var fs = require("fs");
var parse = require("csv-parse");

var inputFile = "datuak/2012/MunP12_e.csv";

var ordua = "00:00";
var zenbatua = "100.00";

var json_udalerriak = {
    "udalerriak": []
}

fs.createReadStream(inputFile)
    .pipe(parse({
        delimiter: ",",
        columns: true
    }))
    .on("data", function(errenkada) {
        //console.log(errenkada);
        json_udalerriak.udalerriak.push({
            "ordua": ordua,
            "zenbatua": zenbatua,
            "kodea": errenkada["Udalherri-Kodea"],
            "izena": errenkada["EREMU"],
            "zentsua": errenkada["Errolda"],
            "hautetsiak": null,
            "partehartzea": (errenkada["Hautesleak"] - errenkada["Errolda"]) / 100,
            "hautesleak": errenkada["Hautesleak"],
            "baliogabeak": errenkada["Baliogabeak"],
            "baliozkoak": errenkada["Baleko"],
            "zuriak": errenkada["Zuriak"],
            "hautagaien_b": errenkada["Hautagaien B."],
            "abstentzioa": errenkada["Abstentzioa"],
            "hautagai_kop": null,
            "ordena": ["HERRITARRAK", "PP"],
            "hautagaiak": {
                "HERRITARRAK": {
                    "izena": "HERRITARRAK",
                    "ehunekoa": "93.83",
                    "botoak": "152",
                    "hautetsiak": "7"
                },
                "PP": {
                    "izena": "PP",
                    "ehunekoa": "0.62",
                    "botoak": "1",
                    "hautetsiak": "0"
                }
            },
            "azkenaurrekoa": null,
            "azkena": null,
            "azkena_aukera1": null,
            "azkena_aukera1_botoak": null,
            "azkena_aukera2": null,
            "azkena_aukera2_botoak": null
        });
    })
    .on("end", function() {
        console.log(json_udalerriak);
    });
