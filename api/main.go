package main

import (
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
)

func welcome(w http.ResponseWriter, r *http.Request) {
	rows, err := QueryDb("SELECT * FROM MyFirstTable")
	if err != nil {
		log.Fatalf("welcome query failed: %v", err)
		return
	}

	for rows.Next() {
		var theBestColumn string
		rows.Scan(&theBestColumn)
		log.Println(theBestColumn)
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load environment variables from .env file, exiting ...")
		return
	}

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/plants", CreatePlant).Methods("POST")
	router.HandleFunc("/plants/{id}", GetPlant).Methods("GET")
	router.HandleFunc("/plants", GetPlants).Methods("GET")
	router.HandleFunc("/plants/{id}", DeletePlant).Methods("DELETE")
	router.HandleFunc("/plants/{id}", UpdatePlant).Methods("PUT")

	port := os.Getenv("PORT")
	log.Println("Listening for REST calls on port " + port)
	log.Fatal(http.ListenAndServe(":" + port, router))
}
