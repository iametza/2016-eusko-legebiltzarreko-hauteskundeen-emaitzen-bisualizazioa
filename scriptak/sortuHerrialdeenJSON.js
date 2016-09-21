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

        var botoak = parseInt(errenkada[element], 10) || 0;

        emaitzak.push([element, botoak]);

        hautagaiak[element] = {
            "izena": element,
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
        "errolda": errenkada["Errolda"],
        "hautesleak": errenkada["Hautesleak"],
        "baliogabeak": errenkada["Baliogabeak"],
        "baliozkoak": errenkada["Baleko"],
        "zuriak": errenkada["Zuriak"],
        "hautagaien_botoak": errenkada["Hautagaien B."],
        "abstentzioa": errenkada["Abstentzioa"],
        "ordena": emaitzak,
        "hautagaiak": hautagaiak
    }

    switch (errenkada["EREMU"]) {

        case "ARABA/�LAVA":
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

    // JSON fitxategiak gorde.
    fs.writeFile(outputFile, JSON.stringify(json_herrialdeak));
});
