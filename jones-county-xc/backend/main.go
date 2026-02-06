package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/health", healthHandler)
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/api/athletes", athletesHandler)
	http.HandleFunc("/api/meets", meetsHandler)
	http.HandleFunc("/api/results", resultsHandler)

	log.Println("Backend server starting on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

type Athlete struct {
	Name           string `json:"name"`
	Grade          int    `json:"grade"`
	PersonalRecord string `json:"personalRecord"`
}

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	athletes := []Athlete{
		{Name: "Jake Miller", Grade: 11, PersonalRecord: "16:42"},
		{Name: "Sarah Thompson", Grade: 10, PersonalRecord: "19:15"},
		{Name: "Marcus Davis", Grade: 12, PersonalRecord: "16:08"},
		{Name: "Emily Chen", Grade: 9, PersonalRecord: "20:31"},
		{Name: "Tyler Brooks", Grade: 11, PersonalRecord: "17:05"},
	}
	json.NewEncoder(w).Encode(athletes)
}

type Meet struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

func meetsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	meets := []Meet{
		{ID: 1, Name: "Jones County Invitational", Date: "2026-03-14", Location: "Jones County Park"},
		{ID: 2, Name: "Region 4 Championship", Date: "2026-03-28", Location: "Cedar Creek Trails"},
		{ID: 3, Name: "State Qualifying Meet", Date: "2026-04-11", Location: "Riverside Complex"},
	}
	json.NewEncoder(w).Encode(meets)
}

type Result struct {
	ID        int    `json:"id"`
	AthleteID int    `json:"athleteId"`
	MeetID    int    `json:"meetId"`
	Time      string `json:"time"`
	Place     int    `json:"place"`
}

func resultsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	results := []Result{
		{ID: 1, AthleteID: 1, MeetID: 1, Time: "17:02", Place: 3},
		{ID: 2, AthleteID: 2, MeetID: 1, Time: "19:45", Place: 8},
		{ID: 3, AthleteID: 3, MeetID: 1, Time: "16:15", Place: 1},
		{ID: 4, AthleteID: 4, MeetID: 1, Time: "21:03", Place: 12},
		{ID: 5, AthleteID: 5, MeetID: 1, Time: "17:22", Place: 5},
	}
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
