"use strict";

requirejs.config({
    baseUrl: "js/src",
    paths: {
        bower   : "./../../bower_components",
        jquery  : "./../../bower_components/jquery/jquery.min",
        d3      : "./../../bower_components/d3/d3.min",
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
});

requirejs(["main"]);