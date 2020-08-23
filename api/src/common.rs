use http::StatusCode;
use log::error;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use serde::{Deserialize, Serialize};
use std::env;
use tokio_postgres::Client;
use warp::reply::{json, with_status};

#[derive(Serialize, Deserialize)]
struct JsonMessage {
    message: String,
}

pub async fn db_connect() -> Client {
    let credentials = env::var("DATABASE_URL").unwrap();
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

pub fn ok(message: &str, status: StatusCode) -> impl warp::Reply {
    let response = JsonMessage {
        message: String::from(message),
    };
    with_status(json(&response), status)
}
