-- Jedna relacja na parę użytkowników, niezależnie od tego, kto kogo zaprosił.
-- UNIQUE (user_id, friend_id) z V1 nie blokuje pary w odwrotnym kierunku.
CREATE UNIQUE INDEX uq_friendship_unordered_pair
    ON friendship (LEAST(user_id, friend_id), GREATEST(user_id, friend_id));