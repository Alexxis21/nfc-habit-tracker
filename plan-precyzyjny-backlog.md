# 📋 Backlog Projektowy (Lista do odznaczania): System Budowania Nawyków NFC

Ten plik Markdown zawiera pełną, niezwykle szczegółową listę zadań techniczo-wdrożeniowych opartą bezpośrednio na dokumencie źródłowym **plan_precyzyjny_nfc.docx**. Każda faza i tydzień zostały rozbite na konkretne, dające się łatwo weryfikować podzadania (micro-tasks), łącznie z komendami CLI, nazwami plików i strukturami katalogów.

Możesz wczytać ten plik do dowolnego programu wspierającego markdown z polami wyboru (np. Obsidian, Notion, GitHub, VS Code), aby wygodnie i na bieżąco monitorować postęp prac inżynierskich!

---

## 📅 ETAP 1 — Architektura, baza danych, środowisko i start UI
**Sierpień 2026 · Cel:** Fundament techniczny projektu oraz wczesny start budowy interfejsu na bazie gotowego projektu designu.

### 🛠️ Tydzień 1: Rekonesans NFC, PoC i przygotowanie repozytorium
- [ ] **Zgromadzenie sprzętu:**
  - [ ] Pozyskanie zestawu fizycznych naklejek NTAG215 (NFC Forum Type 2).
  - [ ] Przygotowanie fizycznego telefonu z obsługą NFC (Android/iOS).
- [ ] **Wytworzenie Proof of Concept (PoC) NFC:**
  - [ ] Utworzenie osobnego projektu testowego: `npx react-native init NfcPoc`.
  - [ ] Instalacja biblioteki: `npm install react-native-nfc-manager`.
  - [ ] Konfiguracja uprawnień w pliku `/android/app/src/main/AndroidManifest.xml`:
    ```xml
    <uses-permission android:name="android.permission.NFC" />
    <uses-feature android:name="android.hardware.nfc" android:required="true" />
    ```
  - [ ] Implementacja testu zapisu rekordu NDEF URI: `NfcManager.writeNdefMessage([Ndef.uriRecord('https://example.com/test')])` — potwierdzenie możliwości zaprogramowania tagu.
  - [ ] Implementacja testu odczytu: sprawdzenie, czy po zbliżeniu zaprogramowanego tagu system Android rozpoznaje URL i automatycznie wywołuje otwarcie przeglądarki.
  - [ ] Test na fizycznym telefonie: uruchomienie za pomocą `npx react-native run-android` i weryfikacja logów przez `adb logcat`.
- [ ] **Weryfikacja obsługi NFC (Expo vs Bare React Native):**
  - [ ] Test uruchomienia PoC w Expo Go — potwierdzenie braku bezpośredniego dostępu do modułów natywnych NFC.
  - [ ] Konfiguracja testowa w Expo Dev Client: `npx expo install expo-dev-client` oraz budowanie deweloperskie `eas build --profile development --platform android`.
  - [ ] Sporządzenie notatki porównawczej dotyczącej złożoności konfiguracji i czasu kompilacji.
  - [ ] Zapisanie decyzji architektonicznej w repozytorium pod ścieżką: `docs/adr/001-nfc-approach.md`.
- [ ] **Inicjalizacja repozytorium projektu:**
  - [ ] Utworzenie repozytorium na GitHub o nazwie `nfc-habit-tracker`.
  - [ ] Inicjalizacja lokalna: `git init`.
  - [ ] Dodanie pliku `.gitignore` ignorującego: `node_modules`, `build`, `.env`, `target/`, `.idea/`, `.vscode/`.
  - [ ] Utworzenie fizycznej struktury katalogów w projekcie:
    - `/backend` (kod źródłowy Spring Boot)
    - `/mobile` (kod źródłowy aplikacji React Native)
    - `/docs` (dokumentacja techniczna i diagramy)
  - [ ] Napisanie wstępnego pliku `README.md` z opisem założeń i instrukcją uruchomienia.
  - [ ] Ustalenie i spisanie konwencji commitów (np. wg standardu *Conventional Commits*: `feat:`, `fix:`, `docs:`).
- [ ] **Inwentaryzacja i przegląd designu UI:**
  - [ ] Zebranie plików projektowych (np. link do Figmy) i zapisanie w folderze `docs/design`.
  - [ ] Przygotowanie spisu wszystkich wymaganych ekranów w pliku `docs/design/screens-inventory.md`.
  - [ ] Wyodrębnienie kluczowych tokenów graficznych: kolory HEX, rozmiary i kroje fontów, skale spacingów (marginesy/paddingi).
  - [ ] Spisanie listy komponentów wielokrotnego użytku (np. przyciski, karty, inputy, ikony stanów).
- [ ] **Konfiguracja środowiska deweloperskiego pod iOS:**
  - [ ] Instalacja środowiska Xcode z App Store oraz instalacja Command Line Tools przez: `xcode-select --install`.
  - [ ] Instalacja menedżera zależności CocoaPods: `sudo gem install cocoapods`.
  - [ ] Założenie płatnego konta deweloperskiego Apple Developer (99 USD/rok) w celu uzyskania dostępu do uprawnień odczytu NFC (Associated Domains i NFC Tag Reading).
  - [ ] Testowe uruchomienie pustego projektu React Native na fizycznym iPhonie: `cd ios && pod install && cd .. && npx react-native run-ios --device` (weryfikacja działania na modelu XS lub nowszym).

### 📐 Tydzień 2: Modelowanie danych, reguły biznesowe i baza UI
- [ ] **Zaprojektowanie diagramu ERD:**
  - [ ] Wybór narzędzia do wizualizacji (np. dbdiagram.io lub draw.io).
  - [ ] Naniesienie 9 kluczowych encji systemu: `User`, `HabitCategory`, `Habit`, `NfcTag`, `ScanLog`, `Friendship`, `Challenge`, `ChallengeParticipant`, `Notification`.
  - [ ] Zdefiniowanie wszystkich kluczy głównych, obcych i relacji (w tym kardynalności 1—N).
  - [ ] Eksport gotowego diagramu i zapisanie go w repozytorium jako plik `docs/erd.png`.
- [ ] **Spisanie specyfikacji reguł biznesowych:**
  - [ ] Utworzenie dokumentu `docs/business-rules.md`.
  - [ ] Precyzyjne zdefiniowanie zasady cooldownu skanowania (np. zabezpieczenie: min. 5 minut odstępu między skanami tej samej naklejki).
  - [ ] Spisanie algorytmu wyliczania oraz resetowania streaków (ciągłości dni wykonania nawyku).
  - [ ] Określenie sposobu obsługi stref czasowych (zapis znaczników czasu UTC w bazie danych, konwersja na lokalny czas użytkownika w aplikacji).
- [ ] **Inicjalizacja aplikacji mobilnej i wdrożenie systemu projektowego:**
  - [ ] Inicjalizacja produkcyjnego projektu React Native z obsługą TypeScript: `npx react-native init HabitApp --template react-native-template-typescript`.
  - [ ] Instalacja narzędzi wspierających stylowanie (np. `styled-components` lub konfiguracja `NativeWind` / Tailwind CSS).
  - [ ] Utworzenie pliku z definicją motywu graficznego `src/theme.ts` zawierającego kolory HEX, rozmiary fontów i spacingi wyciągnięte z Figmy.
  - [ ] Zakodowanie zestawu bazowych komponentów UI w katalogu `src/components/ui/`:
    - `Button.tsx` (konfigurowalny przycisk)
    - `Card.tsx` (panel na nawyki/statystyki)
    - `Input.tsx` (stylowane pole tekstowe)
    - `Badge.tsx` (etykieta kategorii/statusu)

### 🐳 Tydzień 3: Docker-compose, inicjalizacja backendu i makiety ekranów
- [ ] **Konfiguracja środowiska kontenerowego (Docker):**
  - [ ] Utworzenie pliku `docker-compose.yml` w głównym folderze repozytorium.
  - [ ] Definicja usługi `db` (obraz `postgres:16`, mapowanie portów `5432:5432`, zmienne środowiskowe `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, zamontowanie wolumenu na dane bazy).
  - [ ] Definicja usługi `backend` budowanej z pliku `/backend/Dockerfile` z zależnością `depends_on: db`.
  - [ ] Przetestowanie konfiguracji: `docker-compose up -d` i weryfikacja połączenia za pomocą narzędzia `psql` lub dowolnego klienta SQL.
- [ ] **Inicjalizacja backendu w Spring Boot:**
  - [ ] Wygenerowanie szkieletu projektu przez Spring Initializr (Java 21, Maven) z zależnościami: *Spring Web (REST)*, *Spring Data JPA*, *Spring Security*, *PostgreSQL Driver*, *Validation*.
  - [ ] Import projektu do IDE i utworzenie struktury pakietów:
    - `com.habitapp.auth` (rejestracja, logowanie, tokeny)
    - `com.habitapp.habit` (logika nawyków i kategorii)
    - `com.habitapp.scan` (odbieranie i przetwarzanie skanów NFC)
    - `com.habitapp.social` (znajomi, rankingi)
    - `com.habitapp.challenge` (wyzwania grupowe i indywidualne)
    - `com.habitapp.common` (klasy wspólne, filtry, obsługa wyjątków)
  - [ ] Przygotowanie pliku konfiguracyjnego `application.yml` z konfiguracją bazy danych PostgreSQL.
  - [ ] Test uruchomienia: `./mvnw spring-boot:run` i weryfikacja startu na porcie `8080`.
- [ ] **Budowa makiet UI na bazie danych mockowych:**
  - [ ] Utworzenie pliku JSON z danymi mockowymi w aplikacji mobilnej: `src/mocks/habits.json` (zgodnego z planowanym kontraktem API).
  - [ ] Instalacja biblioteki nawigacji: `npm install @react-navigation/native @react-navigation/native-stack`.
  - [ ] Skonfigurowanie nawigacji w pliku `src/navigation/AppNavigator.tsx`.
  - [ ] Zakodowanie statycznych ekranów UI:
    - `LoginScreen.tsx` (ekran logowania)
    - `RegisterScreen.tsx` (ekran rejestracji)
    - `HabitListScreen.tsx` (wyświetlanie listy nawyków z pliku JSON za pomocą `FlatList`)
    - `HabitDetailScreen.tsx` (podgląd szczegółów z przekazywaniem ID nawyku w parametrach nawigacji)

### 🛢️ Tydzień 4: Migracje Flyway, automatyzacja CI i makiety formularzy
- [ ] **Wdrożenie wersjonowania bazy danych (Flyway):**
  - [ ] Dodanie wymaganych zależności w pliku `pom.xml` (`flyway-core`, `flyway-database-postgresql`).
  - [ ] Konfiguracja właściwości Flyway w pliku `application.yml`:
    ```yaml
    spring:
      flyway:
        enabled: true
        locations: classpath:db/migration
    ```
  - [ ] Utworzenie folderu `src/main/resources/db/migration/`.
  - [ ] Napisanie pierwszego skryptu migracji `V1__init_schema.sql` tworzącego kompletny schemat tabel na podstawie diagramu ERD.
  - [ ] Test migracji: ponowne uruchomienie backendu i zweryfikowanie poprawnego zaaplikowania migracji w logach oraz bezpośrednio w bazie w tabeli `flyway_schema_history`.
- [ ] **Konfiguracja integracji ciągłej (CI) w GitHub Actions:**
  - [ ] Utworzenie pliku `.github/workflows/backend-ci.yml` (kroki: pobranie kodu, setup Java 21, cache'owanie zależności Maven, budowanie i uruchomienie testów `./mvnw test`).
  - [ ] Utworzenie pliku `.github/workflows/mobile-ci.yml` (kroki: setup Node, cache node_modules, instalacja zależności `npm ci`, testy jednostkowe `npm test`).
  - [ ] Przesłanie zmian na GitHub i weryfikacja poprawnego wykonania i zaliczenia obu przepływów (green builds).
- [ ] **Dokończenie budowy statycznych ekranów UI w aplikacji:**
  - [ ] `HabitFormScreen.tsx` — formularz tworzenia/edycji nawyków (nazwa, kategoria, harmonogram dni) oparty na lokalnym stanie komponentu `useState`.
  - [ ] `StatsScreen.tsx` — przygotowanie układu (layoutu) pod wykresy (dodanie tymczasowych elementów skeleton/placeholder).
  - [ ] `TagAssignScreen.tsx` — ekran parowania naklejki NFC (dodanie przycisku „Symuluj skan” wywołującego lokalne odhaczenie nawyku).
  - [ ] Przeprowadzenie weryfikacji wszystkich ekranów na emulatorze pod kątem spójności z designem.

---

## 📅 ETAP 2 — Backend, API, logika nawyków i dalsza rozbudowa UI
**Wrzesień 2026 · Cel:** Zbudowanie logiki domenowej i API oraz kontynuacja budowy interfejsu równolegle na mockach.

### 🔑 Tydzień 1: JPA, autoryzacja użytkowników i pierwsze wykresy UI
- [ ] **Konfiguracja mapowania obiektowo-relacyjnego (JPA):**
  - [ ] Utworzenie klas encji: `User`, `HabitCategory`, `Habit` wraz z odpowiednimi adnotacjami JPA (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, relacje `@ManyToOne` i `@OneToMany`).
  - [ ] Utworzenie interfejsów repozytoriów Spring Data JPA (np. `UserRepository extends JpaRepository<User, Long>`).
  - [ ] Przygotowanie skryptu migracyjnego `V2__seed_habit_categories.sql` wprowadzającego bazowe kategorie (np. *Rozwój*, *Higiena*, *Zdrowie*).
- [ ] **Zaimplementowanie systemu rejestracji i uwierzytelniania:**
  - [ ] Dodanie zależności bezpieczeństwa: `spring-boot-starter-security` oraz biblioteki do obsługi JWT (np. `jjwt-api`, `jjwt-impl`).
  - [ ] Konfiguracja klasy `SecurityConfig.java` (wyłączenie CSRF, udostępnienie publiczne ścieżek pod adresem `/api/auth/**`, zabezpieczenie pozostałych endpointów).
  - [ ] Implementacja kontrolera `AuthController` z endpointami `POST /api/auth/register` oraz `POST /api/auth/login`.
  - [ ] Implementacja serwisu `JwtService` odpowiedzialnego za bezpieczne generowanie tokenów (zawierających `userId`, `email` oraz czas wygaśnięcia).
  - [ ] Wdrożenie haszowania haseł za pomocą `BCryptPasswordEncoder`.
  - [ ] Testy manualne: rejestracja nowego użytkownika, logowanie i walidacja struktury wygenerowanego tokenu na stronie `jwt.io`.
- [ ] **Aplikacja mobilna (Równolegle): wdrożenie wykresów statystyk:**
  - [ ] Przygotowanie bogatego pliku mockowego `src/mocks/stats.json` z historycznymi skanami.
  - [ ] Instalacja biblioteki wykresów **Victory Native XL** oraz natywnego renderera grafiki:
    ```bash
    npm install victory-native react-native-svg
    ```
  - [ ] Zaimplementowanie interaktywnego wykresu liniowego (postępy w czasie) oraz kołowego (podział nawyków na kategorie) na ekranie `StatsScreen.tsx` przy użyciu danych mockowych.

### 👥 Tydzień 2: API dla nawyków, testy jednostkowe i widoki społecznościowe
- [ ] **Wytworzenie endpointów CRUD dla nawyków:**
  - [ ] Implementacja `HabitController` udostępniającego operacje `GET /api/habits`, `POST /api/habits`, `PUT /api/habits/{id}` oraz `DELETE /api/habits/{id}`.
  - [ ] Implementacja serwisu `HabitService` z walidacją danych wejściowych (np. walidacja pustej nazwy, sprawdzenie czy kategoria istnieje w bazie).
  - [ ] Utworzenie dedykowanych klas transferu danych (DTO): `HabitRequestDto`, `HabitResponseDto` i mechanizmów mapowania między encjami a DTO.
  - [ ] Dodanie walidacji wejścia przy użyciu adnotacji `@NotBlank` oraz `@NotNull` (wymaga `spring-boot-starter-validation`).
- [ ] **Napisanie testów jednostkowych logiki biznesowej:**
  - [ ] Utworzenie klasy testowej `HabitServiceTest` przy użyciu JUnit 5 i biblioteki Mockito (`@ExtendWith(MockitoExtension.class)`).
  - [ ] Napisanie testów: utworzenie nawyku z poprawnymi danymi, walidacja błędu przy pustej nazwie, zachowanie systemu przy próbie aktualizacji nieistniejącego nawyku (oczekiwany kod błędu 404).
  - [ ] Uruchomienie testów poleceniem `./mvnw test` i wygenerowanie raportu pokrycia (np. JaCoCo).
- [ ] **Aplikacja mobilna (Równolegle): ekrany społecznościowe na mockach:**
  - [ ] Przygotowanie plików z danymi testowymi JSON: `friends.json` (lista znajomych), `leaderboard.json` (ranking punktów), `challenges.json` (wyzwania grupowe).
  - [ ] Zakodowanie ekranu `FriendsListScreen.tsx` zawierającego sekcję aktywnych znajomych oraz wysłanych/odebranych zaproszeń.
  - [ ] Zakodowanie ekranu rankingu `LeaderboardScreen.tsx` prezentującego posortowaną listę użytkowników wraz z ich punktacją.
  - [ ] Stworzenie ekranu wyzwań `ChallengesScreen.tsx` i szczegółów wyzwania `ChallengeDetailScreen.tsx`.

### 🔗 Tydzień 3: API skanowania i parowania tagów oraz integracja Axios/React Query
- [ ] **Wdrożenie logiki skanowania tagów (NFC):**
  - [ ] Implementacja kontrolera `ScanController` z metodą `POST /api/scan` przyjmującą identyfikator `tagId` (publiczny UUID zapisywany w rekordzie NDEF na naklejce).
  - [ ] Implementacja serwisu `ScanService`: wyszukiwanie powiązanego tagu w bazie, walidacja reguły anty-spamowej cooldownu (np. odrzucenie skanu wykonanego szybciej niż 5 minut od poprzedniego), obliczenie nowego stanu nawyku, aktualizacja passy wykonania (streak) oraz przyznanie punktów.
  - [ ] Wdrożenie globalnej obsługi wyjątków (`@ControllerAdvice`) tłumaczącej błędy domenowe (np. `TagNotAssignedException`, `DuplicateScanException`) na czytelne kody HTTP (404, 409).
- [ ] **Endpoint przypisywania tagu NFC do nawyku:**
  - [ ] Implementacja kontrolera i endpointu `POST /api/habits/{id}/tags` służącego do przypisania wygenerowanego UUID tagu do konkretnego nawyku.
  - [ ] Wdrożenie unikalności pola `tagId` na poziomie bazy danych: dodanie migracji `V3__add_unique_tag_id.sql` nakładającej ograniczenie `UNIQUE` na kolumnę tabeli `nfc_tag`.
  - [ ] Napisanie testu weryfikującego odrzucenie próby powiązania tego samego fizycznego identyfikatora `tagId` z dwoma różnymi nawykami (oczekiwana odpowiedź 409 Conflict).
- [ ] **Aplikacja mobilna (Równolegle): Integracja warstwy komunikacji sieciowej:**
  - [ ] Instalacja biblioteki HTTP oraz asynchronicznego menedżera stanu:
    ```bash
    npm install axios @tanstack/react-query
    ```
  - [ ] Konfiguracja klienta HTTP w pliku `src/api/client.ts` (ustawienie adresu URL bazy – np. dla emulatora Androida będzie to `http://10.0.2.2:8080`).
  - [ ] Zaimplementowanie interceptora Axios automatycznie pobierającego token JWT z bezpiecznego magazynu (`expo-secure-store` / `react-native-keychain`) i dołączającego go do nagłówka `Authorization: Bearer <token>`.
  - [ ] Wdrożenie interceptora obsługi błędów uwierzytelniania 401 (automatyczne przekierowanie do ekranu logowania i czyszczenie tokenu).
  - [ ] Opakowanie aplikacji w kontener stanu `QueryClientProvider`.

### 📈 Tydzień 4: Agregacja statystyk, testy integracyjne API i Universal Links na backendzie
- [ ] **Implementacja pobierania statystyk:**
  - [ ] Przygotowanie zapytań agregujących w `StatsRepository` (użycie JPQL lub natywnego SQL grupującego skany po datach i kategoriach nawyków).
  - [ ] Obsługa parametru filtrującego zakres czasu `range` (7d / 30d / 90d) poprzez dynamiczne dopasowanie daty `scanned_at` w zapytaniu SQL.
  - [ ] Implementacja endpointu `GET /api/stats` zwracającego zmapowany obiekt `StatsResponseDto`.
- [ ] **Napisanie testów integracyjnych backendu (E2E):**
  - [ ] Dodanie zależności wspierających izolowane środowisko testowe PostgreSQL: `testcontainers`, `testcontainers-postgresql`.
  - [ ] Konfiguracja klasy testowej z adnotacją `@Testcontainers` automatycznie uruchamiającej lekki kontener z bazą danych na czas trwania testów integracyjnych.
  - [ ] Przygotowanie testu `MockMvc` przechodzącego przez całą ścieżkę krytyczną: rejestracja użytkownika -> utworzenie nawyku -> przypisanie wygenerowanego `tagId` -> symulacja skanowania tagu -> weryfikacja poprawności naliczenia streaka w bazie.
  - [ ] Uruchomienie testów komendą `./mvnw verify`.
- [ ] **Przygotowanie backendu pod Universal Links (iOS) i App Links (Android):**
  - [ ] Rejestracja stabilnej domeny publicznej pod serwer deweloperski (np. `https://habitapp.pl`) — wymagane do poprawnego działania Universal Links, ponieważ systemy iOS/Android nie akceptują lokalnych adresów IP ani dynamicznych adresów ngrok przy weryfikacji domen.
  - [ ] Utworzenie statycznego pliku weryfikacyjnego dla Apple pod adresem: `src/main/resources/static/.well-known/apple-app-site-association` (plik bez rozszerzenia, format JSON definiujący `appID` oraz ścieżkę nasłuchu `["/scan*"]`).
  - [ ] Utworzenie statycznego pliku dla Google pod adresem: `src/main/resources/static/.well-known/assetlinks.json` (plik JSON zawierający nazwę pakietu aplikacji Android oraz odcisk palca certyfikatu SHA-256 klucza podpisującego aplikację).
  - [ ] Test dostępności plików: uruchomienie serwera w chmurze lub na lokalnej maszynie podpiętej pod domenę i sprawdzenie, czy pliki są poprawnie serwowane pod adresami `https://habitapp.pl/.well-known/apple-app-site-association` oraz `https://habitapp.pl/.well-known/assetlinks.json` z wymaganym nagłówkiem HTTP `Content-Type: application/json`.
- [ ] **Aplikacja mobilna (Równolegle): podłączenie realnego API:**
  - [ ] Zastąpienie mockowych ekranów logowania/rejestracji mutacjami React Query (`useMutation` wysyłające dane do API).
  - [ ] Podłączenie listy nawyków `HabitListScreen.tsx` do zapytania `useQuery` pobierającego dane z `/api/habits`.
  - [ ] Podłączenie ekranu wykresów statystyk `StatsScreen.tsx` do realnych agregacji z `/api/stats`.
  - [ ] Przeprowadzenie pełnego testu działania aplikacji mobilnej połączonej z lokalnym lub chmurowym serwerem backendowym.

---

## 📅 ETAP 3 — Integracja NFC (Android i iOS) i pełne podłączenie aplikacji do backendu
**Październik 2026 · Cel:** Wdrożenie mechanizmu NDEF + Deep Linking (Universal Links na iOS, App Links na Android) jako jednego wspólnego sposobu skanowania na obu platformach, oraz dopięcie pozostałych ekranów do realnego API.

### 📱 Tydzień 1: Konfiguracja Universal Links (iOS) i App Links (Android)
- [ ] **Wdrożenie Universal Links w aplikacji iOS:**
  - [ ] Uruchomienie projektu Xcode: `open ios/HabitApp.xcworkspace`.
  - [ ] Przejście do zakładki *Signing & Capabilities*, aktywacja i dodanie nowej usługi **Associated Domains** (wymaga płatnego konta Apple Developer).
  - [ ] Dodanie wpisu domeny w formacie: `applinks:habitapp.pl`.
  - [ ] Zweryfikowanie, że plik `apple-app-site-association` na Twoim serwerze poprawnie autoryzuje identyfikator Twojej aplikacji Apple ID.
  - [ ] Przetestowanie działania Universal Link: wysłanie na fizyczny telefon iPhone wiadomości iMessage z linkiem `https://habitapp.pl/scan?tagId=test-ios` i kliknięcie w link. Potwierdzenie, że system iOS automatycznie otworzył aplikację HabitApp zamiast Safari.
- [ ] **Wdrożenie App Links w aplikacji Android:**
  - [ ] Dodanie filtra intencji (intent-filter) w pliku konfiguracyjnym aplikacji `/android/app/src/main/AndroidManifest.xml` z parametrem `android:autoVerify="true"`:
    ```xml
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="habitapp.pl" android:pathPrefix="/scan" />
    </intent-filter>
    ```
  - [ ] Zweryfikowanie, że plik `assetlinks.json` na serwerze poprawnie dopasowuje nazwę pakietu Android i odcisk certyfikatu SHA-256.
  - [ ] Przetestowanie statusu weryfikacji App Links przez system Android przy użyciu komendy ADB:
    ```bash
    adb shell pm get-app-links com.habitapp.mobile
    ```
    Potwierdzenie, że domena `habitapp.pl` posiada status `verified`.
  - [ ] Przetestowanie działania: kliknięcie w link `https://habitapp.pl/scan?tagId=test-android` w dowolnej zewnętrznej aplikacji na telefonie (np. Keep) i weryfikacja automatycznego otwarcia HabitApp.

### 🔌 Tydzień 2: Implementacja handlera Deep Linków oraz modułu zapisu NDEF
- [ ] **Zaimplementowanie wspólnego odbiorcy deep linków w React Native:**
  - [ ] Skonfigurowanie właściwości `linking` w komponencie nawigacyjnym `NavigationContainer` (mapowanie ścieżki URL `/scan` bezpośrednio na obsługę parametru `tagId`).
  - [ ] Dodanie nasłuchu zdarzeń dla aplikacji działającej w tle (lub aktywnej na pierwszym planie) za pomocą metody: `Linking.addEventListener('url', handler)`.
  - [ ] Dodanie obsługi tzw. „zimnego startu” (gdy aplikacja była całkowicie zamknięta i otwiera się bezpośrednio w wyniku skanowania tagu) poprzez: `Linking.getInitialURL()`.
  - [ ] Implementacja metody `handleScanLink(url)` odpowiedzialnej za sparsowanie wartości `tagId` z parametrów zapytania URL i przekierowanie jej do logiki zapisu skanu.
  - [ ] Przetestowanie działania handlera z poziomu konsoli za pomocą narzędzi CLI:
    - Dla Androida: `npx uri-scheme open "https://habitapp.pl/scan?tagId=test-cmd" --android`
    - Dla iOS (na zablokowanym/odblokowanym fizycznym iPhonie): wysłanie linku przez iMessage i weryfikacja wywołania handlera.
- [ ] **Zaimplementowanie programowania (zapisu) tagów NDEF na ekranie parowania:**
  - [ ] Przebudowa ekranu `TagAssignScreen.tsx` — usunięcie przycisku symulacji i wdrożenie natywnej obsługi zapisu NFC.
  - [ ] Integracja z API backendu: wywołanie mutacji `POST /api/habits/{id}/tags` w celu rejestracji nowego powiązania i odebrania unikalnego identyfikatora `tagId` (UUID) wygenerowanego przez serwer.
  - [ ] Zaimplementowanie niskopoziomowego zapisu rekordu NDEF URI na fizycznej naklejce NTAG215:
    ```typescript
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const bytes = Ndef.encodeMessage([
        Ndef.uriRecord('https://habitapp.pl/scan?tagId=' + tagId)
    ]);
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
    ```
  - [ ] Dodanie zabezpieczeń i obsługi błędów zapisu (np. obsługa tagów zablokowanych tylko do odczytu, przedwczesne oddalenie telefonu od naklejki w trakcie przesyłu danych).
  - [ ] Test zapisu na systemie Android i potwierdzenie poprawnego odczytu zapisanego linku na iPhonie (oraz odwrotnie) w celu udowodnienia 100% kompatybilności tagów między platformami.

### 🔬 Tydzień 3: Połączenie z API skanowania i fizyczne testy sprzętowe
- [ ] **Połączenie handlera Deep Linku z bazą danych:**
  - [ ] Po pomyślnym odebraniu i wyciągnięciu parametru `tagId` z linku: wywołanie mutacji `POST /api/scan`.
  - [ ] Zaimplementowanie **optimistic updates** (optymistycznej aktualizacji interfejsu) w cache React Query — nawyk jest od razu oznaczany wizualnie na ekranie jako wykonany, zanim serwer prześle zwrotnie potwierdzenie HTTP (zapewnia to natychmiastową reakcję aplikacji).
  - [ ] Dodanie efektownej, płynnej animacji sukcesu (np. przy użyciu biblioteki `Lottie` lub `react-native-reanimated`) wyświetlanej użytkownikowi w momencie pomyślnego zaliczenia nawyku.
  - [ ] Wdrożenie obsługi błędów sieciowych (np. mechanizm ponawiania próby wysyłki `retry: 2` w konfiguracji React Query).
- [ ] **Przeprowadzenie serii fizycznych testów sprzętowych:**
  - [ ] Przygotowanie ustrukturyzowanego dokumentu ze scenariuszami testowymi: `docs/test-scenarios.md` (scenariusze: pierwszy poprawny skan w ciągu dnia, próba ponownego skanu w czasie cooldownu, próba odczytu tagu nieprzypisanego do żadnego nawyku, brak połączenia z siecią).
  - [ ] Przeprowadzenie testów na min. dwóch telefonach z Androidem różnych producentów:
    - [ ] Test przy odblokowanym ekranie i otwartej aplikacji na pierwszym planie (natychmiastowe zaliczenie).
    - [ ] Test przy zamkniętej aplikacji (uruchomienie aplikacji i przejście do ekranu sukcesu).
    - [ ] Test przy zablokowanym telefonie.
  - [ ] Przeprowadzenie testów na fizycznym iPhonie (model XS lub nowszy):
    - [ ] Potwierdzenie wysunięcia systemowego powiadomienia (baneru) po zbliżeniu tagu do zablokowanego/odblokowanego telefonu.
    - [ ] Potwierdzenie, że kliknięcie w to powiadomienie bezpiecznie otwiera aplikację HabitApp i odhacza nawyk (z uwzględnieniem odblokowania biometrycznego Face ID/Touch ID).
  - [ ] Test fallbacku przeglądarki: sprawdzenie zachowania systemu, gdy aplikacja nie jest zainstalowana (otwarcie domeny `https://habitapp.pl/scan` w przeglądarce).

### 💾 Tydzień 4: Buforowanie offline, odporność na brak sieci i sesja dogfoodingowa
- [ ] **Wdrożenie trybu działania offline-first:**
  - [ ] Skonfigurowanie mechanizmu persystencji w TanStack Query za pomocą `persistQueryClient` w celu automatycznego zapisywania całego cache'u zapytań w bezpiecznej pamięci AsyncStorage telefonu.
  - [ ] Zainstalowanie biblioteki do monitorowania stanu sieci: `npm install @react-native-community/netinfo`.
  - [ ] Zaimplementowanie kolejkowania mutacji (skanów NFC) przy braku internetu — nieudane skany z powodu braku sieci są bezpiecznie zapisywane w kolejce na dysku telefonu, a ich wysyłka do API jest automatycznie wznawiana zaraz po wykryciu przywrócenia połączenia.
- [ ] **Stabilizacja i eliminacja błędów (Bugfixing):**
  - [ ] Założenie tablicy błędów na GitHub Issues z podziałem na etykiety platformowe `bug:android` oraz `bug:ios`.
  - [ ] Przeprowadzenie testów wydajnościowych: pomiar czasu dzielącego fizyczne zbliżenie telefonu do naklejki od wizualnej aktualizacji stanu nawyku na ekranie (cel inżynierski: poniżej 2 sekund na Androidzie, na iOS z wyłączeniem czasu wymaganego na kliknięcie powiadomienia).
  - [ ] Przeprowadzenie wewnętrznej sesji deweloperskiej typu *dogfooding* (korzystanie z aplikacji przez dewelopera i 2–3 znajomych z wykorzystaniem realnych naklejek przez kilka dni).

---

## 📅 ETAP 4 — Grywalizacja, wyzwania i powiadomienia
**Listopad 2026 · Cel:** Mechanizmy społecznościowe i motywacyjne podnoszące atrakcyjność aplikacji.

### 🏆 Tydzień 1: Punkty, relacje znajomych i migracje bazodanowe
- [ ] **Zaimplementowanie systemu punktacji (Grywalizacja):**
  - [ ] Rozszerzenie tabeli logów skanowania `ScanLog` o kolumnę `points` rejestrującą liczbę punktów przyznanych za dany skan.
  - [ ] Wdrożenie algorytmu punktacji w backendowym serwisie `ScanService` (np. baza 10 punktów za skan + dodatkowy bonus punktowy naliczany proporcjonalnie do aktualnego streaka, np. bonus za streak >= 7 dni).
- [ ] **Zaimplementowanie logiki wyzwań grupowych i indywidualnych:**
  - [ ] Utworzenie encji JPA `Challenge` oraz `ChallengeParticipant` odzwierciedlających model danych z Etapu 1.
  - [ ] Dodanie migracji bazy danych `V4__add_challenges.sql` tworzącej tabele dla wyzwań.
  - [ ] Implementacja repozytoriów oraz serwisu `ChallengeService` udostępniającego metody: `createChallenge` (tworzenie wyzwania), `joinChallenge` (dołączanie do wyzwania), `updateProgress` (aktualizacja postępu użytkownika).
- [ ] **Endpointy i logika zarządzania znajomymi:**
  - [ ] Implementacja kontrolera `FriendshipController` obsługującego akcje: `POST /api/friends/{userId}/invite` (wysyłanie zaproszenia), `PUT /api/friends/{id}/accept` (akceptacja zaproszenia), `GET /api/friends` (pobieranie listy znajomych użytkownika).
  - [ ] Implementacja reguł walidacyjnych w `FriendshipService` zapobiegających wysyłaniu duplikatów zaproszeń oraz gwarantujących obustronną widoczność znajomych dopiero po zaakceptowaniu zaproszenia.
  - [ ] Dodanie migracji `V5__add_friendships.sql` wprowadzającej ograniczenie unikalności pary użytkowników (`UNIQUE(user_id, friend_id)`).

### 📊 Tydzień 2: Agregacje rankingowe i kalkulacje postępu wyzwań
- [ ] **Wytworzenie endpointu rankingu społecznościowego:**
  - [ ] Napisanie wydajnego zapytania agregującego SQL/JPQL dla endpointu `GET /api/leaderboard` (zapytanie sumujące punkty zdobyte przez użytkownika oraz wszystkich jego znajomych w wybranym przedziale czasowym, np. parametr `range=7d`).
  - [ ] Sortowanie wyników w kolejności malejącej oraz mapowanie odpowiedzi do obiektu DTO zwracającego aktualną pozycję zalogowanego użytkownika w rankingu na tle jego znajomych.
- [ ] **Implementacja logiki obliczania postępu w wyzwaniach grupowych:**
  - [ ] Zaimplementowanie algorytmu liczącego łączny postęp wszystkich uczestników wyzwania grupowego względem zdefiniowanego celu (`targetValue`).
  - [ ] Wdrożenie endpointu `GET /api/challenges/{id}/progress` zwracającego procentowy postęp wyzwania oraz listę uczestników uszeregowaną według ich wkładu.

### 📱 Tydzień 3: Podłączenie widoków społecznościowych i grywalizacji w aplikacji
- [ ] **Podłączenie danych rankingu i statystyk:**
  - [ ] Zastąpienie statycznych danych mockowych na ekranie rankingu `LeaderboardScreen.tsx` realnymi wywołaniami API za pomocą hooka `useQuery(['leaderboard'], fetchLeaderboard)`.
  - [ ] Rozbudowanie widoku statystyk `StatsScreen.tsx` o interaktywny przełącznik zakresu czasu (7 dni / 30 dni / 90 dni) wywołujący ponowne pobranie odfiltrowanych danych z backendu.
- [ ] **Podłączenie modułu wyzwań grupowych:**
  - [ ] Przebudowa ekranu wyzwań `ChallengesScreen.tsx` — wyświetlanie listy aktywnych wyzwań pobranych z `/api/challenges`.
  - [ ] Podłączenie widoku tworzenia nowego wyzwania `ChallengeCreateScreen.tsx` (formularz definiujący nazwę, typ, ramy czasowe oraz cel wyzwania) do endpointu `POST /api/challenges`.
  - [ ] Dodanie obsługi przycisku „Dołącz do wyzwania” zintegrowanego z `POST /api/challenges/{id}/join`.

### 🔔 Tydzień 4: Powiadomienia push (FCM) oraz zaplanowane przypomnienia lokalne
- [ ] **Integracja z Firebase Cloud Messaging (FCM):**
  - [ ] Założenie projektu w konsoli Firebase, pobranie plików konfiguracyyjnych `google-services.json` dla Androida oraz `GoogleService-Info.plist` dla systemu iOS.
  - [ ] Zainstalowanie bibliotek Firebase w aplikacji mobilnej:
    ```bash
    npm install @react-native-firebase/app @react-native-firebase/messaging
    ```
  - [ ] Zaimplementowanie pobierania unikalnego tokenu urządzenia po pomyślnym zalogowaniu użytkownika: `messaging().getToken()`.
  - [ ] Utworzenie endpointu `POST /api/devices` na backendzie i wysyłanie tam tokenu urządzenia w celu powiązania go z kontem zalogowanego użytkownika w bazie (encja `DeviceToken`).
  - [ ] Zintegrowanie biblioteki Firebase Admin SDK po stronie backendu i zaimplementowanie serwisu wysyłającego powiadomienia push o zaplanowanych porach przy użyciu mechanizmu automatycznych zadań Springa (`@Scheduled`).
- [ ] **Implementacja powiadomień lokalnych jako fallback offline:**
  - [ ] Instalacja biblioteki obsługi powiadomień lokalnych na urządzeniu (np. `@notifee/react-native` lub `expo-notifications`).
  - [ ] Zaimplementowanie planowania lokalnych powiadomień przypominających o nawyku zgodnie z jego harmonogramem, bezpośrednio na telefonie (niezależnie od dostępu do internetu).
  - [ ] Zaimplementowanie automatycznego anulowania zaplanowanego na dany dzień lokalnego przypomnienia natychmiast po tym, jak użytkownik fizycznie zeskanuje powiązany tag NFC.

---

## 📅 ETAP 5 — Testy, wdrożenie i redakcja dokumentacji
**Grudzień 2026 – Styczeń 2027 · Cel:** Stabilizacja całego rozproszonego systemu, ostateczne testy wydajnościowe oraz finalizacja pisemnej pracy inżynierskiej.

### 🧪 Grudzień — Tydzień 1–2: Automatyzacja testów i testy obciążeniowe wydajności
- [ ] **Rozszerzenie testów integracyjnych w chmurze CI:**
  - [ ] Dodanie pełnych scenariuszy testowych w `Testcontainers` pokrywających logikę modułów społecznościowych (zaproszenie znajomego -> akceptacja -> utworzenie wspólnego wyzwania -> rejestracja skanów przez obu użytkowników -> weryfikacja aktualizacji pozycji w rankingu).
  - [ ] Integracja tych testów z procesem GitHub Actions w pliku `backend-ci.yml`.
- [ ] **Przeprowadzenie testów obciążeniowych backendu (Load Testing):**
  - [ ] Instalacja narzędzia do testów obciążeniowych **k6** (np. lokalnie przez `brew install k6` lub za pomocą kontenera Docker: `docker run grafana/k6`).
  - [ ] Przygotowanie skryptu testowego w języku JavaScript `scan-load-test.js` symulującego wysłanie dużej liczby równoległych żądań `POST /api/scan` na endpoint skanowania.
  - [ ] Uruchomienie testu obciążeniowego (np. symulacja 50 wirtualnych użytkowników wykonujących nieustanny odczyt przez 30 sekund):
    ```bash
    k6 run scan-load-test.js --vus 50 --duration 30s
    ```
  - [ ] Przeanalizowanie czasów odpowiedzi serwera (metryka p95) i wdrożenie optymalizacji w bazie danych (np. dodanie indeksów na kolumnach `tag_id` oraz `user_id` w tabelach `nfc_tag` i `scan_log` w celu przyspieszenia zapytań SQL).

### 👥 Grudzień — Tydzień 3–4: Badania z użytkownikami (SUS) i start pisania pracy
- [ ] **Przeprowadzenie testów użyteczności (Usability Testing):**
  - [ ] Rekrutacja grupy próbnej składającej się z 3–5 zewnętrznych użytkowników testowych.
  - [ ] Przygotowanie ustrukturyzowanej ankiety użyteczności opartej na uznanym standardzie **SUS (System Usability Scale)**.
  - [ ] Przeprowadzenie sesji badawczych z użytkownikami metodą głośnego myślenia (*think-aloud*), podczas których wykonują oni zadania (np. parowanie nowego tagu NFC z nawykiem, rejestracja skanu, dołączenie do wyzwania grupowego).
  - [ ] Spisanie spostrzeżeń i napotkanych problemów w pliku `docs/usability-findings.md`.
  - [ ] Naprawa zidentyfikowanych błędów interfejsu według priorytetów na tablicy GitHub Issues.
- [ ] **Inicjalizacja i redagowanie pisemnej pracy inżynierskiej:**
  - [ ] Utworzenie szablonu dokumentu pracy (w systemie LaTeX lub szablonie MS Word zgodnym z wytycznymi Twojej uczelni).
  - [ ] Osadzenie w tekście pracy przygotowanych diagramów ERD bazy danych oraz schematów architektury rozproszonej systemu.
  - [ ] Opisanie założeń projektowych oraz wybranego stosu technologicznego wraz z inżynierskim uzasadnieniem.

### 📝 Styczeń — Tydzień 1–2: Redagowanie pracy pisemnej i przygotowanie do obrony
- [ ] **Sfinalizowanie tekstu pracy inżynierskiej:**
  - [ ] Opisanie implementacji technicznej (osadzenie kluczowych fragmentów konfiguracji, np. konfiguracji filtrów Spring Security czy handlera Deep Linków w React Native).
  - [ ] Dodanie rozdziału prezentującego wyniki badań użyteczności (analiza ankiet SUS) oraz wyniki testów obciążeniowych k6 wraz z wykresami.
  - [ ] Przeprowadzenie dokładnej korekty językowej, stylistycznej oraz spójności stosowanej terminologii technicznej.
- [ ] **Przygotowanie prezentacji i scenariusza obrony:**
  - [ ] Przygotowanie slajdów prezentacji na obronę (struktura: cel projektu -> architektura -> uniwersalność podejścia NDEF Universal Links -> demo -> wyniki testów obciążeniowych -> wnioski).
  - [ ] Przygotowanie szczegółowego scenariusza demonstracji działania aplikacji na żywo (live-demo) przed komisją (przygotowanie fizycznych naklejek NFC i określenie kolejności skanowania).

### 🚀 Styczeń — Tydzień 3–4: Produkcyjne wdrożenie chmurowe i próba generalna
- [ ] **Wdrożenie demonstracyjnego środowiska produkcyjnego:**
  - [ ] Założenie konta i wdrożenie aplikacji backendowej Spring Boot w chmurze na platformie typu Render lub Railway.
  - [ ] Konfiguracja produkcyjnej bazy danych PostgreSQL w chmurze (np. Render PostgreSQL) i zaaplikowanie migracji Flyway.
  - [ ] Skonfigurowanie zmiennych środowiskowych środowiska produkcyjnego (hasła, klucze JWT, konfiguracja profilu `prod` w Spring Boot).
- [ ] **Ostateczne testy działania systemu w terenie:**
  - [ ] Przeprowadzenie testów zasięgu i czułości odczytu fizycznych naklejek (odległości od 0 do 4 cm) na różnych modelach telefonów.
  - [ ] Przetestowanie działania aplikacji w warunkach rzeczywistych z wykorzystaniem sieci komórkowej (LTE/5G) w celu zweryfikowania odporności na opóźnienia sieciowe i stabilności kolejkowania offline.
- [ ] **Próba generalna obrony:**
  - [ ] Przeprowadzenie pełnej próby prezentacji slajdów oraz prezentacji działania aplikacji na żywo (mierzenie czasu wystąpienia w celu zmieszczenia się w limicie czasowym uczelni).
