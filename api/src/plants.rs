use crate::common;
use http::StatusCode;
use serde::{Deserialize, Serialize};
use tokio_postgres::row::Row;
use warp::reply::{json, with_status};

#[derive(Serialize, Deserialize)]
pub struct Plant {
    id: Option<i32>,
    name: String,
    moisture: Option<i32>,
    last_meassure: Option<String>,
}

impl From<&Row> for Plant {
    fn from(row: &Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            moisture: row.get("moisture"),
            last_meassure: row.get("last_meassure"),
        }
    }
}

pub async fn new_plant(plant: Plant) -> Result<impl warp::Reply, warp::Rejection> {
    let client = common::db_connect().await;
    client
        .query("INSERT INTO plant (name) VALUES ($1)", &[&plant.name])
        .await
        .unwrap();
    Ok(common::ok("new plant created", StatusCode::CREATED))
}

pub async fn list_plants() -> Result<impl warp::Reply, warp::Rejection> {
    let client = common::db_connect().await;
    let rows: Vec<Plant> = client
        .query(
            "
        select distinct on (plant.id)
            plant.id as id,
            plant.name as name,
            sensordata.data as moisture,
            coalesce(to_char(sensordata.timestamp, 'YYYY-MM-DD HH24:MI:SS'), '') as last_meassure
        from
            plant
            inner join
            sensordata on plant.id = sensordata.plant
        order by plant.id, sensordata.timestamp desc",
            &[],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| Plant::from(row))
        .collect();
    Ok(with_status(json(&rows), StatusCode::OK))
}
