create table personnel (

id bigint generated always as identity primary key,

rank varchar(30),

firstname varchar(100),

lastname varchar(100),

nickname varchar(100),

position text,

class varchar(20),

phone varchar(30),

remark text,

image text,

created_at timestamp default now()

);

create table commanders(

id bigint generated always as identity primary key,

rank varchar(30),

firstname varchar(100),

lastname varchar(100),

position text

);

create table wives(

id bigint generated always as identity primary key,

personnel_id bigint,

wife_name text,

phone varchar(30)

);
