-- Schemat początkowy NFC Habit Tracker.
-- Odpowiada diagramowi ERD w docs/erd.md (10 encji, patrz tam po pełny opis
-- relacji i uzasadnienie decyzji projektowych).
--
-- Uwaga: encja "User" z ERD jest tu tabelą `users`, bo `user` to zarezerwowane
-- słowo kluczowe w SQL/Postgres.

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    display_name  VARCHAR(100)  NOT NULL,
    avatar_url    VARCHAR(500),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE habit_category (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    color_hex  VARCHAR(7)   NOT NULL,
    icon       VARCHAR(20)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE habit_template (
    id                           BIGSERIAL PRIMARY KEY,
    category_id                  BIGINT       NOT NULL REFERENCES habit_category(id) ON DELETE RESTRICT,
    title                        VARCHAR(150) NOT NULL,
    icon                         VARCHAR(20)  NOT NULL,
    default_daily_target_count   INT          NOT NULL DEFAULT 1 CHECK (default_daily_target_count > 0),
    unit_label                   VARCHAR(50),
    default_time_of_day          VARCHAR(20)  NOT NULL
        CHECK (default_time_of_day IN ('RANO', 'POPOLUDNIE', 'WIECZOR', 'CALY_DZIEN')),
    default_target_days_per_week INT          NOT NULL DEFAULT 7 CHECK (default_target_days_per_week BETWEEN 1 AND 7),
    created_at                   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE habit (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id          BIGINT      NOT NULL REFERENCES habit_template(id) ON DELETE RESTRICT,
    daily_target_count   INT         NOT NULL DEFAULT 1 CHECK (daily_target_count > 0),
    time_of_day          VARCHAR(20) NOT NULL
        CHECK (time_of_day IN ('RANO', 'POPOLUDNIE', 'WIECZOR', 'CALY_DZIEN')),
    target_days_per_week INT         NOT NULL CHECK (target_days_per_week BETWEEN 1 AND 7),
    scheduled_days       JSONB       NOT NULL DEFAULT '[1,2,3,4,5,6,7]',
    current_streak       INT         NOT NULL DEFAULT 0,
    reminders_enabled    BOOLEAN     NOT NULL DEFAULT true,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_habit_user_id ON habit(user_id);

CREATE TABLE nfc_tag (
    id         BIGSERIAL PRIMARY KEY,
    habit_id   BIGINT       NOT NULL UNIQUE REFERENCES habit(id) ON DELETE CASCADE,
    uid        VARCHAR(255) NOT NULL UNIQUE,
    ndef_url   VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE scan_log (
    id              BIGSERIAL PRIMARY KEY,
    habit_id        BIGINT      NOT NULL REFERENCES habit(id) ON DELETE CASCADE,
    nfc_tag_id      BIGINT      NOT NULL REFERENCES nfc_tag(id) ON DELETE CASCADE,
    user_id         BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scanned_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    status          VARCHAR(30) NOT NULL
        CHECK (status IN ('SUCCESS', 'REJECTED_COOLDOWN', 'REJECTED_UNASSIGNED')),
    points_awarded  INT         NOT NULL DEFAULT 0
);

-- Pod zapytania statystyczne (GET /api/stats) i wyliczanie dziennego postępu
-- (patrz "Mechanika wielokrotnego odznaczania" w docs/erd.md).
CREATE INDEX idx_scan_log_habit_scanned_at ON scan_log(habit_id, scanned_at);
CREATE INDEX idx_scan_log_user_id ON scan_log(user_id);

CREATE TABLE friendship (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id  BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status     VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_friendship_pair UNIQUE (user_id, friend_id),
    CONSTRAINT chk_friendship_not_self CHECK (user_id <> friend_id)
);

CREATE TABLE challenge (
    id           BIGSERIAL PRIMARY KEY,
    creator_id   BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(150) NOT NULL,
    type         VARCHAR(30) NOT NULL CHECK (type IN ('TOTAL_SCANS', 'STREAK_TARGET')),
    target_value INT         NOT NULL CHECK (target_value > 0),
    start_date   DATE        NOT NULL,
    end_date     DATE        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_challenge_dates CHECK (end_date >= start_date)
);

CREATE TABLE challenge_participant (
    id              BIGSERIAL PRIMARY KEY,
    challenge_id    BIGINT      NOT NULL REFERENCES challenge(id) ON DELETE CASCADE,
    user_id         BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    progress_value  INT         NOT NULL DEFAULT 0,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_challenge_participant UNIQUE (challenge_id, user_id)
);

CREATE TABLE notification (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(20) NOT NULL CHECK (type IN ('REMINDER', 'CHALLENGE', 'SOCIAL')),
    title      VARCHAR(150) NOT NULL,
    body       VARCHAR(500) NOT NULL,
    is_read    BOOLEAN     NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_user_id ON notification(user_id);
