package com.habitapp.habit;

public class HabitNotFoundException extends RuntimeException {
    public HabitNotFoundException(Long id) {
        super("Nie znaleziono nawyku o id: " + id);
    }
}