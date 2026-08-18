# Inwentaryzacja komponentów wielokrotnego użytku

Lista komponentów UI zaimplementowanych w `mobile/src/components/`, zgodnych z systemem projektowym Kinetic Flow (patrz [`design-tokens.md`](design-tokens.md)).

## Komponenty bazowe (`components/ui/`)

Cegiełki design systemu — bez logiki biznesowej, używane w wielu miejscach aplikacji.

| Komponent | Plik | Warianty / propsy | Używany w |
|---|---|---|---|
| **Button** | [`ui/Button.tsx`](../../mobile/src/components/ui/Button.tsx) | `variant`: `primary` \| `secondary` \| `outline` \| `danger`; `size`: `sm` \| `md` \| `lg`; `loading`, `disabled`, `icon` | Wszystkie ekrany (zapis formularza, akcje NFC, CTA) |
| **Card** | [`ui/Card.tsx`](../../mobile/src/components/ui/Card.tsx) | `variant`: `elevated` (domyślny, cień Level 1) \| `flat` \| `outlined` | Kontener większości sekcji na wszystkich ekranach |
| **Input** | [`ui/Input.tsx`](../../mobile/src/components/ui/Input.tsx) | `label`, `error`, `icon`; stan `focused` (obramowanie teal) | Obecnie nieużywany bezpośrednio na ekranach (formularz nawyku korzysta z dropdownu), dostępny do przyszłych formularzy (np. logowanie) |
| **Badge** | [`ui/Badge.tsx`](../../mobile/src/components/ui/Badge.tsx) | `label`, `icon`, `color`, `backgroundColor` — dowolna kombinacja kolorów per użycie | Kategorie nawyków, statusy streaka, tier odznak, trend „+12%” w Statystykach |
| **CircularProgress** | [`ui/CircularProgress.tsx`](../../mobile/src/components/ui/CircularProgress.tsx) | `percentage`, `size`, `strokeWidth`, `color`, `trackColor`, `label`, `sublabel` — pierścień progresu zbudowany z 56 radialnie rozmieszczonych kropek (bez zależności SVG) | Daily Goal (Home), Milestone (Detail), Consistency Score (Stats) |

## Komponenty domenowe (`components/`)

Złożone komponenty specyficzne dla funkcji aplikacji, zbudowane na bazie komponentów `ui/`.

| Komponent | Plik | Opis | Używany w |
|---|---|---|---|
| **HabitCard** | [`HabitCard.tsx`](../../mobile/src/components/HabitCard.tsx) | Karta nawyku: ikona, tytuł, licznik streaka, pasek postępu tygodniowego, status „Wykonano/Oczekuje”, przycisk toggle | `HabitListScreen` |
| **BestStreakBanner** | [`BestStreakBanner.tsx`](../../mobile/src/components/BestStreakBanner.tsx) | Ciemny baner z najlepszym aktywnym streakiem (liczba dni + nazwa nawyku + ikona ognia) | `StatsScreen` |
| **MonthlyStreakHeatmap** | [`MonthlyStreakHeatmap.tsx`](../../mobile/src/components/MonthlyStreakHeatmap.tsx) | Heatmapa miesięczna (siatka dni, 4 poziomy intensywności, legenda) | `StatsScreen` |
| **ConsistencyMap** | [`ConsistencyMap.tsx`](../../mobile/src/components/ConsistencyMap.tsx) | Heatmapa tygodniowa z nagłówkami dni (Pon–Ndz) i oznaczeniem „dziś” (przerywana ramka) | `HabitDetailScreen` |

## Ikony statusów

Statusy wizualne (kolor + ikona/emoji) są obecnie realizowane bezpośrednio przez `Badge` z odpowiednią kombinacją `color`/`backgroundColor`/`icon`, a nie osobnym komponentem — np.:

- Status ukończenia nawyku: `Wykonano` (zielony tekst) / `Oczekuje` (szary tekst) w `HabitCard`
- Tier odznaki streaka: 🥉 Nowicjusz / 🥈 Wytrwały Praktyk / 🏆 Master Practitioner / 👑 Legenda Passy w `HabitDetailScreen`
- Trend statystyk: `+12% vs last week` (zielony badge) w `StatsScreen`

**Uwaga:** we wcześniejszej iteracji istniał dedykowany komponent `NfcStatusChip` (pulsujący chip statusu czytnika NFC, opisany w źródłowym systemie Kinetic Flow jako „NFC Status Chip”). Został usunięty jako nieużywany po przeprojektowaniu ekranu Home zgodnie z finalnym makietami — do przywrócenia, jeśli pojawi się miejsce w UI wymagające jawnego wskaźnika stanu czytnika NFC (np. ekran skanowania w Etapie 3).
