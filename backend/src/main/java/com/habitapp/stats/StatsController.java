package com.habitapp.stats;

import com.habitapp.auth.UserPrincipal;
import com.habitapp.stats.dto.StatsResponseDto;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Statistics", description = "Get statistics about the user's habits.")
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @Operation(summary = "Get statistics", description = "Returns totals, the completion rate")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @GetMapping
    public StatsResponseDto getStats(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "7d") String range,
            @RequestParam(required = false) String timeZone
    ) {
        return statsService.getStats(principal.getUser().getId(), range, timeZone);
    }
}