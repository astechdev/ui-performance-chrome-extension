
document.title="test";

// document.addEventListener('PEP_LOADED', function (e) {
//   console.log("PEP_LOADED");
// }, false);

var download = ((window.performance.timing.domLoading - window.performance.timing.navigationStart) / 1000);
var processing = ((window.performance.timing.domInteractive - window.performance.timing.domLoading) / 1000);

console.log("download: " + download + " processing: " + processing);


var toReturn = {
    download: download,
    processing: processing
};

toReturn;