package com.habitapp.scan.dto;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

public record ScanRequestDto(
    @Schema(description = "Identifier read from the sticker", example = "Qm9v3kT0xJ8vYlq2n5Wc1A")
    @NotBlank String tagId,
    String timeZone) {}
