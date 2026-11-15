package com.habitapp.scan;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.habitapp.auth.UserPrincipal;
import com.habitapp.scan.dto.ScanRequestDto;
import com.habitapp.scan.dto.ScanResponseDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Scanning", description = "Scan an NFC tag to record a habit.")
@RestController 
@RequestMapping("/api/scan")
public class ScanController {
    
    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @Operation(summary = "Scan an NFC tag", description = "Records a habit by scanning an NFC tag identified by tag Id. Returns the updated habit details.")
    @ApiResponse(responseCode = "200", description = "Scan registered")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @ApiResponse(responseCode = "404", description = "Tag not found")
    @ApiResponse (responseCode = "409", description = "Duplicate scan")
    @PostMapping 
    public ScanResponseDto scan(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody ScanRequestDto request
    ){
        return scanService.scan(principal.getUser(), request.tagId(), request.timeZone());
    }
}
