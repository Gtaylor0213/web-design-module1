package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"jones-county-xc/db"
)

var queries *db.Queries

func main() {
	dbUser := getEnv("DB_USER", "xcapp")
	dbPass := getEnv("DB_PASS", "xcpass")
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "jones_county_xc")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPass, dbHost, dbPort, dbName)

	conn, err := sql.Open("mysql", dsn)
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
	mux.HandleFunc("GET /api/meets/upcoming", upcomingMeetsHandler)
	mux.HandleFunc("GET /api/meets/{id}/results", meetResultsHandler)
	mux.HandleFunc("GET /api/athletes/{id}/results", athleteResultsHandler)

	// Auth
	mux.HandleFunc("POST /api/login", loginHandler)
	mux.HandleFunc("POST /api/logout", logoutHandler)
	mux.HandleFunc("GET /api/auth/check", authCheckHandler)

	// Admin - Athletes
	mux.HandleFunc("POST /api/admin/athletes", requireAuth(createAthleteHandler))
	mux.HandleFunc("PUT /api/admin/athletes/{id}", requireAuth(updateAthleteHandler))
	mux.HandleFunc("DELETE /api/admin/athletes/{id}", requireAuth(deleteAthleteHandler))

	// Admin - Meets
	mux.HandleFunc("POST /api/admin/meets", requireAuth(createMeetHandler))
	mux.HandleFunc("PUT /api/admin/meets/{id}", requireAuth(updateMeetHandler))
	mux.HandleFunc("DELETE /api/admin/meets/{id}", requireAuth(deleteMeetHandler))

	// Admin - Results
	mux.HandleFunc("POST /api/admin/results", requireAuth(createResultHandler))
	mux.HandleFunc("PUT /api/admin/results/{id}", requireAuth(updateResultHandler))
	mux.HandleFunc("DELETE /api/admin/results/{id}", requireAuth(deleteResultHandler))

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

func upcomingMeetsHandler(w http.ResponseWriter, r *http.Request) {
	meets, err := queries.GetUpcomingMeets(r.Context())
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

func athleteResultsHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "invalid athlete id", http.StatusBadRequest)
		return
	}
	results, err := queries.GetAthleteResults(r.Context(), int32(id))
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

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
