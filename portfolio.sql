-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/BmkwUq
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.
-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE `user` (
    `id` int  NOT NULL AUTO_INCREMENT,
    `email` varchar(255)  NOT NULL ,
    `password` varchar(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `project` (
    `id` int  NOT NULL AUTO_INCREMENT,
    `name` varchar(255)  NOT NULL ,
    `description` TEXT  NOT NULL ,
    `picture` varchar(255)  NOT NULL ,
    `date` DATE,
    `repo_front` varchar(255),
    `repo_back` varchar(255),
    `deploy_url` varchar(255),
    `category_id` int,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `category` (
    `id` int  NOT NULL AUTO_INCREMENT,
    `name` varchar(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `language` (
    `id` int  NOT NULL AUTO_INCREMENT,
    `name` varchar(255)  NOT NULL ,
    `picture` varchar(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `language_project` (
    `project_id` int  NOT NULL ,
    `language_id` int  NOT NULL 
);

CREATE TABLE `skill` (
    `id` int  NOT NULL AUTO_INCREMENT,
    `name` varchar(100)  NOT NULL ,
    `picture` varchar(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

ALTER TABLE `project` ADD CONSTRAINT `fk_project_category_id` FOREIGN KEY(`category_id`)
REFERENCES `category` (`id`);

ALTER TABLE `language_project` ADD CONSTRAINT `fk_language_project_project_id` FOREIGN KEY(`project_id`)
REFERENCES `project` (`id`);

ALTER TABLE `language_project` ADD CONSTRAINT `fk_language_project_language_id` FOREIGN KEY(`language_id`)
REFERENCES `language` (`id`);

