-- Generated from JPA entities. Target DB: PostgreSQL
-- Drop tables (optional, keep commented by default)
-- DROP TABLE IF EXISTS audit_logs, booking_vouchers, bookings, cinema_clusters, cinemas,
--   genres, movie_genres, movies, payments, permissions, role_permissions,
--   refresh_tokens, reviews, roles, rooms, seat, showtime_seats, showtimes, tickets, "user" CASCADE;

-- Enums stored as TEXT/VARCHAR via @Enumerated(EnumType.STRING)

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Using table name "user" per @Table(name = "user")
CREATE TABLE "user" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    address VARCHAR(255),
    password VARCHAR(255),
    role_id BIGINT,
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL
);

ALTER TABLE "user"
  ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id);

CREATE TABLE refresh_tokens (
    id VARCHAR(100) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE,
    country VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(20),
    city_id BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_district_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE cinema_clusters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE cinemas (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone_number VARCHAR(20),
    city_id BIGINT,
    district_id BIGINT,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    cinema_cluster_id BIGINT,
    CONSTRAINT fk_cinema_cluster FOREIGN KEY (cinema_cluster_id) REFERENCES cinema_clusters(id),
    CONSTRAINT fk_cinema_city FOREIGN KEY (city_id) REFERENCES cities(id),
    CONSTRAINT fk_cinema_district FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    cinema_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    seat_schema_version INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL,
    CONSTRAINT fk_room_cinema FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
);

CREATE TABLE seat (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    row_label VARCHAR(255) NOT NULL,
    seat_number VARCHAR(255) NOT NULL,
    seat_type VARCHAR(255) NOT NULL,
    col INTEGER NOT NULL,
    row INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_seat_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE room_seat_pricing (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    additional_price NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_room_seat_pricing_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT uq_room_seat_pricing UNIQUE(room_id, seat_type)
);

CREATE TABLE genres (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(200),
    tagline VARCHAR(300),
    overview TEXT,
    duration_minutes INTEGER NOT NULL,
    release_date DATE,
    original_language VARCHAR(50),
    format VARCHAR(100),
    age_rating VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    vote_average NUMERIC(4,3),
    vote_count INTEGER,
    trailer_url VARCHAR(500),
    poster_path VARCHAR(300),
    backdrop_path VARCHAR(300),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE movie_genres (
    movie_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    CONSTRAINT fk_movie_genre_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_movie_genre_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE showtimes (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    ticket_price NUMERIC(10,2) NOT NULL,
    movie_format VARCHAR(50) NOT NULL,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT fk_showtime_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_showtime_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE showtime_seats (
    id BIGSERIAL PRIMARY KEY,
    showtime_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    user_id BIGINT,
    held_until TIMESTAMP,
    booking_id BIGINT,
    CONSTRAINT fk_showtime_seat_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
    CONSTRAINT fk_showtime_seat_seat FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE,
    CONSTRAINT fk_showtime_seat_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL,
    CONSTRAINT fk_showtime_seat_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    showtime_id BIGINT NOT NULL,
    voucher_id BIGINT,
    voucher_code VARCHAR(50),
    booking_code VARCHAR(50) UNIQUE,
    booking_date TIMESTAMP NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    booking_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

CREATE TABLE booking_vouchers (
    booking_id BIGINT NOT NULL,
    voucher_id BIGINT NOT NULL,
    PRIMARY KEY (booking_id, voucher_id),
    CONSTRAINT fk_booking_voucher_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_voucher_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    status VARCHAR(255) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    notes TEXT,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE vouchers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_value NUMERIC(10,2) NOT NULL,
    voucher_type VARCHAR(50) NOT NULL,
    quantity INTEGER,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    min_order_amount NUMERIC(10,2) NOT NULL,
    max_discount_amount NUMERIC(10,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating NUMERIC(2,1) NOT NULL,
    comment TEXT,
    review_date TIMESTAMP NOT NULL,
    is_approved BOOLEAN NOT NULL,
    parent_review_id BIGINT,
    CONSTRAINT fk_review_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_parent FOREIGN KEY (parent_review_id) REFERENCES reviews(id) ON DELETE SET NULL
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    showtime_seat_id BIGINT NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL,
    qr_code_url VARCHAR(255),
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_ticket_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_showtime_seat FOREIGN KEY (showtime_seat_id) REFERENCES showtime_seats(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    user_id BIGINT,
    timestamp TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL
);

-- Useful indexes
CREATE INDEX idx_user_role ON "user"(role_id);
CREATE INDEX idx_room_cinema ON rooms(cinema_id);
CREATE INDEX idx_showtime_movie ON showtimes(movie_id);
CREATE INDEX idx_showtime_room ON showtimes(room_id);
CREATE INDEX idx_showtime_seat_showtime ON showtime_seats(showtime_id);
CREATE INDEX idx_showtime_seat_seat ON showtime_seats(seat_id);
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_showtime ON bookings(showtime_id);
CREATE INDEX idx_payment_booking ON payments(booking_id);
CREATE INDEX idx_ticket_booking ON tickets(booking_id);
CREATE INDEX idx_review_movie ON reviews(movie_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_room_seat_pricing_room ON room_seat_pricing(room_id);
CREATE INDEX idx_room_seat_pricing_type ON room_seat_pricing(seat_type);



    create table audit_logs (
        entity_id bigint not null,
        log_id bigint generated by default as identity,
        timestamp timestamp(6) not null,
        user_id bigint,
        ip_address varchar(45),
        action varchar(50) not null,
        entity_type varchar(50) not null,
        new_value TEXT,
        old_value TEXT,
        primary key (log_id)
    );

    create table booking_vouchers (
        booking_id bigint not null,
        voucher_id bigint not null
    );

    create table bookings (
        total_amount numeric(10,2) not null,
        booking_date timestamp(6) not null,
        created_at timestamp(6),
        id bigint generated by default as identity,
        showtime_id bigint not null,
        voucher_id bigint,
        voucher_code varchar(50),
        updated_at timestamp(6),
        user_id bigint not null,
        booking_status varchar(20) not null check (booking_status in ('PENDING','CONFIRMED','CANCELLED','EXPIRED')),
        booking_code varchar(50) unique,
        primary key (id)
    );

    create table cinema_clusters (
        created_at timestamp(6),
        id bigint generated by default as identity,
        updated_at timestamp(6),
        description TEXT,
        icon_url varchar(255),
        name varchar(255) not null unique,
        primary key (id)
    );

    create table cinemas (
        is_active boolean not null,
        cinema_cluster_id bigint,
        created_at timestamp(6),
        id bigint generated by default as identity,
        updated_at timestamp(6),
        phone_number varchar(20),
        city varchar(100),
        address varchar(500),
        name varchar(255) not null,
        primary key (id)
    );

    create table genres (
        created_at timestamp(6),
        id bigint not null,
        updated_at timestamp(6),
        name varchar(50) not null unique,
        primary key (id)
    );

    create table movie_genres (
        genre_id bigint not null,
        movie_id bigint not null
    );

    create table movies (
        duration_minutes integer not null,
        is_active boolean not null,
        release_date date,
        vote_average numeric(4,3),
        vote_count integer,
        created_at timestamp(6),
        id bigint generated by default as identity,
        updated_at timestamp(6),
        original_language varchar(50),
        status varchar(50) not null check (status in ('COMING_SOON','NOW_SHOWING','ARCHIVED')),
        age_rating varchar(100),
        format varchar(100),
        original_title varchar(200),
        backdrop_path varchar(300),
        poster_path varchar(300),
        tagline varchar(300),
        trailer_url varchar(500),
        overview TEXT,
        title varchar(255) not null,
        cast_name varchar(150) array,
        country_code varchar(10) array,
        primary key (id)
    );

    create table payments (
        amount numeric(38,2) not null,
        booking_id bigint not null,
        payment_date timestamp(6) not null,
        payment_id bigint generated by default as identity,
        currency varchar(10) not null,
        transaction_id varchar(100) unique,
        notes TEXT,
        payment_method varchar(255) not null check (payment_method in ('MOMO','VNPAY')),
        status varchar(255) not null check (status in ('PENDING','SUCCESS','FAILED','REFUNDED')),
        primary key (payment_id)
    );

    create table permissions (
        is_active boolean not null,
        id bigint generated by default as identity,
        code varchar(50) not null unique,
        name varchar(100) not null unique,
        description TEXT,
        primary key (id)
    );

    create table vouchers (
        discount_value numeric(38,2) not null,
        voucher_type varchar(50) not null,
        is_active boolean not null,
        max_discount_amount numeric(38,2),
        min_order_amount numeric(38,2) not null,
        quantity integer,
        end_date timestamp(6) not null,
        id bigint generated by default as identity,
        start_date timestamp(6) not null,
        code varchar(50) not null unique,
        description TEXT,
        primary key (id)
    );

    create table refresh_tokens (
        created_at timestamp(6),
        updated_at timestamp(6),
        user_id bigint not null,
        id varchar(100) not null,
        token varchar(255) not null,
        primary key (id)
    );

    create table reviews (
        is_approved boolean not null,
        rating float(53) not null,
        id bigint generated by default as identity,
        movie_id bigint not null,
        parent_review_id bigint,
        review_date timestamp(6) not null,
        user_id bigint not null,
        comment TEXT,
        primary key (id)
    );

    create table role_permissions (
        permission_id bigint not null,
        role_id bigint not null,
        primary key (permission_id, role_id)
    );

    create table roles (
        is_active boolean not null,
        id bigint generated by default as identity,
        code varchar(20) not null unique,
        name varchar(50) not null unique,
        description varchar(255),
        primary key (id)
    );

    create table rooms (
        is_active boolean not null,
        price numeric(38,2),
        rows_count integer not null,
        seats_per_row integer not null,
        cinema_id bigint not null,
        id bigint generated by default as identity,
        name varchar(255) not null,
        room_type varchar(255) not null check (room_type in ('STANDARD','IMAX','VIP')),
        primary key (id)
    );

    create table seat (
        col integer not null,
        is_active boolean not null,
        row integer not null,
        created_at timestamp(6) not null,
        id bigint generated by default as identity,
        room_id bigint not null,
        updated_at timestamp(6) not null,
        row_label varchar(255) not null,
        seat_number varchar(255) not null,
        seat_type varchar(255) not null check (seat_type in ('VIP','NORMAL','COUPLE')),
        status varchar(255) not null check (status in ('AVAILABLE','HELD','BOOKED','UNAVAILABLE','MAINTENANCE','BLOCKED')),
        primary key (id)
    );

    create table room_seat_pricing (
        id BIGSERIAL PRIMARY KEY,
        room_id BIGINT NOT NULL,
        seat_type VARCHAR(20) NOT NULL,
        additional_price NUMERIC(10,2) NOT NULL,
        CONSTRAINT fk_room_seat_pricing_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
        CONSTRAINT uq_room_seat_pricing UNIQUE(room_id, seat_type)
    );

    create table genres (
        id BIGINT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP
    );

    create table movies (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        original_title VARCHAR(200),
        tagline VARCHAR(300),
        overview TEXT,
        duration_minutes INTEGER NOT NULL,
        release_date DATE,
        original_language VARCHAR(50),
        format VARCHAR(100),
        age_rating VARCHAR(100),
        status VARCHAR(50) NOT NULL,
        vote_average NUMERIC(4,3),
        vote_count INTEGER,
        trailer_url VARCHAR(500),
        poster_path VARCHAR(300),
        backdrop_path VARCHAR(300),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP
    );

    create table movie_genres (
        movie_id BIGINT NOT NULL,
        genre_id BIGINT NOT NULL,
        PRIMARY KEY (movie_id, genre_id),
        CONSTRAINT fk_movie_genre_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        CONSTRAINT fk_movie_genre_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    );

    create table showtimes (
        id BIGSERIAL PRIMARY KEY,
        movie_id BIGINT NOT NULL,
        room_id BIGINT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(255) NOT NULL,
        CONSTRAINT fk_showtime_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        CONSTRAINT fk_showtime_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );

    create table showtime_seats (
        id BIGSERIAL PRIMARY KEY,
        showtime_id BIGINT NOT NULL,
        seat_id BIGINT NOT NULL,
        status VARCHAR(255) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        user_id BIGINT,
        held_until TIMESTAMP,
        booking_id BIGINT,
        CONSTRAINT fk_showtime_seat_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
        CONSTRAINT fk_showtime_seat_seat FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE,
        CONSTRAINT fk_showtime_seat_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL,
        CONSTRAINT fk_showtime_seat_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    );

    create table bookings (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        showtime_id BIGINT NOT NULL,
        voucher_id BIGINT,
        voucher_code VARCHAR(50),
        booking_code VARCHAR(50) UNIQUE,
        booking_date TIMESTAMP NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        booking_status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP,
        CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
        CONSTRAINT fk_booking_showtime FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
        CONSTRAINT fk_booking_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
    );

    create table booking_vouchers (
        booking_id BIGINT NOT NULL,
        voucher_id BIGINT NOT NULL,
        PRIMARY KEY (booking_id, voucher_id),
        CONSTRAINT fk_booking_voucher_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        CONSTRAINT fk_booking_voucher_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
    );

    create table payments (
        payment_id BIGSERIAL PRIMARY KEY,
        booking_id BIGINT NOT NULL,
        payment_date TIMESTAMP NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        payment_method VARCHAR(255) NOT NULL,
        transaction_id VARCHAR(100) UNIQUE,
        status VARCHAR(255) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        notes TEXT,
        CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );

    create table vouchers (
        id BIGSERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        discount_value NUMERIC(10,2) NOT NULL,
        voucher_type VARCHAR(50) NOT NULL,
        quantity INTEGER,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        min_order_amount NUMERIC(10,2) NOT NULL,
        max_discount_amount NUMERIC(10,2),
        is_active BOOLEAN NOT NULL DEFAULT TRUE
    );

    create table reviews (
        id BIGSERIAL PRIMARY KEY,
        movie_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        rating NUMERIC(2,1) NOT NULL,
        comment TEXT,
        review_date TIMESTAMP NOT NULL,
        is_approved BOOLEAN NOT NULL,
        parent_review_id BIGINT,
        CONSTRAINT fk_review_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
        CONSTRAINT fk_review_parent FOREIGN KEY (parent_review_id) REFERENCES reviews(id) ON DELETE SET NULL
    );

    create table tickets (
        id BIGSERIAL PRIMARY KEY,
        booking_id BIGINT NOT NULL,
        showtime_seat_id BIGINT NOT NULL UNIQUE,
        price NUMERIC(10,2) NOT NULL,
        qr_code_url VARCHAR(255),
        is_used BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT fk_ticket_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        CONSTRAINT fk_ticket_showtime_seat FOREIGN KEY (showtime_seat_id) REFERENCES showtime_seats(id) ON DELETE CASCADE
    );

    create table audit_logs (
        log_id BIGSERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id BIGINT NOT NULL,
        action VARCHAR(50) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        user_id BIGINT,
        timestamp TIMESTAMP NOT NULL,
        ip_address VARCHAR(45),
        CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL
    );

    create table room_seat_pricing (
        id BIGSERIAL PRIMARY KEY,
        room_id BIGINT NOT NULL,
        seat_type VARCHAR(20) NOT NULL CHECK (seat_type IN ('VIP','NORMAL','COUPLE')),
        additional_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_room_seat_pricing_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
        CONSTRAINT uk_room_seat_type UNIQUE (room_id, seat_type)
    );

-- Useful indexes
CREATE INDEX idx_user_role ON "user"(role_id);
CREATE INDEX idx_room_cinema ON rooms(cinema_id);
CREATE INDEX idx_showtime_movie ON showtimes(movie_id);
CREATE INDEX idx_showtime_room ON showtimes(room_id);
CREATE INDEX idx_showtime_seat_showtime ON showtime_seats(showtime_id);
CREATE INDEX idx_showtime_seat_seat ON showtime_seats(seat_id);
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_showtime ON bookings(showtime_id);
CREATE INDEX idx_payment_booking ON payments(booking_id);
CREATE INDEX idx_ticket_booking ON tickets(booking_id);
CREATE INDEX idx_review_movie ON reviews(movie_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_room_seat_pricing_room ON room_seat_pricing(room_id);
CREATE INDEX idx_room_seat_pricing_type ON room_seat_pricing(seat_type);

