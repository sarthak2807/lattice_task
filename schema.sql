CREATE DATABASE HOSPITAL;
USE HOSPITAL;
CREATE TABLE hospitals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE psychiatrists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  hospital_id INT,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(15) NOT NULL,
  psychiatrist_id INT,
  hospital_id INT,
  FOREIGN KEY (psychiatrist_id) REFERENCES psychiatrists(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);