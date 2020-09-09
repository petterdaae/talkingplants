use http::StatusCode;
use serde::{Deserialize, Serialize};
use warp;

use crate::common;

#[derive(Serialize, Deserialize)]
struct JsonResponse {
    message: String,
}

#[derive(Serialize, Deserialize)]
pub struct SensorData {
    data: i32,
    #[serde(rename = "type")]
    type_name: String,
    plant: i32,
}

pub async fn new_data(sensor_data: SensorData) -> Result<impl warp::Reply, warp::Rejection> {
    let client = common::db_connect().await;
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
    Ok(common::ok("sensordata registered", StatusCode::CREATED))
}
