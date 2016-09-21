(function() {

    // Zein herrialdetako datuak bistaratu nahi diren hemen zehazten da:
    // Aukerak:
    //		"araba"
    // 		"bizkaia"
    //		"gipuzkoa"
    //		"nafarroa"
    var hautatutako_herrialdea = "gipuzkoa";

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
        "UPYD": {
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
        "IRABAZI": {
            kolorea: "#4B4B49",
            irudia: "img/irabazi.png"
        },
        "GEROA BAI": {
            kolorea: "#D42E12",
            irudia: "img/geroabai.jpg"
        },
        "UPN": {
            kolorea: "#0C4DA2",
            irudia: "img/upn.png"
        },
        "PSN": {
            kolorea: "#ed1b24",
            irudia: "img/psn.png"
        },
        "RCN-NOK": {
            irudia: "img/rcn-nok.png"
        },
        "I-E(n)": {
            kolorea: "#C60E4A",
            irudia: "img/ezkerra.jpg"
        },
        "SAIn": {
            irudia: "img/sain.png"
        },
        "PACMA": {
            irudia: "img/pacma.jpeg"
        },
        "LN": {
            irudia: "img/ln.png"
        },
        "EQUO": {
            irudia: "img/equo.jpeg"
        },
        "IKUNE": {
            irudia: "img/ikune.png"
        },
        "VOX": {
            irudia: "img/vox.jpg"
        }
    }

    var herrialdeak = {
        "gipuzkoa": {
            kodea: 20,
            datuakJSON_1: "datuak/2012/udalerriak2012-gipuzkoa.json",
            datuakJSON_2: "datuak/2012/udalerriak2012-gipuzkoa.json",
            json_izena: "udalerriak-gipuzkoa",
            topoJSON: "topoJSON/udalerriak-gipuzkoa.json",
            proiekzioa: {
                erdia: {
                    lat: -2.165,
                    lng: 43.15
                },
                eskala: 43500
            },
            altuera: 535,
            zabalera: 680

        },
        "bizkaia": {
            kodea: 48,
            datuakJSON_1: "datuak/bizkaia-udalak-2011.json",
            datuakJSON_2: "datuak/bizkaia-udalak-2015.json",
            json_izena: "udalerriak-bizkaia",
            topoJSON: "topoJSON/udalerriak-bizkaia.json",
            proiekzioa: {
                erdia: {
                    lat: -2.93,
                    lng: 43.22
                },
                eskala: 37000
            },
            altuera: 430,
            zabalera: 680
        },
        "araba": {
            kodea: "01",
            datuakJSON_1: "datuak/araba-udalak-2011.json",
            datuakJSON_2: "datuak/araba-udalak-2015.json",
            json_izena: "udalerriak-araba",
            topoJSON: "topoJSON/udalerriak-araba.json",
            proiekzioa: {
                erdia: {
                    lat: -2.75,
                    lng: 42.85
                },
                eskala: 33000
            },
            altuera: 600,
            zabalera: 680
        },
        "nafarroa": {
            kodea: "31",
            datuakJSON_1: "datuak/nafarroa-udalak-2011.json",
            datuakJSON_2: "datuak/nafarroa-udalak-2015.json",
            json_izena: "udalerriak-nafarroa",
            topoJSON: "topoJSON/udalerriak-nafarroa.json",
            proiekzioa: {
                erdia: {
                    lat: -1.615,
                    lng: 42.61
                },
                eskala: 19000
            },
            altuera: 650,
            zabalera: 680
        }
    }

    // Maparen svg elementuaren neurriak.
    var width = herrialdeak[hautatutako_herrialdea].zabalera,
        height = herrialdeak[hautatutako_herrialdea].altuera;

    // Maparen proiekzioaren xehetasunak.
    var projection = d3.geo.mercator()
        .center([herrialdeak[hautatutako_herrialdea].proiekzioa.erdia.lat, herrialdeak[hautatutako_herrialdea].proiekzioa.erdia.lng])
        .scale(herrialdeak[hautatutako_herrialdea].proiekzioa.eskala)
        .translate([width / 2, height / 2]);

    // Maparen bidearen generatzailea.
    var path = d3.geo.path()
        .projection(projection);

    // Maparen svg elementua DOMera gehitu eta neurriak ezarri.
    var svg = d3.select("#mapa").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Hautatutako herrialdeko 2011 hauteskundeen datuak irakurri dagokion JSONetik.
    d3.json(herrialdeak[hautatutako_herrialdea].datuakJSON_1, function(error, emaitzak1) {

        if (error) {
            return console.error(error);
        }

        // Hautatutako herrialdeko 2015 hauteskundeen datuak irakurri dagokion JSONetik.
        d3.json(herrialdeak[hautatutako_herrialdea].datuakJSON_2, function(error, emaitzak2) {

            if (error) {
                return console.error(error);
            }

            // Hautatutako herrialdearen datu geografikoak irakurri dagokion topoJSONetik.
            d3.json(herrialdeak[hautatutako_herrialdea].topoJSON, function(error, eh) {

                if (error) {
                    return console.error(error);
                }

                // Emaitzak eta topoJSON-a bateratzeko ideia hemendik hartu dut, behar bada badago modu hobe bat.
                // http://stackoverflow.com/questions/22994316/how-to-reference-csv-alongside-geojson-for-d3-rollover

                // 2011ko hauteskundeetako udalerri bakoitzeko datuak dagokion mapako elementuarekin lotu.
                // d: Emaitzen arrayko udalerri bakoitzaren propietateak biltzen dituen objektua.
                // i: indizea
                emaitzak1.udalerriak.forEach(function(d, i) {

                    // e: Datu geografikoetako udalerriaren propietateak
                    // j: indizea
                    topojson.feature(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena]).features.forEach(function(e, j) {

                        // Emaitzetako herriaren kodeari 0ak gehitu beharrezkoa denean,
                        // gero maparen udalerrien kodearekin konparatu ahal izateko.
                        if (d.kodea.toString().length === 1) {
                            d.kodea = "00" + d.kodea;
                        } else if (d.kodea.toString().length === 2) {
                            d.kodea = "0" + d.kodea;
                        }

                        // Trebiñuko konderriko 2 herriak kontutan izan. Trebiñu Araba da!!
                        if ("09" + d.kodea == e.properties.ud_kodea) {

                            e.properties.emaitzak1 = d;

                        // Villaverde de Turtzioz berriz Bizkaia!
                        } else if ("39" + d.kodea == e.properties.ud_kodea) {

                            e.properties.emaitzak1 = d;

                        // Gainerako euskal udalerriak.
                        } else if (herrialdeak[hautatutako_herrialdea].kodea + d.kodea === e.properties.ud_kodea) {

                            // Udalerri honetako 2011ko emaitzak mapako bere elementuarekin lotu.
                            e.properties.emaitzak1 = d;

                        }

                    });

                });

                // 2015ko hauteskundeetako udalerri bakoitzeko datuak dagokion mapako elementuarekin lotu.
                // d: Emaitzen arrayko udalerri bakoitzaren propietateak biltzen dituen objektua.
                // i: indizea
                emaitzak2.udalerriak.forEach(function(d, i) {

                    // e: Datu geografikoetako udalerriaren propietateak
                    // j: indizea
                    topojson.feature(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena]).features.forEach(function(e, j) {

                        if (d.kodea.toString().length === 1) {
                            d.kodea = "00" + d.kodea;
                        } else if (d.kodea.toString().length === 2) {
                            d.kodea = "0" + d.kodea;
                        }

                        // Trebiñuko konderriko 2 herriak kontutan izan. Trebiñu Araba da!!
                        if ("09" + d.kodea == e.properties.ud_kodea) {

                            e.properties.emaitzak2 = d;

                        // Villaverde de Turtzioz berriz Bizkaia!
                        } else if ("39" + d.kodea == e.properties.ud_kodea) {

                            e.properties.emaitzak2 = d;

                        // Gainerako euskal udalerriak
                        } else if (herrialdeak[hautatutako_herrialdea].kodea + d.kodea === e.properties.ud_kodea) {

                            // Udalerri honetako 2015eko emaitzak mapako bere elementuarekin lotu.
                            e.properties.emaitzak2 = d;

                        }

                    });

                });

                // Udalerri guztiak.
                svg.selectAll(".unitateak")
                    .data(topojson.feature(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena]).features)
                    .enter().append("path")
                    .attr("fill", function(d) {

                        // Herriko hautagai bozkatuenaren kolorea.
                        if (d.properties.emaitzak2) {

                            // Hautagaiarentzat kolore bat definitu badugu...
                            if (hautagaiak[d.properties.emaitzak2.ordena[0]]) {

                                return hautagaiak[d.properties.emaitzak2.ordena[0]].kolorea;

                            } else {

                                return "#cccccc";

                            }

                        }

                        // Emaitzarik ez badago...
                        return "#ffffff";

                    })
                    .attr("class", "unitateak")
                    .attr("id", function(d) { return "unitatea_" + d.properties.ad_kod; })
                    .attr("d", path)
                    .on("mouseover", function(d) {

                        // Elementu geografiko guztiek ez daukate iz_euskal propietatea,
                        // ez badauka ud_iz_e erabili.
                        if (d.properties.iz_euskal) {

                            $("#unitatea-izena").text(d.properties.iz_euskal);

                        } else {

                            $("#unitatea-izena").text(d.properties.ud_iz_e);

                        }

                        if (d.properties.emaitzak2) {

                            beteTaula(d.properties.emaitzak1, d.properties.emaitzak2);

                            beteDatuak(d.properties.emaitzak2);

                            $(".hasierako-mezua").hide();

                            $(".daturik-ez").hide();

                            $(".datuak").show();

                        } else {

                            $(".datuak").hide();

                            $(".daturik-ez").show();

                        }

                    });

                // Eskualdeen arteko mugak (a !== b)
                svg.append("path")
                    .datum(topojson.mesh(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena], function(a, b) { return a !== b; }))
                    .attr("d", path)
                    .attr("class", "eskualde-mugak");

                // Kanpo-mugak (a === b)
                svg.append("path")
                    .datum(topojson.mesh(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena], function(a, b) { return a === b; }))
                    .attr("d", path)
                    .attr("class", "kanpo-mugak");

            });

        });

    });

    // Udalerri bateko hautagaien emaitzen datuak bistaratu.
    // datuak1: 2011ko emaitzak.
    // datuak2: 2015eko emaitzak.
    function beteTaula(datuak1, datuak2) {

        var katea = "";

        var aldea = "";

        var izena = "";

        var kolorea = "#cccccc";

        for (var i = 0; i < datuak2.ordena.length; i++) {

            // Botoak lortu dituzten hautagaiak bakarrik bistaratu.
            if (datuak2.hautagaiak[datuak2.ordena[i]].botoak > 0) {

                aldea = "";

                for (var j = 0; j < datuak1.ordena.length; j++) {

                    if (datuak2.hautagaiak[datuak2.ordena[i]].izena === datuak1.hautagaiak[datuak1.ordena[j]].izena) {

                        aldea = datuak2.hautagaiak[datuak2.ordena[i]].botoak - datuak1.hautagaiak[datuak1.ordena[j]].botoak;

                    }

                    // Salbuespena: BILDU -> EH BILDU.
                    if (datuak2.hautagaiak[datuak2.ordena[i]].izena === "EH BILDU" && datuak1.hautagaiak[datuak1.ordena[j]].izena === "BILDU") {

                        aldea = datuak2.hautagaiak[datuak2.ordena[i]].botoak - datuak1.hautagaiak[datuak1.ordena[j]].botoak;

                    // Salbuespena: GEROA BAI -> NA-BAI.
                    } else if (datuak2.hautagaiak[datuak2.ordena[i]].izena === "GEROA BAI" && datuak1.hautagaiak[datuak1.ordena[j]].izena === "NA-BAI") {

                        aldea = datuak2.hautagaiak[datuak2.ordena[i]].botoak - datuak1.hautagaiak[datuak1.ordena[j]].botoak;

                    }

                }

                // Bi hauteskundeen artean hautagaien hautetsi kopuruan egondako aldaketaren zeinua (igo, jaitsi...) bistaratzeko prestatu.
                if (aldea === "") {

                    // Hautagaia ez zen aurkeztu aurreko hauteskundeetan
                    // edo izena ez dator bat (izenen normalizazioarekin arazoak izan ditugu).
                    aldea = "-";

                } else if (aldea > 0) {

                    // Hautagaiaren hautetsi kopurua igo da.
                    aldea = "&#9650;" + aldea;

                } else if (aldea < 0) {

                    // Hautagaiaren hautetsi kopurua jaitsi da.
                    aldea = "&#9660;" + Math.abs(aldea);

                } else {

                    // Hautagaiak hautetsi kopuru berdina atera du.
                    aldea = "=";

                }

                // // Izena luzeegia bada moztu egingo dugu.
                if (datuak2.ordena[i].length > 20) {
                    izena = datuak2.ordena[i].substring(0, 18) + "...";
                } else {
                    izena = datuak2.ordena[i];
                }

                // Hautagaiak kolorea badu...
                if (hautagaiak[datuak2.ordena[i]] && hautagaiak[datuak2.ordena[i]].kolorea) {

                    kolorea = hautagaiak[datuak2.ordena[i]].kolorea;

                // Bestela kolore neutro bat erabili.
                } else {

                    kolorea = "#cccccc";

                }

                // Taulako errenkada prestatu.
                katea = katea + "<tr><td class='kolorea' style='background-color:" + kolorea + "'>&nbsp;</td><td class='izena' title='" + datuak2.ordena[i] + "'>" + izena + "</td><td class='botoak'>" + datuak2.hautagaiak[datuak2.ordena[i]].botoak + "</td><td class='ahulkiak'>" + datuak2.hautagaiak[datuak2.ordena[i]].ehunekoa + "</td><td class='aldea'>" + aldea + "</td></tr>";

            }

        }

        $(".emaitzak-taula").html(katea);

    }

    function borobildu2dezimaletara(zenbakia) {

        return parseFloat(Math.round(zenbakia * 100) / 100).toFixed(2);

    }

    // Udalerri bateko 2015ko hauteskundeetako datu orokorrak bistaratu.
    function beteDatuak(datuak) {

        $(".eguneraketa-ordua").text(datuak.ordua);

        $(".zenbatua").text(datuak.zenbatua);

        $(".errolda").text(datuak.zentsua);

        $(".ehuneko-abstentzioa").text(borobildu2dezimaletara(100 * datuak.abstentzioa / datuak.zentsua, 10));

        $(".ehuneko-baliogabeak").text(borobildu2dezimaletara(100 * datuak.baliogabeak / datuak.hautesleak));

        $(".ehuneko-zuriak").text(borobildu2dezimaletara(100 * datuak.zuriak / datuak.hautesleak));

    }
}());
