package com.habitapp.scan.dto;

import java.time.Instant;
import io.swagger.v3.oas.annotations.media.Schema;

public record TagResponseDto(
        @Schema(description = "Internal id of the sticker record")
        Long id,
        Long habitId,
        @Schema(description = "Random identifier of the sticker")
        String tagId,
        @Schema(description = "URL of the NDEF record, address to write to the sticker with tagId ", example = "habitapp://scan?tagId=Qm9v3kT0xJ8vYlq2n5Wc1A")
        String ndefUrl,
        Instant createdAt
) {}