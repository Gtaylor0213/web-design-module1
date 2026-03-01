package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"jones-county-xc/db"
)

// --- Athletes ---

func createAthleteHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name           string `json:"Name"`
		Grade          int32  `json:"Grade"`
		PersonalRecord string `json:"PersonalRecord"`
		Events         string `json:"Events"`
		Gender         string `json:"Gender"`
		Team           string `json:"Team"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	result, err := queries.CreateAthlete(r.Context(), db.CreateAthleteParams{
		Name:           req.Name,
		Grade:          req.Grade,
		PersonalRecord: req.PersonalRecord,
		Events:         req.Events,
		Gender:         req.Gender,
		Team:           req.Team,
	})
	if err != nil {
		http.Error(w, `{"error":"failed to create athlete"}`, http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	athlete, err := queries.GetAthleteByID(r.Context(), int32(id))
	if err != nil {
		http.Error(w, `{"error":"failed to fetch created athlete"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(athlete)
}

func updateAthleteHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	var req struct {
		Name           string `json:"Name"`
		Grade          int32  `json:"Grade"`
		PersonalRecord string `json:"PersonalRecord"`
		Events         string `json:"Events"`
		Gender         string `json:"Gender"`
		Team           string `json:"Team"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	if err := queries.UpdateAthlete(r.Context(), db.UpdateAthleteParams{
		ID:             int32(id),
		Name:           req.Name,
		Grade:          req.Grade,
		PersonalRecord: req.PersonalRecord,
		Events:         req.Events,
		Gender:         req.Gender,
		Team:           req.Team,
	}); err != nil {
		http.Error(w, `{"error":"failed to update athlete"}`, http.StatusInternalServerError)
		return
	}

	athlete, err := queries.GetAthleteByID(r.Context(), int32(id))
	if err != nil {
		http.Error(w, `{"error":"failed to fetch updated athlete"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(athlete)
}

func deleteAthleteHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	if err := queries.DeleteAthlete(r.Context(), int32(id)); err != nil {
		if strings.Contains(err.Error(), "foreign key constraint") ||
			strings.Contains(err.Error(), "a]foreign key constraint fails") {
			http.Error(w, `{"error":"Cannot delete athlete with existing results. Delete the results first."}`, http.StatusConflict)
			return
		}
		http.Error(w, `{"error":"failed to delete athlete"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

// --- Meets ---

func createMeetHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"Name"`
		Date        string `json:"Date"`
		Location    string `json:"Location"`
		Description string `json:"Description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		http.Error(w, `{"error":"invalid date format, use YYYY-MM-DD"}`, http.StatusBadRequest)
		return
	}

	result, err := queries.CreateMeet(r.Context(), db.CreateMeetParams{
		Name:        req.Name,
		Date:        date,
		Location:    req.Location,
		Description: req.Description,
	})
	if err != nil {
		http.Error(w, `{"error":"failed to create meet"}`, http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	meet, err := queries.GetMeetByID(r.Context(), int32(id))
	if err != nil {
		http.Error(w, `{"error":"failed to fetch created meet"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(meet)
}

func updateMeetHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	var req struct {
		Name        string `json:"Name"`
		Date        string `json:"Date"`
		Location    string `json:"Location"`
		Description string `json:"Description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		http.Error(w, `{"error":"invalid date format, use YYYY-MM-DD"}`, http.StatusBadRequest)
		return
	}

	if err := queries.UpdateMeet(r.Context(), db.UpdateMeetParams{
		ID:          int32(id),
		Name:        req.Name,
		Date:        date,
		Location:    req.Location,
		Description: req.Description,
	}); err != nil {
		http.Error(w, `{"error":"failed to update meet"}`, http.StatusInternalServerError)
		return
	}

	meet, err := queries.GetMeetByID(r.Context(), int32(id))
	if err != nil {
		http.Error(w, `{"error":"failed to fetch updated meet"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meet)
}

func deleteMeetHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	if err := queries.DeleteMeet(r.Context(), int32(id)); err != nil {
		if strings.Contains(err.Error(), "foreign key constraint") {
			http.Error(w, `{"error":"Cannot delete meet with existing results. Delete the results first."}`, http.StatusConflict)
			return
		}
		http.Error(w, `{"error":"failed to delete meet"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

// --- Results ---

func createResultHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AthleteID int32  `json:"AthleteID"`
		MeetID    int32  `json:"MeetID"`
		Event     string `json:"Event"`
		Time      string `json:"Time"`
		Place     int32  `json:"Place"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	_, err := queries.CreateResult(r.Context(), db.CreateResultParams{
		AthleteID: req.AthleteID,
		MeetID:    req.MeetID,
		Event:     req.Event,
		Time:      req.Time,
		Place:     req.Place,
	})
	if err != nil {
		http.Error(w, `{"error":"failed to create result"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

func updateResultHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	var req struct {
		AthleteID int32  `json:"AthleteID"`
		MeetID    int32  `json:"MeetID"`
		Event     string `json:"Event"`
		Time      string `json:"Time"`
		Place     int32  `json:"Place"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	if err := queries.UpdateResult(r.Context(), db.UpdateResultParams{
		ID:        int32(id),
		AthleteID: req.AthleteID,
		MeetID:    req.MeetID,
		Event:     req.Event,
		Time:      req.Time,
		Place:     req.Place,
	}); err != nil {
		http.Error(w, `{"error":"failed to update result"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

func deleteResultHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	if err := queries.DeleteResult(r.Context(), int32(id)); err != nil {
		http.Error(w, `{"error":"failed to delete result"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}
