# Inwentaryzacja ekranów

Lista wszystkich ekranów aplikacji mobilnej, ich odpowiedników w makietach Stitch (`stitch_nfc_habit_tracker/`, katalog nieśledzony przez git) oraz aktualny status implementacji.

Nawigacja: [`TabNavigator.tsx`](../../mobile/src/navigation/TabNavigator.tsx) — dolny pasek z 4 zakładkami (Home / Statystyki / Profil / Ustawienia) + dwa ekrany nakładkowe (`form`, `detail`) otwierane poza paskiem zakładek.

| # | Ekran | Plik | Mockup Stitch | Opis | Status |
|---|---|---|---|---|---|
| 1 | **Home / Lista Nawyków** | [`HabitListScreen.tsx`](../../mobile/src/screens/HabitListScreen.tsx) | `lista_nawyk_w/` | Powitanie, cel dzienny (pierścień progresu), lista aktywnych nawyków, wykres postępu tygodniowego, FAB dodawania nawyku (przypięty na stałe do rogu ekranu) | ✅ Zaimplementowany, dane mockowe |
| 2 | **Szczegóły Nawyku i NFC** | [`HabitDetailScreen.tsx`](../../mobile/src/screens/HabitDetailScreen.tsx) | `szczeg_y_i_nfc/` | Mapa spójności (heatmapa tygodniowa), kamień milowy (pierścień + odznaka), sekcja „How it works" (gdy brak sparowanego tagu) lub panel NFC + historia skanów (gdy tag sparowany), tabela szczegółów nawyku | ✅ Zaimplementowany, dane mockowe |
| 3 | **Statystyki Postępów** | [`StatsScreen.tsx`](../../mobile/src/screens/StatsScreen.tsx) | `statystyki_post_p_w/` | Przełącznik Weekly/Monthly, wykres Habit Consistency z trendem, baner najlepszego streaka, wynik konsekwencji (pierścień), ranking „Most Consistent", heatmapa miesięczna streaków | ✅ Zaimplementowany, dane mockowe |
| 4 | **Dodaj Nowy Nawyk** | [`HabitFormScreen.tsx`](../../mobile/src/screens/HabitFormScreen.tsx) | `dodaj_nowy_nawyk/` | Karta parowania NFC (Skanuj teraz / Dodaj później), dropdown z predefiniowanymi nawykami, częstotliwość (dni tygodnia), pora dnia, przycisk zapisu | ✅ Zaimplementowany, dane mockowe |
| 5 | Profil | [`ProfileScreen.tsx`](../../mobile/src/screens/ProfileScreen.tsx) | — *(brak mockupu Stitch)* | Dane użytkownika (avatar, poziom/XP), zapowiedź funkcji społecznościowych | ✅ Zaimplementowany jako placeholder — do rozbudowy w Etapie 4 (znajomi, wyzwania) |
| 6 | Ustawienia | [`SettingsScreen.tsx`](../../mobile/src/screens/SettingsScreen.tsx) | — *(brak mockupu Stitch)* | Przełączniki: powiadomienia, auto-otwieranie po skanie NFC, tryb ciemny; informacje o wersji aplikacji | ✅ Zaimplementowany jako placeholder |
| — | Logowanie | `LoginScreen.tsx` *(nie istnieje)* | — | Ekran logowania | ❌ Niezaimplementowany — zaplanowany w checkliście, Etap 1 Tydzień 3 |
| — | Rejestracja | `RegisterScreen.tsx` *(nie istnieje)* | — | Ekran rejestracji | ❌ Niezaimplementowany — zaplanowany w checkliście, Etap 1 Tydzień 3 |
| — | Znajomi | `FriendsListScreen.tsx` *(nie istnieje)* | — | Lista znajomych i zaproszeń | ❌ Zaplanowane na Etap 1 Tydzień 4 / backend w Etapie 4 |
| — | Ranking | `LeaderboardScreen.tsx` *(nie istnieje)* | — | Ranking punktowy | ❌ Zaplanowane na Etap 1 Tydzień 4 / backend w Etapie 4 |
| — | Wyzwania | `ChallengesScreen.tsx`, `ChallengeDetailScreen.tsx` *(nie istnieją)* | — | Lista i szczegóły wyzwań grupowych | ❌ Zaplanowane na Etap 1 Tydzień 4 / backend w Etapie 4 |

## Uwagi

- Ekrany 1–4 mają bezpośrednie makiety w Stitch i zostały zaimplementowane z wysoką wiernością wizualną względem designu (zweryfikowane wizualnie w przeglądarce przy przeprojektowaniu UI).
- Ekrany Profil i Ustawienia nie miały gotowego designu — zbudowane jako minimalne, spójne stylistycznie placeholdery, żeby domknąć 4-zakładkową nawigację widoczną w makietach (dolny pasek na każdym mockupie ma 4 pozycje: Home, Statystyki, Profil, Ustawienia).
- Ekrany logowania/rejestracji oraz społecznościowe (znajomi/ranking/wyzwania) są jeszcze do zbudowania — patrz checklista, Etap 1 Tydzień 3–4.
