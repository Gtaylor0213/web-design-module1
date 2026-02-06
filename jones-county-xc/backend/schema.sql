CREATE DATABASE IF NOT EXISTS jones_county_xc;
USE jones_county_xc;

CREATE TABLE athletes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade INT NOT NULL,
    personal_record VARCHAR(10) NOT NULL,
    events VARCHAR(255) NOT NULL
);

CREATE TABLE meets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id INT NOT NULL,
    meet_id INT NOT NULL,
    time VARCHAR(10) NOT NULL,
    place INT NOT NULL,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (meet_id) REFERENCES meets(id)
);

INSERT INTO athletes (name, grade, personal_record, events) VALUES
    ('Jake Miller', 11, '16:42', '5K, 3200m'),
    ('Sarah Thompson', 10, '19:15', '5K, 1600m'),
    ('Marcus Davis', 12, '16:08', '5K, 3200m'),
    ('Emily Chen', 9, '20:31', '5K'),
    ('Tyler Brooks', 11, '17:05', '5K, 1600m');

INSERT INTO meets (name, date, location, description) VALUES
    ('Jones County Invitational', '2026-03-14', 'Jones County Park', 'Annual home invitational on our 5K course'),
    ('Region 4 Championship', '2026-03-28', 'Cedar Creek Trails', 'Regional championship to qualify for state'),
    ('State Qualifying Meet', '2026-04-11', 'Riverside Complex', 'Final qualifying meet before state competition');

INSERT INTO results (athlete_id, meet_id, time, place) VALUES
    (1, 1, '17:02', 3),
    (2, 1, '19:45', 8),
    (3, 1, '16:15', 1),
    (4, 1, '21:03', 12),
    (5, 1, '17:22', 5);
