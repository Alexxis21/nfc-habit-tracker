# Design Tokens — Kinetic Flow

Źródło: system projektowy **Kinetic Flow** wyeksportowany z narzędzia Stitch (odpowiednik zakładki „Inspect” w Figmie — plik źródłowy `stitch_nfc_habit_tracker/kinetic_flow/DESIGN.md`, katalog nieśledzony przez git, patrz `.gitignore`). Wdrożone tokeny znajdują się w [`mobile/src/theme.ts`](../../mobile/src/theme.ts).

Tabele poniżej zawierają **pełną paletę źródłową** ze Stitch oraz kolumnę „W `theme.ts`”, która pokazuje, które tokeny zostały faktycznie zaimplementowane w kodzie (część tokenów źródłowych — np. warianty `-fixed`, `-inverse` — nie jest jeszcze wykorzystywana i stanowi rezerwę na przyszłe warianty UI, np. dark mode).

## Kolory

| Token źródłowy (Stitch) | Hex | Token w `theme.ts` | Zastosowanie |
|---|---|---|---|
| `primary` | `#006b5c` | `colors.primaryDark` | Aktywne akcje, tekst na jasnym tle, ikony |
| `primary-container` | `#00bfa5` | `colors.primary` | Główny akcent — przyciski, wypełnienia progresu, stan „ukończone” |
| `primary-fixed` | `#68fadd` | `colors.primaryLight` | Jasne akcenty (np. tło ikony przy ukończonym nawyku) |
| `on-primary-container` | `#00473c` | `colors.primaryContainer` | Głęboki teal (tła banerów typu „Best Streak”) |
| `secondary` | `#516161` | `colors.secondary` | Tekst pomocniczy, drugorzędne elementy |
| `secondary-container` | `#d4e6e5` | `colors.secondaryContainer` | Tła chipów, aktywne taby, progres bg |
| `tertiary` | `#546067` | `colors.tertiary` | Zarezerwowane — nawigacja głębokiego poziomu |
| `background` | `#f8fafb` | `colors.background` | Tło globalne aplikacji |
| `surface-container-lowest` | `#ffffff` | `colors.surface` | Tło kart |
| `surface-container` | `#eceeef` | `colors.surfaceContainer` | Tła nieaktywnych elementów, tracki progresu |
| `surface-container-high` | `#e6e8e9` | `colors.surfaceContainerHigh` | Tła podniesione (np. nieaktywny checkbox) |
| `on-surface` | `#191c1d` | `colors.onSurface` | Główny tekst |
| `on-surface-variant` | `#3c4a46` | `colors.onSurfaceVariant` | Tekst pomocniczy / etykiety |
| `outline` | `#6c7a76` | `colors.outline` | Obramowania, ikony nieaktywne |
| `outline-variant` | `#bbcac4` | `colors.outlineVariant` | Delikatne obramowania kart/inputów |
| `error` | `#ba1a1a` | `colors.error` | Komunikaty błędów |
| `error-container` | `#ffdad6` | `colors.errorContainer` | Tło komunikatów błędów |
| — | `#00BFA5` | `colors.success` | Stan sukcesu (alias `primary`) |

Tokeny źródłowe **nieużyte jeszcze w kodzie** (rezerwa pod przyszłe warianty, np. tryb ciemny opisany w `SettingsScreen`): `surface-dim`, `surface-bright`, `inverse-surface`, `inverse-on-surface`, `inverse-primary`, `on-secondary`, `on-secondary-container`, `on-tertiary*`, `tertiary-container`, `*-fixed-dim`, `on-*-fixed*`.

## Typografia

Źródło definiuje pełną skalę na bazie **Inter** (nagłówki/body) i **Geist** (etykiety/dane systemowe). W obecnej implementacji RN fonty te **nie są jeszcze wgrane** przez `expo-font` — `theme.fonts` mapuje wszystkie role na `'System'` (font systemowy iOS/Android) jako tymczasowy fallback wizualnie zbliżony do Inter.

| Rola | Font (docelowo) | Rozmiar | Waga | Line-height | Letter-spacing | Token w `theme.ts` |
|---|---|---|---|---|---|---|
| Headline XL | Inter | 40px | 700 | 48px | -0.02em | — (nieużywane w mobile, zarezerwowane pod ekrany szersze) |
| Headline LG | Inter | 32px | 600 | 40px | -0.01em | — |
| Headline LG (mobile) | Inter | 28px | 600 | 36px | — | odpowiada `fontSize: 26–28` używanym w nagłówkach ekranów (`HabitListScreen`, `StatsScreen`) |
| Headline MD | Inter | 24px | 600 | 32px | — | odpowiada tytułom kart/sekcji (`fontSize: 16–20`, skalowane w dół dla mobile) |
| Body LG | Inter | 18px | 400 | 28px | — | — |
| Body MD | Inter | 16px | 400 | 24px | — | `fonts.body`, bazowy rozmiar treści (np. `Input`, opisy) |
| Label MD | Geist | 14px | 500 | 20px | 0.02em | `fonts.label`, etykiety formularzy, sekcje |
| Label SM | Geist | 12px | 600 | 16px | 0.05em | `fonts.label`, mikro-etykiety (daty, statusy) |

**Do zrobienia (poza zakresem tego zadania):** wgranie realnych fontów Inter/Geist przez `expo-font` + `useFonts`, żeby zastąpić fallback `'System'`.

## Spacing

| Token | Wartość | Zastosowanie |
|---|---|---|
| `spacing.unit` | 8px | Bazowa jednostka siatki (wszystkie odstępy są wielokrotnością 8) |
| `spacing.containerMargin` | 24px | Marginesy boczne ekranu |
| `spacing.gutter` | 16px | Odstępy między elementami w rzędzie |
| `spacing.cardPadding` | 20px | Wewnętrzny padding kart (`Card.tsx`) |
| `spacing.stackGap` | 12px | Odstępy pionowe między elementami listy |

## Border radius (kształty)

| Token | Wartość | Zastosowanie |
|---|---|---|
| `borderRadius.sm` | 4px | Drobne elementy (kafelki heatmapy) |
| `borderRadius.md` | 8px | Przyciski ikonowe, małe kontrolki |
| `borderRadius.lg` | 16px | Przyciski, inputy, dropdown |
| `borderRadius.xl` | 24px | Karty (`Card.tsx`) |
| `borderRadius.full` | 9999px | Elementy w pełni zaokrąglone (progres bary, chipy, FAB) |

## Cienie / elevation

| Token | Zastosowanie | Wartości |
|---|---|---|
| `shadows.card` | Domyślny cień kart (Level 1) | `shadowColor: onSurface`, opacity 0.06, radius 12, offset (0,4), elevation 3 |
| `shadows.active` | Podniesione/aktywne elementy (Level 2 — FAB, przycisk primary, baner streaka) | `shadowColor: primary`, opacity 0.2, radius 16, offset (0,6), elevation 5 |

## Uwagi wdrożeniowe

- Wdrożona paleta jest **podzbiorem** źródłowego systemu Kinetic Flow — celowo uproszczonym do tego, co faktycznie występuje w zaimplementowanych ekranach.
- Skala typografii jest spłaszczona do 3 ról (`headline`, `body`, `label`) zamiast pełnej skali 8-poziomowej ze źródła — wystarcza to na obecnym etapie (mockowy UI), ale przy rozbudowie warto rozważyć pełne odwzorowanie skali.
- Wszystkie odstępy w komponentach są zgodne z siatką 8px zdefiniowaną w `spacing`.
