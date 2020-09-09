extern crate dotenv;

use log::error;
use pretty_env_logger;
use std::env;
use std::net::SocketAddr;
use warp::Filter;

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
    let api_key = Box::leak(env::var("API_KEY").unwrap().into_boxed_str());
    if api_key.len() < 20 {
        error!("Invalid API_KEY. The API_KEY should be longer than 20 characters. Check your environment.");
        return;
    }

    let authentication = warp::header::exact("Authorization", api_key);

    // Setup authorized routes
    let new_plant = warp::post()
        .and(warp::path("plants"))
        .and(warp::body::json())
        .and_then(plants::new_plant);
    let new_data = warp::post()
        .and(warp::path("data"))
        .and(warp::body::json())
        .and_then(sensordata::new_data);
    let authorized = authentication.and(new_plant.or(new_data));

    // Setup unauthorized routes
    let list_plants = warp::get()
        .and(warp::path("plants"))
        .and_then(plants::list_plants);
    let health = warp::get().and(warp::path("health")).map(|| "Healthy");
    let unauthorized = health.or(list_plants);

    //// Serve routes
    warp::serve(authorized.or(unauthorized))
        .run(socket_addr)
        .await;
}
