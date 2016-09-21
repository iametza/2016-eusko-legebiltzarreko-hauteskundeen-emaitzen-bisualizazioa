var fs = require("fs");
var parse = require("csv-parse");

var inputFile = "datuak/2012/MunP12_e.csv";
var outputFile = "datuak/2012/udalerriak2012.json";
var outputFile_araba = "datuak/2012/udalerriak2012-araba.json";
var outputFile_bizkaia = "datuak/2012/udalerriak2012-bizkaia.json";
var outputFile_gipuzkoa = "datuak/2012/udalerriak2012-gipuzkoa.json";

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

fs.createReadStream(inputFile)
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

    if (errenkada["TH"] === "ARABA-�LAVA") {
        json_udalerriak_araba.udalerriak.push(udalerria);
    } else if (errenkada["TH"] === "BIZKAIA") {
        json_udalerriak_bizkaia.udalerriak.push(udalerria);
    } else if (errenkada["TH"] === "GIPUZKOA") {
        json_udalerriak_gipuzkoa.udalerriak.push(udalerria);
    }

})
.on("end", function() {

    // JSON fitxategiak gorde.
    fs.writeFile(outputFile, JSON.stringify(json_udalerriak));
    fs.writeFile(outputFile_araba, JSON.stringify(json_udalerriak_araba));
    fs.writeFile(outputFile_bizkaia, JSON.stringify(json_udalerriak_bizkaia));
    fs.writeFile(outputFile_gipuzkoa, JSON.stringify(json_udalerriak_gipuzkoa));
});
