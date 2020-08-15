package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

func CreatePlant(w http.ResponseWriter, r *http.Request) {
	var plant Plant
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal("Missing or invalid body")
		w.WriteHeader(500)
		return
	}

	json.Unmarshal(body, &plant)

	_, err = QueryDb("INSERT INTO plant (name) VALUES ($1)", plant.Name)
	if err != nil {
		log.Fatalf("Insert new plant query failed: %v", err)
		w.WriteHeader(500)
	}
}

func GetPlant(w http.ResponseWriter, r *http.Request) {
	// TODO : implement
}

func UpdatePlant(w http.ResponseWriter, r *http.Request) {
	// TODO : implement
}

func DeletePlant(w http.ResponseWriter, r *http.Request) {
	// TODO : implement
}

func GetPlants(w http.ResponseWriter, r *http.Request) {
	// TODO : implement
}
