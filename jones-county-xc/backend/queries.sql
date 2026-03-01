-- name: GetAllAthletes :many
SELECT id, name, grade, personal_record, events, gender, team FROM athletes ORDER BY name;

-- name: GetAthleteByID :one
SELECT id, name, grade, personal_record, events, gender, team FROM athletes WHERE id = ?;

-- name: GetAllMeets :many
SELECT id, name, date, location, description FROM meets ORDER BY date;

-- name: GetUpcomingMeets :many
SELECT id, name, date, location, description FROM meets WHERE date >= CURDATE() ORDER BY date;

-- name: GetMeetResults :many
SELECT r.id, r.athlete_id, r.meet_id, r.event, r.time, r.place, a.name AS athlete_name, a.grade AS athlete_grade
FROM results r
JOIN athletes a ON a.id = r.athlete_id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, event, time, place) VALUES (?, ?, ?, ?, ?);

-- name: CreateAthlete :execresult
INSERT INTO athletes (name, grade, personal_record, events, gender, team) VALUES (?, ?, ?, ?, ?, ?);

-- name: UpdateAthlete :exec
UPDATE athletes SET name = ?, grade = ?, personal_record = ?, events = ?, gender = ?, team = ? WHERE id = ?;

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;

-- name: GetMeetByID :one
SELECT id, name, date, location, description FROM meets WHERE id = ?;

-- name: CreateMeet :execresult
INSERT INTO meets (name, date, location, description) VALUES (?, ?, ?, ?);

-- name: UpdateMeet :exec
UPDATE meets SET name = ?, date = ?, location = ?, description = ? WHERE id = ?;

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;

-- name: UpdateResult :exec
UPDATE results SET athlete_id = ?, meet_id = ?, event = ?, time = ?, place = ? WHERE id = ?;

-- name: DeleteResult :exec
DELETE FROM results WHERE id = ?;

-- name: GetAthleteResults :many
SELECT r.id, r.event, r.time, r.place, m.name AS meet_name, m.date AS meet_date
FROM results r
JOIN meets m ON m.id = r.meet_id
WHERE r.athlete_id = ?
ORDER BY m.date DESC;
