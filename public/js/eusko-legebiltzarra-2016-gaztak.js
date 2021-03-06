(function() {

    "use strict";

    // http://stackoverflow.com/a/3855394/2855012
    function eskuratuURLParametroak(a) {

        if (a === "") {
            return {};
        }

        var b = {};

        for (var i = 0; i < a.length; ++i) {
            var p=a[i].split('=', 2);
            if (p.length == 1) {
                b[p[0]] = "";
            } else {
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
        }
        return b;
    }

    var url_parametroak = eskuratuURLParametroak(window.location.search.substr(1).split('&'));

    var hiru_zutabetara = url_parametroak.hiru_zutabetara === "true" ? true : false;

    if (hiru_zutabetara) {
        $("#kontainerra").addClass("hiru-zutabetara");
    }

    var herrialdeen_json1 = "datuak/2012/herrialdeak2012.json";
    var herrialdeen_json2 = "datuak/2016/herrialdeak2016.json";

    var hautagaiak = {
        "EH BILDU": {
            kolorea: "#b3c801",
            irudia: "img/eh-bildu.gif"
        },
        "EAJ-PNV": {
            kolorea: "#008336",
            irudia: "img/eaj-pnv.gif"
        },
        "PSE-EE": {
            kolorea: "#ed1b24",
            irudia: "img/pse-ee.gif"
        },
        "PP": {
            kolorea: "#0BB2FF",
            irudia: "img/pp.gif"
        },
        "UPyD": {
            kolorea: "#E4007D",
            irudia: "img/upyd.gif"
        },
        "CIUDADANOS": {
            kolorea: "#F78934",
            irudia: "img/ciudadanos.jpg"
        },
        "PODEMOS": {
            kolorea: "#5B1256",
            irudia: "img/podemos.png"
        },
        "IU-LV": {
            kolorea: "#4B4B49",
            irudia: "img/iu.gif"
        },
        "EB-B": {
            kolorea: "#4B4B49",
            irudia: "img/eb.gif"
        },
        "EQUO": {
            irudia: "img/equo.gif"
        },
        "Eb-Az": {
            irudia: "img/eb-az.gif"
        },
        "PACMA/ATTKA": {
            irudia: "img/pacma.gif"
        },
        "HARTOS.org": {
            irudia: "img/hartos.gif"
        },
        "PUM+J": {
            irudia: "img/mj.gif"
        },
        "PH": {
            irudia: "img/ph.gif"
        },
        "PFyV": {
            irudia: "img/pfyv.gif"
        },
        "POSI": {
            irudia: "img/posi.gif"
        },
        "UCE": {
            irudia: "img/uce.gif"
        },
        "EK-PCPE": {
            irudia: "img/pcpe.gif"
        },
        "ONGI ETORRI": {
            irudia: "img/ongi-etorri.gif"
        },
        "PYC": {
            irudia: "img/pyc.gif"
        },
        "ELKARREKIN PODEMOS": {
            irudia: "img/podemos.jpg",
            kolorea: "#5B1256"
        },
        "GANEMOS:SI SE PUEDE": {
            kolorea: "#fff"
        },
        "RECORTES CERO-GV": {
            kolorea: "#fff"
        },
        "LN": {
            kolorea: "#fff"
        },
        "O.E.": {
            kolorea: "#fff"
        },
        "VOX": {
            kolorea: "#fff"
        }
    };

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

            bistaratuZenbatua("eae", emaitzak2);
            bistaratuZenbatua("araba", emaitzak2);
            bistaratuZenbatua("bizkaia", emaitzak2);
            bistaratuZenbatua("gipuzkoa", emaitzak2);

            beteTaula("eae", emaitzak1, emaitzak2, 5);
            beteTaula("araba", emaitzak1, emaitzak2, 5);
            beteTaula("bizkaia", emaitzak1, emaitzak2, 5);
            beteTaula("gipuzkoa", emaitzak1, emaitzak2, 5);
        });
    });

    function bistaratuZenbatua(zer, datuak) {
        $("#" + zer + " .zenbatua .portzentaia").text(datuak[zer].zenbatua);
    }

    function beteTaula(zer, datuak1, datuak2, zenbat_alderdi_bistaratu) {

		var katea = "";

		var aldea = "";

        for (var i = 0; i < zenbat_alderdi_bistaratu; i++) {

            // Botoak lortu dituzten alderdiak bakarrik bistaratu.

			aldea = "";

			for (var j = 0; j < datuak1[zer].ordena.length; j++) {

				if ((datuak2[zer].hautagaiak[datuak2[zer].ordena[i]]) &&
                    (datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].izena === datuak1[zer].hautagaiak[datuak1[zer].ordena[j]].izena)) {

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

            var kolorea = "#cccccc";

            // Hautagaiak kolorea badu...
            if (hautagaiak[datuak2[zer].ordena[i]] && hautagaiak[datuak2[zer].ordena[i]].kolorea) {

                kolorea = hautagaiak[datuak2[zer].ordena[i]].kolorea;

            // Bestela kolore neutro bat erabili.
            } else {

                kolorea = "#cccccc";

            }
            console.log(datuak2[zer].ordena[i]);
			katea = katea + "<tr><td class='irudia'><img src='" +  hautagaiak[datuak2[zer].ordena[i]].irudia + "' /></td><td class='kolorea' style='background-color:" + kolorea + "'>&nbsp;</td><td class='botoak'>" + gehituPuntuakZenbakiei(datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].botoak) + "</td><td class='ahulkiak'>" + datuak2[zer].hautagaiak[datuak2[zer].ordena[i]].hautetsiak + "</td><td class='aldea'>" + aldea + "</td></tr>";

        }

        $("#" + zer + " .datuak-taula").html(katea);

	}

    function bistaratuDonuta(hautatzailea, emaitzak, zer, title) {
        var pareak_zero = [];
        var pareak = [];

        var koloreak = {};

        $.each(hautagaiak, function(index, value) {

            koloreak[index] = value.kolorea;
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
    function gehituPuntuakZenbakiei(zenbakia) {
        return zenbakia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}());
