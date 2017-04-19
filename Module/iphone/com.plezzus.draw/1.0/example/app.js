/*
  Example File for com.plezzus.draw

  Copyright (c) 2014 Plezzus, LLC, All Rights Reserved
*/

var Draw = require('com.plezzus.draw');

(function() {
    "use strict"
    // ------------------------------------------------------------------------------------------------------------------------
    // TESTS
    var tests = [
	function(view) { // 1 blue stroke
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcLineTo(90, 90);
	    view.gcColor('blue');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 2 red stroke
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcLineTo(90, 90);
	    view.gcLineTo(10, 90);
	    view.gcClosePath();
	    view.gcColor('#f00');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 3 green fill
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcLineTo(90, 90);
	    view.gcLineTo(10, 90);
	    view.gcClosePath();
	    view.gcColor([0, 255, 0]);
	    view.gcFill();
	},
	function(view) { // 4 butt cap
	    view.gcBeginPath();
	    view.gcMoveTo(20, 20);
	    view.gcLineTo(80, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineCap('butt');
	    view.gcStroke();
	},
	function(view) { // 5 round cap
	    view.gcBeginPath();
	    view.gcMoveTo(20, 20);
	    view.gcLineTo(80, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineCap('round');
	    view.gcStroke();
	},
	function(view) { // 6 square cap
	    view.gcBeginPath();
	    view.gcMoveTo(20, 20);
	    view.gcLineTo(80, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineCap('square');
	    view.gcStroke();
	},
	function(view) { // 7 miter join
	    view.gcBeginPath();
	    view.gcMoveTo(30, 80);
	    view.gcLineTo(50, 50);
	    view.gcLineTo(70, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineJoin('miter');
	    view.gcStroke();
	},
	function(view) { // 8 bevel join
	    view.gcBeginPath();
	    view.gcMoveTo(30, 80);
	    view.gcLineTo(50, 50);
	    view.gcLineTo(70, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineJoin('bevel');
	    view.gcStroke();
	},
	function(view) { // 9 round join
	    view.gcBeginPath();
	    view.gcMoveTo(30, 80);
	    view.gcLineTo(50, 50);
	    view.gcLineTo(70, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineJoin('round');
	    view.gcStroke();
	},
	function(view) { // 10 miter limit
	    view.gcBeginPath();
	    view.gcMoveTo(30, 80);
	    view.gcLineTo(50, 30);
	    view.gcLineTo(70, 80);
	    view.gcColor('white');
	    view.gcLineWidth(20);
	    view.gcLineJoin('miter');
	    view.gcMiterLimit(2.5);
	    view.gcStroke();
	},
	function(view) { // 11 subpaths stroke
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcLineTo(40, 10);
	    view.gcLineTo(10, 40);
	    view.gcClosePath();
	    view.gcMoveTo(60, 60);
	    view.gcLineTo(90, 60);
	    view.gcLineTo(60, 90);
	    view.gcClosePath();
	    view.gcColor('blue');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 12 subpaths fill
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcLineTo(70, 10);
	    view.gcLineTo(70, 70);
	    view.gcLineTo(10, 70);
	    view.gcClosePath();
	    view.gcMoveTo(30, 30);
	    view.gcLineTo(90, 30);
	    view.gcLineTo(90, 90);
	    view.gcLineTo(30, 90);
	    view.gcClosePath();
	    view.gcColor('teal');
	    view.gcFill();
	},
	function(view) { // 13 subpaths fill
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcLineTo(90, 10);
	    view.gcLineTo(90, 90);
	    view.gcLineTo(10, 90);
	    view.gcClosePath();
	    view.gcMoveTo(30, 30);
	    view.gcLineTo(70, 30);
	    view.gcLineTo(70, 70);
	    view.gcLineTo(30, 70);
	    view.gcClosePath();
	    view.gcColor('teal');
	    view.gcFill();
	},
	function(view) { // 14 rectangles
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcRect(20, 20, 60, 60);
	    view.gcRect(30, 30, 40, 40);
	    view.gcColor('fuchsia')
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 15 circles
	    view.gcBeginPath();
	    view.gcCircle(50, 50, 40);
	    view.gcCircle(50, 50, 30);
	    view.gcCircle(50, 50, 20);
	    view.gcColor('maroon')
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 16 ovals
	    view.gcBeginPath();
	    view.gcOval(50, 50, 40, 20);
	    view.gcOval(50, 50, 20, 40);
	    view.gcColor('magenta')
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 17 fill pattern
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcPattern(Ti.Filesystem.getFile("texture.png").read());
	    view.gcFill(); // pattern is removed after filling
	},
	function(view) { // 18 stroke pattern
	    view.gcBeginPath();
	    view.gcRect(25, 25, 50, 50);
	    view.gcPattern(Ti.Filesystem.getFile("texture.png").read());
	    view.gcLineWidth(20);
	    view.gcStroke(); // pattern is removed after stroking
	},
	function(view) { // 19 transparency
	    view.gcBeginPath();
	    view.gcRect(10, 10, 60, 60);
	    view.gcColor('green');
	    view.gcFill();
	    view.gcBeginPath();
	    view.gcRect(30, 30, 60, 60);
	    view.gcColor([255, 0, 0, 255 * 0.75]);
	    view.gcFill();
	},
	function(view) { // 20 linear gradient
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcLinearGrad(10, 50, 90, 50, 'red', 'orange');
	    view.gcFill(); // gradient is removed after filling
	},
	function(view) { // 21 linear gradient
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcLinearGrad(10, 50, 90, 50, [{position: 0, color: 'red'},
					       {position: 0.2, color: 'orange'},
					       {position: 0.4, color: 'yellow'},
					       {location: 0.6, color: 'green'}, // can use position or location
					       {location: 0.8, color: 'blue'},
					       {location: 1, color: 'purple'}]);
	    view.gcFill();
	},
	function(view) { // 22 radial gradient
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcRadialGrad(50, 50, 0, 50, [{position: 0, color: 'red'},
					      {position: 0.2, color: 'orange'},
					      {position: 0.4, color: 'yellow'},
					      {location: 0.6, color: 'green'},
					      {location: 0.8, color: 'blue'},
					      {location: 1, color: 'purple'}]);
	    view.gcFill();
	},
	function(view) { // 23 radial gradient
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcRadialGrad(50, 50, 20, 50, 'blue', 'purple');
	    view.gcFill();
	},
	function(view) { // 24 cubic curve
	    view.gcBeginPath();
	    view.gcMoveTo(5, 50);
	    view.gcCubicTo(35, 0, 65, 100, 95, 50);
	    view.gcColor('olive');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 25 clip
	    view.gcBeginPath();
	    view.gcCircle(50, 50, 40);
	    view.gcClip();
	    view.gcBeginPath();
	    view.gcRect(0, 0, 100, 100);
	    view.gcRadialGrad(50, 50, 0, 50, [{position: 0, color: 'red'},
					      {position: 0.2, color: 'orange'},
					      {position: 0.4, color: 'yellow'},
					      {location: 0.6, color: 'green'},
					      {location: 0.8, color: 'blue'},
					      {location: 1, color: 'purple'}]);
	    view.gcFill();
	},
	function(view) { // 26 clip/restore
	    view.gcSave();
	    view.gcBeginPath();
	    view.gcCircle(50, 50, 35);
	    view.gcClip();
	    view.gcBeginPath();
	    view.gcRect(0, 0, 100, 100);
	    view.gcLinearGrad(10, 50, 90, 50, [{position: 0, color: 'red'},
					       {position: 0.2, color: 'orange'},
					       {position: 0.4, color: 'yellow'},
					       {location: 0.6, color: 'green'},
					       {location: 0.8, color: 'blue'},
					       {location: 1, color: 'purple'}]);
	    view.gcFill(); // gradient is removed after filling
	    view.gcRestore(); // clipping is removed
	    view.gcLineWidth(20);
	    view.gcColor('white');
	    view.gcStroke();
	},
	function(view) { // 27 scale
	    view.gcScale(10, 10);
	    view.gcBeginPath();
	    view.gcRect(1, 1, 8, 8);
	    view.gcColor('cyan');
	    view.gcLineWidth(1);
	    view.gcStroke();
	},
	function(view) { // 28 translate
	    view.gcTranslate(10, 10);
	    view.gcBeginPath();
	    view.gcRect(0, 0, 80, 80);
	    view.gcColor('brown');
	    view.gcStroke();
	},
	function(view) { // 29 rotate
	    view.gcTranslate(50, 50);
	    view.gcRotate(20);
	    view.gcBeginPath();
	    view.gcRect(-30, -30, 60, 60);
	    view.gcColor('lime');
	    view.gcFill();
	},
	function(view) { // 30 rotate/restore
	    view.gcTranslate(50, 50);
	    view.gcSave();
	    view.gcRotate(20);
	    view.gcBeginPath();
	    view.gcRect(-30, -30, 60, 60);
	    view.gcColor('silver');
	    view.gcFill();
	    view.gcRestore();
	    view.gcBeginPath();
	    view.gcRect(-30, -30, 60, 60);
	    view.gcColor('#80ff');
	    view.gcFill();
	},
	function(view) { // 31 clockwise ovular arc
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcArcTo(50, 50, 20, 40, -90, 90);
	    view.gcColor('yellow');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 32 counterclockwise arc
	    view.gcBeginPath();
	    view.gcMoveTo(10, 90);
	    view.gcArcTo(50, 50, 40, 40, 90, -90, true);
	    view.gcColor('yellow');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 33 arc
	    view.gcBeginPath();
	    view.gcMoveTo(50, 90);
	    view.gcArcTo(50, 50, 40, 40, 90, 90 - 2);
	    view.gcColor('yellow');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 34 quadratic curve
	    view.gcBeginPath();
	    view.gcMoveTo(5, 50);
	    view.gcQuadTo(50, 100, 95, 50);
	    view.gcColor('olive');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 35 reusing path
	    view.gcBeginPath();
	    view.gcCircle(50, 50, 30);
	    view.gcColor('lime')
	    view.gcFill();
	    view.gcColor('pink');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 36 drawing (stretched) image
	    view.gcBeginPath();
	    view.gcCircle(50, 50, 45);
	    view.gcClip();
	    view.gcDrawImage(Ti.Filesystem.getFile("texture.png").read(), 0, 0, 64, 64, 0, 0, 100, 100);
	},
	function(view) { // 37 reusing path
	    view.gcBeginPath();
	    view.gcRect(10, 10, 60, 60);
	    view.gcColor('pink');
	    view.gcFill();
	    view.gcTranslate(20, 20);
	    view.gcRotate(-20);
	    view.gcColor('orange');
	    view.gcFill();
	},
	function(view) { // 38 fill pattern, url
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    view.gcPattern("texture.png");
	    view.gcFill(); // pattern is removed after filling
	},
	function(view) { // 39 fill pattern, cached
	    view.gcBeginPath();
	    view.gcRect(10, 10, 80, 80);
	    var b = Draw.createBitmap("texture.png");
	    view.gcPattern(b);
	    Ti.API.debug("texture.png DIMENSIONS = " + b.width + "x" + b.height);
	    view.gcFill(); // pattern is removed after filling
	},
	function(view) { // 40 counterclockwise arc
	    view.gcBeginPath();
	    view.gcMoveTo(10, 10);
	    view.gcArcTo(50, 50, 40, 40, -180, 0, true);
	    view.gcColor('yellow');
	    view.gcLineWidth(5);
	    view.gcStroke();
	},
	function(view) { // 41 text
	    view.gcFont({fontFamily: 'Whitehall', fontSize: 10});
	    Ti.API.debug("TEXT WIDTH = " + view.gcGetTextWidth("text", {fontFamily: 'Whitehall', fontSize: 10}));
	    view.gcColor('red');
	    view.gcText("text", 10, 50);
	},
	function(view) { // 42 text
	    view.gcFont({fontFamily: 'Whitehall', fontSize: 20});
	    Ti.API.debug("TEXT WIDTH = " + view.gcGetTextWidth("text", {fontFamily: 'Whitehall', fontSize: 20}));
	    view.gcPattern("texture.png");
	    view.gcRotate(-10);
	    view.gcText("text", 10, 50);
	},
	function(view) { // 43 skew
	    view.gcSkew(0.5, 0.25);
	    view.gcBeginPath();
	    view.gcRect(10, 10, 50, 50);
	    view.gcColor('blue');
	    view.gcFill();
	},
	function(view) { // 43 shadow
	    view.gcShadow('white', 10, 0, 0);
	    view.gcBeginPath();
	    view.gcRect(10, 20, 80, 10);
	    view.gcColor('blue');
	    view.gcFill();
	    view.gcShadow('yellow', 10, 0, 0);
	    view.gcBeginPath();
	    view.gcRect(45, 10, 10, 80);
	    view.gcColor('red');
	    view.gcFill();
	    view.gcShadow();
	    view.gcBeginPath();
	    view.gcRect(10, 80, 80, 10);
	    view.gcColor('yellow');
	    view.gcFill();
	}
    ];
    // ------------------------------------------------------------------------------------------------------------------------
    // DISPLAY CANVASES AND CANVAS VIEWS
    var win = Ti.UI.createWindow({
	title: "Canvas Test",
	fullscreen: true,
	backgroundColor: 'black',
	exitOnClose: true
    });
    var scrview = Ti.UI.createScrollView({
	width: Ti.UI.FILL, height: Ti.UI.FILL,
	contentWidth: Ti.UI.FILL, contentHeight: Ti.UI.SIZE,
	scrollType: 'vertical',
	showVerticalScrollIndicator: true,
	layout: 'vertical'
    });
    for (var i = 0, ie = tests.length; i < ie; ++i) {
	var disp = Ti.UI.createView({
	    width: Ti.UI.SIZE, height: Ti.UI.SIZE,
	    layout: 'horizontal',
	    top: 10
	});
	disp.add(Ti.UI.createLabel({
	    width: Ti.UI.SIZE, height: Ti.UI.SIZE,
	    text: (i + 1).toString(),
	    color: 'darkgray'
	}));
	var xydim = Ti.Platform.osname === 'android' ? '100px' : '100dp';
	// --------------------------------------------------------------------------------
	// CANVAS
	var canv = Draw.createCanvas(100, 100);
	Ti.API.debug("Canvas " + (i + 1));
	tests[i](canv); // draw onto canvas
	disp.add(Ti.UI.createImageView({
	    width: xydim, height: xydim,
	    image: canv.getBlob(),
	    backgroundColor: 'black',
	    borderColor: 'darkgray',
	    borderWidth: 1
	}));
	// CANVASVIEW
	var view = Draw.createCanvasView({
	    width: xydim, height: xydim,
	    backgroundColor: 'black',
	    borderColor: 'darkgray',
	    borderWidth: 1
	});
	Ti.API.debug("CanvasView " + (i + 1));
	tests[i](view); // draw onto view
	view.gcDone();
	disp.add(view);
	// --------------------------------------------------------------------------------
	scrview.add(disp);	
    }
    win.add(scrview);
    win.open();
})();
