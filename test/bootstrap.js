"use strict";

QUnit.config.autostart = false; // We'll QUnit.start() after loading the RequireJS modules

var require = {
    baseUrl: ".",
    urlArgs: (new Date).getTime(), // Bypass caches (useful when loading the page from the file system)
    paths: {
        jquery  : "bower_components/jquery/jquery",
        d3      : "bower_components/d3/d3.min",
        moment  : "./../../bower_components/momentjs/min/moment.min",
        pikaday : "./../../bower_components/pikaday/pikaday"
    },
    "shim": {
        "jquery": {
            exports: "$"
        },
        "d3": {
            exports: "d3"
        }
    }
};