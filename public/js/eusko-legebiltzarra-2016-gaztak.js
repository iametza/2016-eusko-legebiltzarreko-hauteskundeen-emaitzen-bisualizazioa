(function() {

    "use strict";

    var herrialdeen_json = "datuak/2016/herrialdeak2016.json";

    d3.json(herrialdeen_json, function(error, emaitzak) {

        if (error) {
            return console.error(error);
        }

        bistaratuDonuta("#eae-donuta", emaitzak, "eae", 75);
        bistaratuDonuta("#araba-donuta", emaitzak, "araba", 25);
        bistaratuDonuta("#bizkaia-donuta", emaitzak, "bizkaia", 25);
        bistaratuDonuta("#gipuzkoa-donuta", emaitzak, "gipuzkoa", 25);
    });

    function bistaratuDonuta(hautatzailea, emaitzak, zer, title) {
        var pareak_zero = [];
        var pareak = [];

        emaitzak[zer].ordena.forEach(function(element, index, array) {

            pareak_zero.push([element, 0]);
            pareak.push([element, emaitzak[zer].hautagaiak[element].hautetsiak]);

        });

        var eae = c3.generate({
            bindto: hautatzailea,
            data: {
                columns: pareak_zero,
                type : 'donut',
                onclick: function (d, i) {
                    //console.log("onclick", d, i);
                },
                onmouseover: function (d, i) {
                    //console.log("onmouseover", d, i);
                },
                onmouseout: function (d, i) {
                    //console.log("onmouseout", d, i);
                }
            },
            donut: {
                title: title,
                label: {
                    format: function (value) {
                        return value;
                    }
                }
            },
            legend: {
                hide: true
            },
            tooltip: {
                format: {
                    value: function(value, ratio, id) {
                        return value;
                    }
                }
            }
        });

        setTimeout(function () {
            eae.load({
                columns: pareak
            });
        }, 500);
    }
}());
