
var debugListenNow = false;
var debugStats = { TotalTime: {count: 1, time: 0} };
var pages_iterator = 0;
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

            //Reload and start test - This first update resets the page
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
        printForExcel();
    }

};

var printReport = function() {

    console.log("\n\n###### FINAL REPORT ######");

    pages.forEach(function(elem) {

        // Calculate Stats... Do this only once
        getAvgStdDevVar(elem.stats);

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

var printForExcel = function() {

    console.log("\n\n###### FOR EXCEL ######");

    console.log("\n , , download, domInteractive, loadEventStart, loadEventEnd, deviation, deviation, deviation, deviation ");

    pages.forEach(function(elem) {

        console.log("%s, %s, %s, %s, %s, %s, %s, %s, %s, %s", elem.page, elem.description, elem.stats.average.download, elem.stats.average.domInteractive,
            elem.stats.average.loadEventStart, elem.stats.average.loadEventEnd, elem.stats.deviation.download, elem.stats.deviation.domInteractive,
            elem.stats.deviation.loadEventStart, elem.stats.deviation.loadEventEnd);

    });


    console.log("\n\n###### FOR EXCEL !(DEBUG)! ######");

    var outputArray = [];
    var toOutput = "";

    pages.forEach(function(elem) {

        var crh = "\n , , ";
        var cr = "\nCOUNT, " + elem.description + ", ";
        var crd = "\nCOUNT DEVIATION, " + elem.description + ", ";
        var trh = "\n , , ";
        var tr = "\nTIME, " + elem.description + ", ";
        var trd = "\nTIME DEVIATION, " + elem.description + ", ";

        elem.stats.debugStatsKeys.forEach(function(key) {

            // Count Data
            // crh = crh + key + ", ";
            // cr = cr + elem.stats.debugStats[key].count.average + ", ";
            // crd = crd + elem.stats.debugStats[key].count.deviation + ", ";

            //Only Show metric if is mora than 3 milliseconds
            if (elem.stats.debugStats[key].time.average && (elem.stats.debugStats[key].time.average > 3)) {
                trh = trh + key + ", ";
                tr = tr + elem.stats.debugStats[key].time.average + ", ";
                trd = trd + elem.stats.debugStats[key].time.deviation + ", ";
            }

        });

        // for (var key in elem.stats.debugStats) {
        //     console.log(key);
        //     crh = crh + key + ", ";
        //     cr = cr + elem.stats.debugStats[key].count.average + ", ";
        //     crd = crd + elem.stats.debugStats[key].count.deviation + ", ";

        //     if (elem.stats.debugStats[key].time.average) {
        //         trh = trh + key + ", ";
        //         tr = tr + elem.stats.debugStats[key].time.average + ", ";
        //         trd = trd + elem.stats.debugStats[key].time.deviation + ", ";
        //     }
        // }

        //outputArray.push(crh + cr + crd + trh + tr + trd);
        outputArray.push(trh + tr + trd);

    });

    for (var i = 0; i < outputArray.length; i++) {
        toOutput = toOutput + outputArray[i];
    }

    console.log(toOutput);

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

    //Debug Stats

    var debug = {};

    for (var i=0; i<stats.debug.length; i++) {

        for (var key in stats.debug[i]) {

            if (!debug[key]) {
                debug[key] = {count: [], time: []};
            }

            debug[key].count.push(stats.debug[i][key].count);
            debug[key].time.push(stats.debug[i][key].time);

        }

    };

    //console.log(debug);

    stats["debugStats"] = {};
    stats["debugStatsKeys"] = [];

    for (var key in debug) {

        stats.debugStatsKeys.push(key);

        stats.debugStats[key] = {count: {}, time: {}};

        stats.debugStats[key].count["average"] = getAverageFromNumArr(debug[key].count, 3);
        stats.debugStats[key].time["average"] = getAverageFromNumArr(debug[key].time, 3);

        stats.debugStats[key].count["deviation"] = getStandardDeviation(debug[key].count, 3);
        stats.debugStats[key].time["deviation"] = getStandardDeviation(debug[key].time, 3);

        stats.debugStats[key].count["variance"] = getVariance(debug[key].count, 3);
        stats.debugStats[key].time["variance"] = getVariance(debug[key].time, 3);

    }

    stats.debugStatsKeys.sort();

    console.log(stats.debugStats);

};


var updateUrl = function(tabId) {

    //console.log("### DEBUG: In updateUrl... | rep_iterator: %s | pages_iterator: %s ", rep_iterator, pages_iterator);

    if (rep_iterator == 1) {
        //First Time Through

        pages[pages_iterator].stats = {
            runs: [],
            debug: [],
            // average: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            // deviation: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            // variance: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            fastest: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0},
            slowest: {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0}
        };

    }

    debugStats = { TotalTime: {count: 1, time: 0} };;
    debugListenNow = true;

    chrome.tabs.update(tabId, {url: url + pages[pages_iterator].page});


};


var listener = function (tabId, changeInfo, tab) {

    if (changeInfo.status == 'complete') {

        chrome.tabs.executeScript(tabId, {file: "content/checkLoadEventEnd.js", runAt: "document_idle"});

    }

}

var handleResponse = function(tabId, results) {

    debugListenNow = false;

    var stats = pages[pages_iterator].stats;

    console.log('%s, %s, %s, %s',
        results.download, results.domInteractive, results.loadEventStart, results.loadEventEnd );

    stats.runs[(rep_iterator-1)] = {download: 0, domInteractive: 0, loadEventStart: 0, loadEventEnd: 0};

    stats.runs[(rep_iterator-1)].download = results.download;
    stats.runs[(rep_iterator-1)].domInteractive = results.domInteractive;
    stats.runs[(rep_iterator-1)].loadEventStart = results.loadEventStart;
    stats.runs[(rep_iterator-1)].loadEventEnd = results.loadEventEnd;

    stats.debug[(rep_iterator-1)] = debugStats;

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
        console.log(stats);
        setupPage(tabId);

    } else {
        rep_iterator++;
        updateUrl(tabId);
    }

}

var initDebug = function(tabId) {

    chrome.debugger.attach({tabId:tabId}, "1.0", function() {

        chrome.debugger.sendCommand({tabId:tabId}, "Timeline.start", {maxCallStackDepth:5}, function(result) {
        });

        chrome.debugger.onEvent.addListener(function(source, method, params) {

            if (method == "Timeline.eventRecorded" && debugListenNow) {

                _processRecord(params.record);

            }

            //console.log(debugStats);

        });

    });

}

var _processRecord = function (record) {

    // if ( (a.type == "TimerFire") || (a.type == "FireAnimationFrame" ) || (a.type == "EvaluateScript" ) || (a.type == "FunctionCall" ) ) {

    //console.log(record);

    if (record.children && (record.children.length > 0)) {

        record.children.forEach(function(a) {
            //console.log(a);
            _processRecord(a);
        });

    } else {
        _logIt(record);
    }


};

var _logIt = function(a) {

    //if (a.type == "FunctionCall") console.log(a);

    if (!debugStats[a.type]) debugStats[a.type] = {count: 0, time: 0};

    debugStats[a.type].count += 1;
    debugStats[a.type].time += (a.endTime - a.startTime);

    if ( (a.endTime - a.startTime) && (a.type != "GCEvent") ) {
        //console.log(a.type + ' ' + debugStats[a.type].time);
        debugStats["TotalTime"].time += (a.endTime - a.startTime);
    }

};

chrome.browserAction.onClicked.addListener(function(tab) {

    pages_iterator = 0;
    rep_iterator = 1;

    initDebug(tab.id);

    chrome.runtime.onMessage.addListener(function(results) {
        handleResponse(tab.id, results)
    });

    setupPage(tab.id);


// Experimenting

    // chrome.tabs.create({url: 'main/main.html'}, function(mainTab) {
    // });

    //chrome.devtools.inspectedWindow.getResources(function callback)

    //chrome.tabs.executeScript(tab.id, {file: "content/monitorEvents.js", runAt: "document_idle"});


});


