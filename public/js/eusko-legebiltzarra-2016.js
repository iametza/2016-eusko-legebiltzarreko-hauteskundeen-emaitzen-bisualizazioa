(function() {

    "use strict";

    // http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
    };

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

    // Zein herrialdetako datuak bistaratu nahi diren hemen zehazten da:
    // Aukerak:
    //		"araba"
    // 		"bizkaia"
    //		"gipuzkoa"
    //		"nafarroa"
    var hautatutako_herrialdea = url_parametroak.herrialdea ? url_parametroak.herrialdea : "araba";

    var zer_bistaratu = {
        barrak: url_parametroak.barrak  === "false" ? false : true,
        mapa: url_parametroak.mapa  === "false" ? false : true,
        xehetasunak: url_parametroak.xehetasunak  === "false" ? false : true
    };

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

    var herriz_herriko_taulako_alderdien_ordena = [
        "EAJ-PNV",
        "EH BILDU",
        "ELKARREKIN PODEMOS",
        "PSE-EE",
        "PP"
    ];

    var herrialdeen_jsonak = [
        "datuak/2012/herrialdeak2012.json",
        "datuak/2016/herrialdeak2016.json"
    ];

    var herrialdeak = {
        "gipuzkoa": {
            kodea: 20,
            datuakJSON_1: "datuak/2012/udalerriak2012-gipuzkoa.json",
            datuakJSON_2: "datuak/2016/udalerriak2016-gipuzkoa.json",
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
            datuakJSON_1: "datuak/2012/udalerriak2012-bizkaia.json",
            datuakJSON_2: "datuak/2016/udalerriak2016-bizkaia.json",
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
            datuakJSON_1: "datuak/2012/udalerriak2012-araba.json",
            datuakJSON_2: "datuak/2016/udalerriak2016-araba.json",
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
        },
        "eae": {
            kodea: null,
            datuakJSON_1: "datuak/2012/udalerriak2012.json",
            datuakJSON_2: "datuak/2016/udalerriak2016.json",
            json_izena: "udalerriak",
            topoJSON: "datuak/2016/udalerriak2016.json",
            proiekzioa: {
                erdia: {
                    lat: null,
                    lng: null
                },
                eskala: null
            },
            altuera: null,
            zabalera: null
        }
    };

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

    d3.json(herrialdeen_jsonak[0], function(error, emaitzak_herrialdeak1) {

        if (error) {
            return console.error(error);
        }

        d3.json(herrialdeen_jsonak[1], function(error, emaitzak_herrialdeak2) {

            if (error) {
                return console.error(error);
            }

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

                        if (zer_bistaratu.barrak) {

                            bistaratuBarrak("#barrak", emaitzak_herrialdeak1, emaitzak_herrialdeak2, hautatutako_herrialdea, 5);

                            $("#barrak-kaxa").show();
                        }

                        aldatuKredituenKokapena(hautatutako_herrialdea);

                        if (zer_bistaratu.mapa) {

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

                                        $(".datuak").css("visibility", "visible");

                                    } else {

                                        $(".datuak").css("visibility", "hidden");

                                        $(".daturik-ez").show();

                                    }

                                });

                            // Eskualdeen arteko mugak (a !== b)
                            svg.append("path")
                                .datum(topojson.mesh(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena], function(a, b) { return a !== b; }))
                                .attr("d", path)
                                .attr("class", "eskualde-mugak");

                            // Unitateak aurreko planora ekarri.
                            svg.selectAll(".unitateak").each(function() {
                                var sel = d3.select(this);
                                sel.moveToFront();
                            });

                            // Kanpo-mugak (a === b)
                            svg.append("path")
                                .datum(topojson.mesh(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena], function(a, b) { return a === b; }))
                                .attr("d", path)
                                .attr("class", "kanpo-mugak");

                            // Unitateak aurreko planora ekarri.
                            svg.selectAll(".unitateak").each(function() {
                                var sel = d3.select(this);
                                sel.moveToFront();
                            });

                            $("#mapa").show();
                            $(".hasierako-mezua").show();
                            $(".datuak").show();
                        }

                        if (zer_bistaratu.xehetasunak) {

                            bistaratuHerrialdekoDatuak(emaitzak_herrialdeak1[hautatutako_herrialdea], emaitzak_herrialdeak2[hautatutako_herrialdea]);

                            bistaratuHerrienTaula(emaitzak1, emaitzak2);

                            $("#herrialdeko-datuak-etiketa").show();
                            $("#herrialdeko-datuak").show();
                            $("#emaitzak-herriz-herri-etiketa").show();
                            $("#emaitzak-herriz-herri").show();
                        }
                    });
                });
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
                katea = katea + "<tr><td class='kolorea' style='background-color:" + kolorea + "'>&nbsp;</td><td class='izena' title='" + datuak2.ordena[i] + "'>" + izena + "</td><td class='botoak'>" + gehituPuntuakZenbakiei(datuak2.hautagaiak[datuak2.ordena[i]].botoak) + "</td><td class='ahulkiak'>%" + ordezkatuPuntuaKomarekin(datuak2.hautagaiak[datuak2.ordena[i]].ehunekoa) + "</td><td class='aldea'>" + aldea + "</td></tr>";

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

        $(".zenbatua").text("%" + ordezkatuPuntuaKomarekin(datuak.zenbatua));

        $(".errolda").text(gehituPuntuakZenbakiei(datuak.zentsua));

        $(".ehuneko-abstentzioa").text("%" + ordezkatuPuntuaKomarekin(borobildu2dezimaletara(100 * datuak.abstentzioa / datuak.zentsua, 10)));

        $(".ehuneko-baliogabeak").text("%" + ordezkatuPuntuaKomarekin(borobildu2dezimaletara(100 * datuak.baliogabeak / datuak.hautesleak)));

        $(".ehuneko-zuriak").text("%" + ordezkatuPuntuaKomarekin(borobildu2dezimaletara(100 * datuak.zuriak / datuak.hautesleak)));

    }

    function bistaratuHerrialdekoDatuak(datuak1, datuak2) {

        var katea = "";
        var aldea = "";
        var hautetsien_aldea = "";

        for (var i = 0; i < datuak2.ordena.length; i++) {

            aldea = "";
            hautetsien_aldea = "";

            for (var j = 0; j < datuak1.ordena.length; j++) {

                if (datuak2.hautagaiak[datuak2.ordena[i]].izena === datuak1.hautagaiak[datuak1.ordena[j]].izena) {

                    aldea =  gehituPuntuakZenbakiei(datuak2.hautagaiak[datuak2.ordena[i]].botoak - datuak1.hautagaiak[datuak1.ordena[j]].botoak);
                    hautetsien_aldea = datuak2.hautagaiak[datuak2.ordena[i]].hautetsiak - datuak1.hautagaiak[datuak1.ordena[j]].hautetsiak;
                }

                // Salbuespena: BILDU -> EH BILDU.
                if (datuak2.hautagaiak[datuak2.ordena[i]].izena === "EH BILDU" && datuak1.hautagaiak[datuak1.ordena[j]].izena === "BILDU") {

                    aldea = datuak2.hautagaiak[datuak2.ordena[i]].botoak - datuak1.hautagaiak[datuak1.ordena[j]].botoak;

                // Salbuespena: GEROA BAI -> NA-BAI.
                } else if (datuak2.hautagaiak[datuak2.ordena[i]].izena === "GEROA BAI" && datuak1.hautagaiak[datuak1.ordena[j]].izena === "NA-BAI") {

                    aldea = datuak2.hautagaiak[datuak2.ordena[i]].botoak - datuak1.hautagaiak[datuak1.ordena[j]].botoak;

                }

            }

            // Bi hauteskundeen artean hautagaien boto kopuruan egondako aldaketaren zeinua (igo, jaitsi...) bistaratzeko prestatu.
            if (aldea === "") {

                // Hautagaia ez zen aurkeztu aurreko hauteskundeetan
                // edo izena ez dator bat (izenen normalizazioarekin arazoak izan ditugu).
                aldea = "-";

            } else if (aldea > 0) {

                // Hautagaiaren boto kopurua igo da.
                aldea = "&#9650;" + aldea;

            } else if (aldea < 0) {

                // Hautagaiaren boto kopurua jaitsi da.
                aldea = "&#9660;" + Math.abs(aldea);

            } else {

                // Hautagaiak boto kopuru berdina atera du.
                aldea = "=";

            }

            // Bi hauteskundeen artean hautagaien hautetsi kopuruan egondako aldaketaren zeinua (igo, jaitsi...) bistaratzeko prestatu.
            if (hautetsien_aldea === "") {

                // Hautagaia ez zen aurkeztu aurreko hauteskundeetan
                // edo izena ez dator bat (izenen normalizazioarekin arazoak izan ditugu).
                hautetsien_aldea = "-";

            } else if (hautetsien_aldea > 0) {

                // Hautagaiaren hautetsi kopurua igo da.
                hautetsien_aldea = "&#9650;" + hautetsien_aldea;

            } else if (hautetsien_aldea < 0) {

                // Hautagaiaren hautetsi kopurua jaitsi da.
                hautetsien_aldea = "&#9660;" + Math.abs(hautetsien_aldea);

            } else {

                // Hautagaiak hautetsi kopuru berdina atera du.
                hautetsien_aldea = "=";

            }

            katea = katea +
                "<tr>" +
                    "<td class='alderdia'>" + datuak2.hautagaiak[datuak2.ordena[i]].izena + "</td>" +
                    "<td class='botoak'>" + gehituPuntuakZenbakiei(datuak2.hautagaiak[datuak2.ordena[i]].botoak) + "</td>" +
                    "<td class='botoak-aldea'>" + aldea + "</td>" +
                    "<td class='ehunekoa'>%" + ordezkatuPuntuaKomarekin(datuak2.hautagaiak[datuak2.ordena[i]].ehunekoa) + "</td>" +
                    "<td class='hautetsiak'>" + datuak2.hautagaiak[datuak2.ordena[i]].hautetsiak + "</td>" +
                    "<td class='hautetsiak-aldea'>" + hautetsien_aldea + "</td>" +
                "</tr>";
        }

        $("#herrialdeko-datuak table tbody").html(katea);

    }

    function bistaratuHerrienTaula(datuak1, datuak2) {

        var katea = "";

        datuak2.udalerriak.forEach(function(element, index, array) {

            var guztira = element.bai + element.ez + element.zuria + element.baliogabea;

            katea = katea +
                "<tr>" +
                    "<td>" + element.izena + "</td>" +
                    "<td>%" + ordezkatuPuntuaKomarekin(element.partehartzea) + "</td>";

            herriz_herriko_taulako_alderdien_ordena.forEach(function(element2, index2, array2) {

                katea =  katea + "<td>" + gehituPuntuakZenbakiei(element.hautagaiak[element2].botoak) + "</td>";
            });

            katea = katea + "</tr>";
        });

        var tbody = document.querySelector("#emaitzak-herriz-herri tbody");

        tbody.innerHTML = katea;
    }

    function aldatuKredituenKokapena(herrialdea) {
        $("#kredituak").addClass(herrialdea);
    }

    function bistaratuBarrak(hautatzailea, emaitzak1, emaitzak2, zer, zenbat_barra_bistaratu) {

        var array2012 = ["2012"];
        var array2016 = ["2016"];

        // Tooltip-ean ze alderdiren datuak diren bistaratzeko.
        var indizea = 0;

        for (var i = 0; i < zenbat_barra_bistaratu; i++) {
            if (emaitzak1[zer].hautagaiak[emaitzak2[zer].ordena[i]]) {
                array2012.push(emaitzak1[zer].hautagaiak[emaitzak2[zer].ordena[i]].botoak);
            } else {
                array2012.push(0);
            }
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
                labels: {
                    format: function(v, id, i, j) {
                        return gehituPuntuakZenbakiei(v);
                    }
                }
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
                    },

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
    function gehituPuntuakZenbakiei(zenbakia) {
        return zenbakia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function ordezkatuPuntuaKomarekin(zenbakia) {
        return zenbakia.toString().replace(".", ',');
    }
}());
