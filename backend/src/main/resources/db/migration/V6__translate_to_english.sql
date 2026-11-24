-- Translate seed data and time_of_day codes from Polish to English.
-- V1-V3 are already applied (including production), so they must not be edited;
-- this migration converts the existing rows in place.

-- 1. Categories
UPDATE habit_category SET name = 'Health' WHERE name = 'Zdrowie';
UPDATE habit_category SET name = 'Growth' WHERE name = 'Rozwój';
-- 'Fit' is already English.

-- 2. Habit templates (TRIM: V3 contains 'Branie witamin ' with a trailing space)
UPDATE habit_template SET title = 'Drink water',                         unit_label = 'glasses' WHERE TRIM(title) = 'Picie wody';
UPDATE habit_template SET title = 'Take vitamins',                       unit_label = 'pills'   WHERE TRIM(title) = 'Branie witamin';
UPDATE habit_template SET title = 'Take medication',                     unit_label = 'pills'   WHERE TRIM(title) = 'Branie leków';
UPDATE habit_template SET title = 'Read a book'                                                 WHERE TRIM(title) = 'Czytanie książki';
UPDATE habit_template SET title = 'Language learning'                                           WHERE TRIM(title) = 'Nauka języka';
UPDATE habit_template SET title = 'Floss teeth'                                                 WHERE TRIM(title) = 'Nitkowanie zębów';
UPDATE habit_template SET title = 'Strength or cardio workout'                                  WHERE TRIM(title) = 'Trening siłowy lub cardio';
UPDATE habit_template SET title = 'Walk the dog'                                                WHERE TRIM(title) = 'Spacer z psem';
UPDATE habit_template SET title = 'Deep work session'                                           WHERE TRIM(title) = 'Sesja Deep Work';
UPDATE habit_template SET title = 'Meditation and breathing exercises'                          WHERE TRIM(title) = 'Medytacja i ćwiczenia oddechowe';
UPDATE habit_template SET title = 'Yoga'                                                        WHERE TRIM(title) = 'Joga';
UPDATE habit_template SET title = 'No screens 30 min before bed'                                WHERE TRIM(title) = 'Bez ekranów 30 min przed snem';
UPDATE habit_template SET title = 'Walk 10,000 steps'                                           WHERE TRIM(title) = 'Spacer 10000 kroków';
-- 'Sudoku' is the same in both languages.

-- 3. time_of_day codes (habit_template.default_time_of_day and habit.time_of_day)
-- The CHECK constraints from V1 are inline and unnamed, so PostgreSQL gave them default names.
ALTER TABLE habit_template DROP CONSTRAINT IF EXISTS habit_template_default_time_of_day_check;
ALTER TABLE habit          DROP CONSTRAINT IF EXISTS habit_time_of_day_check;

UPDATE habit_template SET default_time_of_day = CASE default_time_of_day
    WHEN 'RANO'       THEN 'MORNING'
    WHEN 'POPOLUDNIE' THEN 'AFTERNOON'
    WHEN 'WIECZOR'    THEN 'EVENING'
    WHEN 'CALY_DZIEN' THEN 'ALL_DAY'
    ELSE default_time_of_day
END;

UPDATE habit SET time_of_day = CASE time_of_day
    WHEN 'RANO'       THEN 'MORNING'
    WHEN 'POPOLUDNIE' THEN 'AFTERNOON'
    WHEN 'WIECZOR'    THEN 'EVENING'
    WHEN 'CALY_DZIEN' THEN 'ALL_DAY'
    ELSE time_of_day
END;

ALTER TABLE habit_template
    ADD CONSTRAINT habit_template_default_time_of_day_check
    CHECK (default_time_of_day IN ('MORNING', 'AFTERNOON', 'EVENING', 'ALL_DAY'));
ALTER TABLE habit
    ADD CONSTRAINT habit_time_of_day_check
    CHECK (time_of_day IN ('MORNING', 'AFTERNOON', 'EVENING', 'ALL_DAY'));
