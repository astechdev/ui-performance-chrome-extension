chrome.devtools.panels.create("UI Performance",
    "devtools/img/mickey.png",
    "devtools/panel.html",
    function(panel) {

        console.log("panel");
        console.log(panel);

        //chrome.devtools.inspectedWindow.getResources(function(resources) {console.log(resources);})
        // chrome.debugger.attach({tabId:tab.id}, "1.0", function() {
        //     console.log("debugger");
        // });


    });



