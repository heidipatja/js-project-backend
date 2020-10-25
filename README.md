[![Build Status](https://travis-ci.org/heidipatja/js-project-backend.svg?branch=main)](https://travis-ci.org/heidipatja/js-project-backend)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/heidipatja/js-project-backend/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/heidipatja/js-project-backend/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/heidipatja/js-project-backend/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/heidipatja/js-project-backend/?branch=main)

## Available Scripts

### `npm install`

Install all dependencies.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8303](http://localhost:8303) to view it in the browser.

### `npm test`

Resets db and runs tests. Coverage reports are created under /coverage.

## .env file

Add an .env file containing your personal JWT_SECRET in the root folder.<br />
Example: **JWT_SECRET=yOur-sUPer-C0mpl1cat3d-S3cr3T!**


## Redovisning krav 1: Backend

För att bygga upp grundläggande funktionalitet för servern används Node.js och Express. Fördelen med Express är att det går snabbt att komma igång och känns stabilt. Det känns också smidigt att använda samma språk i frontend och backend.

För att spara information om användarna har jag använt NoSQL-databasen MongoDB. Det underlättar kopplingen till objekten som ska köpas och säljas, eftersom de kan kopplas direkt till användaren. Vi behöver inte skapa en massa stora tabeller som sedan kanske inte behövs för alla användare, utan har lite flexibilitet i hur vi lagrar vår data när vi utvecklar appen. När vi jobbade med MongoDB under kursen stötte jag ofta på Mongoose när jag googlade, vilket gjorde att jag blev nyfiken på vad man kunde använda det till och varför det verkade vara en så populär kombination. Under projektet testade jag att använda Mongoose till att skapa ett schema över användardatabasen. Med hjälp av schemat kunde jag se till att alla användare skapades med samma grundstruktur och fick en depå kopplad till sig. Valutorna ligger i en array kopplad till användaren, så det är enkelt att bygga på med fler valutor eller koppla på annan data på liknande sätt. Min erfarenhet av både MongoDB och Mongoose är begränsad än så länge och att slänga in Mongoose i projektfasen var lite av ett experiment, men jag tyckte att kombinationen gjorde att man lätt kunde visualisera datastrukturen och se till att grundläggande data lagrades i rätt form och struktur, men utan att tappa flexibiliteten som man får med MongoDB jämfört med en traditionell relationsdatabas. Databasen kan återställas genom att köra node db/reset.js.

För autentisering används JSON Web Tokens och för att kryptera lösenord används bcrypt. Tack vare bcrypt behöver vi inte lagra lösenord i klartext och vi kan göra lösenorden svårare att knäcka. Dotenv används för att ladda in env-variabler, i detta fall JWT_SECRET. Fördelen är att man inte behöver lagra dem i koden eller skriva in dem i terminalen varje gång. Andra användare kan istället skapa egna filer med sina personliga variabler. För att kunna få mer utförliga loggar används morgan. CORS används för att det ska vara möjligt för andra klienter att hämta information via API:t.

## Redovisning krav 4: Tester backend

Innan testet körs db/reset.js som tömmer databasen och skapar en testanvändare. Optimalt borde jag förstås ha skapat en testdatabas för att slippa återställa den riktiga databasen, men det var inget jag hade något behov av under projektet.

För testningen har jag använt Mocha och Chai, eftersom de är enkla att implementera och använda, fungerar väl ihop och passar in i min JavaScript-miljö. Kodtäckningen visuliseras på ett bra sätt med hjälp av Istanbul och gör det enkelt att se vilka delar som inte täcks in.

CI-kedjan skapas med hjälp av byggverktyget Travis och för att få data om kodtäckning och kodkvalitet används Scrutinizer. Dessa verktyg är framför allt smidiga eftersom det finns en koppling mot GitHub, vilket gör att de kan hämta all kod, bygga upp miljön och köra testerna automatiskt så fort det sker en commit. Man kan även få notiser ifall testet plötsligt inte gått igenom eller om det har skett någon förändring, vilket är användbart om man är flera i samma projekt och vill ha översikt eller bara vill automatisera testprocessen och få lite analyser på köpet.

Jag fick 10.00 i kodkvalitet, vilket jag är nöjd med. Kodtäckningen är 95%, vilket inte var särskilt svårt att uppnå. Koden består i stort sett bara av några routes och databasändringar, vilket gör att testerna blir ganska lika och är lätta att reproducera. Jag har fokuserat på integrationstester, vilket täcker in nästan all kod, men man hade kunnat utveckla det genom att lägga på mer djupgående tester för att se att de uppdateringar man gör mot databasen blir korrekta och inte bara går igenom. Nu är det stort fokus på flödet och att man får tillbaka rätt statuskoder och meddelanden. Den delen av koden som har lägst kodtäckning är kopplad till databas-uppkopplingen, eftersom jag inte har testat vad som händer om vi t.ex. inte kan nå databasen.
