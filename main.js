/**
 * https://github.com/eviratec/nautilus-replacement
 * Copyright (c) 2017 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
"use strict";

(function (angular) {

  var fs = require("fs");
  var path = require("path");
  var child_process = require("child_process");

  var app = angular.module("nautilusReplacement", [
    "ngAnimate",
    "ngAria",
    "ngMaterial",
    "ngMessages",
  ]);

  app.config(function($mdThemingProvider) {

    let toolbarPalette = $mdThemingProvider.extendPalette('light-blue', {
      '500': '#0091ea',
      'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.definePalette('toolbarPalette', toolbarPalette);

    $mdThemingProvider.theme('toolbar')
      .primaryPalette('toolbarPalette');

    // Get the current window
    var win = nw.Window.get();
    win.resizeTo(1000, 600);

  });

  app.factory("FileSystemObject", FileSystemObjectFactory);

  FileSystemObjectFactory.$inject = [];
  function FileSystemObjectFactory () {

    class FileSystemObject {
      constructor (parentUri, info) {
        this.parentUri = parentUri;
        this.info = info;
      }
      get uri () {
        return this.parentUri + "/" + this.basename;
      }
      get basename () {
        return this.info.split(/\s+/g).slice(-1)[0];
      }
      get isHidden () {
        let baseStartsWithDot = "." === this.info.split(/\s/g).slice(-1)[0][0];
        return baseStartsWithDot;
      }
    }

    return FileSystemObject;

  }

  app.factory("File", FileFactory);

  FileFactory.$inject = ["FileSystemObject"];
  function FileFactory (FileSystemObject) {

    class File extends FileSystemObject {
      constructor (parentUri, info) {
        super(...arguments);
      }
    }

    return File;

  }

  app.factory("Directory", DirectoryFactory);

  DirectoryFactory.$inject = ["FileSystemObject"];
  function DirectoryFactory (FileSystemObject) {

    class Directory extends FileSystemObject {
      constructor (parentUri, info) {
        super(...arguments);
      }
    }

    return Directory;

  }

  app.factory("NavigationList", NavigationListFactory);

  NavigationListFactory.$inject = ["Directory", "File"];
  function NavigationListFactory (  Directory,   File) {

    class NavigationList {
      constructor (parentUri, contents) {
        this._contents = contents || [];
        this.contents = this._contents.slice(0);
        this.contents = this.contents.map(item => {
          if ("d" === item.substr(0, 1)) {
            return new Directory(parentUri, item);
          }
          return new File(parentUri, item);
        });
      }
    }

    return NavigationList;

  }

  app.controller("WindowController", WindowController);

  WindowController.$inject = ["$timeout", "NavigationList", "Directory"];
  function WindowController (  $timeout,   NavigationList,   Directory) {

    var $w = this;

    this.showHidden = false;

    this.info = {
      nodeVersion: process.version,
    };

    this.locationHistory = [];

    this.location = {
      str: "/",
      path: "",
      dirname: "",
      contents: [],
    };

    this.favourites = {
      contents: [
        new Directory(process.env.HOME, "d Documents"),
        new Directory(process.env.HOME, "d Downloads"),
        new Directory(process.env.HOME, "d Music"),
        new Directory(process.env.HOME, "d Pictures"),
        new Directory(process.env.HOME, "d Projects"),
        new Directory(process.env.HOME, "d Videos"),
      ],
    };

    this.handleClick = function ($item, $event) {
      let pathStr = path.resolve($item.uri);
      if (pathStr !== $w.locationHistory[0]) {
        $w.locationHistory.unshift(pathStr);
      }
      setLoc(pathStr);
      reloadContents();
    };

    this.openMenu = function ($mdMenu, $event) {
      originatorEv = $event;
      $mdMenu.open($event);
    };

    setLoc(process.env.HOME);
    reloadContents();

    function reloadContents () {
      var contents;
      $w.location.contents.splice(0);
      readdir(currentPath())
        .then((r) => {
          $timeout(function () {
            r.contents.forEach(item => {
              $w.location.contents.push(item);
            });
          });
        });
    }

    function readdir (path) {
      // return fs.readdirSync(path);
      return new Promise((resolve, reject) => {
        child_process.exec(`ls -alh`, {cwd: path}, function (err, res) {
          resolve(new NavigationList(path, res.split(/\n/g).slice(2)));
        });
      });
    }

    function currentPath () {
      return $w.location.str;
    }

    function setLoc (uri) {
      $w.location.str = uri;
      $w.location.path = path.parse(uri).dir;
      $w.location.dirname = path.parse(uri).base;
    }

  }

})(angular);