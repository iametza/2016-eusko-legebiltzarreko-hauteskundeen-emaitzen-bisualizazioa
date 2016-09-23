var fs = require("fs");
var parse = require("csv-parse");
var iconv = require('iconv-lite');

var inputFile = "public/datuak/2012/CirP12_e.csv";
var outputFile = "public/datuak/2012/herrialdeak2012.json";

var ordua = "00:00";
var zenbatua = "100.00";

var json_herrialdeak = {
    "araba": {},
    "bizkaia": {},
    "gipuzkoa": {}
};

// 2012ko emaitza ofizialetan agertzen diren ordenean.
var alderdiak = [
    "EAJ-PNV",
    "PP",
    "EB-B",
    "PH",
    "EK-PCPE",
    "POSI",
    "UCE",
    "PSE-EE/PSOE",
    "PACMA/ATTKA",
    "PUM+J",
    "PFYV",
    "UPYD",
    "EQUO",
    "IU-LV",
    "EB-AZ",
    "ONGI ETORRI",
    "EH BILDU",
    "PYC",
    "HARTOS.ORG"
];

var ordenatuHerrienArrayaAlfabetikoki = function(a, b) {

    if (a.izena < b.izena) {
        return -1;
    } else if (a.izena > b.izena) {
        return 1;
    } else {
        return 0;
    }
};

var normalizatuAlderdiarenIzenak = function(izena) {

    switch (izena) {
        case "PSE-EE(PSOE)":
        case "PSE-EE/PSOE":
            izena = "PSE-EE";
            break;
        case "UPYD":
            izena = "UPyD";
            break;
        case "EB-AZ":
            izena = "Eb-Az";
            break;
        case "HARTOS.ORG":
            izena = "HARTOS.org";
            break;
        case "PFYV":
            izena = "PFyV";
            break;
    }

    return izena;
}

fs.createReadStream(inputFile)
.pipe(iconv.decodeStream("latin1"))
.pipe(iconv.encodeStream("utf8"))
.pipe(parse({
    delimiter: ",",
    columns: true
}))
.on("data", function(errenkada) {

    var herrialdea = {};

    var hautagaiak = {};
    var emaitzak = [];

    alderdiak.forEach(function(element, index, array) {

        var izen_normalizatua = normalizatuAlderdiarenIzenak(element);

        var botoak = parseInt(errenkada[element], 10) || 0;

        emaitzak.push([izen_normalizatua, botoak]);

        hautagaiak[izen_normalizatua] = {
            "izena": izen_normalizatua,
            "ehunekoa": (100 * botoak / errenkada["Hautesleak"]).toFixed(2),
            "botoak": botoak,
            "hautetsiak": null
        }
    });

    emaitzak.sort(function(a, b) {
        return b[1] - a[1];
    });

    emaitzak = emaitzak.map(function(element, index, array) {

        return element[0];

    });

    herrialdea = {
        "zentsua": errenkada["Errolda"],
        "hautesleak": errenkada["Hautesleak"],
        "baliogabeak": errenkada["Baliogabeak"],
        "baliozkoak": errenkada["Baleko"],
        "zuriak": errenkada["Zuriak"],
        "hautagaien_b": errenkada["Hautagaien B."],
        "abstentzioa": errenkada["Abstentzioa"],
        "ordena": emaitzak,
        "hautagaiak": hautagaiak
    }

    switch (errenkada["EREMU"]) {

        case "ARABA/ÁLAVA":
            json_herrialdeak["araba"] = herrialdea;
            break;

        case "BIZKAIA":
            json_herrialdeak["bizkaia"] = herrialdea;
            break;

        case "GIPUZKOA":
            json_herrialdeak["gipuzkoa"] = herrialdea;
            break;
    }
})
.on("end", function() {

    var guztira = {
        "errolda": 0,
        "hautesleak": 0,
        "baliogabeak": 0,
        "baliozkoak": 0,
        "zuriak": 0,
        "hautagaien_botoak": 0,
        "abstentzioa": 0,
        "ordena": [],
        "hautagaiak": {}
    };

    var emaitzak = [];

    guztira.errolda = guztira.errolda + parseInt(json_herrialdeak.araba.errolda, 10) + parseInt(json_herrialdeak.bizkaia.errolda, 10) + parseInt(json_herrialdeak.gipuzkoa.errolda, 10);
    guztira.hautesleak = guztira.hautesleak + parseInt(json_herrialdeak.araba.hautesleak, 10) + parseInt(json_herrialdeak.bizkaia.hautesleak, 10) + parseInt(json_herrialdeak.gipuzkoa.hautesleak, 10);
    guztira.baliogabeak = guztira.baliogabeak + parseInt(json_herrialdeak.araba.baliogabeak, 10) + parseInt(json_herrialdeak.bizkaia.baliogabeak, 10) + parseInt(json_herrialdeak.gipuzkoa.baliogabeak, 10);
    guztira.baliozkoak = guztira.baliozkoak + parseInt(json_herrialdeak.araba.baliozkoak, 10) + parseInt(json_herrialdeak.bizkaia.baliozkoak, 10) + parseInt(json_herrialdeak.gipuzkoa.baliozkoak, 10);
    guztira.zuriak = guztira.zuriak + parseInt(json_herrialdeak.araba.zuriak, 10) + parseInt(json_herrialdeak.bizkaia.zuriak, 10) + parseInt(json_herrialdeak.gipuzkoa.zuriak, 10);
    guztira.hautagaien_botoak = guztira.hautagaien_botoak + parseInt(json_herrialdeak.araba.hautagaien_botoak, 10) + parseInt(json_herrialdeak.bizkaia.hautagaien_botoak, 10) + parseInt(json_herrialdeak.gipuzkoa.hautagaien_botoak, 10);
    guztira.abstentzioa = guztira.abstentzioa + parseInt(json_herrialdeak.araba.abstentzioa, 10) + parseInt(json_herrialdeak.bizkaia.abstentzioa, 10) + parseInt(json_herrialdeak.gipuzkoa.abstentzioa, 10);

    alderdiak.forEach(function(element, index, array) {

        var izen_normalizatua = normalizatuAlderdiarenIzenak(element);

        var botoak = parseInt(json_herrialdeak.araba.hautagaiak[izen_normalizatua].botoak, 10) +
                     parseInt(json_herrialdeak.bizkaia.hautagaiak[izen_normalizatua].botoak, 10) +
                     parseInt(json_herrialdeak.gipuzkoa.hautagaiak[izen_normalizatua].botoak, 10);

        emaitzak.push([izen_normalizatua, botoak]);

        guztira.hautagaiak[izen_normalizatua] = {
            "izena": izen_normalizatua,
            "ehunekoa": (100 * botoak / guztira.hautesleak).toFixed(2),
            "botoak": botoak,
            "hautetsiak": null
        }
    });

    emaitzak.sort(function(a, b) {
        return b[1] - a[1];
    });

    emaitzak = emaitzak.map(function(element, index, array) {

        return element[0];

    });

    guztira.ordena = emaitzak;

    json_herrialdeak["eae"] = guztira;

    // JSON fitxategiak gorde.
    fs.writeFile(outputFile, JSON.stringify(json_herrialdeak));
});
