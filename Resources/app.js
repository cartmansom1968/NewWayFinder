var displayWidth = Ti.Platform.displayCaps.platformWidth;
var displayHeight = Ti.Platform.displayCaps.platformHeight;
var display = Titanium.Platform.displayCaps;

var wRatio = display.platformWidth/320.0;

function renderW(val,max) {
  var newVal = Math.round(wRatio*val);
  
  if (max!=null) {
      if (newVal>max) {
          return max;
      }
  }
  return newVal;
}


var mainWin = Titanium.UI.createWindow({
                statusBarStyle: Ti.UI.iPhone.StatusBar.OPAQUE_BLACK,
                top: 0,
                left: 0,
                width: displayWidth,
                height: displayHeight,
                fullscreen:false,
                navBarHidden:true,
                tabBarHidden:true,
                backgroundColor: 'white',
                exitOnClose : true
              });

mainWin.open();

var menuModule = require('/src/maputil/MenuOptions');

menuModule.initMenu(mainWin);

var scrollView = Ti.UI.createScrollView({
  contentWidth: 'auto',
  contentHeight: 'auto',
  top: renderW(0),
  height: displayHeight,
  width: displayWidth,
  minZoomScale: 0.25,
  zoomScale: 0.30,
  maxZoomScale:2.0
});

mainWin.add(scrollView);

var mapCanvasModule = require('/src/maputil/MapCanvas');
var mapCanvas = mapCanvasModule.createMapCanvas("GWC.jpg",mainWin,1,scrollView);
menuModule.setCanvas(mapCanvas);
//alert("IP Address "+Titanium.Platform.address);
//mapCanvasModule.drawWalkablePath();



