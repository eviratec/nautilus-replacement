# Nautilus Replacement

For [Ubuntu](https://www.ubuntu.com/).

Using [Angular.js](https://angularjs.org/), [ACE Editor](https://ace.c9.io/), and [NW.js](https://nwjs.io/).

## Getting started (for users)

### Requirements

- [Ubuntu](https://www.ubuntu.com)
- [npm](https://www.npmjs.com)

### Install it

Install via NPM
```shell
$ npm install -g nautilus-replacement
```

### Start it

```shell
$ nautilus-replacement
```

## Screenshot

![alt text](https://github.com/eviratec/nautilus-replacement/raw/master/screenshot.png "Screenshot")

## Development

### Requirements

- [Node.js](https://www.nodejs.org) v8.0.0
- [nw.js](https://nwjs.io/) [v0.23.1-SDK](https://nwjs.io/downloads/)

### Set-up

1. Obtain [nw.js](https://nwjs.io/) v0.23.1-**SDK**
  ```shell
  $ cd ~/Downloads
  $ wget -nc -O - https://dl.nwjs.io/v0.23.1/nwjs-sdk-v0.23.1-linux-x64.tar.gz | tar xvz
  ```
2. Fetch the *nautilus-replacement* (this) project development source
  ```shell
  $ cd ~/Downloads
  $ wget -nc -O - https://github.com/eviratec/nautilus-replacement/archive/development.tar.gz | tar xvz
  $ cd nautilus-replacement-development
  ```
3. Install NPM dependencies
  ```shell
  $ npm install
  ```
4. Fire it up!
  ```shell
  $ ~/Downloads/nwjs-sdk-v0.23.1-linux-x64/nw .
  ```

### Tips and documentation

- Official [Angular.js v1.x](https://angularjs.org/) documentation:
  - [AngularJS: API Reference](https://docs.angularjs.org/api)
  - [AngularJS: Developer Guide](https://docs.angularjs.org/guide)
  - [AngularJS Material: Latest](https://material.angularjs.org/latest/)
- Official [ace editor](https://ace.c9.io/) documentation:
  - [Ace: API Reference](https://ace.c9.io/#howto=&nav=api)
  - [Ace: How-To Guide](https://ace.c9.io/#howto=&nav=howto)
  - [Ace: Syntax Highlighters](https://ace.c9.io/#howto=&nav=higlighter)
- Official [nw.js](https://nwjs.io/) documentation:
  - [nw.js: Latest](http://docs.nwjs.io/en/latest/)

## License

By [Eviratec Software](https://www.eviratec.com.au)

```
Copyright (c) 2017 - 2018 Callan Peter Milne

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
