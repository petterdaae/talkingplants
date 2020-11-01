create table plant (
    id serial primary key,
    name varchar(255) not null
);

alter table plant add column threshold int;
alter table plant add column enabled boolean;

create table sensordata (
    id serial primary key,
    data int not null,
    timestamp timestamp not null default current_timestamp,
    type varchar(255) not null,
    plant int not null,
    foreign key (plant) references plant (id)
);

create table notifications (
    id serial primary key,
    type varchar(255) not null,
    timestamp timestamp not null default current_timestamp
);
