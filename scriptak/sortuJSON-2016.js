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

        result["SalidaDatos"]["SalidaXML"].forEach(function(element, index, array) {

            var hautagaiak = {};
            var emaitzak = [];

            var unitatea = {
                "ordua": element["FECHAHORA"][0].split(" ")[1],
                "zenbatua": element["PESCRU"][0],
                "kodea": element["AMBITO"][0],
                "izena": element["DESCRIP"][0],
                "zentsua": parseInt(element["CENSO"][0], 10),
                "hautetsiak": null,
                "partehartzea": (100 * parseInt(element["NVOTOS"][0], 10) / parseInt(element["CENSO"][0], 10)).toFixed(2),
                "hautesleak": parseInt(element["NVOTOS"][0], 10),
                "baliogabeak": parseInt(element["NNULOS"][0], 10),
                "baliozkoak": parseInt(element["NVALIDOS"][0], 10),
                "zuriak": parseInt(element["NBLANCOS"][0], 10),
                "hautagaien_b": parseInt(element["NVALIDOS"][0], 10) - parseInt(element["NBLANCOS"][0], 10),
                "abstentzioa": parseInt(element["CENSO"][0], 10) - parseInt(element["NVOTOS"][0], 10),
                "hautagai_kop": null,
                "ordena": [],
                "hautagaiak": {},
                "azkenaurrekoa": null,
                "azkena": element["ESCULTIMO"][0],
                "azkena_aukera1": element["ESCULTIMO1"][0],
                "azkena_aukera1_botoak": element["VOTOSULT1"][0],
                "azkena_aukera2": null,
                "azkena_aukera2_botoak": null
            };

            element["PARTIDO"].forEach(function(element2, index2, array2) {

                var botoak = parseInt(element2["VOTOS"][0], 10) || 0;

                emaitzak.push([element2["SIGLAS"][0], botoak]);

                hautagaiak[element2["SIGLAS"][0]] = {
                    "izena": element2["SIGLAS"][0],
                    "ehunekoa": parseFloat(element2["PORCENTAJE"][0].replace(",", ".")).toFixed(2),
                    "botoak": botoak,
                    "hautetsiak": parseInt(element2["ESCAÑOS"][0], 10)
                }
            });

            emaitzak.sort(function(a, b) {
                return b[1] - a[1];
            });

            emaitzak = emaitzak.map(function(element, index, array) {

                return element[0];

            });

            unitatea["ordena"] = emaitzak;
            unitatea["hautagaiak"] = hautagaiak;

            switch (index) {

                case 0:
                    json_herrialdeak["eae"] = unitatea;
                    break;

                case 1:
                    json_herrialdeak["araba"] = unitatea;
                    break;

                case 2:
                    json_herrialdeak["bizkaia"] = unitatea;
                    break;

                case 3:
                    json_herrialdeak["gipuzkoa"] = unitatea;
                    break;
            }
        });

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

        // JSON fitxategiak gorde.
        fs.writeFile(outputFile_herrialdeak, JSON.stringify(json_herrialdeak));
    });
});
