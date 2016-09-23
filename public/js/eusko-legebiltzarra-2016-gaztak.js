(function() {

    "use strict";

    var herrialdeen_json1 = "datuak/2012/herrialdeak2012.json";
    var herrialdeen_json2 = "datuak/2016/herrialdeak2016.json";

    var koloreak = {
        "EH BILDU": "#b3c801",
        "EAJ-PNV": "#008336",
        "PSE-EE": "#ed1b24",
        "PP": "#0BB2FF",
        "UPYD": "#E4007D",
        "CIUDADANOS": "#F78934",
        "PODEMOS": "#6B1F5F"
    }

    d3.json(herrialdeen_json1, function(error, emaitzak1) {

        if (error) {
            return console.error(error);
        }

        d3.json(herrialdeen_json2, function(error, emaitzak2) {

            if (error) {
                return console.error(error);
            }

            bistaratuDonuta("#eae-donuta", emaitzak2, "eae", 75);
            bistaratuDonuta("#araba-donuta", emaitzak2, "araba", 25);
            bistaratuDonuta("#bizkaia-donuta", emaitzak2, "bizkaia", 25);
            bistaratuDonuta("#gipuzkoa-donuta", emaitzak2, "gipuzkoa", 25);

            bistaratuBarrak("#gipuzkoa-barrak", emaitzak1, emaitzak2, "gipuzkoa", 5);

        });
    });

    function bistaratuBarrak(hautatzailea, emaitzak1, emaitzak2, zer, zenbat_barra_bistaratu) {

        var array2012 = ["2012"];
        var array2016 = ["2016"];

        // Tooltip-ean ze alderdiren datuak diren bistaratzeko.
        var indizea = 0;

        for (var i = 0; i < zenbat_barra_bistaratu; i++) {

            array2012.push(emaitzak1[zer].hautagaiak[emaitzak2[zer].ordena[i]].botoak);
            array2016.push(emaitzak2[zer].hautagaiak[emaitzak2[zer].ordena[i]].botoak);

        }

        var chart = c3.generate({
            bindto: hautatzailea,
            data: {
                columns: [
                    array2012,
                    array2016
                ],
                color: function (color, d) {

                    // d will be 'id' when called for legends
                    if (d.index >= 0) {
                        return koloreak[emaitzak2[zer].ordena[d.index]];
                    }
                    return color;
                },
                type: 'bar',
                onmouseover: function (d, i) {
                    // Tooltip-ean ze alderdiren datuak diren bistaratzeko.
                    indizea = d.index;
                },
                labels: true
            },
            bar: {
                width: {
                    ratio: 0.85 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            legend: {
                show: false
            },
            tooltip: {
                format: {
                    title: function(value, ratio, id) {

                        // onmouseover gertaeran gordetako indizeari dagokion alderdiaren izena bistaratu.
                        return emaitzak2[zer].ordena[indizea];
                    }
                }
            },
            axis: {
                x: {
                    tick: {
                        format: function(d) {
                            return emaitzak2[zer].ordena[d];
                        },
                        outer: false
                    }
                },
                y: {
                    show: false
                }
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
