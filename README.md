Chrome Extension for UI Performance
===================================

Clone the code:

    git clone git://github.disney.com/sartioli/ui-performance-chrome-extension.git

## Installation

Open Chrome Extensions Tab (Window->Extensions)

Click on "Developer Mode"

Click on "Load unpacked extensions"

Navigate to the folder "ui-performance-chrome-extension" that you cloned from git

![uipt](https://github.disney.com/sartioli/ui-performance-chrome-extension/raw/master/uipt.png "uipt")

Make sure you check: "Allow access to file URLs" for the "UI Performace Tool" extension you just added

If you make changes to any of the files, you will want to click the "Reload" button the "UI Performace Tool" extension

## Output

To see the output of the tool, click on the "Inspect views: background page" link in the "UI Performace Tool" extension (See Image Above)

You will see progressive output, as well as a text dump that can be imported or pasted into excell as csv data.

## Customization

All changes should be made in settings.js

## External References

[W3 Processing Model](http://www.w3.org/TR/navigation-timing/#processing-model)

[How not to trigger a layout in webkit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)

[Rendering Repaint Reflow Relayout Restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)

[Chrome DevTools Timeline](https://developers.google.com/chrome-developer-tools/docs/timeline)

