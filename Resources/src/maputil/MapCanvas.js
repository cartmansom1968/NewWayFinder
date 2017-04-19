var displayWidth = Ti.Platform.displayCaps.platformWidth;
var displayHeight = Ti.Platform.displayCaps.platformHeight - 20;

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

var Canvas = require('com.plezzus.draw');
//var Menu = require('/src/maputil/MenuOptions');

var dataForStartBox = null;
var serverURL = "http://wilas.techstudio.mobi:8123"; //"http://119.9.92.46:8123";

var startx = -1;
var starty = -1;
var endx = -1;
var endy = -1;

var imgObjStart = null;
var imgObjEnd = null;
var ratio = 1;

var currLoc = null;

var offsetX = 0;
var offsetY = 0;


function getAllLandmarks() {
	return 	dataForStartBox.landmarks;
}

function init(terminal) {
	pullLandmarks(terminal);
}

var rotateAction =  null;

var scrollView = null;
var mapView = null;
var testMode = false;


function createMapCanvas(map,win,ratiox,scrollViewx) {
	ratio = ratiox;
	scrollView = scrollViewx;	
	var displayWidth = Ti.Platform.displayCaps.platformWidth;
	var displayHeight = Ti.Platform.displayCaps.platformHeight - 20;
		
	mapView = Ti.UI.createView({
    	top:0, left:0, width:3875*ratio, height:3034*ratio,
    	backgroundImage:"./maps/"+map
	});	
	
	scrollView.add(mapView);
	
	function reinit() {
		if (imgObjEnd!=null) {
		    mapView.canvas.remove(imgObjEnd);
            imgObjEnd = null;
		}
		if (imgObjStart!=null) {
			mapView.canvas.remove(imgObjStart);
			imgObjStart = null;
		}		
	};
	
	mapView.addEventListener('singletap', function(e) {
		if (mapView.isEditable==true) {
			if (imgObjStart!=null) {
		    	mapView.clearStart();
            	imgObjStart = null;
			}			
			
			startX = e.x;
			startY = e.y;
			mapView.clearPath();
			mapView.addStart(startX, startY);
		} 
	}); 
	
	
	var canvasView = Canvas.createCanvasView({
    	top:0, left:0, width:3875, height:3034,
    	backgroundColor: 'transparent'
	});	
	
	mapView.canvas = canvasView;
	mapView.isEditable = false;
	
	mapView.add(canvasView);
		
	mapView.clear = function() {
		mapView.canvas.gcReset();
		mapView.canvas.gcDone();
		if (imgObjEnd!=null) {
			mapView.canvas.remove(imgObjEnd);
			imgObjEnd = null;
		}
		if (imgObjStart!=null) {
			mapView.canvas.remove(imgObjStart);
			imgObjStart = null;
		}
	};


	mapView.clearPath = function() {
		mapView.canvas.gcReset();
		mapView.canvas.gcDone();
	};
	
	mapView.clearEnd = function() {
		if (imgObjEnd!=null) {
			mapView.canvas.remove(imgObjEnd);
			imgObjEnd = null;
		}
	};
	
	mapView.clearStart = function() {
		if (imgObjStart!=null) {
			mapView.canvas.remove(imgObjStart);
			imgObjStart = null;
		}
	};

	mapView.addStart = function(x,y) {
        startx = Math.round(x*(1/ratio));
        starty = Math.round(y*(1/ratio));
		imgObjStart = Titanium.UI.createButton({
			backgroundImage : "imgs/start.png",
			height : 165 * ratio,
			width : 131 * ratio,
			left : x - offsetX - 65 * ratio,
			top : y - offsetY  - 165 * ratio,
			bubbleParent: false
		});
		
		/*
		imgObjStart.addEventListener('click',function(e) {
			if (mapView.isEditable==true) {
				mapView.canvas.remove(imgObjStart);
				imgObjStart=null;
				startx=-1;
				starty=-1;
				Menu.clearSource();
			}
		});
		*/
		
		mapView.canvas.add(imgObjStart);
	};
	
	mapView.addEnd = function(x,y) {
		endx = Math.round(x*ratio);
		endy = Math.round(y*ratio);
		imgObjEnd = Titanium.UI.createButton({
			backgroundImage : "imgs/end.png",
			height : 165 * ratio,
			width : 131 * ratio,
			left : endx - offsetX - 65 * ratio,
			top : endy - offsetY - 165 * ratio,
			bubbleParent: false
		});
		
		/*
		imgObjEnd.addEventListener('click',function(e) {
			if (mapView.isEditable==true) {
				mapView.canvas.remove(imgObjEnd);
				imgObjEnd=null;
				endx=-1;
				endx=-1;
				Menu.clearDest();
			}
		});
		*/
		
		mapView.canvas.add(imgObjEnd);
	};
	


    mapView.adjustScroll = function(x,y) {
		var scrollX = (x*ratio - offsetX)*scrollView.getZoomScale()-160;//+160;
		var scrollY = (y*ratio - offsetY)*scrollView.getZoomScale()-240;
		
		scrollView.scrollTo(scrollX,scrollY); //y*ratio - offsetY);    		
    };
     
	mapView.drawRoute = function() {
		drawRouteOnCanvas(mapView.canvas,"GWC1","GWC1",null,null,startx,starty,endx,endy);
	};
				
	return mapView;
}



function drawRouteOnCanvas(mapCanvas,startMap,endMap,startLandmark,endLandmark,startX,startY,endX,endY) {
	if (startMap == "") {
		startMap = "GWC1";
	}

	if (endMap == "") {
		endMap = "GWC1";
	}

	startMap == startMap.toUpperCase();
	endMap = endMap.toUpperCase();

	if (startX != "" && startY != "" && endX != "" && endY != "") {
		drawRoute(mapCanvas, startMap, startX, startY, endMap, endX, endY);
	} else {
		alert("You need to define both a start point and an end point");
	}
}

function drawRoute(mapCanvas,startMap,startX,startY,endMap,endX,endY) {
	endx = endX;
	endy = endY;
	var xhr = Ti.Network.createHTTPClient();
	var urlStr = serverURL+"/RouteToDestination?appID=capext&appPwd=pwd&endPts=true&startMapID="+startMap+"&startPtX="+startX+"&startPtY="+startY+"&endMapID="+endMap+"&endPtX="+endX+"&endPtY="+endY;
	Titanium.API.info("URL - "+urlStr);
	xhr.setTimeout(40000);
	xhr.open('GET', urlStr);
	xhr.send();
	xhr.onload = function() {
		var pts = this.responseText;
		var path = JSON.parse(pts);
		Titanium.API.info('Data received = ' + pts);
		displayRouteMulti(mapCanvas,path);
		return true;
	};

	xhr.onerror = function() {
		Titanium.API.info('Failed to connect to server to pull Points');
		return false;
	};		
}

function displayRouteMulti(mapCanvas,path) {
	var noOfMaps = path.routes.length;
	for (var i = 0; i < noOfMaps; ++i) {
		var pathPoints = path.routes[i].route;
		var sX = pathPoints[0].x;
		var sY = pathPoints[0].y;
		var eX = pathPoints[pathPoints.length - 1].x;
		var eY = pathPoints[pathPoints.length - 1].y;
		displayRouteLayer(mapCanvas, pathPoints, sX, sY, eX, eY);
	}
}        

function displayRouteLayer(mapCanvas, pathPoints, startx, starty, endx, endy) {
	var pathObj = new Object();
	pathObj.pathPoints = pathPoints;
	pathObj.startx = startx;
	pathObj.starty = starty;
	pathObj.endx = endx;
	pathObj.endy = endy;
	pathObj.isPoint = false;

	displayMapMulti(mapCanvas, pathObj);
} 
  
function displayMapMulti(mapCanvas,routeObj) {
    if (routeObj!=null) {
      if (routeObj.isPoint==true) {
      	addPoint(routeObj, mapCanvas);
      } else {
        addRoute(routeObj, mapCanvas);
      }
    } 
}

function addPoint(routeObj,mapCanvas) {
	var pointx = routeObj.pointx;
	var pointy = routeObj.pointy;

	var pointImg = Titanium.UI.createImageView({
		image : "imgs/yellowround.png",
		height : 100,
		width : 100,
		top : pointy - 50,
		left : pointx - 50
	});

	mapCanvas.add(pointImg); 
}

function addEndPoint(endPoint,mapCanvas) {
	mapCanvas.add(endPoint);
};

function addRoute(routeObj,mapCanvas) {
	var pathPoints = routeObj.pathPoints;	
    drawPathFromPoints(mapCanvas,pathPoints);
}

function drawPathFromPoints(mapCanvas,pathPoints) {
	mapCanvas.gcBeginPath();
	
	for (var i = 0; i < pathPoints.length - 1; ++i) {
		var startPt = pathPoints[i];
		var endPt = pathPoints[i + 1];		
		Titanium.API.info("======================================================== "+ratio);
		Titanium.API.info("StartX "+(startPt.x*ratio-offsetX)+" StartY "+(startPt.y*ratio-offsetY));
		Titanium.API.info("EndX "+(endPt.x*ratio-offsetX)+" EndY "+(endPt.y*ratio-offsetY));	

		if (i==0) mapCanvas.gcMoveTo((startPt.x*ratio-offsetX), (startPt.y*ratio-offsetY));
		mapCanvas.gcLineTo((endPt.x*ratio-offsetX), (endPt.y*ratio-offsetY));
	}
	
	mapCanvas.gcColor('red');
	mapCanvas.gcLineWidth(5);
	mapCanvas.gcLineCap("round");
	mapCanvas.gcStroke();
	mapCanvas.gcDone();
	
	
	//mapView.addEnd(endx,endy);
}

function drawWalkablePath() {
	var dataObj = require('src/data/gwcpoi');
	var edges = dataObj.getEdges();
	var vertices = dataObj.getVertices();
	
	//Titanium.API.info(JSON.stringify(edges));
	
	var canvas = mapView.canvas;
	//alert("Going to draw "+edges.length+" edges");
	canvas.gcBeginPath();

	for (var i = 0; i < edges.length; i++) {
		var edge = edges[i];

		var start = vertices[edge.start];
		var end = vertices[edge.end];
        //alert("Edge from "+(start.x*ratio-offsetX)+","+ (start.y*ratio-offsetY));
		canvas.gcMoveTo((start.x*ratio-offsetX), (start.y*ratio-offsetY));
        //alert("Edge to "+(end.x*ratio-offsetX)+","+ (end.y*ratio-offsetY));
		canvas.gcLineTo((end.x*ratio-offsetX), (end.y*ratio-offsetY));
	}
	
	canvas.gcColor('green');
	canvas.gcLineWidth(3);
	canvas.gcLineCap("round");
	canvas.gcStroke();
	canvas.gcDone();		
}


exports.init = init;
exports.createMapCanvas = createMapCanvas;
exports.drawRouteOnCanvas = drawRouteOnCanvas;
exports.getAllLandmarks = getAllLandmarks;
exports.drawWalkablePath=drawWalkablePath;

