savedEvent = {};

document.addEventListener('mousedown', function (e) {

    savedEvent = e;

    console.log(e);

    setTimeout(function() {

        document.dispatchEvent(e);

    }, 3000);

}, false);
