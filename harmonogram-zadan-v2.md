# Harmonogram i Lista Zadań: System Budowania Nawyków NFC (Wersja v2)
---
## 📅 ETAP 1: Architektura, Baza Danych, Środowisko i Start UI (Sierpień 2026)

### Tydzień 1: Inicjalizacja środowisk i PoC NFC
- [x] **Zadanie 1.1:** Zamówienie zestawu naklejek NTAG215 (NFC Forum Type 2).
- [ ] **Zadanie 1.2:** Inicjalizacja repozytorium GitHub `nfc-habit-tracker` i konfiguracja pliku `.gitignore` dla Node, Javy i IDE.
- [ ] **Zadanie 1.3:** Stworzenie struktury folderów w repozytorium: `/backend`, `/mobile`, `/docs`.
- [ ] **Zadanie 1.4:** Inicjalizacja projektu React Native (bare workflow / Expo Dev Client pod kątem natywnych modułów NFC i Deep Linking).
- [ ] **Zadanie 1.5 (Android):** Instalacja `react-native-nfc-manager` i dodanie uprawnień oraz konfiguracja obsługi **Android App Links** w `AndroidManifest.xml` dla domeny `https://habitapp.pl/scan`. Przygotowanie pliku konfiguracyjnego `assetlinks.json`.
- [ ] **Zadanie 1.6 (iOS):** Założenie konta Apple Developer, konfiguracja Xcode, dodanie capability `Near Field Communication Tag Reading` oraz **Associated Domains** (`applinks:habitapp.pl`). Konfiguracja kluczy w `Info.plist` pod kątem Core NFC. Przygotowanie pliku `apple-app-site-association` (AASA).
- [ ] **Zadanie 1.7:** Napisanie kodu Proof of Concept (PoC) – prostego komponentu odczytującego rekord NDEF URI w formacie HTTPS z fizycznego tagu.

### Tydzień 2: Modelowanie, reguły i design system
- [ ] **Zadanie 2.1:** Przygotowanie ostatecznego diagramu ERD (np. w dbdiagram.io) dla 9 tabel (User, HabitCategory, Habit, NfcTag, ScanLog, Friendship, Challenge, ChallengeParticipant, Notification).
- [ ] **Zadanie 2.2:** Spisanie dokumentu reguł biznesowych (`docs/business-rules.md`): cooldown na skany (np. min. 5 minut), algorytm naliczania i resetu streaków (ciągłości dni) z uwzględnieniem stref czasowych UTC.
- [ ] **Zadanie 2.3:** Konfiguracja systemu projektowego w React Native (`src/theme.ts`): definicja kolorów HEX, wielkości fontów i spacingów na podstawie założeń z Figmy.
- [ ] **Zadanie 2.4:** Utworzenie atomowych komponentów UI wielokrotnego użytku: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`.

### Tydzień 3: Docker, Spring Boot Init i makiety UI
- [ ] **Zadanie 3.1:** Stworzenie pliku `docker-compose.yml` w głównym katalogu backendu (usługa PostgreSQL 16 z wolumenem na dane i przypisanym portem 5432).
- [ ] **Zadanie 3.2:** Wygenerowanie szkieletu projektu Spring Boot 3 (Java 21, Maven) z dependencies: Web, JPA, PostgreSQL, Security, Validation.
- [ ] **Zadanie 3.3:** Konfiguracja połączenia z bazą danych w `application.yml` przy użyciu profili Springa (local vs prod).
- [ ] **Zadanie 3.4:** Stworzenie plików z danymi mockowymi (`src/mocks/habits.json`) odpowiadających strukturze przyszłego API.
- [ ] **Zadanie 3.5:** Konfiguracja React Navigation (`AppNavigator.tsx`) z obsługą nawigacji z linku zewnętrznego (Deep Linking/Universal Links) oraz stworzenie widoków `LoginScreen.tsx` i `RegisterScreen.tsx`.
- [ ] **Zadanie 3.6:** Zbudowanie ekranu głównego `HabitListScreen.tsx` z listą nawyków renderowaną na podstawie danych mockowych.

### Tydzień 4: Migracje bazodanowe i automatyzacja CI
- [ ] **Zadanie 4.1:** Konfiguracja Flyway w Spring Boot (dodanie zależności Maven do `pom.xml` i ustawień w `application.yml`).
- [ ] **Zadanie 4.2:** Napisanie pierwszej migracji `V1__init_schema.sql` (tworzenie tabel na podstawie diagramu ERD).
- [ ] **Zadanie 4.3:** Przygotowanie plików CI (`.github/workflows/backend-ci.yml` i `mobile-ci.yml`) do automatycznego odpalania testów przy każdym pushu.
- [ ] **Zadanie 4.4:** Dokończenie ekranów statycznych w aplikacji: `HabitFormScreen.tsx` (tworzenie/edycja nawyków) oraz `TagAssignScreen.tsx` (parowanie tagu z symulacją fizycznego zapisu rekordu HTTPS NDEF).

---

## 📅 ETAP 2: Backend, API i logika nawyków (Wrzesień 2026)

### Tydzień 1: JPA, Rejestracja/Logowanie i zaawansowane wykresy
- [ ] **Zadanie 1.1:** Implementacja klas encji JPA (User, HabitCategory, Habit) wraz z adnotacjami mapującymi i relacjami.
- [ ] **Zadanie 1.2:** Stworzenie migracji `V2__seed_habit_categories.sql` wprowadzającej predefiniowane kategorie (Rozwój, Higiena, Zdrowie).
- [ ] **Zadanie 1.3:** Dodanie zależności Spring Security + JWT, konfiguracja `SecurityConfig.java` i implementacja endpointów `/api/auth/register` oraz `/api/auth/login`.
- [ ] **Zadanie 1.4:** Instalacja **Victory Native XL** i `react-native-svg` w aplikacji mobilnej.
- [ ] **Zadanie 1.5:** Implementacja wykresu liniowego postępów i kołowego podziału kategorii na ekranie `StatsScreen.tsx` z użyciem danych mockowych.

### Tydzień 2: CRUD dla nawyków i ekrany społecznościowe
- [ ] **Zadanie 2.1:** Implementacja `HabitController` (GET, POST, PUT, DELETE) oraz `HabitService` z walidacją wejścia (@NotBlank, @NotNull).
- [ ] **Zadanie 2.2:** Przygotowanie testów jednostkowych serwisu nawyków (`HabitServiceTest`) przy użyciu Mockito (pokrycie min. 70%).
- [ ] **Zadanie 2.3:** Przygotowanie mocków JSON dla modułów społecznościowych (`friends.json`, `leaderboard.json`, `challenges.json`).
- [ ] **Zadanie 2.4:** Budowa statycznych widoków społecznościowych: `FriendsListScreen.tsx`, `LeaderboardScreen.tsx` oraz `ChallengesScreen.tsx`.

### Tydzień 3: Obsługa skanu, parowanie tagów i Axios/React Query
- [ ] **Zadanie 3.1:** Implementacja publicznych endpointów na backendzie służących do autoryzacji systemów mobilnych w domenie: `GET /.well-known/apple-app-site-association` (dla iOS) oraz `GET /.well-known/assetlinks.json` (dla Androida) zwracających poprawne pliki konfiguracyjne JSON.
- [ ] **Zadanie 3.2:** Implementacja głównego endpointu `POST /api/scan` obsługującego rejestrację fizycznego zbliżenia.
- [ ] **Zadanie 3.3:** Logika biznesowa w `ScanService`: wyszukiwanie tagu NFC po identyfikatorze UUID (`tagId`) przekazanym w parametrach Universal Linku, weryfikacja przynależności, cooldown, aktualizacja passy (streaka).
- [ ] **Zadanie 3.4:** Implementacja endpointu `POST /api/habits/{id}/tags` służącego do przypisywania wygenerowanego `tagId` do istniejącego nawyku.
- [ ] **Zadanie 3.5:** Konfiguracja klienta Axios z interceptorem automatycznie dołączającym token JWT pobierany z bezpiecznej pamięci urządzenia (`expo-secure-store`).
- [ ] **Zadanie 3.6:** Konfiguracja `QueryClientProvider` i podpięcie pierwszych hooków pobierających dane z serwera dla list nawyków.

### Tydzień 4: Agregacja statystyk i testy integracyjne API
- [ ] **Zadanie 4.1:** Implementacja endpointu `GET /api/stats` – napisanie zapytań agregujących SQL/JPQL grupujących skany po dacie i kategorii z obsługą filtrów zakresu czasu (7d / 30d / 90d).
- [ ] **Zadanie 4.2:** Konfiguracja testów integracyjnych backendu z użyciem biblioteki `Testcontainers` (automatyczne uruchamianie testowego kontenera z PostgreSQL na czas testów API).
- [ ] **Zadanie 4.3:** Napisanie testu integracyjnego end-to-end na backendzie: rejestracja użytkownika -> utworzenie nawyku -> przypisanie tagu -> wysłanie skanu -> weryfikacja poprawności obliczenia streaka.
- [ ] **Zadanie 4.4:** Pełne zastąpienie danych mockowych w aplikacji mobilnej realnymi zapytaniami API dla ekranów logowania, listy nawyków i statystyk.

---

## 📅 ETAP 3: Integracja Universal Links, NFC i obsługa Offline (Październik 2026)

### Tydzień 1: Android – integracja, parowanie i App Links
- [ ] **Zadanie 1.1:** Reorganizacja kodu PoC NFC do architektury produkcyjnej: `src/services/nfc.android.ts` (obsługa zapisu i odczytu rekordu NDEF HTTPS).
- [ ] **Zadanie 1.2:** Konfiguracja i przetestowanie poprawnego przechwytywania Android App Links w emulatorze/telefonie deweloperskim po zbliżeniu zaprogramowanego tagu.
- [ ] **Zadanie 1.3:** Implementacja dedykowanego hooka `useNfcScan()` zarządzającego stanami i cyklem nasłuchu.
- [ ] **Zadanie 1.4:** Podłączenie fizycznego zapisu rekordu NDEF HTTPS na ekranie parowania i integracja z mutacją `POST /api/habits/{id}/tags`.

### Tydzień 2: iOS – konfiguracja Core NFC, Associated Domains i systemowy UI
- [ ] **Zadanie 2.1:** Implementacja obsługi platformowej dla iOS (`src/services/nfc.ios.ts`) zawierająca zapis rekordu NDEF HTTPS.
- [ ] **Zadanie 2.2:** Integracja i przetestowanie **iOS Background Tag Reading** za pomocą Universal Linków na fizycznym iPhonie (weryfikacja zachowania: wyświetlenie systemowej notyfikacji, przejście do aplikacji po kliknięciu i obsługa odblokowania ekranu).
- [ ] **Zadanie 2.3:** Integracja sesji skanowania iOS w trybie aktywnym (`NFCTagReaderSession`) i obsługa systemowej nakładki.
- [ ] **Zadanie 2.4:** Zmapowanie stanów zamknięcia sesji i błędów odczytu na wspólny interfejs z Androidem.

### Tydzień 3: Spójny przepływ skanowania i optymistyczne aktualizacje
- [ ] **Zadanie 3.1:** Opracowanie spójnego komponentu nakładki dialogowej 'Skanuj tag NFC' w aplikacji.
- [ ] **Zadanie 3.2:** Podłączenie skanu NFC do API (POST /api/scan) z zastosowaniem **optimistic updates** w React Query.
- [ ] **Zadanie 3.3:** Stworzenie płynnej animacji sukcesu (np. przy użyciu `react-native-reanimated`) wyświetlanej po udanym skanowaniu.

### Tydzień 4: Tryb offline i odporność na brak sieci
- [ ] **Zadanie 4.1:** Konfiguracja `@tanstack/react-query-persist-client` oraz AsyncStorage persistera w celu zapisu stanu na dysku urządzenia.
- [ ] **Zadanie 4.2:** Podpięcie NetInfo do wykrywania stanu sieci w czasie rzeczywistym.
- [ ] **Zadanie 4.3:** Implementacja kolejki mutacji offline w React Query (automatyczne wznawianie po wykryciu sieci).

---

## 📅 ETAP 4: Grywalizacja, Wyzwania i Powiadomienia (Listopad 2026)

### Tydzień 1: Backend grywalizacji i relacji znajomych
- [ ] **Zadanie 1.1:** Rozbudowa tabeli `ScanLog` o kolumnę `points` i napisanie logiki naliczania punktacji na backendzie.
- [ ] **Zadanie 1.2:** Stworzenie tabeli i encji `Friendship` oraz migracja bazodanowa `V5__add_friendships.sql`.
- [ ] **Zadanie 1.3:** Implementacja API do obsługi zaproszeń i listy znajomych (GET, POST, PUT).

### Tydzień 2: Rankingi i wyzwania grupowe
- [ ] **Zadanie 2.1:** Napisanie zapytań SQL dla rankingu znajomych (GET /api/leaderboard) za dany okres.
- [ ] **Zadanie 2.2:** Dodanie tabel dla wyzwań grupowych (`Challenge`, `ChallengeParticipant`) i logiki postępu.

### Tydzień 3: Podłączenie widoków grywalizacji w aplikacji
- [ ] **Zadanie 3.1:** Zastąpienie mocków na ekranie rankingu (`LeaderboardScreen.tsx`) realnym zapytaniem do endpointu `/api/leaderboard` z użyciem React Query.
- [ ] **Zadanie 3.2:** Integracja modułu wyzwań (wyświetlanie aktywnych, formularz tworzenia wyzwania grupowego).

### Tydzień 4: Powiadomienia push (FCM) oraz fallback lokalny
- [ ] **Zadanie 4.1:** Konfiguracja projektu Firebase Cloud Messaging (FCM) dla platform Android (JSON) oraz iOS (certyfikaty APNs).
- [ ] **Zadanie 4.2:** Napisanie serwisu backendowego wysyłającego powiadomienia push o zaplanowanych porach nawyków.
- [ ] **Zadanie 4.3:** Wdrożenie lokalnych notyfikacji za pomocą `@notifee/react-native` jako offline-first fallback.

---

## 📅 ETAP 5: Testy, Wdrożenie i Dokumentacja (Grudzień 2026 – Styczeń 2027)

### Tydzień 1–2 (Grudzień): Testy E2E i testy wydajnościowe
- [ ] **Zadanie 5.1:** Rozszerzenie testów integracyjnych w CI o pełne scenariusze z uwzględnieniem wyzwań i powiadomień.
- [ ] **Zadanie 5.2:** Przygotowanie skryptu testów obciążeniowych w k6 (symulacja ruchu na endpoint skanowania NFC).
- [ ] **Zadanie 5.3:** Przeprowadzenie analizy wydajności zapytań PostgreSQL, dodanie brakujących indeksów.

### Tydzień 3–4 (Grudzień): Testy z użytkownikami i pisanie pracy
- [ ] **Zadanie 5.4:** Rekrutacja grupy 3–5 testerów i przeprowadzenie testów użyteczności metodą głośnego myślenia (Think-Aloud).
- [ ] **Zadanie 5.5:** Zebranie opinii przy użyciu ankiety SUS, analiza statystyczna wyników w dokumentacji.
- [ ] **Zadanie 5.6:** Przygotowanie szablonu pracy inżynierskiej w LaTeX/Word oraz opis architektury i baz danych.

### Tydzień 1–2 (Styczeń): Praca pisemna i przygotowanie obrony
- [ ] **Zadanie 5.7:** Uzupełnienie rozdziałów teoretycznych, technologicznych i wdrożeniowych pracy inżynierskiej.
- [ ] **Zadanie 5.8:** Przygotowanie prezentacji multimedialnej na obronę oraz konspektu demonstracji aplikacji na żywo.

### Tydzień 3–4 (Styczeń): Produkcyjne wdrożenie chmurowe i próba generalna
- [ ] **Zadanie 5.9:** Wdrożenie backendu na platformie typu Render lub Railway i podpięcie chmurowej bazy danych PostgreSQL (oraz poprawne serwowanie plików `.well-known`).
- [ ] **Zadanie 5.10:** Przeprowadzenie testów stabilności systemu w warunkach rzeczywistych na sieci komórkowej (LTE/5G).
- [ ] **Zadanie 5.11:** Próba generalna prezentacji i działania fizycznych naklejek bezpośrednio przed obroną.
