# ERD — Diagram encji i relacji

Diagram bazy danych aplikacji NFC Habit Tracker. Bazowa checklista wymieniała 9 encji (User, HabitCategory, Habit, NfcTag, ScanLog, Friendship, Challenge, ChallengeParticipant, Notification) — dodano 10. encję **HabitTemplate**, żeby wesprzeć katalog predefiniowanych nawyków (wybieranych przez użytkownika z listy, a nie wpisywanych ręcznie) oraz nawyki odznaczane wielokrotnie w ciągu dnia (np. picie wody: 3× dziennie po szklance).

Diagram zapisany jest w formacie **Mermaid** (`erDiagram`) — renderuje się natywnie w podglądzie plików `.md` na GitHub, bez potrzeby zewnętrznych narzędzi. Poniżej znajduje się też źródło do wklejenia w dbdiagram.io/draw.io, jeśli wolisz formę graficzną (PNG) do pracy inżynierskiej.

```mermaid
erDiagram
    USER ||--o{ HABIT : "tworzy"
    USER ||--o{ SCAN_LOG : "wykonuje"
    USER ||--o{ FRIENDSHIP : "zaprasza (user_id)"
    USER ||--o{ FRIENDSHIP : "zapraszany (friend_id)"
    USER ||--o{ CHALLENGE : "tworzy"
    USER ||--o{ CHALLENGE_PARTICIPANT : "dołącza"
    USER ||--o{ NOTIFICATION : "otrzymuje"

    HABIT_CATEGORY ||--o{ HABIT_TEMPLATE : "kategoryzuje"
    HABIT_TEMPLATE ||--o{ HABIT : "jest wzorcem dla"

    HABIT ||--o| NFC_TAG : "ma przypisany"
    HABIT ||--o{ SCAN_LOG : "generuje"

    NFC_TAG ||--o{ SCAN_LOG : "rejestruje"

    CHALLENGE ||--o{ CHALLENGE_PARTICIPANT : "ma uczestników"

    USER {
        bigint id PK
        varchar email UK "unique, not null"
        varchar password_hash "bcrypt"
        varchar display_name
        varchar avatar_url "nullable"
        timestamptz created_at
        timestamptz updated_at
    }

    HABIT_CATEGORY {
        bigint id PK
        varchar name
        varchar color_hex
        varchar icon
        timestamptz created_at
    }

    HABIT_TEMPLATE {
        bigint id PK
        bigint category_id FK
        varchar title "np. Picie wody, Czytanie książki"
        varchar icon
        int default_daily_target_count "domyślna liczba odznaczeń dziennie, np. 3"
        varchar unit_label "nullable, np. szklanka, strona, sesja"
        varchar default_time_of_day "RANO|POPOLUDNIE|WIECZOR|CALY_DZIEN"
        int default_target_days_per_week
        timestamptz created_at
    }

    HABIT {
        bigint id PK
        bigint user_id FK
        bigint template_id FK "wybór z predefiniowanej listy HabitTemplate"
        int daily_target_count "ile razy dziennie trzeba odznaczyć; domyślnie z template, edytowalne"
        varchar time_of_day "RANO|POPOLUDNIE|WIECZOR|CALY_DZIEN"
        int target_days_per_week
        jsonb scheduled_days "np. [1,2,3,4,5]"
        int current_streak "default 0"
        boolean reminders_enabled "default true"
        timestamptz created_at
        timestamptz updated_at
    }

    NFC_TAG {
        bigint id PK
        bigint habit_id FK "UK, unique — jeden tag na nawyk"
        varchar uid UK "unikalny identyfikator NDEF"
        varchar ndef_url
        timestamptz created_at
    }

    SCAN_LOG {
        bigint id PK
        bigint habit_id FK
        bigint nfc_tag_id FK
        bigint user_id FK "zdenormalizowane pod kątem zapytań"
        timestamptz scanned_at
        varchar status "SUCCESS|REJECTED_COOLDOWN|REJECTED_UNASSIGNED"
        int points_awarded
    }

    FRIENDSHIP {
        bigint id PK
        bigint user_id FK
        bigint friend_id FK
        varchar status "PENDING|ACCEPTED"
        timestamptz created_at
    }

    CHALLENGE {
        bigint id PK
        bigint creator_id FK
        varchar title
        varchar type "TOTAL_SCANS|STREAK_TARGET"
        int target_value
        date start_date
        date end_date
        timestamptz created_at
    }

    CHALLENGE_PARTICIPANT {
        bigint id PK
        bigint challenge_id FK
        bigint user_id FK
        int progress_value "default 0"
        timestamptz joined_at
    }

    NOTIFICATION {
        bigint id PK
        bigint user_id FK
        varchar type "REMINDER|CHALLENGE|SOCIAL"
        varchar title
        varchar body
        boolean is_read "default false"
        timestamptz created_at
    }
```

## Relacje i kardynalność

| Relacja | Kardynalność | Uwagi |
|---|---|---|
| User → Habit | 1—N | Użytkownik ma wiele nawyków |
| HabitCategory → HabitTemplate | 1—N | Kategoria ma wiele wzorców nawyków; 3 domyślne kategorie z migracji `V2__seed_habit_categories.sql` (Etap 2) |
| HabitTemplate → Habit | 1—N | Wzorzec (np. „Picie wody") może być wybrany przez wielu użytkowników jako ich własny `Habit`; katalog wzorców zasilany osobną migracją seedującą (analogicznie do kategorii) |
| Habit → NfcTag | 1—1 (opcjonalna) | `nfc_tag.habit_id` z ograniczeniem `UNIQUE` — jeden aktywny tag na nawyk (zgodnie z regułą z Etapu 2, migracja `V3__add_unique_uid.sql`) |
| Habit → ScanLog | 1—N | Każdy skan (udany i odrzucony) jest logowany |
| NfcTag → ScanLog | 1—N | Historia wszystkich zbliżeń danego tagu |
| User → ScanLog | 1—N | Zdenormalizowane dla szybkich zapytań statystycznych (`GET /api/stats`) bez JOIN-a przez Habit |
| User ↔ User (przez Friendship) | M—N (self-referencing) | `UNIQUE(user_id, friend_id)` zapobiega duplikatom zaproszeń — zgodnie z regułą z Etapu 4 |
| User → Challenge | 1—N | Jako twórca wyzwania (`creator_id`) |
| Challenge → ChallengeParticipant | 1—N | Wielu uczestników na wyzwanie |
| User → ChallengeParticipant | 1—N | Użytkownik może dołączyć do wielu wyzwań; `UNIQUE(challenge_id, user_id)` |
| User → Notification | 1—N | Powiadomienia push/lokalne (Etap 4) |

## Klucze obce — podsumowanie

- `habit.user_id → user.id`
- `habit.template_id → habit_template.id`
- `habit_template.category_id → habit_category.id`
- `nfc_tag.habit_id → habit.id` (UNIQUE)
- `scan_log.habit_id → habit.id`
- `scan_log.nfc_tag_id → nfc_tag.id`
- `scan_log.user_id → user.id`
- `friendship.user_id → user.id`
- `friendship.friend_id → user.id`
- `challenge.creator_id → user.id`
- `challenge_participant.challenge_id → challenge.id`
- `challenge_participant.user_id → user.id`
- `notification.user_id → user.id`

## Mechanika wielokrotnego odznaczania w ciągu dnia

Wprowadzenie `daily_target_count` na `Habit` (np. 3 dla „Picie wody") nie wymaga osobnej tabeli licznika — dzienny postęp wylicza się na bieżąco z istniejącej tabeli `ScanLog`:

```
dzisiejszy_postęp = COUNT(*) FROM scan_log
                    WHERE habit_id = :id
                      AND status = 'SUCCESS'
                      AND scanned_at::date = CURRENT_DATE (w strefie użytkownika)

nawyk_ukończony_dzisiaj = dzisiejszy_postęp >= habit.daily_target_count
```

- Reguła **cooldownu** (min. 5 minut między skanami tego samego tagu, patrz `docs/business-rules.md`) nadal obowiązuje między pojedynczymi odznaczeniami — nie da się „dobić" dziennego celu kilkoma szybkimi stuknięciami pod rząd.
- Reguła **streaka** (wzrost przy wykonaniu w zaplanowanym dniu) sprawdza teraz `dzisiejszy_postęp >= daily_target_count`, a nie sam fakt jakiegokolwiek skanu — dzień liczy się dopiero po osiągnięciu pełnego celu (np. 3/3 szklanek).
- Warto dodać indeks `(habit_id, scanned_at)` na `scan_log` pod kątem wydajności tego zapytania przy większej liczbie użytkowników.
- `unit_label` z `HabitTemplate`/`Habit` jest czysto prezentacyjny (np. UI pokazuje „2 / 3 szklanki") i nie wpływa na logikę backendu.

## Uwaga wdrożeniowa

Diagram zapisano jako `docs/erd.md` (Mermaid) zamiast `docs/erd.png` z dbdiagram.io/draw.io — nie mamy w tym środowisku dostępu do tych narzędzi graficznych. Mermaid renderuje się automatycznie w podglądzie GitHub, więc efekt wizualny jest równoważny. Jeśli do pracy inżynierskiej potrzebujesz pliku PNG, najszybsza droga: otwórz ten plik na GitHub (renderuje diagram), zrób zrzut ekranu, albo wklej blok `mermaid` do [mermaid.live](https://mermaid.live) i wyeksportuj PNG/SVG stamtąd.

`HabitTemplate` będzie wymagać własnej migracji seedującej (analogicznie do `V2__seed_habit_categories.sql`), np. `V2b__seed_habit_templates.sql`, wypełniającej katalog startowy (Picie wody, Czytanie książki, Trening itd. — pokrywa się z listą już używaną w mockach frontendu, `mobile/src/mocks/habits.ts`).
