# Programrendszerek fejlesztése projektmunka
#### 2025. tavasz
#### Martina Péter - N6HO3C
#### Mobil webáruház

# Telepítés és előkészületek

## Node.js és NPM telepíése

Töltsük le a Node.js telepítőt: https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi

A telepítés során ügyeljünk arra, hogy az "npm package manager" komponens is ki legyen választva. Az "Add to PATH" opció megkönnyíti a későbbi munkát.

Bár előreláthatóan nem használunk majd "natív modulokat", érdemes a telepítés során engedélyezni az ehhez szükséges eszközök automatikus telepítését, mint például a Chocolatey.

A telepítés után ellenőrizzük a telepítés eredményességét a következő parancsokkal:

```
node -v
npm -v
```

## MongoDB telepítése

Töltsük le a MongoDB telepítőt: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.5-signed.msi

A MongoDB Community Server-t telepítjük és a telepítés során minden beállítást alapértelmezés szerint hagyva végezzük el a telepítést. Ezzel többek között telepítésre kerül a MongoDB Compass alkalmazás, ami segítséget nyújt az adatbázis áttekintéséhez.

Alapértelmezés szerint szolgáltatásként telepítettük fel az adatbázisszervert, így már fut és rendszerindításkor automatikusan indul.

## Angular CLI telepítése globálisan az NPM használatával
Az Angular projekt futtatásához szükséges az Angular CLI telepítése. Ez a következő parancs segítségével történik:

```
npm install -g @angular/cli
```

## NPM függőségek telepítése a server oldalán
A projekten belül lépjünk a server könyvtárába és futtassuk az

```
cd server
npm update
```

## NPM függőségek telepítése a kliens oldalán
```
cd client
npm update
```

## A szerver futtatása
A szerver futtatása a következő utasítással történik:

```
node server.js
```

## A kliens futtatása
A kliens futtatása a következő utasítással történik:

```
ng serve --open
```

A kliens webalkalmazás a

```
http://localhost:4200/
```

címen elérhető és használható.