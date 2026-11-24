package com.habitapp.scan;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ScanRulesTest {

    private static final List<Integer> EVERY_DAY = List.of(1, 2, 3, 4, 5, 6, 7);

    @Test
    void isInCooldown_czteryMinutyPoPoprzednimSkanie_zwracaTrue() {
        Instant last = Instant.parse("2026-10-07T10:00:00Z");

        assertThat(ScanRules.isInCooldown(last, last.plusSeconds(4 * 60))).isTrue();
    }

    @Test
    void isInCooldown_dokladniePiecMinutPoPoprzednimSkanie_zwracaFalse() {
        Instant last = Instant.parse("2026-10-07T10:00:00Z");

        assertThat(ScanRules.isInCooldown(last, last.plusSeconds(5 * 60))).isFalse();
    }

    @Test
    void nextStreak_wczorajUkonczony_zwiekszaStreak() {
        LocalDate today = LocalDate.of(2026, 10, 7);
        LocalDate yesterday = LocalDate.of(2026, 10, 6);

        int result = ScanRules.nextStreak(4, today, EVERY_DAY, day -> day.equals(yesterday));

        assertThat(result).isEqualTo(5);
    }

    @Test
    void nextStreak_wczorajNieukonczony_resetujeDoJeden() {
        LocalDate today = LocalDate.of(2026, 10, 7);

        int result = ScanRules.nextStreak(4, today, EVERY_DAY, day -> false);

        assertThat(result).isEqualTo(1);
    }

    @Test
    void nextStreak_pierwszyDzienNawyku_zaczynaOdJeden() {
        LocalDate today = LocalDate.of(2026, 10, 7);

        int result = ScanRules.nextStreak(0, today, EVERY_DAY, day -> false);

        assertThat(result).isEqualTo(1);
    }

    @Test
    void nextStreak_dzienPozaHarmonogramemNiePrzerywaPassy() {
        // pon, śr, pt; dzisiaj piątek 9.10 — czwartek nie jest zaplanowany, liczy się środa 7.10
        LocalDate today = LocalDate.of(2026, 10, 9);
        LocalDate wednesday = LocalDate.of(2026, 10, 7);

        int result = ScanRules.nextStreak(4, today, List.of(1, 3, 5), day -> day.equals(wednesday));

        assertThat(result).isEqualTo(5);
    }

    @Test
    void nextStreak_nawykRazWTygodniu_sprawdzaPoprzedniTydzien() {
        // tylko poniedziałki; dzisiaj poniedziałek 12.10, poprzedni zaplanowany dzień to 5.10
        LocalDate today = LocalDate.of(2026, 10, 12);
        LocalDate lastMonday = LocalDate.of(2026, 10, 5);

        int result = ScanRules.nextStreak(2, today, List.of(1), day -> day.equals(lastMonday));

        assertThat(result).isEqualTo(3);
    }

    @Test
    void pointsFor_dodajeBonusZaStreak() {
        assertThat(ScanRules.pointsFor(3)).isEqualTo(16);
    }

    @Test
    void pointsFor_bonusJestOgraniczonyDoPiecdziesieciu() {
        assertThat(ScanRules.pointsFor(100)).isEqualTo(60);
    }

        @Test
    void pointsForScan_skanWRamachCelu_naliczaPunkty() {
        assertThat(ScanRules.pointsForScan(3, 2, 3)).isEqualTo(16);
    }

    @Test
    void pointsForScan_skanOsiagajacyCel_naliczaPunkty() {
        assertThat(ScanRules.pointsForScan(3, 3, 3)).isEqualTo(16);
    }

    @Test
    void pointsForScan_skanPonadCel_zwracaZero() {
        assertThat(ScanRules.pointsForScan(3, 4, 3)).isZero();
    }
}