extern crate dotenv;

use log::error;
use pretty_env_logger;
use std::env;
use std::net::SocketAddr;
use warp::filter::map::Map;
use warp::{filters, reject, Filter, Rejection};

mod common;
mod plants;
mod sensordata;

#[tokio::main]
async fn main() {
    // Load config into environment from .evn file
    dotenv::dotenv().ok();

    // Initialize logging
    pretty_env_logger::init();

    // Determine what socket addr to bind to
    let port = env::var("PORT").unwrap();
    let host = format!("0.0.0.0:{}", port);
    let socket_addr: SocketAddr = host.parse().unwrap();

    // Validate api key
    let api_key = env::var("API_KEY").unwrap();
    if api_key.len() < 20 {
        error!("Invalid API_KEY. The API_KEY should be longer than 20 characters. Check your environment.");
        return;
    }

    // Setup authorized routes
    let new_plant = warp::post()
        .and(warp::path("plants"))
        .and(warp::body::json())
        .and_then(plants::new_plant);
    let new_data = warp::post()
        .and(warp::path("data"))
        .and(warp::body::json())
        .and_then(sensordata::new_data);
    let authorized = with_env_auth(api_key).and(new_plant.or(new_data));

    // Setup unauthorized routes
    let health = warp::get().and(warp::path("health")).map(|| "Healthy");
    let unauthorized = health;

    // Serve routes
    warp::serve(authorized.or(unauthorized))
        .run(socket_addr)
        .await;
}

fn with_env_auth(api_key: String) -> impl Filter<Extract = (), Error = Rejection> + Copy {
    warp::header("Authorization").map(move |authorization| -> Result<(), Rejection> {
        if authorization == api_key {
            Ok(())
        } else {
            Err(reject::reject())
        }
    })
    // .map_err(|| reject::reject())
}
