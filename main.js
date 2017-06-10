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
      .primaryPalette('toolbarPalette')

  });

  app.controller("WindowController", WindowController);

  WindowController.$inject = ["$timeout"];
  function WindowController (  $timeout) {

    var $w = this;

    this.info = {
      nodeVersion: process.version,
    };

    this.location = {
      str: process.env.HOME,
      path: path.parse(process.env.HOME).dir,
      dirname: path.parse(process.env.HOME).base,
      contents: [],
    };

    reloadContents();

    function reloadContents () {
      var contents;
      $timeout(function () {
        $w.location.contents.splice(0);
        contents = fs.readdirSync(currentPath());
        console.log(currentPath(),contents);
        contents.forEach(item => {
          $w.location.contents.push(item);
        });
      });
    }

    function currentPath () {
      return $w.location.str;
    }

  }

})(angular);
