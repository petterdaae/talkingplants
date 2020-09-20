use crate::common;
use http::StatusCode;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio_postgres::row::Row;
use warp;
use warp::reply::{json, with_status};

#[derive(Serialize, Deserialize)]
struct JsonResponse {
    message: String,
}

#[derive(Serialize, Deserialize)]
pub struct SensorDataIn {
    data: i32,
    #[serde(rename = "type")]
    type_name: String,
    plant: i32,
}

#[derive(Serialize, Deserialize)]
pub struct SensorDataOut {
    data: i32,
    timestamp: String,
    #[serde(rename = "type")]
    type_name: String,
}

impl From<&Row> for SensorDataOut {
    fn from(row: &Row) -> Self {
        Self {
            data: row.get("data"),
            timestamp: row.get("timestamp"),
            type_name: row.get("type"),
        }
    }
}

pub async fn new_data(sensor_data: SensorDataIn) -> Result<impl warp::Reply, warp::Rejection> {
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

pub async fn list_data(
    params: HashMap<String, String>,
) -> Result<impl warp::Reply, warp::Rejection> {
    if !params.contains_key("plant") {
        return Ok(common::bad_request("missing query parameter: plant"));
    }
    let plant = params.get("plant").unwrap();
    let plant = plant.parse::<i32>();
    if !plant.is_ok() {
        return Ok(common::bad_request("invalid query parameter: plant"));
    }
    let plant = plant.unwrap();
    let client = common::db_connect().await;
    let rows: Vec<SensorDataOut> = client
        .query(
            "select data, coalesce(to_char(timestamp, 'YYYY-MM-DD HH24:MI:SS'), '') as timestamp, type from sensordata where plant = $1 order by timestamp desc",
            &[&plant],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| SensorDataOut::from(row))
        .collect();
    Ok(with_status(json(&rows), StatusCode::OK))
}
