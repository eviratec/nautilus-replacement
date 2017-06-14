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
    "ngFilesizeFilter",
    "ui.ace",
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
    win.icon = path.resolve("./icon.png");
    win.resizeTo(1000, 600);

  });

  app.factory("nwWindow", nwWindowFactory);

  nwWindowFactory.$inject = [];
  function nwWindowFactory () {
    return nw.Window;
  }

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
      get size () {
        return this.info.split(/\s+/g)[4];
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
      static is (obj) {
        return obj instanceof File;
      }
      constructor (parentUri, info) {
        super(...arguments);
        this.type = "application/octet-stream";
      }
    }

    return File;

  }

  app.factory("Directory", DirectoryFactory);

  DirectoryFactory.$inject = ["FileSystemObject"];
  function DirectoryFactory (FileSystemObject) {

    class Directory extends FileSystemObject {
      static is (obj) {
        return obj instanceof Directory;
      }
      constructor (parentUri, info) {
        super(...arguments);
        this.type = "_DIRECTORY";
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

  WindowController.$inject = ["$timeout", "$mdDialog", "NavigationList", "Directory", "nwWindow"];
  function WindowController (  $timeout,   $mdDialog,   NavigationList,   Directory,   nwWindow) {

    var $w = this;

    this.showHidden = false;
    this.fabSpeedDialOpen = false;
    this.tooltipVisible = true;
    this.showEditor = false;
    this.editorContent = "";

    this.aceEditor = null;
    this.aceSession = null;

    this.aceConfig = {
      showGutter: true,
      onLoad: function aceLoaded (_editor) {

        let _session;
        let _renderer;

        $w.aceEditor = _editor;
        _session = $w.aceSession = _editor.getSession();
        _renderer = _editor.renderer;

        $w.aceEditor.setValue($w.editorContent);
        _editor.gotoLine(1);

        if (currentPath().slice(-1)[0].match(/\.js$/)) {
          _session.setMode("ace/mode/javascript");
        }

        // Options
        // _editor.setReadOnly(true);
        _session.setUndoManager(new ace.UndoManager());
        _session.setTabSize(2);
        _renderer.setShowGutter(true);

        // Events
        _editor.on("changeSession", function(){

        });
        _session.on("change", function(){

        });
      },
    };



    this.goHome = function ($event) {
      openDir(process.env.HOME);
    };

    this.closeWindow = function ($event) {
      nwWindow.get().close();
    };

    this.newWindow = function ($event) {
      nwWindow.open("app.html", {}, newWindow => { });
    };

    this.showAbout = function ($event) {
      nwWindow.open("about.html", {}, newWindow => { });
    };

    this.showSettings = function ($event) {
      nwWindow.open("settings.html", {}, newWindow => { });
    };

    this.showSearch = function ($event) {
      nwWindow.open("search.html", {}, newWindow => { });
    };

    this.info = {
      nodeVersion: process.version,
    };

    this.locationHistory = [];

    this.location = {
      str: "/",
      path: "",
      dirname: "",
      contents: [],
      uriParts: [],
    };

    this.favourites = {
      contents: [
        new Directory(process.env.HOME, "d Desktop"),
        new Directory(process.env.HOME, "d Documents"),
        new Directory(process.env.HOME, "d Downloads"),
        new Directory(process.env.HOME, "d Music"),
        new Directory(process.env.HOME, "d Pictures"),
        new Directory(process.env.HOME, "d Projects"),
        new Directory(process.env.HOME, "d Videos"),
      ],
    };

    this.customItemIcon = function (item) {
      if (!itemHasIconAssignment(item.uri)) {
        return "";
      }

      return itemIconAssignment(item.uri);
    }

    this.hasCustomIcon = function (item) {
      if (this.isDirectory(item)) {
        return false;
      }

      return itemHasIconAssignment(item.uri);
    }

    this.onClickCreateFile = function ($ev) {
      var confirm = $mdDialog.prompt()
        .title('Create New File')
        .placeholder('File name')
        .ariaLabel('File name')
        .initialValue('New File')
        .targetEvent($ev)
        .ok('Create File')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        try {
          fs.writeFileSync(path.join(currentPath(), result), "A new file!");
          reloadContents();
        }
        catch (err) {
          console.log("Create file failed:");
          console.log(err);
        }
      }, function() {
        console.log('You didn\'t name your file.');
      });
    };

    this.onClickCreateFolder = function ($ev) {
      var confirm = $mdDialog.prompt()
        .title('Create New Folder')
        .placeholder('Folder name')
        .ariaLabel('Folder name')
        .initialValue('New Folder')
        .targetEvent($ev)
        .ok('Create Folder')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        try {
          fs.mkdirSync(path.join(currentPath(), result));
          reloadContents();
        }
        catch (err) {
          console.log("Create folder failed:");
          console.log(err);
        }
      }, function() {
        console.log('You didn\'t name your folder.');
      });
    };

    this.onClickCreateLink = function ($ev) {
      var confirm = $mdDialog.prompt()
        .title('Create New Link')
        .placeholder('Link name')
        .ariaLabel('Link name')
        .initialValue('New Link')
        .targetEvent($ev)
        .ok('Create Link')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        console.log('You decided to name your link ' + result + '.');
      }, function() {
        console.log('You didn\'t name your link.');
      });
    };

    function itemHasIconAssignment (uri) {
      return !!itemIconAssignment(uri);
    }

    function itemIconAssignment (uri) {
      if (/package\.json$/g.test(uri)) {
        return iconPath("icon-node-192x192.png");
      }
      return "";
    }

    function iconPath (x) {
      return x;
    }

    this.isDirectory = function (directory) {
      return Directory.is(directory);
    }

    this.handleClick = function ($item, $event) {
      let pathStr = path.resolve($item.uri);
      if (pathStr !== $w.locationHistory[0]) {
        $w.locationHistory.unshift(pathStr);
      }
      openDir(pathStr);
    };

    this.openMenu = function ($mdMenu, $event) {
      $mdMenu.open($event);
    };

    openDir(process.env.HOME);

    function openDir (fullpath) {
      setLoc(fullpath);
      reloadContents();
    }

    function reloadContents () {
      var contents;
      $w.location.contents.splice(0);
      readdir(currentPath())
        .then(r => {
          $timeout(function () {
            $w.showEditor = false;
            r.contents.forEach(item => {
              $w.location.contents.push(item);
            });
          });
        })
        .catch(err => {
          $timeout(function () {
            $w.showEditor = true;
            $w.editorContent = fs.readFileSync(currentPath(), "utf-8");
            $w.aceEditor &&
              $w.aceEditor.setValue($w.editorContent) &&
              $w.aceEditor.resize();
          });
        });
    }

    function readdir (path) {
      // return fs.readdirSync(path);
      return new Promise((resolve, reject) => {
        child_process.exec(`ls -al`, {cwd: path}, function (err, res) {
          resolve(new NavigationList(path, res.split(/\n/g).slice(2)));
        });
      });
    }

    function currentPath () {
      return $w.location.str;
    }

    function setLoc (uri) {
      let uriParts;
      $w.location.str = uri;
      $w.location.path = path.parse(uri).dir;
      $w.location.dirname = path.parse(uri).base;
      $w.location.uriParts.splice(0);
      uriParts = uri.split(/\//g);
      $w.location.uriParts.push(...uriParts.map((part, index) => {
        return {
          basename: part.replace(/\/$/, ""),
          uri: uriParts.slice(0, index + 1).join("/"),
        };
      }));
    }

  }

})(angular);
