var fs = require('fs'),
    xml2js = require('xml2js'),
    iconv = require('iconv-lite');

var parser = new xml2js.Parser();

var inputFile = "public/datuak/2016/Resultados.xml";

var outputFile_herrialdeak = "public/datuak/2016/herrialdeak2016.json";
var outputFile_udalerriak = "public/datuak/2016/udalerriak2016.json";
var outputFile_araba = "public/datuak/2016/udalerriak2016-araba.json";
var outputFile_bizkaia = "public/datuak/2016/udalerriak2016-bizkaia.json";
var outputFile_gipuzkoa = "public/datuak/2016/udalerriak2016-gipuzkoa.json";

var json_herrialdeak = {
    "araba": {},
    "bizkaia": {},
    "gipuzkoa": {}
};

// 2016ko emaitza ofizialetan agertzen diren ordenean.
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


fs.readFile(inputFile, function(err, data) {

    //data = iconv.decodeStream(data, "latin1");
    //data = iconv.encodeStream(data, "utf8");

    parser.parseString(data, function (err, result) {

        var herrialdea = {};

        var hautagaiak = {};
        var emaitzak = [];

        // EAEko datuak.
        var guztira = {
            "errolda": parseInt(result["SalidaDatos"]["SalidaXML"][0]["CENSO"][0], 10),
            "hautesleak": parseInt(result["SalidaDatos"]["SalidaXML"][0]["NVOTOS"][0], 10),
            "baliogabeak": parseInt(result["SalidaDatos"]["SalidaXML"][0]["NNULOS"][0], 10),
            "baliozkoak": parseInt(result["SalidaDatos"]["SalidaXML"][0]["NVALIDOS"][0], 10),
            "zuriak": parseInt(result["SalidaDatos"]["SalidaXML"][0]["NBLANCOS"][0], 10),
            "hautagaien_botoak": parseInt(result["SalidaDatos"]["SalidaXML"][0]["NVALIDOS"][0], 10) - parseInt(result["SalidaDatos"]["SalidaXML"][0]["NBLANCOS"][0], 10),
            "abstentzioa": parseInt(result["SalidaDatos"]["SalidaXML"][0]["CENSO"][0], 10) - parseInt(result["SalidaDatos"]["SalidaXML"][0]["NVOTOS"][0], 10),
            "ordena": [],
            "hautagaiak": {}
        };

        result["SalidaDatos"]["SalidaXML"][0]["PARTIDO"].forEach(function(element, index, array) {

            var botoak = parseInt(element["VOTOS"][0], 10) || 0;

            emaitzak.push([element["SIGLAS"][0], botoak]);

            hautagaiak[element["SIGLAS"][0]] = {
                "izena": element["SIGLAS"][0],
                "ehunekoa": parseFloat(element["PORCENTAJE"][0].replace(",", ".")).toFixed(2),
                "botoak": botoak,
                "hautetsiak": parseInt(element["ESCAÑOS"][0], 10)
            }
        });

        emaitzak.sort(function(a, b) {
            return b[1] - a[1];
        });

        emaitzak = emaitzak.map(function(element, index, array) {

            return element[0];

        });

        guztira["ordena"] = emaitzak;
        guztira["hautagaiak"] = hautagaiak;

        /*switch (errenkada["EREMU"]) {

            case "ARABA/ÁLAVA":
                json_herrialdeak["araba"] = herrialdea;
                break;

            case "BIZKAIA":
                json_herrialdeak["bizkaia"] = herrialdea;
                break;

            case "GIPUZKOA":
                json_herrialdeak["gipuzkoa"] = herrialdea;
                break;
        }*/

        json_herrialdeak["eae"] = guztira;

        // JSON fitxategiak gorde.
        fs.writeFile(outputFile_herrialdeak, JSON.stringify(json_herrialdeak));
    });
});
