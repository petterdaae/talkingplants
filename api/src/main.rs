extern crate dotenv;

use http::StatusCode;
use log::error;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use pretty_env_logger;
use serde::{Deserialize, Serialize};
use std::env;
use std::net::SocketAddr;
use tokio_postgres::Client;
use warp::reply::{json, with_status};
use warp::Filter;

#[derive(Serialize, Deserialize)]
struct Plant {
    name: String,
}

#[derive(Serialize, Deserialize)]
struct SensorData {
    data: i32,
    #[serde(rename = "type")]
    type_name: String,
    plant: i32,
}

#[derive(Serialize, Deserialize)]
struct JsonResponse {
    message: String,
}

async fn db_connect() -> Client {
    let credentials = env::var("DB_CONNECTION_STRING").unwrap();
    let mut builder = SslConnector::builder(SslMethod::tls()).unwrap();
    builder.set_verify(openssl::ssl::SslVerifyMode::NONE);
    let negotiator = MakeTlsConnector::new(builder.build());
    let (client, connection) = tokio_postgres::connect(&credentials, negotiator)
        .await
        .unwrap();
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            error!("database connection failed: {}", e);
        }
    });
    client
}

async fn new_plant(plant: Plant, auth_header: String) -> Result<impl warp::Reply, warp::Rejection> {
    let correct_key = env::var("API_KEY").unwrap();
    if correct_key != auth_header {
        let response = JsonResponse {
            message: String::from("Authentication failed"),
        };
        return Ok(with_status(json(&response), StatusCode::UNAUTHORIZED));
    }

    let client = db_connect().await;
    client
        .query("INSERT INTO plant (name) VALUES ($1)", &[&plant.name])
        .await
        .unwrap();

    let response = JsonResponse {
        message: String::from("successfully inserted new plant into database"),
    };
    Ok(with_status(json(&response), StatusCode::CREATED))
}

async fn new_data(
    sensor_data: SensorData,
    auth_header: String,
) -> Result<impl warp::Reply, warp::Rejection> {
    let correct_key = env::var("API_KEY").unwrap();
    if correct_key != auth_header {
        let response = JsonResponse {
            message: String::from("Authentication failed"),
        };
        return Ok(with_status(json(&response), StatusCode::UNAUTHORIZED));
    }

    let client = db_connect().await;
    client
        .query(
            "INSERT INTO sensordata (data, type, plant) VALUES ($1, $2, $3)",
            &[
                &sensor_data.data,
                &sensor_data.type_name,
                &sensor_data.plant,
            ],
        )
        .await
        .unwrap();

    let response = JsonResponse {
        message: String::from("sucessfully inserted new sensor data into database"),
    };
    Ok(with_status(json(&response), StatusCode::CREATED))
}

#[tokio::main]
async fn main() {
    // Load config into environment from .evn files
    dotenv::dotenv().ok();

    // Initialize logging
    pretty_env_logger::init();

    // Fetch socket address to host api from
    let socket_addr: SocketAddr = env::var("SOCKET_ADDR").unwrap().parse().unwrap();

    let new_plant_route = warp::post()
        .and(warp::path("plants"))
        .and(warp::body::json())
        .and(warp::header("Authorization"))
        .and_then(new_plant);

    let new_data_route = warp::post()
        .and(warp::path("data"))
        .and(warp::body::json())
        .and(warp::header("Authorization"))
        .and_then(new_data);

    let health = warp::get().and(warp::path("health")).map(|| "Healthy");

    warp::serve(new_plant_route.or(new_data_route).or(health))
        .run(socket_addr)
        .await;
}
