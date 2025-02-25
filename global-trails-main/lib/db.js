import sql from 'better-sqlite3';

const db = sql('global-trails.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        role TEXT,
        password TEXT
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT NOT NULL PRIMARY KEY,
        expires_at INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `);

db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        slug TEXT UNIQUE,
        description TEXT,
        image TEXT
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        slug TEXT UNIQUE,
        description TEXT,
        address TEXT,
        image TEXT,
        city TEXT,
        user INTEGER,
        FOREIGN KEY (city) REFERENCES cities(name) ON DELETE CASCADE
        FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS rentals (
        id INTEGER PRIMARY KEY,
        price FLOAT,
        rating FLOAT,
        place INTEGER,
        FOREIGN KEY (place) REFERENCES places(id) ON DELETE CASCADE
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
     id INTEGER PRIMARY KEY,
     date TEXT,
     rating FLOAT,
     comment TEXT,
     place INTEGER,
     user INTEGER,
     FOREIGN KEY (place) REFERENCES places(id) ON DELETE CASCADE
     FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS stays (
    id INTEGER PRIMARY KEY,
    place INTEGER,
    user INTEGER,
    date_start TEXT,
    date_end TEXT,
    FOREIGN KEY (place) REFERENCES places(id) ON DELETE CASCADE
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
    );
    `);

db.exec(`
    CREATE TABLE IF NOT EXISTS hidden_places (
        id INTEGER PRIMARY KEY,
        slug TEXT,
        FOREIGN KEY (slug) REFERENCES places(slug) ON DELETE CASCADE
    );
    `);

const hasCities =
	db
		.prepare(
			`
    SELECT COUNT(*) AS count FROM cities
`
		)
		.get().count > 0;

if (!hasCities) {
	db.exec(`
        INSERT INTO users (email, name, role, password)
        VALUES
        ('admin@admin.pl', 'Patryk', 'admin', 'admin'),
        ('admin2@admin.pl', 'Igor', 'admin', 'admin'),
        ('admin3@admin.pl', 'Jan', 'admin', 'admin');
    `);

	db.exec(`
        INSERT INTO cities (name, slug, description, image)
        VALUES
        ('Gdańsk', 'gdansk', 'Gdańsk to malownicze miasto nad Bałtykiem, znane z pięknej starówki i symbolicznej Fontanny Neptuna. Ma duże znaczenie historyczne jako miejsce wybuchu II wojny światowej i kolebka ruchu Solidarność.', '/gdansk.jpg'),
        ('Poznań', 'poznan', 'Poznań to dynamiczne miasto w zachodniej Polsce, znane z Koziołków Poznańskich i bogatej historii. Słynie z malowniczego rynku oraz tradycyjnych rogali świętomarcińskich.', '/poznan.jpg'),
        ('Warszawa', 'warszawa', 'Warszawa, stolica Polski, to nowoczesne miasto z bogatą historią i zabytkami, takimi jak Zamek Królewski. Jest ważnym ośrodkiem kulturalnym, politycznym i gospodarczym kraju.', '/warszawa.jpg'),
        ('Wrocław', 'wroclaw' ,'Wrocław to urokliwe miasto nad Odrą, słynące z licznych mostów i malowniczych wysp. Znane jest z pięknego rynku, historycznego Ostrowa Tumskiego i wrocławskich krasnali.', '/wroclaw.jpg');
    `);

	db.exec(`
        INSERT INTO places (name, slug, description, address, image, city, user)
        VALUES
        ('Apartament Nad Motławą', 'apartament-nad-motlawa', 'Komfortowy apartament z widokiem na rzekę.', 'ul. Chmielna 70', 'https://apartamenty-szafarnia-z-widokiem-na-rzeke-lub-z.booked.com.pl/data/Photos/OriginalPhoto/10372/1037279/1037279437/Apartamenty-Centrum-Nad-Motlawa-Z-Widokiem-Na-Rzeke-Lub-Na-Patio-Z-Balkonem-Gdansk-Exterior.JPEG', 'Gdańsk', 1),
        ('Willa w Parku', 'willa-w-parku', 'Elegancka willa w sercu parku.', 'ul. Parkowa 15', 'https://willawparku.pl/wp-content/uploads/2021/02/DSC_4395-1.jpg', 'Warszawa', 1),
        ('Loft na Wyspie', 'loft-na-wyspie', 'Stylowy loft na wyspie.', 'ul. Wyspiańska 10', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/373882314.jpg?k=945031fbc43678c90a098b0ee488b6aa137bf0257f54c55682f3cc61ee994142&o=&hp=1', 'Wrocław', 1),
        ('Kamienica Staromiejska', 'kamienica-staromiejska', 'Zabytkowa kamienica w centrum.', 'ul. Długa 7', 'https://dzieje.pl/sites/default/files/styles/open_article_750x0_/public/202211/kamienica_lucinskiego.jpg?itok=PRW5Crzv', 'Poznań', 1),
        ('Podniebny Loft', 'podniebny-loft', 'Ekskluzywny loft z zapierającym dech widokiem.', 'ul. Panorama 21', 'https://www.budownictwo.co/wp-content/uploads/2020/09/454_Sky_Loft_1-1000x667.jpg', 'Warszawa', 1),
        ('Mieszkanie Artysty', 'mieszkanie-artysty', 'Kreatywne mieszkanie w artystycznym stylu.', 'ul. Rynek 2', 'https://architektnaszpilkach.pl/wp-content/uploads/2015/02/4a-2.jpg', 'Wrocław', 1),
        ('Studio Artystyczne', 'studio-artystyczne', 'Nowoczesne studio w artystycznej dzielnicy.', 'ul. Artystów 11', 'https://www.designalive.pl/wp-content/uploads/2022/07/Mr_Buckley_Edynburg_designalive-5.jpg', 'Wrocław', 1),
        ('Rezydencja nad Odrą', 'rezydencja-nad-odra', 'Rezydencja nad brzegiem Odry.', 'ul. Nadbrzeżna 33', 'https://dba-architekci.pl/wp-content/uploads/2023/11/dom_nad_Odra_DL01_09.jpg', 'Poznań', 1),
        ('Apartament Królewski', 'apartament-krolewski', 'Wyjątkowy apartament w królewskim stylu.', 'ul. Królewska 5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkYpHZ8qkOTuOKnX__fRDOeYi2zZtP6pIzpw&s', 'Gdańsk', 1),
        ('Willa w Zalesiu', 'willa-w-zalesiu', 'Przestronna willa w cichej okolicy.', 'ul. Leśna 18', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/417400848.jpg?k=3fb5724880be9c7e0debacd3f450a4111143539069db5f807ae77aa35f17f6e8&o=&hp=1', 'Warszawa', 1),
        ('Nadmorski Apartament', 'nadmorski-apartament', 'Komfortowy apartament z widokiem na morze.', 'ul. Brzegowa 1', 'https://nadmorskiluksus.pl/wp-content/uploads/2022/10/nadmorski-luksus-apartament-nadmorski-II-05.jpg', 'Gdańsk', 1),
        ('Zakątek w Ogrodach', 'zakatek-w-ogrodach', 'Przytulne mieszkanie w otoczeniu zieleni.', 'ul. Ogrodowa 2', 'https://gardenspace.pl/uploads/articles/1076/zakatek-w-ogrodzie.jpg', 'Warszawa', 1),
        ('Przystań Artysty', 'przystan-artysty', 'Artystyczne mieszkanie z wyjątkowym klimatem.', 'ul. Sztuki 3', 'https://i.dobrzemieszkaj.pl/i/70/83/15/r3/1920/przytulne-mieszkanie-kolorowe-i-stylowe.jpg', 'Wrocław', 1),
        ('Nowoczesny Loft', 'nowoczesny-loft', 'Stylowy loft w nowoczesnym stylu.', 'ul. Loftowa 4', 'https://www.porta.com.pl/otworzsiena/phavi/ph/r,1035,0/upl/s/2017/1228/1243-i-d5ebe0754ffab0eaf1ebe07471e5b1eb.jpg?token=53cbb9ae', 'Poznań', 1),
        ('Apartament na Wzgórzu', 'apartament-na-wzgorzu', 'Apartament z pięknym widokiem na miasto.', 'ul. Wzgórze 5', 'https://www.krynica.pl/userFiles/photoObject/800x800/648.jpg', 'Gdańsk', 1),
        ('Zielona Oaza', 'zielona-oaza', 'Mieszkanie w spokojnej, zielonej okolicy.', 'ul. Zielona 6', 'https://img.dodajobiekt.pl/thumbs/zielona-oaza-3912-zdjecia-24dff001_12.jpg?s=1', 'Warszawa', 1),
        ('Willa z Widokiem', 'willa-z-widokiem', 'Elegancka willa z panoramicznym widokiem.', 'ul. Widokowa 7', 'https://www.uniquehomesmoraira.com/objetos/temp/source/uniquemoraira/uniquehomesmoraira-propiedades_60c8aa307ce4c-source.jpg', 'Wrocław', 1),
        ('Apartament w Marinie', 'apartament-w-marinie', 'Luksusowy apartament w marinie.', 'ul. Portowa 8', 'https://www.inwest-hel.pl/wp-content/uploads/2020/07/P1010903-scaled.jpg', 'Poznań', 1),
        ('Rezydencja na Skarpie', 'rezydencja-na-skarpie', 'Przestronna rezydencja na skarpie.', 'ul. Skarpowa 9', 'https://cdn.galleries.smcloud.net/t/galleries/gf-k5Qi-EQHk-kFwJ_dom-na-skrapie-664x442.jpg', 'Gdańsk', 1),
        ('Miejska Przystań', 'miejska-przystan', 'Nowoczesne mieszkanie w centrum miasta.', 'ul. Centralna 10', 'https://www.super-nieruchomosci.com/upload/galeria/_min/miejska-przystan-ul-miejska695221046932379.jpg', 'Warszawa', 1),
        ('Podniebna Rezydencja', 'podniebna-rezydencja', 'Luksusowa rezydencja na najwyższym piętrze.', 'ul. Wysoka 11', 'https://ocdn.eu/pulscms-transforms/1/RFbk9kpTURBXy9mNDE3MDE4YjUzMjhjNzQyZjY5NjAzODAxMjg3YTQxMC5wbmeSlQMOAM0Cbs0BXpMFzQSwzQKe3gABoTAB', 'Wrocław', 1),
        ('Studio w Sercu Miasta', 'studio-w-sercu-miasta', 'Kompaktowe studio w samym centrum.', 'ul. Serce 12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7gIAhvCHv9RkZ2oNQy495IndPIaMnI17rcg&s', 'Poznań', 1),
        ('Apartament na Starym Mieście', 'apartament-na-starym-miescie', 'Apartament w zabytkowej kamienicy.', 'ul. Stare Miasto 13', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/368038682.jpg?k=3eae318710fa0e025711fc1082777910ccbf9e929d5972a24d4d185e3287c0e6&o=&hp=1', 'Gdańsk', 1),
        ('Przestronny Loft', 'przestronny-loft', 'Duży loft z wysokimi sufitami.', 'ul. Loftowa 14', 'https://img.freepik.com/premium-zdjecie/duzy-przestronny-salon-w-stylu-loft-z-kominkiem-i-meblami-tapicerowanymi-duzymi-panoramicznymi-oknami-i-bialymi-scianami-renderowania-3d_295714-2971.jpg', 'Warszawa', 1),
        ('Kamienica Art Deco', 'kamienica-art-deco', 'Zabytkowa kamienica w stylu Art Deco.', 'ul. Art Deco 15', 'https://upload.wikimedia.org/wikipedia/commons/5/54/Tenement%2C_art_deco%2C_1927-_designed_by_arch._Wac%C5%82aw_Nowakowski%2C_6_Inwalid%C3%B3w_square%2C_Krakow%2C_Polandi.jpg', 'Wrocław', 1),
        ('Luksusowy Penthouse', 'luksusowy-penthouse', 'Penthouse z luksusowymi udogodnieniami.', 'ul. Luksusowa 16', 'https://archinea.pl/wp-content/uploads/2019/06/dominik-respondek-otwarte-studio-sztuka-projekt-wnetrz-apartamentu-penthouse-krakow-01.jpg', 'Poznań', 1),
        ('Mieszkanie nad Rzeką', 'mieszkanie-nad-rzeka', 'Mieszkanie z widokiem na rzekę.', 'ul. Rzeczna 17', 'https://storage.googleapis.com/bd-pl-01/buildings-v2/2560x1920/50773.jpg', 'Gdańsk', 1),
        ('Willa w Lesie', 'willa-w-lesie', 'Przestronna willa położona w lesie.', 'ul. Leśna 18', 'https://static.kluszewski.com.pl/files/image/0/7c3669b9a312a8dd78cc73d34768b30b5df74933/file-755-972x700r.jpg', 'Warszawa', 1),
        ('Apartament z Tarasem', 'apartament-z-tarasem', 'Apartament z dużym tarasem.', 'ul. Tarasowa 19', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/270624509.jpg?k=3661c52fb9851bd751fa3efa4d70f3f0c0931f105cdb23e7f3bc0e4f392e29cc&o=&hp=1', 'Wrocław', 1),
        ('Stylowy Apartament', 'stylowy-apartament', 'Apartament w stylu nowoczesnym.', 'ul. Stylowa 20', 'https://magdalenasidor.com/wp-content/uploads/2021/03/OPEN-SPACE-7-12.jpg', 'Poznań', 1),
        ('Klimatyczne Studio', 'klimatyczne-studio', 'Klimatyczne studio w cichej okolicy.', 'ul. Klimatyczna 21', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/480556076.jpg?k=52e595ac3f829a95295d64013776d87bca96adb38309507645903c06a4119936&o=&hp=1', 'Gdańsk', 1),
        ('Willa przy Parku', 'willa-przy-parku', 'Willa w sąsiedztwie parku.', 'ul. Parkowa 22', 'https://meteor-turystyka.pl/images/base/60/59250/472607_40.jpg', 'Warszawa', 1),
        ('Apartament w Wieżowcu', 'apartament-w-wiezowcu', 'Apartament na wysokim piętrze wieżowca.', 'ul. Wysoka 23', 'https://bi.im-g.pl/im/75/a2/14/z21635957AMP,Palac-cudow--czyli-blok-przy-ul--Otolinskiej-23.jpg', 'Wrocław', 1),
        ('Loft w Zabytkowej Kamienicy', 'loft-w-zabytkowej-kamienicy', 'Stylowy loft w zabytkowej kamienicy.', 'ul. Kamieniczna 24', 'https://www.designalive.pl/wp-content/uploads/2020/10/loftkolasinski_designalive-5.jpg', 'Poznań', 1),
        ('Rezydencja z Basenem', 'rezydencja-z-basenem', 'Luksusowa rezydencja z prywatnym basenem.', 'ul. Basenowa 25', 'https://managerplus.pl/wp-content/uploads/2020/10/Dom-z-basenem-Warszawa-Wilanow.jpg', 'Gdańsk', 1),
        ('Apartament w Centrum', 'apartament-w-centrum', 'Apartament w samym centrum miasta.', 'ul. Centralna 26', 'https://i.dobrzemieszkaj.pl/i/72/67/11/r3/1920/apartament-w-centrum-warszawy-zobacz-luksusowo-urzadzone-wnetrze.jpg', 'Warszawa', 1),
        ('Mieszkanie na Poddaszu', 'mieszkanie-na-poddaszu', 'Przytulne mieszkanie na poddaszu.', 'ul. Poddasze 27', 'https://galeria.bankier.pl/p/f/6/db5f6819267358-948-568-0-132-1556-933.jpg', 'Wrocław', 1),
        ('Nowoczesne Studio', 'nowoczesne-studio', 'Nowoczesne studio w centrum.', 'ul. Nowoczesna 28', 'https://img.shmbk.pl/rimgsph/134267_ab4c631d-d498-4bcb-9077-eae1db790840_crop_320_240_zdjecie-salon-styl-nowoczesny.jpg', 'Poznań', 1),
        ('Willa na Wsi', 'willa-na-wsi', 'Spokojna willa na wsi.', 'ul. Wiejska 29', 'https://lh3.googleusercontent.com/wer_Kwq4R51xMJIFX42Agrhs-WGKYHVWbNxr68DP22zq37lHt-xPQE8L8oC1XO4rAZLI9ujhGLA3WpRdc4l_5Ng=w1920-h1080-rj', 'Gdańsk', 1),
        ('Apartament na Wybrzeżu', 'apartament-na-wybrzezu', 'Apartament z widokiem na wybrzeże.', 'ul. Wybrzeże 30', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/358952238.jpg?k=a552107d9ad168e4d1e72b088d86d732463241d40a9fddba37eecdcda44afaf5&o=&hp=1', 'Warszawa', 1),
        ('Rezydencja w Górach', 'rezydencja-w-gorach', 'Luksusowa rezydencja w górach.', 'ul. Górska 31', 'https://panidyrektor.pl/wp-content/uploads/2017/02/luksusowa-rezydencja-w-g%C3%B3rach-g%C3%B3rska-rezydencja-nowoczesny-dom-w-g%C3%B3rach-design-inspiracje-dom-z-widokiem-67.jpg', 'Wrocław', 1),
        ('Kamienica z Historią', 'kamienica-z-historia', 'Zabytkowa kamienica z bogatą historią.', 'ul. Historyczna 32', 'https://uml.lodz.pl/files/public/_processed_/a/1/csm_Kamienica-pod-Gutenbergiem-Piotrkowska_fc6d356d13.jpg', 'Poznań', 1),
        ('Apartament przy Plaży', 'apartament-przy-plazy', 'Apartament z widokiem na plażę.', 'ul. Plażowa 33', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/153067963.jpg?k=5f36a6a2831434b19f19a7edc7226e06ad12f00377e895b7fa614b45ff0f667e&o=&hp=1', 'Gdańsk', 1),
        ('Loft z Antresolą', 'loft-z-antresola', 'Loft z antresolą w centrum miasta.', 'ul. Antresola 34', 'https://perler-design.pl/wp-content/uploads/2019/03/mieszkanie-antresola.jpg', 'Warszawa', 1),
        ('Rezydencja nad Jeziorem', 'rezydencja-nad-jeziorem', 'Rezydencja nad malowniczym jeziorem.', 'ul. Jeziorna 35', 'https://projekty-moderna.pl/wp-content/uploads/2020/05/moderna-jolanta-w%C5%82odarczyk-Dom-nad-jeziorem-W01-scaled.jpg', 'Poznań', 1),
        ('Mieszkanie nad Lasem', 'mieszkanie-nad-lasem', 'Mieszkanie z pięknym widokiem na las.', 'ul. Leśna 36', 'https://thumbs.rynekpierwotny.pl/3e79b87d:-DCaNJqVKVkO9maZPdtSBZc6YUA/414x286/offers/offer/15816/main_image/zbozowa_5db7ce.jpg', 'Gdańsk', 1),
        ('Dom na Skraju Miasta', 'dom-na-skraju-miasta', 'Przestronny dom położony na obrzeżach miasta.', 'ul. Skrajna 37', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/472553336.jpg?k=6bed97648a05f13a1f9f36c293f535a0b96314c8d09f3a602a6f87b4ab1fb6b4&o=&hp=1', 'Warszawa', 1),
        ('Apartament na Klifie', 'apartament-na-klifie', 'Apartament z widokiem na klif nad morzem.', 'ul. Klifowa 38', 'https://www.dopoznania.pl/assets/photo/upload/invest/1276/apartamenty_3-crop-1200-800.jpg', 'Gdańsk', 1),
        ('Stylowa Kamienica', 'stylowa-kamienica', 'Kamienica utrzymana w stylu z lat 20-tych.', 'ul. Stylowa 39', 'https://i.dobrzemieszkaj.pl/i/76/41/64/1920/10-najpiekniejszych-wnetrz-w-kamienicy-te-mieszkania-cie-zachwyca-1.jpg', 'Poznań', 1),
        ('Apartament w Starym Pałacu', 'apartament-w-starym-palacu', 'Elegancki apartament w odrestaurowanym pałacu.', 'ul. Pałacowa 40', 'https://e-turysta.pl/zdjecia/galeria-glowna/maxw772maxh580/92/Agroturystyka-W-Starym-Palacu-Bukowko-920133.jpg', 'Gdańsk', 1);
    `);

	db.exec(`
        INSERT INTO rentals (price, rating, place)
        VALUES
        (150.0, 4.2, 1),
        (200.0, 4.8, 2),
        (120.0, 4.0, 3),
        (180.0, 4.6, 4),
        (220.0, 4.9, 5),
        (130.0, 4.1, 6),
        (140.0, 4.3, 7),
        (250.0, 5.0, 8),
        (190.0, 4.7, 9),
        (160.0, 4.5, 10),
        (170.0, 4.4, 11),
        (110.0, 3.9, 12),
        (175.0, 4.6, 13),
        (155.0, 4.2, 14),
        (205.0, 4.8, 15),
        (145.0, 4.3, 16),
        (180.0, 4.6, 17),
        (165.0, 4.4, 18),
        (135.0, 4.1, 19),
        (195.0, 4.7, 20),
        (210.0, 4.8, 21),
        (125.0, 4.0, 22),
        (175.0, 4.5, 23),
        (190.0, 4.7, 24),
        (160.0, 4.4, 25),
        (150.0, 4.2, 26),
        (200.0, 4.8, 27),
        (140.0, 4.1, 28),
        (170.0, 4.5, 29),
        (120.0, 4.0, 30),
        (180.0, 4.6, 31),
        (220.0, 4.9, 32),
        (130.0, 4.1, 33),
        (140.0, 4.3, 34),
        (250.0, 5.0, 35),
        (190.0, 4.7, 36),
        (160.0, 4.5, 37),
        (170.0, 4.4, 38),
        (110.0, 3.9, 39),
        (175.0, 4.6, 40),
        (155.0, 4.2, 41),
        (205.0, 4.8, 42),
        (145.0, 4.3, 43),
        (180.0, 4.6, 44),
        (165.0, 4.4, 45),
        (135.0, 4.1, 46),
        (195.0, 4.7, 47),
        (210.0, 4.8, 48),
        (125.0, 4.0, 49),
        (175.0, 4.5, 50);
        `);

	db.exec(`
            INSERT INTO reviews (date, rating, comment, place, user)
            VALUES
            ('2023-01-15', 4.5, 'Great place, very clean!', 1, 1),
            ('2023-02-20', 4.0, 'Good experience overall.', 1, 2),
            ('2023-03-10', 3.5, 'Could be better.', 1, 3),
            ('2023-01-18', 5.0, 'Absolutely perfect!', 2, 1),
            ('2023-02-22', 4.8, 'Loved it!', 2, 2),
            ('2023-03-12', 4.7, 'Very comfortable stay.', 2, 3),
            ('2023-01-20', 4.0, 'Nice place.', 3, 1),
            ('2023-02-24', 3.8, 'Decent but a bit noisy.', 3, 2),
            ('2023-03-14', 3.6, 'Not bad.', 3, 3),
            ('2023-01-22', 4.6, 'Wonderful experience!', 4, 1),
            ('2023-02-26', 4.3, 'Really enjoyed my stay.', 4, 2),
            ('2023-03-16', 4.2, 'Good value for money.', 4, 3),
            ('2023-01-25', 5.0, 'Exceptional!', 5, 1),
            ('2023-02-28', 4.9, 'Highly recommend.', 5, 2),
            ('2023-03-18', 4.8, 'Fantastic place.', 5, 3),
            ('2023-01-28', 3.5, 'Average experience.', 6, 1),
            ('2023-03-01', 3.9, 'Good but could improve.', 6, 2),
            ('2023-03-20', 3.7, 'Satisfactory stay.', 6, 3),
            ('2023-01-30', 4.2, 'Comfortable and clean.', 7, 1),
            ('2023-03-03', 4.1, 'Nice but a bit small.', 7, 2),
            ('2023-03-22', 4.0, 'Pretty good overall.', 7, 3),
            ('2023-02-02', 5.0, 'Amazing experience!', 8, 1),
            ('2023-03-05', 4.9, 'Superb stay.', 8, 2),
            ('2023-03-24', 4.8, 'Highly recommend this place.', 8, 3),
            ('2023-02-05', 4.0, 'Good for the price.', 9, 1),
            ('2023-03-08', 3.8, 'Decent but noisy.', 9, 2),
            ('2023-03-26', 3.6, 'Could be better.', 9, 3),
            ('2023-02-08', 4.5, 'Very nice place.', 10, 1),
            ('2023-03-10', 4.3, 'Comfortable stay.', 10, 2),
            ('2023-03-28', 4.2, 'Good value.', 10, 3),
            ('2023-02-11', 4.8, 'Fantastic experience!', 11, 1),
            ('2023-03-13', 4.6, 'Really enjoyed it.', 11, 2),
            ('2023-03-30', 4.5, 'Very nice and clean.', 11, 3),
            ('2023-02-14', 3.5, 'Just okay.', 12, 1),
            ('2023-03-15', 3.9, 'Good but noisy.', 12, 2),
            ('2023-04-01', 3.7, 'Average stay.', 12, 3),
            ('2023-02-17', 4.2, 'Comfortable and clean.', 13, 1),
            ('2023-03-18', 4.1, 'Nice place.', 13, 2),
            ('2023-04-03', 4.0, 'Good value.', 13, 3),
            ('2023-02-20', 5.0, 'Excellent!', 14, 1),
            ('2023-03-21', 4.9, 'Loved it!', 14, 2),
            ('2023-04-05', 4.8, 'Highly recommend.', 14, 3),
            ('2023-02-23', 3.5, 'Not great.', 15, 1),
            ('2023-03-24', 3.9, 'Could be better.', 15, 2),
            ('2023-04-07', 3.7, 'Average.', 15, 3),
            ('2023-02-26', 4.2, 'Nice and clean.', 16, 1),
            ('2023-03-27', 4.1, 'Comfortable.', 16, 2),
            ('2023-04-09', 4.0, 'Pretty good.', 16, 3),
            ('2023-03-01', 4.8, 'Wonderful stay!', 17, 1),
            ('2023-04-01', 4.7, 'Really enjoyed it.', 17, 2),
            ('2023-04-10', 4.6, 'Highly recommend.', 17, 3),
            ('2023-03-04', 3.6, 'Just okay.', 18, 1),
            ('2023-04-03', 3.8, 'Decent but could be better.', 18, 2),
            ('2023-04-12', 3.7, 'Average.', 18, 3),
            ('2023-03-07', 4.5, 'Nice and clean.', 19, 1),
            ('2023-04-06', 4.3, 'Comfortable stay.', 19, 2),
            ('2023-04-15', 4.2, 'Good value.', 19, 3),
            ('2023-03-10', 5.0, 'Excellent!', 20, 1),
            ('2023-04-09', 4.9, 'Loved it!', 20, 2),
            ('2023-04-17', 4.8, 'Highly recommend.', 20, 3),
            ('2023-03-13', 3.5, 'Not great.', 21, 1),
            ('2023-04-12', 3.9, 'Could be better.', 21, 2),
            ('2023-04-19', 3.7, 'Average.', 21, 3),
            ('2023-03-16', 4.2, 'Nice and clean.', 22, 1),
            ('2023-04-15', 4.1, 'Comfortable.', 22, 2),
            ('2023-04-21', 4.0, 'Pretty good.', 22, 3),
            ('2023-03-19', 4.5, 'Wonderful experience!', 23, 1),
            ('2023-04-18', 4.4, 'Really enjoyed my stay.', 23, 2),
            ('2023-04-23', 4.3, 'Good value for money.', 23, 3),
            ('2023-03-22', 3.8, 'Average experience.', 24, 1),
            ('2023-04-21', 3.7, 'Good but noisy.', 24, 2),
            ('2023-04-25', 3.6, 'Just okay.', 24, 3),
            ('2023-03-25', 4.9, 'Exceptional!', 25, 1),
            ('2023-04-24', 4.8, 'Highly recommend.', 25, 2),
            ('2023-04-27', 4.7, 'Fantastic place.', 25, 3),
            ('2023-03-28', 3.5, 'Not great.', 26, 1),
            ('2023-04-27', 3.4, 'Could be better.', 26, 2),
            ('2023-04-29', 3.3, 'Average.', 26, 3),
            ('2023-03-31', 4.2, 'Nice and clean.', 27, 1),
            ('2023-04-30', 4.1, 'Comfortable.', 27, 2),
            ('2023-05-02', 4.0, 'Good value.', 27, 3),
            ('2023-04-02', 5.0, 'Amazing!', 28, 1),
            ('2023-05-01', 4.9, 'Fantastic stay.', 28, 2),
            ('2023-05-04', 4.8, 'Loved it!', 28, 3),
            ('2023-04-05', 3.5, 'Decent but noisy.', 29, 1),
            ('2023-05-04', 3.4, 'Average.', 29, 2),
            ('2023-05-07', 3.3, 'Could be better.', 29, 3),
            ('2023-04-08', 4.3, 'Really good.', 30, 1),
            ('2023-05-07', 4.2, 'Nice place.', 30, 2),
            ('2023-05-09', 4.1, 'Comfortable stay.', 30, 3),
            ('2023-04-11', 4.9, 'Exceptional!', 31, 1),
            ('2023-05-10', 4.8, 'Highly recommend.', 31, 2),
            ('2023-05-12', 4.7, 'Fantastic place.', 31, 3),
            ('2023-04-14', 3.5, 'Average experience.', 32, 1),
            ('2023-05-13', 3.4, 'Good but noisy.', 32, 2),
            ('2023-05-15', 3.3, 'Could be better.', 32, 3),
            ('2023-04-17', 4.5, 'Very nice.', 33, 1),
            ('2023-05-16', 4.4, 'Comfortable.', 33, 2),
            ('2023-05-18', 4.3, 'Good value.', 33, 3),
            ('2023-04-20', 5.0, 'Amazing experience!', 34, 1),
            ('2023-05-19', 4.9, 'Highly recommend.', 34, 2),
            ('2023-05-21', 4.8, 'Fantastic place.', 34, 3),
            ('2023-04-23', 3.5, 'Average stay.', 35, 1),
            ('2023-05-22', 3.4, 'Decent but noisy.', 35, 2),
            ('2023-05-24', 3.3, 'Just okay.', 35, 3),
            ('2023-04-26', 4.2, 'Nice and clean.', 36, 1),
            ('2023-05-25', 4.1, 'Comfortable.', 36, 2),
            ('2023-05-27', 4.0, 'Good value.', 36, 3),
            ('2023-04-29', 5.0, 'Wonderful!', 37, 1),
            ('2023-05-28', 4.9, 'Loved it!', 37, 2),
            ('2023-05-30', 4.8, 'Highly recommend.', 37, 3),
            ('2023-05-02', 3.5, 'Not great.', 38, 1),
            ('2023-06-01', 3.4, 'Could be better.', 38, 2),
            ('2023-06-03', 3.3, 'Average.', 38, 3),
            ('2023-05-05', 4.3, 'Very nice.', 39, 1),
            ('2023-06-04', 4.2, 'Comfortable.', 39, 2),
            ('2023-06-06', 4.1, 'Good value.', 39, 3),
            ('2023-05-08', 4.8, 'Exceptional!', 40, 1),
            ('2023-06-07', 4.7, 'Highly recommend.', 40, 2),
            ('2023-06-09', 4.6, 'Fantastic place.', 40, 3),
            ('2023-05-11', 3.6, 'Just okay.', 41, 1),
            ('2023-06-10', 3.8, 'Could be better.', 41, 2),
            ('2023-06-12', 3.7, 'Average.', 41, 3),
            ('2023-05-14', 4.2, 'Nice and clean.', 42, 1),
            ('2023-06-13', 4.1, 'Comfortable stay.', 42, 2),
            ('2023-06-15', 4.0, 'Good value.', 42, 3),
            ('2023-05-17', 5.0, 'Wonderful experience!', 43, 1),
            ('2023-06-16', 4.9, 'Really enjoyed my stay.', 43, 2),
            ('2023-06-18', 4.8, 'Highly recommend.', 43, 3),
            ('2023-05-20', 3.5, 'Decent but noisy.', 44, 1),
            ('2023-06-19', 3.4, 'Average stay.', 44, 2),
            ('2023-06-21', 3.3, 'Could be better.', 44, 3),
            ('2023-05-23', 4.5, 'Nice and clean.', 45, 1),
            ('2023-06-22', 4.4, 'Comfortable.', 45, 2),
            ('2023-06-24', 4.3, 'Good value.', 45, 3),
            ('2023-05-26', 5.0, 'Amazing!', 46, 1),
            ('2023-06-25', 4.9, 'Highly recommend.', 46, 2),
            ('2023-06-27', 4.8, 'Fantastic place.', 46, 3),
            ('2023-05-29', 3.5, 'Average experience.', 47, 1),
            ('2023-06-28', 3.4, 'Good but noisy.', 47, 2),
            ('2023-06-30', 3.3, 'Just okay.', 47, 3),
            ('2023-06-01', 4.2, 'Nice and clean.', 48, 1),
            ('2023-07-01', 4.1, 'Comfortable.', 48, 2),
            ('2023-07-03', 4.0, 'Pretty good.', 48, 3),
            ('2023-06-04', 4.8, 'Wonderful stay!', 49, 1),
            ('2023-07-04', 4.7, 'Really enjoyed it.', 49, 2),
            ('2023-07-06', 4.6, 'Highly recommend.', 49, 3),
            ('2023-06-07', 3.6, 'Just okay.', 50, 1),
            ('2023-07-07', 3.8, 'Decent but could be better.', 50, 2),
            ('2023-07-09', 3.7, 'Average.', 50, 3);
        `);

	db.exec(`
        INSERT INTO stays (place, user, date_start, date_end)
        VALUES
        (1, 1, '2023-01-01', '2023-01-05'),
        (2, 2, '2023-01-06', '2023-01-10'),
        (3, 3, '2023-01-11', '2023-01-15'),
        (4, 1, '2023-01-16', '2023-01-20'),
        (5, 2, '2023-01-21', '2023-01-25'),
        (6, 3, '2023-01-26', '2023-01-30'),
        (7, 1, '2023-02-01', '2023-02-05'),
        (8, 2, '2023-02-06', '2023-02-10'),
        (9, 3, '2023-02-11', '2023-02-15'),
        (10, 1, '2023-02-16', '2023-02-20'),
        (1, 2, '2023-02-21', '2023-02-25'),
        (2, 3, '2023-02-26', '2023-03-02'),
        (3, 1, '2023-03-03', '2023-03-07'),
        (4, 2, '2023-03-08', '2023-03-12'),
        (5, 3, '2023-03-13', '2023-03-17'),
        (6, 1, '2023-03-18', '2023-03-22'),
        (7, 2, '2023-03-23', '2023-03-27'),
        (8, 3, '2023-03-28', '2023-04-01'),
        (9, 1, '2023-04-02', '2023-04-06'),
        (10, 2, '2023-04-07', '2023-04-11');
        `);
}

export default db;
