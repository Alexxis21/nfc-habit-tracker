# Zasady Projektowe (Workspace Rules) - NFC Habit Tracker

## 1. Wywiad przed każdym zadaniem (Tryb /grill-me)
- Przed rozpoczęciem realizacji dowolnego zadania lub kroku z harmonogramu należy przeprowadzić szczegółowy wywiad z użytkownikiem (zadając pytania po kolei za pomocą narzędzia `ask_question`).
- Każde pytanie musi zawierać czytelny kontekst, opcje wyboru sformatowane z perspektywy użytkownika oraz wyróżnioną rekomendację sformatowaną z przedrostkiem `(Recommended)`.
- Celem jest ustalenie szczegółów technicznych, struktury i podejmowanie świadomych decyzji przez użytkownika.

## 2. Prowadzenie Dziennika Projektu (Journal)
- Wszystkie raporty z wykonanych prac należy rejestrować w pliku `journal.md` w głównym katalogu projektu.
- Każdy wpis w dzienniku musi zawierać datę, podjęte decyzje oraz listę zrealizowanych zadań.

## 3. Komendy Terminala (Samodzielne wykonywanie w VS Code)
- Nie wykonywać głównych komend terminala (np. `git`, `npm`, `npx`, `./mvnw`, `docker`) automatycznie.
- Wszystkie komendy należy zawsze prezentować w czytelnych blokach kodu wraz z opisem i ścieżką katalogu (`Cwd`), aby użytkownik mógł je samodzielnie wklejać do terminala w Visual Studio Code IDE.
