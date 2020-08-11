package main

import (
	"fmt"
	"log"
	"net/http"
)

func welcome(w http.ResponseWriter, r *http.Request) {
	log.Println("Welcome called")
	fmt.Fprintf(w, "Welcome!")
}

func main() {
	log.Println("Listening for http calls ...")
	http.HandleFunc("/", welcome)
	log.Fatal(http.ListenAndServe(":8080", nil))
}