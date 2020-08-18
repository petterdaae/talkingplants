extern crate dotenv;

use http;
use log::{error, info};
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use pretty_env_logger;
use serde::{Deserialize, Serialize};
use std::env;
use tokio_postgres::Client;
use warp::Filter;

#[derive(Serialize, Deserialize)]
struct Plant {
    name: String,
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

async fn new_plant() -> Result<impl warp::Reply, warp::Rejection> {
    let client = db_connect().await;
    client
        .query("INSERT INTO plant (name) VALUES ($1)", &[&"Petter 3"])
        .await
        .unwrap();

    Ok(warp::reply::with_status(
        format!("Hello, World!"),
        http::StatusCode::CREATED,
    ))
}

#[tokio::main]
async fn main() {
    // Load config into environment from .evn files
    dotenv::dotenv().ok();

    // Initialize logging
    pretty_env_logger::init();

    info!("Talking Plants REST API Started");

    let np = warp::post().and(warp::path("plants")).and_then(new_plant);

    warp::serve(np).run(([127, 0, 0, 1], 3030)).await;
}
