package com.habitapp.stats;

import com.habitapp.stats.StatsCalculator.DailyScans;
import com.habitapp.stats.StatsCalculator.HabitInfo;
import com.habitapp.stats.dto.CategoryStatsDto;
import com.habitapp.stats.dto.StatsResponseDto;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class StatsCalculatorTest {

    // poniedziałek 5.10.2026 – niedziela 11.10.2026
    private static final LocalDate FROM = LocalDate.of(2026, 10, 5);
    private static final LocalDate TO = LocalDate.of(2026, 10, 11);
    private static final LocalDate CREATED_EARLIER = LocalDate.of(2026, 10, 1);
    private static final List<Integer> EVERY_DAY = List.of(1, 2, 3, 4, 5, 6, 7);

    @Test
    void calculate_zwracaWpisDlaKazdegoDniaZakresuTakzePustych() {
        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO,
                List.of(habit(1, "Zdrowie", 1, EVERY_DAY, CREATED_EARLIER)), List.of());

        assertThat(result.days()).hasSize(7);
        assertThat(result.days().get(0).date()).isEqualTo(FROM);
        assertThat(result.days().get(6).date()).isEqualTo(TO);
        assertThat(result.totalScans()).isZero();
    }

    @Test
    void calculate_liczySkanyIDniZDomknietymCelem() {
        List<HabitInfo> habits = List.of(
                habit(1, "Zdrowie", 1, EVERY_DAY, CREATED_EARLIER),
                habit(2, "Zdrowie", 3, EVERY_DAY, CREATED_EARLIER));
        List<DailyScans> scans = List.of(scans(1, 6, 1), scans(1, 7, 1), scans(2, 6, 2));

        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO, habits, scans);

        assertThat(result.totalScans()).isEqualTo(4);
        assertThat(result.days().get(1).scans()).isEqualTo(3);
        assertThat(result.days().get(1).completedHabits()).isEqualTo(1);
        assertThat(result.days().get(2).scans()).isEqualTo(1);
        assertThat(result.days().get(2).completedHabits()).isEqualTo(1);
    }

    @Test
    void completionRate_dzienWTokuNieObciazaWyniku() {
        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO,
                List.of(habit(1, "Zdrowie", 1, EVERY_DAY, CREATED_EARLIER)),
                List.of(scans(1, 6, 1), scans(1, 7, 1)));

        // zaplanowanych 6 dni (11.10 w toku i niewykonany jest pominięty), wykonane 2
        assertThat(result.completionRatePercentage()).isEqualTo(33);
    }

    @Test
    void completionRate_dzienWTokuLiczySiePoDomknieciuCelu() {
        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO,
                List.of(habit(1, "Zdrowie", 1, EVERY_DAY, CREATED_EARLIER)),
                List.of(scans(1, 11, 1)));

        // 6 poprzednich dni + dzisiaj wykonane = 7 zaplanowanych, 1 wykonany
        assertThat(result.completionRatePercentage()).isEqualTo(14);
    }

    @Test
    void completionRate_uwzglednaTylkoDniZHarmonogramu() {
        // pon, śr, pt: zaplanowane 5.10, 7.10, 9.10
        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO,
                List.of(habit(1, "Zdrowie", 1, List.of(1, 3, 5), CREATED_EARLIER)),
                List.of(scans(1, 5, 1), scans(1, 7, 1)));

        assertThat(result.completionRatePercentage()).isEqualTo(67);
        assertThat(result.habits().get(0).completionPercentage()).isEqualTo(67);
    }

    @Test
    void completionRate_nieLiczyDniPrzedUtworzeniemNawyku() {
        // utworzony 9.10: zaplanowane 9.10 i 10.10 (11.10 w toku, niewykonany)
        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO,
                List.of(habit(1, "Zdrowie", 1, EVERY_DAY, LocalDate.of(2026, 10, 9))),
                List.of(scans(1, 9, 1)));

        assertThat(result.completionRatePercentage()).isEqualTo(50);
    }

    @Test
    void calculate_bezNawykowDajeZeroIZachowujeDni() {
        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO, List.of(), List.of());

        assertThat(result.completionRatePercentage()).isZero();
        assertThat(result.days()).hasSize(7);
        assertThat(result.categoryBreakdown()).isEmpty();
    }

    @Test
    void categoryBreakdown_grupujeSortujeIPomijaKategorieBezSkanow() {
        List<HabitInfo> habits = List.of(
                habit(1, "Zdrowie", 1, EVERY_DAY, CREATED_EARLIER),
                habit(2, "Zdrowie", 1, EVERY_DAY, CREATED_EARLIER),
                habit(3, "Fit", 1, EVERY_DAY, CREATED_EARLIER),
                habit(4, "Rozwój", 1, EVERY_DAY, CREATED_EARLIER));
        List<DailyScans> scans = List.of(scans(1, 6, 3), scans(2, 6, 1), scans(3, 7, 5));

        StatsResponseDto result = StatsCalculator.calculate("7d", FROM, TO, habits, scans);

        assertThat(result.categoryBreakdown())
                .extracting(CategoryStatsDto::category)
                .containsExactly("Fit", "Zdrowie");
        assertThat(result.categoryBreakdown().get(1).scans()).isEqualTo(4);
    }

    private static HabitInfo habit(long id, String category, int target, List<Integer> days, LocalDate createdOn) {
        return new HabitInfo(id, "Nawyk " + id, "💧", category, "#0EA5E9", target, days, createdOn, 0);
    }

    private static DailyScans scans(long habitId, int dayOfOctober, long count) {
        return new DailyScans(habitId, LocalDate.of(2026, 10, dayOfOctober), count);
    }
}