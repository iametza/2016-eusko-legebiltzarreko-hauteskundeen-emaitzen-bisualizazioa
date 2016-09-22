(function() {

    "use strict";

    var herrialdeen_json = "datuak/2012/herrialdeak2012.json";

    d3.json(herrialdeen_json, function(error, emaitzak) {

        if (error) {
            return console.error(error);
        }

        var pareak_zero = [];
        var pareak = [];

        console.log(emaitzak);

        emaitzak.eae.ordena.forEach(function(element, index, array) {

            pareak_zero.push([element, 0]);
            pareak.push([element, emaitzak.eae.hautagaiak[element].botoak]);

        });

        var chart = c3.generate({
            data: {
                columns: pareak_zero,
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: "75"
            }
        });

        setTimeout(function () {
            chart.load({
                columns: pareak
            });
        }, 500);
    });
}());
