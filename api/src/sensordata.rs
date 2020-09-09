use crate::common;
use http::StatusCode;
use serde::{Deserialize, Serialize};
use tokio_postgres::row::Row;
use warp;
use warp::reply::{json, with_status};

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

#[derive(Serialize, Deserialize)]
pub struct AvgEntry {
    data: i32,
    date: String,
}

impl From<&Row> for AvgEntry {
    fn from(row: &Row) -> Self {
        Self {
            data: row.get("data"),
            date: row.get("date"),
        }
    }
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

pub async fn list_data() -> Result<impl warp::Reply, warp::Rejection> {
    let client = common::db_connect().await;
    let rows: Vec<AvgEntry> = client
        .query("select cast(date(timestamp) as varchar(255)), cast(avg(data) as int) as data from sensordata group by date(timestamp) order by date(timestamp) asc limit 10", &[])
        .await
        .unwrap()
        .iter()
        .map(|row| AvgEntry::from(row))
        .collect();
    Ok(with_status(json(&rows), StatusCode::OK))
}
