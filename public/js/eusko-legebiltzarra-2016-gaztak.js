(function() {

    "use strict";

    var herrialdeen_json1 = "datuak/2012/herrialdeak2012.json";
    var herrialdeen_json2 = "datuak/2016/herrialdeak2016.json";

    var hautagaiak = {
        "EH BILDU": {
            kolorea: "#b3c801",
            irudia: "img/ehbildu.jpg"
        },
        "EAJ-PNV": {
            kolorea: "#008336",
            irudia: "img/eaj-pnv.png"
        },
        "PSE-EE": {
            kolorea: "#ed1b24",
            irudia: "img/pse-ee.gif"
        },
        "PP": {
            kolorea: "#0BB2FF",
            irudia: "img/pp.png"
        },
        "UPyD": {
            kolorea: "#E4007D",
            irudia: "img/upyd.png"
        },
        "CIUDADANOS": {
            kolorea: "#F78934",
            irudia: "img/ciudadanos.jpg"
        },
        "PODEMOS": {
            kolorea: "#6B1F5F",
            irudia: "img/podemos.png"
        },
        "IU-LV": {
            kolorea: "#4B4B49",
            irudia: "img/irabazi.png"
        },
        "EB-B": {
            kolorea: "#4B4B49",
            irudia: "img/irabazi.png"
        },
        "EQUO": {
            irudia: "img/equo.jpeg"
        },
        "Eb-Az": {
            irudia: "img/equo.jpeg"
        },
        "PACMA/ATTKA": {
            irudia: "img/equo.jpeg"
        },
        "HARTOS.org": {
            irudia: "img/equo.jpeg"
        },
        "PUM+J": {
            irudia: "img/equo.jpeg"
        },
        "PH": {
            irudia: "img/equo.jpeg"
        },
        "PFyV": {
            irudia: "img/equo.jpeg"
        },
        "POSI": {
            irudia: "img/equo.jpeg"
        },
        "UCE": {
            irudia: "img/equo.jpeg"
        },
        "EK-PCPE": {
            irudia: "img/equo.jpeg"
        },
        "ONGI ETORRI": {
            irudia: "img/equo.jpeg"
        },
        "PYC": {
            irudia: "img/equo.jpeg"
        }
    }

    d3.json(herrialdeen_json1, function(error, emaitzak1) {

        if (error) {
            return console.error(error);
        }

        d3.json(herrialdeen_json2, function(error, emaitzak2) {

            if (error) {
                return console.error(error);
            }

            //bistaratuDonuta("#eae-donuta", emaitzak2, "eae", 75);
            //bistaratuDonuta("#araba-donuta", emaitzak2, "araba", 25);
            //bistaratuDonuta("#bizkaia-donuta", emaitzak2, "bizkaia", 25);
            //bistaratuDonuta("#gipuzkoa-donuta", emaitzak2, "gipuzkoa", 25);

            bistaratuBarrak("#gipuzkoa-barrak", emaitzak1, emaitzak2, "eae", 5);

            beteTaula("eae", emaitzak1, emaitzak2);
            beteTaula("araba", emaitzak1, emaitzak2);
            beteTaula("bizkaia", emaitzak1, emaitzak2);
            beteTaula("gipuzkoa", emaitzak1, emaitzak2);
        });
    });

    function beteTaula(zer, datuak1, datuak2) {

		var katea = "";

		var aldea = "";

        for (var i = 0; i < datuak2[zer].ordena.length; i++) {

            // Botoak lortu dituzten alderdiak bakarrik bistaratu.

			aldea = "";

			for (var j = 0; j < datuak1[zer].ordena.length; j++) {

				if ((datuak2[zer].hautagaiak[datuak2[zer].ordena[i]]) &&
                    (datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].izena === datuak1[zer].hautagaiak[datuak1[zer].ordena[j]].izena)) {
                    console.log(datuak2[zer].hautagaiak[datuak2[zer].ordena[i]]);
                    console.log(datuak1[zer].hautagaiak[datuak1[zer].ordena[j]]);
					aldea = datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].hautetsiak - datuak1[zer].hautagaiak[datuak1[zer].ordena[j]].hautetsiak;

				}
			}

			// Bi hauteskundeetako hautagaiak ez badatoz bat...
			if (aldea === "") {

				aldea = "-";

			} else if (aldea > 0) {

				aldea = "&#9650;" + aldea;

			} else if (aldea < 0) {

				aldea = "&#9660;" + Math.abs(aldea);

			} else {

				aldea = "=";

			}

			katea = katea + "<tr><td class='irudia'><img src='" +  hautagaiak[datuak2[zer].ordena[i]].irudia + "' /></td><td class='botoak'>" + datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].botoak + "</td><td class='ahulkiak'>" + datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].hautetsiak + "</td><td class='aldea'>" + aldea + "</td></tr>";

        }

        $("#" + zer + " .datuak-taula").html(katea);

	}

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
                        return hautagaiak[emaitzak2[zer].ordena[d.index]].kolorea;
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

        var koloreak = {};

        $.each(hautagaiak, function(index, value) {

            koloreak[index] = value;
        });

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
