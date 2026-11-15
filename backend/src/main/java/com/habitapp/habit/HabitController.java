package com.habitapp.habit;

import com.habitapp.auth.UserPrincipal;
import com.habitapp.habit.dto.HabitRequestDto;
import com.habitapp.habit.dto.HabitResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Habits", description = "Habits of the logged-in user.")
@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @Operation(summary = "List my habits", description = "Returns a list of habits for the authenticated user.")
    @ApiResponse (responseCode = "200", description = "List of habits retrieved successfully")
    @GetMapping
    public List<HabitResponseDto> getHabits(@AuthenticationPrincipal UserPrincipal principal,
        @RequestParam(required = false) String timeZone
    ) {
        return habitService.getHabitsForUser(principal.getUser().getId(), timeZone);
    }

    @Operation(summary = "Create a new habit", description = "Create habit from a template.")
    @ApiResponse (responseCode = "201", description = "Habit created successfully")
    @ApiResponse (responseCode = "400", description = "Invalid input data")
    @ApiResponse (responseCode = "404", description = "Template not found")
    @PostMapping
    public ResponseEntity<HabitResponseDto> createHabit(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody HabitRequestDto request
    ) {
        HabitResponseDto response = habitService.createHabit(principal.getUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation (summary = "Update a habit", description = "Update habit details.")
    @ApiResponse (responseCode = "200", description = "Habit updated successfully")
    @ApiResponse (responseCode = "400", description = "Invalid input data")
    @ApiResponse (responseCode = "404", description = "Habit not found")
    @PutMapping("/{id}")
    public HabitResponseDto updateHabit(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody HabitRequestDto request
    ) {
        return habitService.updateHabit(principal.getUser().getId(), id, request);
    }

    @Operation (summary = "Delete a habit", description = "Delete habit by ID with its sticker and scan history.")
    @ApiResponse (responseCode = "204", description = "Habit deleted successfully")
    @ApiResponse (responseCode = "404", description = "Habit not found, or it belongs to another user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter (description = "ID of the habit to delete", example = "1")
            @PathVariable Long id
    ) {
        habitService.deleteHabit(principal.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}