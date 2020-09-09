use crate::common;
use http::StatusCode;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Plant {
    name: String,
}

pub async fn new_plant(plant: Plant) -> Result<impl warp::Reply, warp::Rejection> {
    let client = common::db_connect().await;
    client
        .query("INSERT INTO plant (name) VALUES ($1)", &[&plant.name])
        .await
        .unwrap();
    Ok(common::ok("new plant created", StatusCode::CREATED))
}
