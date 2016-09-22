(function() {

    "use strict";

    var herrialdeen_json = "datuak/2012/herrialdeak2012.json";

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
            pareak.push([element, emaitzak[zer].hautagaiak[element].botoak]);

        });

        var eae = c3.generate({
            bindto: hautatzailea,
            data: {
                columns: pareak_zero,
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: title
            },
            legend: {
                hide: true
            }
        });

        setTimeout(function () {
            eae.load({
                columns: pareak
            });
        }, 500);
    }
}());
