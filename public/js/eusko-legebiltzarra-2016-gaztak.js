(function() {

    "use strict";

    var herrialdeen_json = "datuak/2016/herrialdeak2016.json";

    var koloreak = {
        "EH BILDU": "#b3c801",
        "EAJ-PNV": "#008336",
        "PSE-EE": "#ed1b24",
        "PP": "#0BB2FF",
        "UPYD": "#E4007D",
        "CIUDADANOS": "#F78934",
        "PODEMOS": "#6B1F5F"
    }

    d3.json(herrialdeen_json, function(error, emaitzak) {

        if (error) {
            return console.error(error);
        }

        bistaratuDonuta("#eae-donuta", emaitzak, "eae", 75);
        bistaratuDonuta("#araba-donuta", emaitzak, "araba", 25);
        bistaratuDonuta("#bizkaia-donuta", emaitzak, "bizkaia", 25);
        bistaratuDonuta("#gipuzkoa-donuta", emaitzak, "gipuzkoa", 25);

        bistaratuBarrak("#gipuzkoa-barrak", emaitzak, emaitzak, "gipuzkoa");
    });

    function bistaratuBarrak(hautatzailea, emaitzak1, emaitzak2, zer) {

        var chart = c3.generate({
            bindto: hautatzailea,
            data: {
                columns: [
                    ['2012', 30, 200, 100, 400, 150, 250],
                    ['2016', 130, 100, 140, 200, 150, 50]
                ],
                type: 'bar',
                labels: {
                    format: function (v, id, i, j) {
                        console.log(v);
                        console.log(id);
                        console.log(i);
                        console.log(j);
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            }
        });
    }

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
                colors: koloreak,
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
