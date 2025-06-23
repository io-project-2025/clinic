SET SEARCH_PATH TO clinic;

INSERT INTO oddzialy (nazwa, adres) VALUES
('Chirurgia Ogólna', 'ul. Lekarska 1, Warszawa'),
('Pediatria', 'ul. Dziecięca 5, Kraków'),
('Dermatologia', 'ul. Skórna 12, Wrocław'),
('Neurologia', 'ul. Nerwowa 8, Poznań'),
('Ortopedia', 'ul. Koścista 7, Lublin');


-- Oddział 1
INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) VALUES
('Anna', 'Kowalska', 'anna.kowalska@clinic.pl', 'tajnehaslo1', 1),
('Piotr', 'Nowicki', 'piotr.nowicki@clinic.pl', 'tajnehaslo1', 1);

-- Oddział 2
INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) VALUES
('Tomasz', 'Dąbrowski', 'tomasz.dabrowski@clinic.pl', 'tajnehaslo', 2),
('Monika', 'Zielińska', 'monika.zielinska@clinic.pl', 'tajnehaslo', 2);

-- Oddział 65
INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) VALUES
('Ewa', 'Wójcik', 'ewa.wojcik@clinic.pl', 'tajnehaslo', 65),
('Kamil', 'Kowalczyk', 'kamil.kowalczyk@clinic.pl', 'tajnehaslo', 65);

-- Oddział 66
INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) VALUES
('Grzegorz', 'Nowak', 'grzegorz.nowak@clinic.pl', 'tajnehaslo', 66),
('Magdalena', 'Lis', 'magdalena.lis@clinic.pl', 'tajnehaslo', 66);

-- Oddział 67
INSERT INTO lekarze (imie, nazwisko, email, haslo, oddzial_id) VALUES
('Dorota', 'Witkowska', 'dorota.witkowska@clinic.pl', 'tajnehaslo', 67),
('Michał', 'Baran', 'michal.baran@clinic.pl', 'tajnehaslo', 67);


-- dyżury na 3 dni
INSERT INTO dyzury (data, zmiana_id) VALUES
('2025-06-24', 1), ('2025-06-24', 2),
('2025-06-25', 1), ('2025-06-25', 2),
('2025-06-26', 1), ('2025-06-26', 2);

-- Dyżur 1
INSERT INTO lekarze_dyzury (dyzur_id, lekarz_id) VALUES
(1, 194), (1, 195), (1, 196);

-- Dyżur 2
INSERT INTO lekarze_dyzury (dyzur_id, lekarz_id) VALUES
(2, 197), (2, 198), (2, 199);

-- Dyżur 3
INSERT INTO lekarze_dyzury (dyzur_id, lekarz_id) VALUES
(3, 200), (3, 201), (3, 202);

-- Dyżur 4
INSERT INTO lekarze_dyzury (dyzur_id, lekarz_id) VALUES
(4, 133), (4, 131), (4, 130);

-- Dyżur 5
INSERT INTO lekarze_dyzury (dyzur_id, lekarz_id) VALUES
(6, 194), (6, 202), (6, 196);

-- Dyżur 6
INSERT INTO lekarze_dyzury (dyzur_id, lekarz_id) VALUES
(7, 197), (7, 201), (7, 202);


INSERT INTO rodzaje_wizyt (rodzaj_wizyty_id, opis, cena, oddzial_id) VALUES

(1, 'Konsultacja internistyczna', 150.00, 1),
(6, 'Konsultacja diabetologiczna', 160.00, 1),
(7, 'Interpretacja wyników badań', 90.00, 1),

(2, 'Wizyta kontrolna pediatryczna', 120.00, 2),
(8, 'Wizyta noworodka', 140.00, 2),
(9, 'Konsultacja alergologiczna dziecięca', 150.00, 2),

(3, 'Szczepienie', 50.00, 65),
(10, 'Konsultacja przedoperacyjna', 250.00, 65),
(11, 'Usunięcie szwów', 60.00, 65),

(4, 'Porada telefoniczna', 30.00, 66),
(12, 'ECHO serca', 300.00, 66),
(13, 'EKG spoczynkowe', 120.00, 66),

(5, 'Wizyta domowa', 400.00, 67),
(14, 'EMG kończyny dolnej', 270.00, 67),
(15, 'Konsultacja pourazowa neurologiczna', 230.00, 67);


INSERT INTO pacjenci (pacjent_id, imie, nazwisko, email, haslo) VALUES
(4,'Aleksandra', 'Nowak', 'aleksandra.nowak@clinic.pl', 'tajnehaslo'),
(5, 'Krzysztof', 'Kowalski', 'krzysztof.kowalski@clinic.pl', 'tajnehaslo'),
(6,'Magdalena', 'Wójcik', 'magdalena.wojcik@clinic.pl', 'tajnehaslo'),
(7,'Marek', 'Kamiński', 'marek.kaminski@clinic.pl', 'tajnehaslo'),
(8,'Patrycja', 'Lewandowska', 'patrycja.lewandowska@clinic.pl', 'tajnehaslo'),
(9,'Tomasz', 'Zieliński', 'tomasz.zielinski@clinic.pl', 'tajnehaslo'),
(10,'Joanna', 'Szymańska', 'joanna.szymanska@clinic.pl', 'tajnehaslo');

UPDATE pacjenci SET
    pesel = 88010112345,
    data_urodzenia = '1988-01-01',
    telefon = 123123123
WHERE pacjent_id = 4;

UPDATE pacjenci SET
    pesel = 75020254321,
    data_urodzenia = '1975-02-02',
    telefon = 765432109
WHERE pacjent_id = 5;

UPDATE pacjenci SET
    pesel = 92031598765,
    data_urodzenia = '1992-03-15',
    telefon = 500123456
WHERE pacjent_id = 6;

UPDATE pacjenci SET
    pesel = 80072045678,
    data_urodzenia = '1980-07-20',
    telefon = 222111222
WHERE pacjent_id = 7;

UPDATE pacjenci SET
    pesel = 66051133445,
    data_urodzenia = '1966-05-11',
    telefon = 987654321
WHERE pacjent_id = 8;

UPDATE pacjenci SET
    pesel = 99083011223,
    data_urodzenia = '1999-08-30',
    telefon = 111222333
WHERE pacjent_id = 9;

UPDATE pacjenci SET
    pesel = 87062544567,
    data_urodzenia = '1987-06-25',
    telefon = 555666777
WHERE pacjent_id = 10;


INSERT INTO wizyty (pacjent_id, lekarz_id, data, godzina, ocena, dokumenty_wizyty, notatki_wizyty, rodzaj_wizyty_id, status) VALUES
(1, 194, '2025-06-24', '09:00', 5,
 '{"skierowanie": "Skierowanie na badanie krwi"}',
 '{"objawy": "kaszel, gorączka"}',
 1, 'zrealizowana'),

(2, 195, '2025-06-25', '10:30', NULL,
 NULL,
 NULL,
 2, 'zaplanowana'),

(3, 196, '2025-06-25', '11:00', 4,
 '{"recepta": "Recepta na antybiotyk"}',
 '{"diagnoza": "infekcja dróg oddechowych"}',
 3, 'zaplanowana'),

(4, 197, '2025-06-26', '08:30', 3,
 NULL,
 '{"objawy": "ból głowy, nudności"}',
 4, 'zaakceptowana'),

(5, 198, '2025-06-26', '09:45', NULL,
 NULL,
 NULL,
 5, 'odwolana'),

(6, 199, '2025-06-24', '14:00', 5,
 '{"skierowanie": "Skierowanie na RTG klatki piersiowej"}',
 '{"diagnoza": "zapalenie oskrzeli"}',
 6, 'odwolana'),

(7, 200, '2025-06-25', '15:30', 4,
 NULL,
 '{"objawy": "uczucie zmęczenia, zawroty głowy"}',
 7, 'zaakceptowana'),

(8, 201, '2025-06-26', '13:15', NULL,
 NULL,
 NULL,
 8, 'odwolana'),

(9, 202, '2025-06-24', '10:00', 5,
 '{"recepta": "Recepta na leki obniżające ciśnienie"}',
 '{"diagnoza": "nadciśnienie tętnicze"}',
 9, 'odwolana');

INSERT INTO wizyty (pacjent_id, lekarz_id, data, godzina, ocena, dokumenty_wizyty, notatki_wizyty, rodzaj_wizyty_id, status) VALUES
(6, 194, '2025-06-28', '08:00', NULL,
 NULL,
 NULL,
 1, 'zaplanowana'),

(7, 195, '2025-06-28', '09:15', 4,
 '{"recepta": "Recepta na witaminy"}',
 '{"diagnoza": "niedobór witaminy D"}',
 2, 'zrealizowana'),

(8, 196, '2025-06-29', '10:00', 5,
 '{"skierowanie": "Skierowanie na badanie EKG"}',
 '{"objawy": "kołatanie serca"}',
 3, 'zrealizowana'),

(9, 197, '2025-06-29', '11:30', NULL,
 NULL,
 NULL,
 4, 'zaplanowana'),

(10, 198, '2025-06-30', '13:00', NULL,
 NULL,
 '{"objawy": "ból w klatce piersiowej"}',
 5, 'zaplanowana'),

(1, 199, '2025-07-01', '09:00', 3,
 '{"recepta": "Recepta na leki przeciwbólowe"}',
 '{"diagnoza": "migrena"}',
 6, 'zrealizowana'),

(2, 200, '2025-07-01', '10:30', NULL,
 NULL,
 NULL,
 7, 'nieobecność pacjenta'),

(3, 201, '2025-07-02', '11:00', NULL,
 NULL,
 NULL,
 8, 'zaplanowana'),

(4, 202, '2025-07-02', '14:00', 4,
 '{"skierowanie": "Skierowanie na badanie neurologiczne"}',
 '{"diagnoza": "neuropatia"}',
 9, 'zrealizowana');

INSERT INTO badania (wyniki, pacjent_id, data, lekarz_id, opis) VALUES
('{"badanie": "Morfologia", "wynik": "WBC: 7.1, RBC: 5.0, HGB: 14.0, PLT: 270"}', 2, '2025-06-10', 194, 'Badanie morfologii krwi.'),
('{"badanie": "USG jamy brzusznej", "wynik": "Wynik prawidłowy, brak zmian"}', 3, '2025-06-11', 195, 'USG jamy brzusznej bez zmian patologicznych.'),
('{"badanie": "EKG", "wynik": "Rytm zatokowy, niewielkie zmiany ST"}', 4, '2025-06-12', 196, 'Badanie EKG z niewielkimi zmianami ST.'),
('{"badanie": "RTG klatki piersiowej", "wynik": "Obraz prawidłowy"}', 5, '2025-06-13', 197, 'RTG klatki piersiowej bez nieprawidłowości.'),
('{"badanie": "Badanie moczu", "wynik": "Brak patologii"}', 6, '2025-06-14', 198, 'Badanie ogólne moczu.'),
('{"badanie": "Test wysiłkowy", "wynik": "Dobrze tolerowany wysiłek"}', 7, '2025-06-15', 199, 'Test wysiłkowy bez zastrzeżeń.'),
('{"badanie": "Morfologia", "wynik": "WBC: 6.5, RBC: 4.9, HGB: 13.8, PLT: 260"}', 8, '2025-06-16', 200, 'Morfologia krwi.'),
('{"badanie": "USG tarczycy", "wynik": "Brak zmian ogniskowych"}', 9, '2025-06-17', 201, 'USG tarczycy bez zmian.'),
('{"badanie": "EKG", "wynik": "Rytm zatokowy, bez zmian"}', 10, '2025-06-18', 202, 'Standardowe badanie EKG.'),
('{"badanie": "Badanie poziomu glukozy", "wynik": "90 mg/dL"}', 1, '2025-06-19', 194, 'Poziom glukozy we krwi.'),
('{"badanie": "RTG kolana", "wynik": "Zmiany zwyrodnieniowe"}', 2, '2025-06-20', 195, 'RTG kolana z widocznymi zmianami zwyrodnieniowymi.'),
('{"badanie": "Badanie moczu", "wynik": "Obecność leukocytów"}', 3, '2025-06-21', 196, 'Badanie moczu wykazało leukocyty.'),
('{"badanie": "Morfologia", "wynik": "WBC: 7.3, RBC: 4.7, HGB: 13.6, PLT: 255"}', 4, '2025-06-22', 197, 'Morfologia krwi.'),
('{"badanie": "USG jamy brzusznej", "wynik": "Wynik prawidłowy"}', 5, '2025-06-23', 198, 'USG jamy brzusznej.'),
('{"badanie": "EKG", "wynik": "Rytm zatokowy, brak nieprawidłowości"}', 6, '2025-06-24', 199, 'Badanie EKG bez nieprawidłowości.');


INSERT INTO wiadomosci (pacjent_id, lekarz_id, nadawca, tresc) VALUES
(1, 194, 'pacjent', 'Dzień dobry, czy mogę umówić się na konsultację w przyszłym tygodniu?'),
(2, 195, 'lekarz', 'Proszę o przesłanie wyników badań przed wizytą.'),
(3, 196, 'pacjent', 'Mam pytanie dotyczące dawkowania leku, który mi Pan przepisał.'),
(4, 197, 'lekarz', 'Przypominam o wizycie zaplanowanej na jutro o 10:00.'),
(5, 198, 'pacjent', 'Dziękuję za pomoc, czuję się już lepiej.');



-- troche wizyt dla lekarza 1
INSERT INTO wizyty (pacjent_id, lekarz_id, data, godzina, rodzaj_wizyty_id, status) VALUES
(3, 1, '2025-06-23', '08:00', 1, 'zaplanowana'),
(7, 1, '2025-06-23', '09:00', 2, 'zrealizowana'),
(5, 1, '2025-06-23', '10:00', 3, 'nieobecność pacjenta'),
(10, 1, '2025-06-23', '11:00', 4, 'zaakceptowana'),
(4, 1, '2025-06-23', '12:00', 5, 'odwolana'),

(8, 1, '2025-06-24', '08:00', 1, 'zaplanowana'),
(6, 1, '2025-06-24', '09:00', 2, 'zaplanowana'),
(9, 1, '2025-06-24', '10:00', 3, 'zaplanowana'),
(5, 1, '2025-06-24', '11:00', 4, 'zaakceptowana'),
(7, 1, '2025-06-24', '12:00', 5, 'odwolana'),

(6, 1, '2025-06-25', '08:00', 1, 'zaplanowana'),
(4, 1, '2025-06-25', '09:00', 2, 'zaplanowana'),
(10, 1, '2025-06-25', '10:00', 3, 'zaplanowana'),
(3, 1, '2025-06-25', '11:00', 4, 'zaakceptowana'),
(9, 1, '2025-06-25', '12:00', 5, 'odwolana'),

(7, 1, '2025-06-26', '08:00', 1, 'zaplanowana'),
(5, 1, '2025-06-26', '09:00', 2, 'zaplanowana'),
(8, 1, '2025-06-26', '10:00', 3, 'zaplanowana'),
(6, 1, '2025-06-26', '11:00', 4, 'zaakceptowana'),
(4, 1, '2025-06-26', '12:00', 5, 'odwolana'),

(9, 1, '2025-06-27', '08:00', 1, 'zaplanowana'),
(10, 1, '2025-06-27', '09:00', 2, 'zaplanowana'),
(7, 1, '2025-06-27', '10:00', 3, 'zaplanowana'),
(8, 1, '2025-06-27', '11:00', 4, 'zaakceptowana'),
(3, 1, '2025-06-27', '12:00', 5, 'odwolana'),

(4, 1, '2025-06-28', '08:00', 1, 'zaplanowana'),
(3, 1, '2025-06-28', '09:00', 2, 'zaplanowana'),
(6, 1, '2025-06-28', '10:00', 3, 'zaplanowana'),
(9, 1, '2025-06-28', '11:00', 4, 'zaakceptowana'),
(10, 1, '2025-06-28', '12:00', 5, 'odwolana'),

(5, 1, '2025-06-29', '08:00', 1, 'zaplanowana'),
(8, 1, '2025-06-29', '09:00', 2, 'zaplanowana'),
(4, 1, '2025-06-29', '10:00', 3, 'zaplanowana'),
(7, 1, '2025-06-29', '11:00', 4, 'zaakceptowana'),
(6, 1, '2025-06-29', '12:00', 5, 'odwolana');


-- troche wizyt dla lekarza 2
INSERT INTO wizyty (pacjent_id, lekarz_id, data, godzina, rodzaj_wizyty_id, status) VALUES
(9, 2, '2025-06-23', '08:30', 3, 'zaplanowana'),
(4, 2, '2025-06-23', '09:30', 1, 'zaplanowana'),
(7, 2, '2025-06-23', '10:30', 5, 'zaakceptowana'),
(6, 2, '2025-06-23', '11:30', 2, 'odwolana'),
(3, 2, '2025-06-23', '12:30', 4, 'zaplanowana'),

(5, 2, '2025-06-24', '08:30', 2, 'zaplanowana'),
(10, 2, '2025-06-24', '09:30', 4, 'zaplanowana'),
(8, 2, '2025-06-24', '10:30', 1, 'zaplanowana'),
(4, 2, '2025-06-24', '11:30', 3, 'zaakceptowana'),
(9, 2, '2025-06-24', '12:30', 5, 'odwolana'),

(7, 2, '2025-06-25', '08:30', 4, 'zaplanowana'),
(6, 2, '2025-06-25', '09:30', 5, 'zaplanowana'),
(3, 2, '2025-06-25', '10:30', 2, 'zaplanowana'),
(5, 2, '2025-06-25', '11:30', 1, 'zaakceptowana'),
(8, 2, '2025-06-25', '12:30', 3, 'odwolana'),

(10, 2, '2025-06-26', '08:30', 5, 'zaplanowana'),
(4, 2, '2025-06-26', '09:30', 3, 'zaplanowana'),
(9, 2, '2025-06-26', '10:30', 1, 'zaplanowana'),
(7, 2, '2025-06-26', '11:30', 2, 'zaakceptowana'),
(6, 2, '2025-06-26', '12:30', 4, 'odwolana'),

(3, 2, '2025-06-27', '08:30', 1, 'zaplanowana'),
(8, 2, '2025-06-27', '09:30', 2, 'zaplanowana'),
(5, 2, '2025-06-27', '10:30', 3, 'zaplanowana'),
(10, 2, '2025-06-27', '11:30', 4, 'zaakceptowana'),
(4, 2, '2025-06-27', '12:30', 5, 'odwolana');


INSERT INTO wizyty (pacjent_id, lekarz_id, data, godzina, rodzaj_wizyty_id, status, dokumenty_wizyty, notatki_wizyty) VALUES
(3, 200, '2025-06-20', '09:00', 1, 'zrealizowana',
 '{"typ": "recepta", "tresc": "Paracetamol 500mg, 3x dziennie"}',
 '{"objawy": "gorączka, ból głowy", "diagnoza": "grypa"}'),

(3, 194, '2025-06-22', '11:30', 2, 'nieobecność pacjenta',
 '{"typ": "skierowanie", "tresc": "Badanie RTG klatki piersiowej"}',
 '{"objawy": "kaszel", "diagnoza": "podejrzenie zapalenia płuc"}'),

(3, 202, '2025-06-24', '10:00', 3, 'zaplanowana',
 '{"typ": "recepta", "tresc": "Ibuprofen 200mg, 2x dziennie"}',
 '{"objawy": "ból gardła", "diagnoza": "zapalenie gardła"}'),

(3, 195, '2025-06-25', '08:30', 4, 'zaakceptowana',
 '{"typ": "skierowanie", "tresc": "EKG oraz konsultacja kardiologiczna"}',
 '{"objawy": "kołatanie serca", "diagnoza": "arytmia do potwierdzenia"}'),

(3, 199, '2025-06-26', '13:00', 5, 'odwolana',
 '{"typ": "recepta", "tresc": "Maść przeciwbólowa Voltaren"}',
 '{"objawy": "ból pleców", "diagnoza": "nadwyrężenie mięśni"}'),

(3, 200, '2025-06-27', '14:30', 1, 'zaplanowana',
 '{"typ": "skierowanie", "tresc": "Morfologia i badanie moczu"}',
 '{"objawy": "ogólne osłabienie", "diagnoza": "diagnostyka w toku"}'),

(3, 200, '2025-06-28', '09:45', 2, 'zaakceptowana',
 '{"typ": "recepta", "tresc": "Loratadyna 10mg na alergię"}',
 '{"objawy": "kichanie, wysypka", "diagnoza": "alergia sezonowa"}'),

(3, 194, '2025-06-29', '11:15', 3, 'odwolana',
 '{"typ": "skierowanie", "tresc": "Konsultacja neurologiczna"}',
 '{"objawy": "zawroty głowy", "diagnoza": "do dalszej diagnostyki"}'),

(3, 195, '2025-06-30', '10:00', 4, 'zaplanowana',
 '{"typ": "recepta", "tresc": "Amoksycylina 1000mg"}',
 '{"objawy": "ból zatok", "diagnoza": "zapalenie zatok"}'),

(3, 199, '2025-07-01', '12:00', 5, 'zaakceptowana',
 '{"typ": "skierowanie", "tresc": "USG jamy brzusznej"}',
 '{"objawy": "ból brzucha", "diagnoza": "dyspepsja"}');

-- SELECT * FROM oddzialy;
-- SELECT * FROM pacjenci;
-- SELECT * FROM lekarze_dyzury;
-- SELECT * FROM lekarze;
-- SELECT * FROM rodzaje_wizyt;
-- SELECT * FROM wizyty;
-- SELECT * FROM badania;
-- SELECT * FROM wiadomosci;
