(function() {

    "use strict";

    var chart = c3.generate({
        data: {
            columns: [
                ['EAJ-PNV', 0],
                ['EH Bildu', 0]
            ],
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "75"
        }
    });

    setTimeout(function () {
        chart.load({
            columns: [
                ['EAJ-PNV', 27],
                ['EH Bildu', 22]
            ]
        });
    }, 1000);
}());
