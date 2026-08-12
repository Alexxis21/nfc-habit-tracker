# ADR 001: Wybór Architektury Aplikacji Mobilnej i Integracji NFC (Expo Dev Client vs Bare React Native)

* **Status:** Przyjęty (Accepted)
* **Data:** 12 Sierpnia 2026
* **Autor:** Zespół projektowy / Praca Inżynierska

---

## 🎯 1. Kontekst i Problem (Context & Problem Statement)

Celem projektu jest stworzenie hybrydowego systemu budowania nawyków **NFC Habit Tracker**, składającego się z aplikacji mobilnej oraz serwera backendowego. Kluczową funkcjonalnością aplikacji jest odczyt i zapis danych na fizycznych naklejkach NFC (NTAG215 / NFC Forum Type 2) oraz automatyczna obsługa głębokiego linkowania (Android App Links oraz iOS Universal Links) po zbliżeniu telefonu do naklejki.

Wymagania techniczne dla warstwy mobilnej:
1. Pełny dostęp do natywnych modułów sprzętowych NFC (Core NFC na iOS oraz Android NFC Adapter).
2. Obsługa zapisu i odczytu rekordów NDEF URI (`https://habitapp.pl/scan?...`).
3. Możliwość automatycznego wywoływania aplikacji ze stanu uśpienia/tła po odczycie tagu NFC.
4. Wysoka wydajność interfejsu użytkownika (UI) oraz sprawny proces deweloperski (Fast Refresh, łatwe debugowanie).

---

## 🔍 2. Rozważane Opcje (Considered Options)

Oceniono trzy potencjalne podejścia architektoniczne do budowy aplikacji mobilnej:

### Opcja A: Standardowe Expo Go
* **Opis:** Użycie gotowej aplikacji produkcyjnej Expo Go pobieranej ze sklepu App Store / Google Play.
* **Zalety:** Natychmiastowy start, brak konieczności kompilacji kodu natywnego na komputerze programisty.
* **Wady:** **Brak możliwości uruchomienia natywnych bibliotek C/C++/Java/Swift**, w tym biblioteki `react-native-nfc-manager`. Projekt nie jest w stanie obsłużyć czytnika NFC.
* **Werdykt:** Opcja odrzucona — technicznie nieakceptowalna.

### Opcja B: Czysty React Native CLI (Bare Workflow)
* **Opis:** Tradcyjne podejście bez wykorzystania narzędzi Expo, z bezpośrednio wygenerowanymi folderami `/android` oraz `/ios`.
* **Zalety:** Pełna kontrola nad wszystkimi plikami natywnymi, brak dodatkowej warstwy abstrakcji frameworka Expo.
* **Wady:** Wymaga ręcznej i czasochłonnej konfiguracji Xcode (certyfikaty, entitlements, capabilities `NFC Tag Reading`, `Associated Domains`) oraz pliku `AndroidManifest.xml`. Skomplikowany proces aktualizacji bibliotek natywnych oraz podatność na błędy kompilacji natywnej przy zmianach wersji React Native.
* **Werdykt:** Opcja możliwa, lecz generująca wysoki koszt utrzymania kodu natywnego.

### Opcja C: Expo z Expo Dev Client oraz Config Plugins (Wybrana Opcja)
* **Opis:** Projekt oparty o najnowszy ekosystem Expo wykorzystujący technologię **Continuous Native Generation (CNG)** oraz **Expo Dev Client**.
* **Zalety:**
  - Pełny dostęp do natywnego modułu `react-native-nfc-manager` poprzez dedykowany Expo Config Plugin.
  - Automatyczna generacja i synchronizacja wymaganych uprawnień w plikach `AndroidManifest.xml` i `Info.plist` podczas procesu `npx expo prebuild`.
  - Zachowanie szybkiego czasu iteracji (Hot Reloading / Fast Refresh) w budowanym na miarę budowlanym kliencie deweloperskim (`expo run:android` / `expo run:ios`).
  - Łatwa integracja z systemem budowania chmurowego (EAS Build).
* **Wady:** Konieczność jednorazowej kompilacji własnej wersji deweloperskiej zamiast korzystania ze standardowego Expo Go.

---

## ⚖️ 3. Porównanie i Analiza (Comparative Matrix)

| Kryterium Oceny | Opcja A (Expo Go) | Opcja B (Bare RN CLI) | Opcja C (Expo Dev Client) |
| :--- | :---: | :---: | :---: |
| **Obsługa NFC (`react-native-nfc-manager`)** | ❌ Brak | ✅ Pełna | ✅ Pełna (dzięki Config Plugin) |
| **Automatyzacja konfiguracji natywnej** | N/A | ❌ Ręczna w Xcode/Gradle | ✅ Automatyczna (`app.json`) |
| **Obsługa App Links / Universal Links** | ❌ Ograniczona | ✅ Pełna | ✅ Pełna (automatyczne AASA/Assetlinks) |
| **Szybkość dewelopmentu (DX)** | Bardzo wysoka | Średnia | Wysoka |
| **Ryzyko długu technologicznego** | N/A | Wysokie | Niskie |

---

## ✅ 4. Decyzja i Uzasadnienie (Decision Outcome)

Wybrano **Opcję C: Expo z Expo Dev Client (z szablonem TypeScript)**.

**Główne powody wyboru:**
1. **Bezpieczeństwo integracji NFC:** Biblioteka `react-native-nfc-manager` posiada oficjalne wsparcie dla Expo Config Plugins, co gwarantuje poprawną rejestrację czytnika NFC w systemie Android i iOS bez ryzyka błędów ręcznej edycji plików projektowych Xcode/Android Studio.
2. **Standard branżowy i wygoda:** Użycie CNG (Continuous Native Generation) eliminuje konieczność ręcznego utrzymywania kodu natywnego w repozytorium, przesuwając konfigurację do czytelnego pliku `app.json`.
3. **Materiały do pracy inżynierskiej:** Analiza ta stanowi istotny wkład do rozdziału architektury systemu, pokazując świadomy wybór narzędzia i ocenę ryzyka technologicznego.

---

## 🔮 5. Konsekwencje (Consequences)

* **Pozytywne:**
  - Gwarancja poprawnego działania odczytu i zapisu tagów NFC.
  - Spójna struktura kodu TypeScript.
  - Skrócenie czasu potrzebnego na konfigurację budowania iOS/Android.
* **Wymagania realizacyjne:**
  - Do testowania NFC na fizycznym telefonie wymagane będzie uruchomienie komendy kompilującej klienta deweloperskiego (`npx expo run:android` lub `npx expo run:ios`).
