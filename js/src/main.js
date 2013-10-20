"use strict";

define([
    "bower/requirejs-domready/domReady",
    "Core/Application"
], function (domReady, Application) {

    domReady(function () {
        var app = new Application();
        app.init();
        app.run();
    });

});