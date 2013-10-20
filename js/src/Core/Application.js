"use strict";

define(["moment", "pikaday", "jquery", "d3"], function (moment, Pikaday) {

    return function () {

        var that = this,
            isLoading = false;

        this.drawLineChart = function (data) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var parseDate = d3.time.format("%Y-%m-%d").parse;

            var x = d3.time.scale()
                .range([0, width])

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.close); });

            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            data = data.map(function(d) {
                return {
                    date: parseDate(d.date),
                    close: d.close
                };
            });

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain(d3.extent(data, function(d) { return d.close; }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        };

        this.consumeYahooAPI = function (json) {
            var totalReturned = json.query.count, stock, data = [];
            for (var i = 0; i < totalReturned; ++i) {
                stock = json.query.results.quote[i];
                data.push({
                    date: stock.Date,
                    close: stock.Close
                });
            }
            return data;
        };

        this.startLoading = function () {
            isLoading = true;
            $("#filter").attr("disabled", "disabled");
            $("svg").remove();
            $("body").append('<img src="images/ajax-loader.gif" id="loading-data" alt="Loading data...">');
        };

        this.stopLoading = function () {
            isLoading = false;
            $("#filter").removeAttr("disabled");
            $("#loading-data").remove();
        };

        this.init = function () {
            new Pikaday({
                field: $("#startDate")[0],
                format: "YYYY-MM-DD"
            });
            new Pikaday({
                field: $("#endDate")[0],
                format: "YYYY-MM-DD"
            });
            $("#filterForm").submit(function () {
                that.run();
                return false;
            });
        };

        this.run = function () {
            this.startLoading();
            var url = 'http://query.yahooapis.com/v1/public/yql',
                startDate = $("#startDate").val(),
                endDate = $("#endDate").val(),
                symbol = $("#symbol").val(),
                data = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol = "' + symbol + '" and startDate = "' + startDate + '" and endDate = "' + endDate + '"');
            $.getJSON(
                url,
                'q=' + data + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json",
                function (json) {
                    var data = that.consumeYahooAPI(json);
                    $("#loading-data").remove();
                    that.drawLineChart(data);
                    that.stopLoading();
                }
            );
        };

    };

});