-- name: GetAllAthletes :many
SELECT id, name, grade, personal_record, events FROM athletes ORDER BY name;

-- name: GetAthleteByID :one
SELECT id, name, grade, personal_record, events FROM athletes WHERE id = ?;

-- name: GetAllMeets :many
SELECT id, name, date, location, description FROM meets ORDER BY date;

-- name: GetMeetResults :many
SELECT r.id, r.athlete_id, r.meet_id, r.time, r.place, a.name AS athlete_name
FROM results r
JOIN athletes a ON a.id = r.athlete_id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, time, place) VALUES (?, ?, ?, ?);
