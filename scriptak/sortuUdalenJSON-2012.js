var fs = require("fs");
var parse = require("csv-parse");
var iconv = require('iconv-lite');

var inputFile = "public/datuak/2012/MunP12_e.csv";
var outputFile = "public/datuak/2012/udalerriak2012.json";
var outputFile_araba = "public/datuak/2012/udalerriak2012-araba.json";
var outputFile_bizkaia = "public/datuak/2012/udalerriak2012-bizkaia.json";
var outputFile_gipuzkoa = "public/datuak/2012/udalerriak2012-gipuzkoa.json";

var ordua = "00:00";
var zenbatua = "100.00";

var json_udalerriak = {
    "udalerriak": []
}

var json_udalerriak_araba = {
    "udalerriak": []
}

var json_udalerriak_bizkaia = {
    "udalerriak": []
}

var json_udalerriak_gipuzkoa = {
    "udalerriak": []
}

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
    //console.log(errenkada);

    var udalerria = {};

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

    udalerria = {
        "ordua": ordua,
        "zenbatua": zenbatua,
        "kodea": errenkada["Udalherri-Kodea"],
        "izena": errenkada["EREMU"],
        "zentsua": errenkada["Errolda"],
        "hautetsiak": null,
        "partehartzea": (100 * errenkada["Hautesleak"] / errenkada["Errolda"]).toFixed(2),
        "hautesleak": errenkada["Hautesleak"],
        "baliogabeak": errenkada["Baliogabeak"],
        "baliozkoak": errenkada["Baleko"],
        "zuriak": errenkada["Zuriak"],
        "hautagaien_b": errenkada["Hautagaien B."],
        "abstentzioa": errenkada["Abstentzioa"],
        "hautagai_kop": null,
        "ordena": emaitzak,
        "hautagaiak": hautagaiak,
        "azkenaurrekoa": null,
        "azkena": null,
        "azkena_aukera1": null,
        "azkena_aukera1_botoak": null,
        "azkena_aukera2": null,
        "azkena_aukera2_botoak": null
    };

    // Udalerri guztiak biltzen dituen JSONean sartu.
    json_udalerriak.udalerriak.push(udalerria);

    if (errenkada["TH"] === "ARABA-ÁLAVA") {
        json_udalerriak_araba.udalerriak.push(udalerria);

    } else if (errenkada["TH"] === "BIZKAIA") {
        json_udalerriak_bizkaia.udalerriak.push(udalerria);

    } else if (errenkada["TH"] === "GIPUZKOA") {
        json_udalerriak_gipuzkoa.udalerriak.push(udalerria);
    }

})
.on("end", function() {

    json_udalerriak.udalerriak.sort(ordenatuHerrienArrayaAlfabetikoki);
    json_udalerriak_araba.udalerriak.sort(ordenatuHerrienArrayaAlfabetikoki);
    json_udalerriak_bizkaia.udalerriak.sort(ordenatuHerrienArrayaAlfabetikoki);
    json_udalerriak_gipuzkoa.udalerriak.sort(ordenatuHerrienArrayaAlfabetikoki);

    // JSON fitxategiak gorde.
    fs.writeFile(outputFile, JSON.stringify(json_udalerriak));
    fs.writeFile(outputFile_araba, JSON.stringify(json_udalerriak_araba));
    fs.writeFile(outputFile_bizkaia, JSON.stringify(json_udalerriak_bizkaia));
    fs.writeFile(outputFile_gipuzkoa, JSON.stringify(json_udalerriak_gipuzkoa));
});
