// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var filePath = 'file://localhost/Users/sartioli/Desktop/XUP-Perf/';

var files = [
    'ak_xup_false_post_avail.htm',
    'ak_xup_false_pre_avail.htm',
    'ak_xup_true_post_avail.htm',
    'ak_xup_true_pre_avail.htm',
    'resorts_xup_false_post_avail.htm',
    'resorts_xup_false_pre_avail.htm',
    'resorts_xup_true_post_avail.htm',
    'resorts_xup_true_pre_avail.htm'
];

var files_iterator = 0;

var repetitions = 10;
var rep_iterator = 1;

var stats = {};

var updateUrl = function(tabId) {

    if (files_iterator < files.length) {

        if (rep_iterator == 1) {
            stats[files[files_iterator]] = { download: 0, processing: 0 };
        }

        chrome.tabs.update(tabId, {url: filePath + files[files_iterator]});

    } else {

        chrome.tabs.onUpdated.removeListener(listener);
        console.log(stats);
    }

};

var listener = function (tabId, changeInfo, tab) {

        if (changeInfo.status == 'complete') {
            //alert(window.performance.timing.domInteractive);

            chrome.tabs.executeScript(tabId, {file: "content.js"}, function(results) {

                if (files_iterator == 1) {
                    stats[files[files_iterator]].download = results[0].download;
                    stats[files[files_iterator]].processing = results[0].processing;
                } else {
                    stats[files[files_iterator]].download = (stats[files[files_iterator]].download + results[0].download)/2;
                    stats[files[files_iterator]].processing = (stats[files[files_iterator]].processing + results[0].processing)/2;
                }
                //console.log(stats);

                if (rep_iterator >= repetitions) {
                    files_iterator++;
                    rep_iterator = 1;
                } else {
                    rep_iterator++;
                }

                updateUrl(tabId);

            });

        }

    }

chrome.browserAction.onClicked.addListener(function(tab) {

    //chrome.tabs.executeScript(tab.id, {file: "content.js", runAt: "document_start"});

    files_iterator = 0;
    rep_iterator = 1;

    chrome.tabs.onUpdated.addListener(listener);

    updateUrl(tab.id);

});


