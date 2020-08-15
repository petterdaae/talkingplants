package main

import (
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

	port := os.Getenv("PORT")

	log.Println("Listening for REST calls on port " + port)

	http.HandleFunc("/", welcome)
	log.Fatal(http.ListenAndServe(":" + port, nil))
}
