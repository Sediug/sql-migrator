# SQL Migrator
Electron application which generate an SQL script (and allow you to apply it directly) for replacing a set of words (for other words) in multiple schemas / tables whithing a mysql database.

Used technologies:
- SQL
- MySQL
- Node.js
- Electron
- React
- ES6


## How to start

Run:
```
npm install
```

## Launching SQL Migrator

Run:
```
npm start
```

## Packaging SQL Migrator

Run:
```
npm run package
```

Yes, it really is that simple. If you want to specify platform / arch, use the --platform=<platform> and --arch=<arch> arguments.


## Generating a distributable

Run:
```
npm run make
```

This will generate platform specific distributables (installers, distribution packages, etc.) for you. By default, you can only generate distributables for your current platform. If you want to specify platform / arch, use the --platform=<platform> and --arch=<arch> arguments, but please note that some distributables are not available to be built on anything but the platform that is targeted. For example, appx (Windows Store) distributables can only be built on Windows.
  

## Publishing
Run:
```
npm run publish
```

Contributions
------------

Use [GitHub issues](https://github.com/Sediug/sql-migrator/issues) for requests.

Changelog
---------

Changes are tracked as [GitHub releases](https://github.com/Sediug/sql-migrator/releases).
