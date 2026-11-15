package com.habitapp.habit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitTemplateRepository extends JpaRepository<HabitTemplate, Long> {
}