**Programrendszerek fejlesztése projektmunka**
*2025\. tavasz*

A gyakorlat teljesítéséhez szükséges egy projektmunka megvalósítása, amely egy teljes web-rendszert mutat be. A rendszernek a MEAN (MongoDB, ExpressJS, Angular 2+, NodeJS) technológiai stack-ben kell megvalósulnia TypeScript alapon. A projektmunka három részből áll össze: egy NoSQL adatbázisból, egy REST API-t biztosító szerverből és egy web-alkalmazásból, amelyek együtt egy teljes web-rendszert alkotnak. A hallgatóknak önállóan kell dolgozniuk a projekten, nem csapatmunka\!

A szervernek REST API-kat kell biztosítania, amelyek felelősek az alapvető CRUD (Create-Read-Update-Delete) műveletekért. Kommunikálnia kell egy MongoDB példánnyal, feldolgoznia a klienstől érkező kéréseket és lekérdezéseket kell indítania az adatbázis felé. A projektnek a CRUD műveleteknél a hitelesítést (csak autentikált felhasználó hajthatja végre) és session-kezelést támogatnia kell. Új felhasználók kezelése érdekében a regisztráció megvalósítása is szükséges.

A web-alkalmazást az Angular 2+ keretrendszer használatával kell implementálni. Egy egyszerű web-alkalmazásnak kell lennie, amely HTTP kéréseket tud indítani REST-en a szerver felé. A web-alkalmazásnak végre kell hajtania az alapvető CRUD műveleteket. A végrehajtott műveletek alapján a szerver visszaválaszol a kliensnek, ami megjeleníti az eredményeket a böngészőben.

Az adatbázisnak egy MongoDB példánynak kell lennie, amely adatokat tud szolgáltatni a szerveren keresztül a kliensnek. A MongoDB lehet helyben host-olt, konténerizál, de akár MongoDB Atlas használata is megengedett. Az adatmodellnek tartalmaznia kell legalább 4 kollekciót és azok megfelelő kapcsolatkezelését. Az adatbázisnak alapértelmezetten tartalmaznia kell néhány demó adatot, amely megjeleníthető a web-alkalmazásban.

A projektet fel kell tölteni a hallgató saját nyilvános GitHub repository-jába és a publikus URL-t fel kell tölteni a CooSpace dedikált “Feladat” színterébe. Ezenkívül a hallgatóknak készíteniük kell egy Readme.md fájlt, amely segít a rendszer különböző elemeinek telepítésében és futtatásában.

Az elkészült projektmunkát be kell mutatni, ezt egy rögzített videó formájában kell megtenni, amely max. 5 perc hosszúságú. A videóban nem kell a forráskódot bemutatni, kizárólag a megvalósult funkciókat kell demózni a saját gépen futó példányon keresztül.

**Projektmunka jelentkezés határideje:** 2025\. március 31., 23:59 (CooSpace projektmunka jelentkezés)  
**Beadási határidő:** 2025\. május 18\. (vasárnap) 23:59  
**Beadás:** forráskód egy publikus GitHub repository-ban, a repo URL-je pedig a CooSpace-en beküldve a létrehozott “Feladat” színtérben  
**Bemutató:** a hallgatók a projektmunkát egy videó (screencast+hang) formájában mutatják be (ez megosztható egy publikus Google Drive fájlként is)

Értékelés:  
\- adatbázis: max. 10 pont  
\- szerver: max. 15 pont  
\- web-alkalmazás: max. 15 pont

Témakör:

**Mobil webáruház:**  
Szerepkörök: admin, vásárlók és vendégek.  
A webáruház mobil eszközöket árul. Az admin felhasználó új termékeket adhat hozzá a webáruházhoz, beállíthatja az árakat és az elérhető darabszámokat. A vendég felhasználók meglátogathatják a webáruházat és ellenőrizhetik az árakat, de nincs kosaruk és jogosultságuk vásárolni. A regisztrált felhasználók a vásárlók, akik termékeket tehetnek a kosarukba és megvásárolhatják azokat.