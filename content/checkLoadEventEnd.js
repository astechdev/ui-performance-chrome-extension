// document.addEventListener('PEP_LOADED', function (e) {
//   console.log("PEP_LOADED");
// }, false);

// $(document).bind( "PEP_LOADED", function( event ) {
//     console.log('yes');
// });

// $.event.trigger('PEP_LOADED');

var checkLoadEventEnd = function() {

    if(window.performance.timing.loadEventEnd == 0) {

        console.log("### INFO: loadEventEnd is still 0");
        setTimeout(checkLoadEventEnd, 500);

    } else {

        var download = ((window.performance.timing.domLoading - window.performance.timing.navigationStart) / 1000);
        var domInteractive = ((window.performance.timing.domInteractive - window.performance.timing.domLoading) / 1000);
        var loadEventStart = ((window.performance.timing.loadEventStart - window.performance.timing.domLoading) / 1000);
        var loadEventEnd = ((window.performance.timing.loadEventEnd - window.performance.timing.domLoading) / 1000);

        var toReturn = {
            download: download,
            domInteractive: domInteractive,
            loadEventStart: loadEventStart,
            loadEventEnd: loadEventEnd
        };

        chrome.runtime.sendMessage(toReturn);

    }

};

checkLoadEventEnd();
