package com.habitapp.habit;

public class HabitTemplateNotFoundException extends RuntimeException {
    public HabitTemplateNotFoundException(Long id) {
        super("Habit template not found with id: " + id);
    }
}