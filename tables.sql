drop database if exists article;

create database article;
use article;

CREATE TABLE publishers (
	id INTEGER not null AUTO_INCREMENT,
	name VARCHAR(50),
	email VARCHAR(50) not null UNIQUE,
	password VARCHAR(50),
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE subscribers (
	id INTEGER not null AUTO_INCREMENT,
	name VARCHAR(50),
	email VARCHAR(50) not null UNIQUE,
	password VARCHAR(32),
	regid TEXT,
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE categories (
	id INTEGER not null AUTO_INCREMENT,
	name VARCHAR(50),
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE subscriptions (
	subscriber INTEGER,
	category INTEGER,
	PRIMARY KEY (subscriber, category),
	FOREIGN KEY (subscriber) REFERENCES subscribers(id),
	FOREIGN KEY (category) REFERENCES categories(id)
) ENGINE=INNODB;

CREATE TABLE articles (
	id INTEGER not null AUTO_INCREMENT,
	publisher INTEGER not null,
	category INTEGER not null,
	title VARCHAR(100) not null,
	content MEDIUMTEXT not null,
	timestamp BIGINT not null,
	PRIMARY KEY (id),
	FOREIGN KEY (publisher) REFERENCES publishers(id),
	FOREIGN KEY (category) REFERENCES categories(id)
) ENGINE=INNODB;

INSERT INTO categories VALUES 
(1, "Arts and Entertainment"),
(2, "Computers and Electronics"),
(3, "Finance and Business"),
(4, "Food"),
(5, "Hobbies and Crafts"),
(6, "Travel"),
(7, "Sports and Fitness"),
(8, "Relationship"),
(9, "Personal Care and Style"),
(10, "Philosophy and Religion"),
(11, "Holidays and Traditions"),
(12, "Education and Communications"),
(13, "Family Life"),
(14, "Home and Garden"),
(15, "Work World"),
(16, "Youth"),
(17, "Cars and Other Vehicles"),
(18, "Health"),
(19, "Pets and Animals");

INSERT INTO publishers VALUES (1, "Siddhant Saurabh", "sidsaurb@iitk.ac.in", MD5("siddhant"));
INSERT INTO subscribers VALUES (1, "Anand Gupta", "anandkg@iitk.ac.in", MD5("anand"), "dzfsdfds");
INSERT INTO subscriptions VALUES (1, 10), (1, 5), (1, 19);
