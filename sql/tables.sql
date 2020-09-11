create table plant (
    id serial primary key,
    name varchar(255) not null
);

alter table plant add column image bytea;

create table sensordata (
    id serial primary key,
    data int not null,
    timestamp timestamp not null default current_timestamp,
    type varchar(255) not null,
    plant int not null,
    foreign key (plant) references plant (id)
);
