package com.habitapp.habit;

import com.habitapp.habit.dto.HabitTemplateResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag (name = "Habit Templates", description = "List of available habit templates.")
@RestController
@RequestMapping("/api/habit-templates")
public class HabitTemplateController {

    private final HabitTemplateRepository habitTemplateRepository;

    public HabitTemplateController(HabitTemplateRepository habitTemplateRepository) {
        this.habitTemplateRepository = habitTemplateRepository;
    }

    @Operation (summary = "List habit templates", description = "Returns a list of all available habit templates.")
    @ApiResponse (responseCode = "200", description = "List of habit templates retrieved")
    @GetMapping
    public List<HabitTemplateResponseDto> getTemplates() {
        return habitTemplateRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private HabitTemplateResponseDto toDto(HabitTemplate template) {
        return new HabitTemplateResponseDto(
                template.getId(),
                template.getTitle(),
                template.getIcon(),
                template.getCategory().getName(),
                template.getCategory().getColorHex(),
                template.getDefaultDailyTargetCount(),
                template.getUnitLabel(),
                template.getDefaultTimeOfDay().name(),
                template.getDefaultTargetDaysPerWeek()
        );
    }
}