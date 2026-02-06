package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"jones-county-xc/db"
)

var queries *db.Queries

func main() {
	conn, err := sql.Open("mysql", "xcapp:xcpass@tcp(127.0.0.1:3306)/jones_county_xc?parseTime=true")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer conn.Close()

	if err := conn.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	queries = db.New(conn)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", healthHandler)
	mux.HandleFunc("GET /api/hello", helloHandler)
	mux.HandleFunc("GET /api/athletes", athletesHandler)
	mux.HandleFunc("GET /api/athletes/{id}", athleteByIDHandler)
	mux.HandleFunc("GET /api/meets", meetsHandler)
	mux.HandleFunc("GET /api/meets/{id}/results", meetResultsHandler)

	log.Println("Backend server starting on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	athletes, err := queries.GetAllAthletes(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(athletes)
}

func athleteByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "invalid athlete id", http.StatusBadRequest)
		return
	}
	athlete, err := queries.GetAthleteByID(r.Context(), int32(id))
	if err != nil {
		http.Error(w, "athlete not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(athlete)
}

func meetsHandler(w http.ResponseWriter, r *http.Request) {
	meets, err := queries.GetAllMeets(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meets)
}

func meetResultsHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "invalid meet id", http.StatusBadRequest)
		return
	}
	results, err := queries.GetMeetResults(r.Context(), int32(id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Hello from Jones County XC API"})
}
