# Specyfikacja Reguł Biznesowych (Business Rules) - NFC Habit Tracker

* **Wersja:** 1.0.0
* **Data utworzenia:** 12 Sierpnia 2026
* **Status:** Zatwierdzony (Approved)

---

## ⏱️ 1. Zabezpieczenie Anty-Spamowe (Scan Cooldown)

Aby zapobiec sztucznemu nabijaniu punktów oraz wielokrotnemu zeskanowaniu tej samej naklejki w krótkim odstępie czasu, wdrożono regułę **Scan Cooldown**:

1. **Minimalny odstęp czasu:** Skanowanie tego samego fizycznego tagu NFC (`tagId`) przez tego samego użytkownika jest akceptowane maksymalnie **raz na 5 minut** (cooldown dynamiczny) lub **raz na dobę kalendarzową** w zależności od typu nawyku.
2. **Kody odpowiedzi API:**
   - W przypadku wysłania skanu przed upływem cooldownu, serwer backendowy odrzuca żądanie zwracając kod **HTTP 409 Conflict** z komunikatem: `"Skan został już zarejestrowany. Odczekaj chwilę przed kolejnym zbliżeniem tagu."`
3. **Zapis logu skanu:** Odrzucone skany nie modyfikują stanu nawyku ani streaka, ale mogą być zapisywane w tabeli auditowej z oznaczeniem statusu `REJECTED_COOLDOWN`.

---

## 🔥 2. Algorytm Naliczania i Resetu Streaków (Passy Dni)

Streak określa liczbę kolejnych dni/okresów, w których nawyk został wykonany zgodnie z harmonogramem.

### A. Definicja dnia kalendarzowego
- Dzień nawyku trwa od **00:00:00** do **23:59:59** w **lokalnej strefie czasowej użytkownika**.

### B. Zasady aktualizacji streaka:
1. **Pierwszy skan w danym dniu:**
   - Jeśli nawyk został skanowany wczoraj $\rightarrow$ `streak = streak + 1`.
   - Jeśli nawyk został skanowany dzisiaj wcześniej $\rightarrow$ brak zmiany streaka.
   - Jeśli ostatni skan był przedwczoraj lub dawniej $\rightarrow$ `streak = 1` (reset passy).
2. **Nawyki o wyznaczonych dniach (np. Pon, Śr, Pt):**
   - Dni wolne zdefiniowane w harmonogramie nawyku nie przerywają streaka. Serwer sprawdza poprawność z uwzględnieniem oczekiwanych dni wykonania.

---

## 🌍 3. Standaryzacja Stref Czasowych (UTC & Timezones)

Aby zapewnić spójność danych niezależnie od lokalizacji użytkownika i podróży strefowych:

1. **Baza danych (PostgreSQL):** Wszystkie znaczniki czasu (`created_at`, `scanned_at`, `updated_at`) są zapisywane w formacie **UTC** (`TIMESTAMP WITH TIME ZONE`).
2. **Komunikacja API:** Znaczniki czasu w formatach JSON przekazywane są jako standard **ISO 8601** (np. `2026-08-12T12:50:00Z`).
3. **Aplikacja mobilna (React Native):** Przeliczanie dat na lokalną strefę użytkownika następuje na poziomie warstwy prezentacji (UI) przy użyciu strefy czasowej urządzenia.

---

## 🏆 4. Punktacja i Grywalizacja (Gamification Rules)

Każde poprawne wykonanie skanu przyznaje użytkownikowi punkty doświadczenia (XP):

- **Podstawowy skan nawyku:** `+10 pkt`
- **Bonus za ciągłość (Streak Bonus):** `+2 pkt` za każdy dzień aktywnego streaka (maksymalnie `+50 pkt` bonusu na skan).
- **Wykonywanie wyzwań grupowych:** Dodatkowe nagrody punktowe po ukończeniu wyzwania.
