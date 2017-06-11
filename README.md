# Nautilus Replacement

For [Ubuntu](https://www.ubuntu.com/).

## Screenshot

![alt text](https://github.com/eviratec/nautilus-replacement/raw/master/screenshot.png "Screenshot")

## User requirements

- [npm](https://www.npmjs.com)

## User setup

Install via NPM
```shell
$ npm install -g nautilus-replacement
$ nautilus-replacement
```

## Dev requirements

- [Node.js](https://www.nodejs.org) v8.0.0
- [nw.js](https://nwjs.io/) [v0.23.1-SDK](https://nwjs.io/downloads/)

## Dev setup

1. Obtain [nw.js](https://nwjs.io/) [v0.23.1-SDK](https://dl.nwjs.io/v0.23.1/nwjs-sdk-v0.23.1-linux-x64.tar.gz)
```shell
$ cd ~/Downloads
$ wget -nc -O - https://dl.nwjs.io/v0.23.1/nwjs-sdk-v0.23.1-linux-x64.tar.gz | tar xvz
```
2. Fetch the project source
```shell
$ cd ~/Downloads
$ wget -nc -O - https://github.com/eviratec/nautilus-replacement/archive/master.tar.gz | tar xvz
$ cd nautilus-replacement-master
```
3. Install NPM dependencies
```shell
$ npm install
```
4. Install Bower dependencies
```shell
$ ./node_modules/bower/bin/bower install
```
5. Fire it up!
```shell
$ ~/Downloads/nwjs-sdk-v0.23.1-linux-x64/nw .
```

## Dev tips and documentation

- Official nw.js documentation: [docs.nwjs.io](http://docs.nwjs.io/en/latest/)

## License

By [Eviratec Software](https://www.eviratec.com.au)

```
Copyright (c) 2017 Callan Peter Milne

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
