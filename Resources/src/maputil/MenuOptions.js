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

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

var startPOI = null;
var endPOI = null;

var whereAmISet = false;
var tapSet = false;
var poiSet = false;

var pois = [];
var poiTable = {};

var pathDrawn = false;

var win = null;

var menuView = null;

var macAddress = null;

var mapView = null;

function getMACAddress() {	
	if (macAddress!=null) {
		return macAddress;
	}
	
	var xhr = Ti.Network.createHTTPClient();
	var urlStr = "http://203.116.84.168:7814/IP2Mac?tenantId=GWC&ip="+Titanium.Platform.address;
	Titanium.API.info("URL - "+urlStr);
	xhr.setTimeout(40000);
	xhr.open('GET', urlStr);
	xhr.send();
	xhr.onload = function() {
		var response = this.responseText;
		//alert(">>>>"+response.replace(/-/g, ":"));
		if (response=="No mac address") {
			alert("Could not retrieve macaddress for IP address "+Titanium.Platform.address+" for this device from the Captive Portal. Please log on to the captive portal, and try again.");
		} else {
			macAddress = response.replace(/-/g, ":");
		}
		
		if (macAddress==null) {
			macAddress = "68:DB:CA:94:77:B2";
		}
	
		return macAddress;
	};

	xhr.onerror = function() {
		Titanium.API.info('Failed to connect to server');
		macAddress = "68:DB:CA:94:77:B2";
		return macAddress;
	};		
}

function getCurrLocation(macaddress) {
	//if (macAddress!=null) {
	//	startX = 2673;
	//	startY = 1577;
	//	return;
	//}
	var xhr = Ti.Network.createHTTPClient();
	var urlStr = "http://203.116.84.168:8813/LastSeen?tenantId=GreatWorldCity&mac="+macaddress+"&threshold=90000";
	xhr.setTimeout(40000);
	xhr.open('GET', urlStr);
	xhr.send();

	xhr.onload = function() {
		var data = this.responseText;
		
		Titanium.API.info('Data received = ' + data);
		if (data == null) {
			return;
		}
		
		var temp = JSON.parse(data);
		if (temp.status=="success") {
			if (temp.mapId="195") { 
				startX = Math.round(temp.x);
				startY = Math.round(temp.y);
				mapView.addPoint(startX,startY);
				mapView.adjustScroll(startX,startY);
			}
		} 
		return true;
	};

	xhr.onerror = function(e) {
		alert("Could not connect to server to get location. Try again later.");
		return false;
	};	
}

function setWindow(winx) {
	win = winx;
}

function initPOIs() {
	var dataObj = require('src/data/gwcpoi');
	//pois = JSON.parse(dataObj.POIs);
	pois = dataObj.getPOIs();
	
	for (var i=0;i<pois.length;++i) {
		poiTable[pois[i].description] = pois[i];
	}		
}

function menuButtonObject(xtitle, xtop, xleft, xheight, xwidth, callback) {
	var imgButton = Ti.UI.createButton({
		borderColor : '#404040',
		borderWidth : 2,
		borderRadius : 10,
		backgroundColor : '#404040',
		title : xtitle,
		color : '#d9d9d9',
		font : {
			fontSize : renderW(14)
		},
		top : renderW(xtop),
		width : renderW(xwidth),
		height : renderW(xheight),
		left : renderW(xleft)
	});

	if (callback != null) {
		imgButton.addEventListener('click', function(e) {
			callback(this.title);
		});
	}

	return imgButton;
}

var sourceWMIBtn = null;
var sourceTapBtn = null;
var sourcePOIBtn = null;
var destPOIBtn = null;



function createMenu() { 
	var menuObjectBaseView = Ti.UI.createView({
		top : renderW(10),
		height : renderW(60),
		width : renderW(320),
		backgroundColor : 'transparent',
		opacity : 1.0,
		zIndex : 10
	});
	
	var sourceLabel = Ti.UI.createLabel({
  		color: '#008000',
  		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 16,
			fontWeight : 'bold'
		},
  		//font: { fontSize:14},
  		text: 'Source',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		top: 0,
  		width:renderW(160), 
  		height: renderW(20)	
	});
	
	var sourceView = Ti.UI.createView({
		top : renderW(0),
		height : renderW(60),
		width : renderW(160),
		left : renderW(5),
		borderColor : '#d9d9d9',
		borderWidth : renderW(1),
		borderRadius : renderW(5),
		backgroundColor : '#d9d9d9',
		opacity : 1.0
	});
	
	menuObjectBaseView.add(sourceView);
	
	sourceView.add(sourceLabel);
		
	sourceWMIBtn = Titanium.UI.createImageView({
		image : "/imgs/whereamiOff.png",
		width : renderW(30),
		height : renderW(30),
		top : renderW(25),
		left : renderW(5),
		canScale : true,
		enableZoomControls : false,
		zIndex : 10
	});
	
	sourceWMIBtn.addEventListener('click', function(e) {
		mapView.clearStart();
		mapView.clearPath();
		sourceWMIBtn.setImage("/imgs/whereami.png");
		whereAmISet = true;
		sourceTapBtn.setImage("/imgs/tapOff.png");
		tapSet = false;
		sourcePOIBtn.setColor("#808080");
		poiSet = false;
		//var macAddress = getMACAddress();
		getCurrLocation(macAddress);
		//mapView.addStart(startX,startY);	
	    //mapView.adjustScroll(startX,startY);
		mapView.isEditable = false;
    });

	sourceView.add(sourceWMIBtn);
	
	sourceTapBtn = Titanium.UI.createImageView({
		image : "/imgs/tapOff.png",
		width : renderW(30),
		height : renderW(30),
		top : renderW(25),
		left : renderW(45),
		canScale : true,
		enableZoomControls : false,
		zIndex : 10
	});
	
	sourceTapBtn.addEventListener('click', function(e) {
		//mapView.clearStart();
		sourceWMIBtn.setImage("/imgs/whereamiOff.png");
		whereAmISet = false;
		sourceTapBtn.setImage("/imgs/tap.png");
		tapSet = true;
		sourcePOIBtn.setColor("#808080");
		poiSet = false;
		mapView.isEditable = true;
    });
    
    sourceView.add(sourceTapBtn);
    
    function activateSourcePOIBtn(poi,btn) {
    	sourceWMIBtn.setImage("/imgs/whereamiOff.png");
		whereAmISet = false;
		sourceTapBtn.setImage("/imgs/tapOff.png");
		tapSet = false;
		sourcePOIBtn.setColor("white");
		poiSet = true;
		mapView.isEditable = false;
		
    	function setPOI(poi) {
    		startPOI = poi;
    		startX = poiTable[poi].x;
    		startY = poiTable[poi].y;   
    		mapView.clearStart();
 	  		mapView.clearPath();
    		mapView.addStart(startX,startY);
    		mapView.adjustScroll(startX,startY);
    	}
    	    	
    	launchPOIPicker(win,setPOI,pois); 
    }
    
    sourcePOIBtn = menuButtonObject("Start POI", 25,85,30,70, activateSourcePOIBtn); 
  
  	sourceView.add(sourcePOIBtn);
  	
  	
	var destLabel = Ti.UI.createLabel({
  		color: '#e62e00',
  		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 16,
			fontWeight : 'bold'
		},
  		text: 'Destination',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		top: 0,
  		width:renderW(80), 
  		height: renderW(20)	
	});
	
	var destView = Ti.UI.createView({
		top : renderW(0),
		height : renderW(60),
		width : renderW(80),
		left : renderW(170),
		borderColor : '#d9d9d9',
		borderWidth : renderW(1),
		borderRadius : renderW(5),
		backgroundColor : '#d9d9d9',
		opacity : 1.0
	});
	
	menuObjectBaseView.add(destView);
	
	destView.add(destLabel);
		  
    function activateDestPOIBtn(poi,btn) {    	
    	function setPOI(poi) {
    		endPOI = poi;
    		endX = poiTable[poi].x;
    		endY = poiTable[poi].y;   		
    		mapView.clearEnd();
    		mapView.clearPath();
    		mapView.addEnd(endX,endY);
		    mapView.adjustScroll(endX,endY);
    	}
    	    	
    	launchPOIPicker(win,setPOI,pois); 
    }
    
    destPOIBtn = menuButtonObject("End POI", 25, 5, 30, 70, activateDestPOIBtn); 
    
    destPOIBtn.setColor("white");
  
  	destView.add(destPOIBtn);
  	
	playBtn = Titanium.UI.createImageView({
		image : "/imgs/play.png",
		width : renderW(40),
		height : renderW(40),
		top : renderW(10),
		right : renderW(15),
		canScale : true,
		enableZoomControls : false,
		zIndex : 10
	});
	
	playBtn.addEventListener('click', function(e) {
		mapView.clearPath();
		mapView.drawRoute();
		//if (startX>0 && startY>0) {
		//	mapView.adjustScroll();
		//}
    });
    
    menuObjectBaseView.add(playBtn);  	

	return menuObjectBaseView;  	 
};
      
function getPickerIPhone(pois) { 
    var index = 0;
    var rows = [];
    var isSelected = false;
    //var pois = getPOIList();
    for (var i = 0; i < pois.length; i++) {
      if (i==0) {
        isSelected = true;
      } else {
        isSelected = false;
      }
      Titanium.API.info("------- ["+pois[i].description+"]  "+ isSelected);
      rows.push({title: pois[i].description,
                 custom_item: pois[i].description,
                 fontSize:14,
                 selected: isSelected});
    }

    var picker = Ti.UI.createPicker({
      type : Ti.UI.PICKER_TYPE_PLAIN,
      top: renderW(40),
      height: renderW(210),
    });
    
    picker.selection = "";
    picker.addEventListener('change', function (e) {
      picker.selection = e.selectedValue[0];
    });
    
    picker.selectionIndicator = true;
    picker.add(rows);
    return picker;
}
  
var pickerView = null;

function getPickerView(picker,win,func,pois) {
	if (pickerView!=null) {
		return;
	}
	pickerView = Ti.UI.createView({opacity:1.0, height:renderW(250),/*top:topVal*/ bottom:0,backgroundColor:'white'});

	var cancel = Titanium.UI.createButton({
		title : 'Cancel',
		style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});

	var done = Titanium.UI.createButton({
		title : 'Done',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
   
	var spacer = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar = Titanium.UI.createToolbar({
		top : 0,
		items : [cancel, spacer, done]
	});

  pickerView.add(toolbar);
  pickerView.add(picker);
  
  done.addEventListener('click',function(x) {  
	//if (currDest != picker.selection) {
		for (var i = 0; i < pois.length; i++) {
			if (pois[i].description==picker.selection) {
				func(pois[i].description);
				break;
			};
		}

		win.remove(pickerView);
		pickerView = null;
	//} else {
	//	win.remove(pickerView);
	//	pickerView = null;
	//}
  });  

  cancel.addEventListener('click',function(x) {
    if (pickerView) {
      win.remove(pickerView);
      pickerView=null;
    }
  });  

  win.add(pickerView);
  return pickerView;
}  

function launchPOIPicker(win,func,pois) {
	if (pickerView!=null) {
		win.remove(pickerView);
		pickerView = null;
	}
	var picker = getPickerIPhone(pois);
	pickerView = getPickerView(picker,win,func,pois);
	return pickerView; 	
}

function initMenu(winx) {
	win = winx;
	initPOIs();
	getMACAddress();
	menu = createMenu();
	win.add(menu);
}

function setCanvas(canvas) {
	mapView = canvas;
}

function resetMenu() {
	
}

exports.initMenu=initMenu;
exports.setWin=setWindow;
exports.launchPOIPicker=launchPOIPicker;
exports.resetMenu=resetMenu;
exports.setCanvas=setCanvas;
