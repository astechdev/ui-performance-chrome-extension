// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


//var url = 'https://wdw-stage.disney.go.com/';
var url = 'https://wdprolt02.disney.go.com/';

var pages = [
    {
        page: 'resorts/',
        description: 'resorts xup=false pre-avail',
        stats: {},
        cookies: []
    },
    {
        page: 'resorts/',
        description: 'resorts xup=true pre-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/',
        description: 'resorts xup=true post-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            },{
                url: url,
                name: 'roomForm_jar',
                value: encodeURI('{"checkInDate":"2014-02-01","checkOutDate":"2014-02-07","numberOfAdults":"2","numberOfChildren":"0","accessible":"0","resort":""}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=false pre-avail',
        cookies: []
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=true pre-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=true post-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            },{
                url: url,
                name: 'roomForm_jar',
                value: encodeURI('{"checkInDate":"2014-02-01","checkOutDate":"2014-02-07","numberOfAdults":"2","numberOfChildren":"0","accessible":"0","resort":"80010395;entityType=resort"}'),
                path: '/'
            }
        ]
    }
];

var pages_iterator = 0;

var repetitions = 10;
var rep_iterator = 1;

var setupPage = function(tabId) {

    if (pages_iterator < pages.length) {
        console.log('### INFO: Setting Up Page');

        //Remove Cookies
        chrome.cookies.getAll({
            url: url
        }, function(cookies) {
            cookies.forEach(function(cookie) {
                chrome.cookies.remove({
                    url: url,
                    name: cookie.name,
                    storeId: cookie.storeId
                });
            });
            console.log("### INFO: Done Removing Cookies");

            //Set Cookies
            pages[pages_iterator].cookies.forEach(function(cookie) {
                chrome.cookies.set(cookie);
                console.log("### INFO: Done Adding Cookie: %s", cookie.name);
            });

            //Reload and start test
            chrome.tabs.update(tabId, {url: url}, function(tab) {

                console.log("### INFO: Starting Test | Page: %s%s \n### INFO: Description: '%s'\n" +
                    "download, domInteractive, loadEventStart, loadEventEnd",
                    url, pages[pages_iterator].page, pages[pages_iterator].description);

                chrome.tabs.onUpdated.addListener(listener);
                updateUrl(tab.id);

            });

        });


    } else {
        console.log('### INFO: Done Iterating Through Pages');
        console.log(pages);
        printReport();
    }

};

var printReport = function() {

    console.log("\n\n###### FINAL REPORT ######");

    pages.forEach(function(elem) {

        // Calculate Average

        var results = getAvgStdDevVar(elem.stats);


        console.log("\n### %s%s ###\n### %s ###\ndownload, domInteractive, loadEventStart, loadEventEnd", url, elem.page, elem.description);
        console.log("# AVERAGE #");
        console.log("%s, %s, %s, %s", elem.stats.average.download, elem.stats.average.domInteractive, elem.stats.average.loadEventStart, elem.stats.average.loadEventEnd);
        console.log("# FASTEST #");
        console.log("%s, %s, %s, %s", elem.stats.fastest.download, elem.stats.fastest.domInteractive, elem.stats.fastest.loadEventStart, elem.stats.fastest.loadEventEnd);
        console.log("# SLOWEST #");
        console.log("%s, %s, %s, %s", elem.stats.slowest.download, elem.stats.slowest.domInteractive, elem.stats.slowest.loadEventStart, elem.stats.slowest.loadEventEnd);
        console.log("# STANDARD DEVIATION #");
        console.log("%s, %s, %s, %s", elem.stats.deviation.download, elem.stats.deviation.domInteractive, elem.stats.deviation.loadEventStart, elem.stats.deviation.loadEventEnd);
        console.log("# VARIANCE #");
        console.log("%s, %s, %s, %s", elem.stats.variance.download, elem.stats.variance.domInteractive, elem.stats.variance.loadEventStart, elem.stats.variance.loadEventEnd);

    });

}

var getAvgStdDevVar = function(stats) {

    var dl = [], di = [], les = [], lee = [];

    for (var i=0; i<stats.runs.length; i++) {

        dl.push(stats.runs[i].download);
        di.push(stats.runs[i].domInteractive);
        les.push(stats.runs[i].loadEventStart);
        lee.push(stats.runs[i].loadEventEnd);

    }

    stats.average = {
        download: getAverageFromNumArr(dl, 3),
        domInteractive: getAverageFromNumArr(di, 3),
        loadEventStart: getAverageFromNumArr(les, 3),
        loadEventEnd: getAverageFromNumArr(lee, 3)
    };

    stats.deviation = {
        download: getStandardDeviation(dl, 3),
        domInteractive: getStandardDeviation(di, 3),
        loadEventStart: getStandardDeviation(les, 3),
        loadEventEnd: getStandardDeviation(lee, 3)
    };

    stats.variance =  {
        download: getVariance(dl, 3),
        domInteractive: getVariance(di, 3),
        loadEventStart: getVariance(les, 3),
        loadEventEnd: getVariance(lee, 3)
    };

};


var updateUrl = function(tabId) {

    //console.log("### DEBUG: In updateUrl... | rep_iterator: %s | pages_iterator: %s ", rep_iterator, pages_iterator);

    if (rep_iterator == 1) {
        //First Time Through

        pages[pages_iterator].stats = {
            runs: [],
            // average: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            // deviation: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            // variance: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            fastest: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            slowest: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0}
        };
    }

    chrome.tabs.update(tabId, {url: url + pages[pages_iterator].page});


};


var listener = function (tabId, changeInfo, tab) {

    if (changeInfo.status == 'complete') {

        chrome.tabs.executeScript(tabId, {file: "content.js", runAt: "document_idle"});

    }

}

var handleResponse = function(tabId, results) {

    var stats = pages[pages_iterator].stats;

    console.log('%s, %s, %s, %s',
        results.download, results.domInteractive, results.loadEventStart, results.loadEventEnd );

    stats.runs[(rep_iterator-1)] = {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0};

    stats.runs[(rep_iterator-1)].download = results.download;
    stats.runs[(rep_iterator-1)].domInteractive = results.domInteractive;
    stats.runs[(rep_iterator-1)].loadEventStart = results.loadEventStart;
    stats.runs[(rep_iterator-1)].loadEventEnd = results.loadEventEnd;


    if (rep_iterator == 1) {

        stats.fastest.download = results.download;
        stats.fastest.domInteractive = results.domInteractive;
        stats.fastest.loadEventStart = results.loadEventStart;
        stats.fastest.loadEventEnd = results.loadEventEnd;

        stats.slowest.download = results.download;
        stats.slowest.domInteractive = results.domInteractive;
        stats.slowest.loadEventStart = results.loadEventStart;
        stats.slowest.loadEventEnd = results.loadEventEnd;

    } else {

        if (stats.fastest.download > results.download) stats.fastest.download = results.download;
        if (stats.fastest.domInteractive > results.domInteractive) stats.fastest.domInteractive = results.domInteractive;
        if (stats.fastest.loadEventStart > results.loadEventStart) stats.fastest.loadEventStart = results.loadEventStart;
        if (stats.fastest.loadEventEnd > results.loadEventEnd) stats.fastest.loadEventEnd = results.loadEventEnd;

        if (stats.slowest.download < results.download) stats.slowest.download = results.download;
        if (stats.slowest.domInteractive < results.domInteractive) stats.slowest.domInteractive = results.domInteractive;
        if (stats.slowest.loadEventStart < results.loadEventStart) stats.slowest.loadEventStart = results.loadEventStart;
        if (stats.slowest.loadEventEnd < results.loadEventEnd) stats.slowest.loadEventEnd = results.loadEventEnd;
    }
    //console.log(stats);

    if (rep_iterator >= repetitions) {
        pages_iterator++;
        rep_iterator = 1;
        chrome.tabs.onUpdated.removeListener(listener);
        setupPage(tabId);

    } else {
        rep_iterator++;
        updateUrl(tabId);
    }

}

chrome.browserAction.onClicked.addListener(function(tab) {

    pages_iterator = 0;
    rep_iterator = 1;

    chrome.runtime.onMessage.addListener(function(results) {
        handleResponse(tab.id, results)
    });

    setupPage(tab.id);


});


