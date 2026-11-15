package com.habitapp.habit;

public class HabitTemplateNotFoundException extends RuntimeException {
    public HabitTemplateNotFoundException(Long id) {
        super("Nie znaleziono szablonu nawyku o id: " + id);
    }
}