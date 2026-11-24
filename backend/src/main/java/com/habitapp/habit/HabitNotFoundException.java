package com.habitapp.habit;

public class HabitNotFoundException extends RuntimeException {
    public HabitNotFoundException(Long id) {
        super("Habit not found with id: " + id);
    }
}