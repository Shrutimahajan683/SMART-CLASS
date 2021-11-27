create table "teacher" (
    "id" varchar(255) ,
    "full_name" varchar(255),
    "username" varchar(255),
    "password" varchar(255),
    "classes" varchar(25),
    "subject" varchar(255),
    "valid" boolean default false,
    "gmail_valid" boolean default false,
    "created_at" timestamp,
    "updated_at" timestamp
);
create table "student" (
    "id" varchar(255) primary key,
    "full_name" varchar(255),
    "username" varchar(255),
    "password" varchar(255),
    "rollno" integer,
    "sclass" varchar(25),
    "valid" boolean default false,
    "gmail_valid" boolean default false,
    "created_at" timestamp,
    "updated_at" timestamp
);
create table "admin" (
    "full_name" varchar(255),
    "username" varchar(255),
    "password" varchar(255)
);
create table "quizes" (
    "id" varchar(255) PRIMARY KEY,
    "sclass" varchar(25),
    "subject" varchar(255),
    "quiz" JSON,
    "count" integer,
    "quizname" varchar(255),
    "created_at" timestamp,
    "updated_at" timestamp
);
create table "classrequest" (
    "id" varchar(255) ,
    "student_id" varchar(255) references(,
    "sclass" varchar(25),
    "subject" varchar(255),
    
    "created_at" timestamp,
    "updated_at" timestamp,
    PRIMARY KEY(student_id,subject,time)
);
create table "attendence" (
    "id" varchar(255) ,
    "student_id" varchar(255),
    "sclass" varchar(25),
    "subject" varchar(255),
    "username" varchar(255),
    "time" varchar(255),
    "date" varchar(255),
    "created_at" timestamp,
    "updated_at" timestamp,
    PRIMARY KEY(student_id,subject,time)
);

CREATE TABLE files(
    "id" varchar(255) primary key,
    "assignmentname" varchar(255),
    "filepath" varchar(255),
    "subject" varchar(255),
    "sclass" varchar(25),
    "valid" boolean default false,
    "created_at" timestamp,
    "updated_at" timestamp
);
CREATE TABLE submittedfiles(
    "id" varchar(255) references files(id),
    "assignmentname" varchar(255),
    "filepath" varchar(255),
    "full_name" varchar(255),
    "rollno" integer,
    "marks" integer default 0,
    "created_at" timestamp,
    "updated_at" timestamp
);

CREATE TABLE topics(
"id" varchar(255) PRIMARY KEY, 
"sclass" varchar(25),
"author" varchar(255),
"title" varchar(65535),
"description" varchar(65535),
"created_at" varchar(255)
);

CREATE TABLE posts(
"topic_id" varchar(255) references topics(id),
"id" varchar(255) ,
"author" varchar(255),
"description" varchar(65535),
"parent" varchar(65535),
"created_at" varchar(255)
);


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


Previous account(shrutimahajan2812@gmail.com ki key)
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

