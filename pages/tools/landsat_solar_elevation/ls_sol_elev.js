

//####################################################################
//####                    MAPPING AND PLOTTING                    ####
//####################################################################

// set global vars
var lat
var lng
var tz
var time
var mdy = []
var xy = []
var chart

// define the map baselayer
var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri'// &mdash;'// Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community
});

// create the map
var map = L.map('map').setView([20, 0], 2)

// function to change the <p> text
function changeElmt(id, key, value, scale){
    var myelement = document.getElementById(id);
    myelement.innerHTML= key+(Math.round(value*scale)/scale).toString();
}

// function to the estimate the local time of landsat passover
function getLandsatTime(lat){
    //y = 4E-06x3 - 1E-05x2 + 0.0038x + 9.9163  //R² = 0.9937   added .25 to yint to set in middle of estimated LS local time - 3rd order poly i think the elliptical spheriod shape of earth fits better 
    /* 3rd order poly i think the elliptical spheriod shape of earth fits better 
    LocalTime	Latitude
    8.13	-70.91472
    9.251944444	-46.03361
    9.966111111	0.00376
    10.43805556	43.18124
    10.82027778	60.08911
    11.69361111	70.91074
    */
    var lsTime = 0.000004 * Math.pow(lat,3) - 0.00001 * Math.pow(lat,2) + 0.0038*lat + 10.1663
    return lsTime
}

// function to get annual solar elevation
function getAnnualSolEl(){
    for(var i=0;i<mdy.length;i++){
        var solEl = calculate(lat, lng, mdy[i].month, mdy[i].day, mdy[i].year, time, tz)
        mdy[i].solEl = solEl
        xy[i].y = solEl
    }   
}

// function to plot solar elevation
function plotSolEl(){
    var ctx = document.getElementById('plot').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',

        // The data for our dataset
        data: {
            //labels: 'scatter',
            datasets: [{
                label: "Solar Elevation",
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                borderColor: 'rgb(98, 184, 234)',
                borderWidth: 2,
                //showLine: false,
                pointRadius: 2,
                pointHoverRadius: 5,
                data: xy
            }
        ]},
        options: {
            tooltips:{
                displayColors: false    
            },
            legend:{
                display:false
            },
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Day-of-Year'
                    },
                    ticks: {
                        min: 1,
                        max: 365,
                        stepSize: 73
                    } 
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Solar Elevation (degrees)'
                    },
                    ticks: {
                        min: 0,
                        max: 90
                    }
                }]
            }
        }
    });
}
    
// function to get the time zone from the longitude
function getZone(lng){
    var zone;
    if(lng < -172.5){zone = 12} 
    if(lng >= -172.5 & lng < -157.5){zone = -11} else
    if(lng >= -157.5 & lng < -142.5){zone = -10} else
    if(lng >= -142.5 & lng < -127.5){zone =  -9} else
    if(lng >= -127.5 & lng < -112.5){zone =  -8} else
    if(lng >= -112.5 & lng <  -97.5){zone =  -7} else
    if(lng >=  -97.5 & lng <  -82.5){zone =  -6} else
    if(lng >=  -82.5 & lng <  -67.5){zone =  -5} else
    if(lng >=  -67.5 & lng <  -52.5){zone =  -4} else
    if(lng >=  -52.5 & lng <  -37.5){zone =  -3} else
    if(lng >=  -37.5 & lng <  -22.5){zone =  -2} else
    if(lng >=  -22.5 & lng <   -7.5){zone =  -1} else
    if(lng >=   -7.5 & lng <    7.5){zone =   0} else
    if(lng >=    7.5 & lng <   22.5){zone =   1} else
    if(lng >=   22.5 & lng <   37.5){zone =   2} else
    if(lng >=   37.5 & lng <   52.5){zone =   3} else
    if(lng >=   52.5 & lng <   67.5){zone =   4} else
    if(lng >=   67.5 & lng <   82.5){zone =   5} else
    if(lng >=   82.5 & lng <   97.5){zone =   6} else
    if(lng >=   97.5 & lng <  112.5){zone =   7} else
    if(lng >=  112.5 & lng <  127.5){zone =   8} else
    if(lng >=  127.5 & lng <  142.5){zone =   9} else
    if(lng >=  142.5 & lng <  157.5){zone =  10} else
    if(lng >=  157.5 & lng <  172.5){zone =  11} else
    if(lng >=  172.5){zone =  12}
    return zone
}

// event handler for map click to capture lat and long at cursor
map.on('click', function(e) {             

    lat = map.wrapLatLng(e.latlng).lat;
    lng = map.wrapLatLng(e.latlng).lng;
    tz = getZone(lng);
    time = getLandsatTime(lat)

    getAnnualSolEl();

    chart.data.datasets[0].data = xy;
    chart.update();
    changeElmt("lat", "Lat: ", lat, 1000)
    changeElmt("lng", "Lng: ", lng, 1000)
    changeElmt("tz", "Time Zone: ", tz, 1)
    changeElmt("tm", "Time: ", time, 100)
});


//####################################################################
//####               SOLAR ELEVATION CALCULATION                  ####
//####    source: https://www.esrl.noaa.gov/gmd/grad/solcalc/     ####
//####################################################################


/* Commented out - Justin Braaten  06/07/2017
//###############################################################
//## Cookie Functions for saving favorite location             ##
//###############################################################

function getCookieVal (offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1)
  endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie (name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i,j) == arg)
      return getCookieVal(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
  }
  return null;
}

function SetCookie (name, value) {
  var argv = SetCookie.arguments;
  var argc = SetCookie.arguments.length;
  var expires = (argc > 2) ? argv[2] : null;
  var path = (argc > 3) ? argv[3] : null;
  var domain = (argc > 4) ? argv[4] : null;
  var secure = (argc > 5) ? argv[5] : null;
  document.cookie = name + "=" + escape (value) + 
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + 
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == null) ? "; secure" : "");
}

function DeleteCookie (name) {
  var exp = new Date();
  exp.setTime (exp.getTime() - 1);
  var cval = GetCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function saveCookie () {
  var expdate = new Date();
  expdate.setTime (expdate.getTime() + (365 * 24 * 60 * 60 * 1000));
  SetCookie ("lat", document.getElementById("latbox").value, expdate, null, null, false);
  SetCookie ("lng", document.getElementById("lngbox").value, expdate, null, null, false);
  SetCookie ("gmt", document.getElementById("zonebox").value, expdate, null, null, false);
}
*/

function calcTimeJulianCent(jd)
{
  var T = (jd - 2451545.0)/36525.0
  return T
}

function calcJDFromJulianCent(t)
{
  var JD = t * 36525.0 + 2451545.0
  return JD
}

function isLeapYear(yr) 
{
  return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
}

/* Commented out - Justin Braaten  06/07/2017    
function calcDoyFromJD(jd)
{
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  if (z < 2299161) {
    var A = z;
  } else {
    alpha = Math.floor((z - 1867216.25)/36524.25);
    var A = z + 1 + alpha - Math.floor(alpha/4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1)/365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D)/30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = (month > 2) ? C - 4716 : C - 4715;

  var k = (isLeapYear(year) ? 1 : 2);
  var doy = Math.floor((275 * month)/9) - k * Math.floor((month + 9)/12) + day -30;
  return doy;
}
*/


function radToDeg(angleRad) 
{
  return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg) 
{
  return (Math.PI * angleDeg / 180.0);
}

function calcGeomMeanLongSun(t)
{
  var L0 = 280.46646 + t * (36000.76983 + t*(0.0003032))
  while(L0 > 360.0)
  {
    L0 -= 360.0
  }
  while(L0 < 0.0)
  {
    L0 += 360.0
  }
  return L0		// in degrees
}

function calcGeomMeanAnomalySun(t)
{
  var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  return M;		// in degrees
}

function calcEccentricityEarthOrbit(t)
{
  var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  return e;		// unitless
}

function calcSunEqOfCenter(t)
{
  var m = calcGeomMeanAnomalySun(t);
  var mrad = degToRad(m);
  var sinm = Math.sin(mrad);
  var sin2m = Math.sin(mrad+mrad);
  var sin3m = Math.sin(mrad+mrad+mrad);
  var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
  return C;		// in degrees
}

function calcSunTrueLong(t)
{
  var l0 = calcGeomMeanLongSun(t);
  var c = calcSunEqOfCenter(t);
  var O = l0 + c;
  return O;		// in degrees
}

function calcSunTrueAnomaly(t)
{
  var m = calcGeomMeanAnomalySun(t);
  var c = calcSunEqOfCenter(t);
  var v = m + c;
  return v;		// in degrees
}

function calcSunRadVector(t)
{
  var v = calcSunTrueAnomaly(t);
  var e = calcEccentricityEarthOrbit(t);
  var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
  return R;		// in AUs
}

function calcSunApparentLong(t)
{
  var o = calcSunTrueLong(t);
  var omega = 125.04 - 1934.136 * t;
  var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
  return lambda;		// in degrees
}

function calcMeanObliquityOfEcliptic(t)
{
  var seconds = 21.448 - t*(46.8150 + t*(0.00059 - t*(0.001813)));
  var e0 = 23.0 + (26.0 + (seconds/60.0))/60.0;
  return e0;		// in degrees
}

function calcObliquityCorrection(t)
{
  var e0 = calcMeanObliquityOfEcliptic(t);
  var omega = 125.04 - 1934.136 * t;
  var e = e0 + 0.00256 * Math.cos(degToRad(omega));
  return e;		// in degrees
}

/* Commented out - Justin Braaten  06/07/2017 
function calcSunRtAscension(t)
{
  var e = calcObliquityCorrection(t);
  var lambda = calcSunApparentLong(t);
  var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
  var tanadenom = (Math.cos(degToRad(lambda)));
  var alpha = radToDeg(Math.atan2(tananum, tanadenom));
  return alpha;		// in degrees
}
*/

function calcSunDeclination(t)
{
  var e = calcObliquityCorrection(t);
  var lambda = calcSunApparentLong(t);

  var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
  var theta = radToDeg(Math.asin(sint));
  return theta;		// in degrees
}

function calcEquationOfTime(t)
{
  var epsilon = calcObliquityCorrection(t);
  var l0 = calcGeomMeanLongSun(t);
  var e = calcEccentricityEarthOrbit(t);
  var m = calcGeomMeanAnomalySun(t);

  var y = Math.tan(degToRad(epsilon)/2.0);
  y *= y;

  var sin2l0 = Math.sin(2.0 * degToRad(l0));
  var sinm   = Math.sin(degToRad(m));
  var cos2l0 = Math.cos(2.0 * degToRad(l0));
  var sin4l0 = Math.sin(4.0 * degToRad(l0));
  var sin2m  = Math.sin(2.0 * degToRad(m));

  var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
  return radToDeg(Etime)*4.0;	// in minutes of time
}

/* Commented out - Justin Braaten  06/07/2017 
function calcHourAngleSunrise(lat, solarDec)
{
  var latRad = degToRad(lat);
  var sdRad  = degToRad(solarDec);
  var HAarg = (Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));
  var HA = Math.acos(HAarg);
  return HA;		// in radians (for sunset, use -HA)
}
 
function isNumber(inputVal) 
{
  var oneDecimal = false;
  var inputStr = "" + inputVal;
  for (var i = 0; i < inputStr.length; i++) 
  {
    var oneChar = inputStr.charAt(i);
    if (i == 0 && (oneChar == "-" || oneChar == "+"))
    {
      continue;
    }
    if (oneChar == "." && !oneDecimal) 
    {
      oneDecimal = true;
      continue;
    }
    if (oneChar < "0" || oneChar > "9")
    {
      return false;
    }
  }
  return true;
}

function zeroPad(n, digits) {
  n = n.toString();
  while (n.length < digits) {
    n = '0' + n;
  }
  return n;
}
 
function readTextBox(inputId, numchars, intgr, pad, min, max, def)
{
  var number = document.getElementById(inputId).value.substring(0,numchars)
  if (intgr) {
    number = Math.floor(parseFloat(number))
  } else {  // float
    number = parseFloat(number)
  }
  if (number < min) {
    number = min
  } else if (number > max) {
    number = max
  } else if (number.toString() == "NaN") {
    number = def
  }
  if ((pad) && (intgr)) {
    document.getElementById(inputId).value = zeroPad(number,2)
  } else {
    document.getElementById(inputId).value = number
  }
  return number
}
*/

monthList = [
	{name: "January",   numdays: 31, abbr: "Jan"},
	{name: "February",  numdays: 28, abbr: "Feb"},
	{name: "March",     numdays: 31, abbr: "Mar"},
	{name: "April",     numdays: 30, abbr: "Apr"},
	{name: "May",       numdays: 31, abbr: "May"},
	{name: "June",      numdays: 30, abbr: "Jun"},
	{name: "July",      numdays: 31, abbr: "Jul"},
	{name: "August",    numdays: 31, abbr: "Aug"},
	{name: "September", numdays: 30, abbr: "Sep"},
	{name: "October",   numdays: 31, abbr: "Oct"},
	{name: "November",  numdays: 30, abbr: "Nov"},
	{name: "December",  numdays: 31, abbr: "Dec"},
];
    
//######################################################################
//######################################################################    
// Added - Justin Braaten  06/07/2017
function makeDataHolders(){
    var count = 0
    for(var m=0;m<monthList.length;m++){
        for(var d=0;d<monthList[m].numdays;d++){
            count++
            mdy.push({month:m+1, day:d+1, year:2015, solEl:0});
            xy.push({x: count, y: 0});
        }
    }
}
//######################################################################
//######################################################################   

function getJD(docmonth, docday, docyear)
{
  /* Commented out - Justin Braaten  06/07/2017
  var docmonth = document.getElementById("mosbox").selectedIndex + 1
  var docday =   document.getElementById("daybox").selectedIndex + 1
  var docyear =  readTextBox("yearbox", 5, 1, 0, -2000, 3000, 2009)
  */
  if ( (isLeapYear(docyear)) && (docmonth == 2) ) {
    if (docday > 29) {
      docday = 29
      //document.getElementById("daybox").selectedIndex = docday - 1 // Commented out - Justin Braaten  06/07/2017
    } 
  } else {
    if (docday > monthList[docmonth-1].numdays) {
      docday = monthList[docmonth-1].numdays
      //document.getElementById("daybox").selectedIndex = docday - 1 // Commented out - Justin Braaten  06/07/2017
    }
  }
  if (docmonth <= 2) {
    docyear -= 1
    docmonth += 12
  }
  var A = Math.floor(docyear/100)
  var B = 2 - A + Math.floor(A/4)
  var JD = Math.floor(365.25*(docyear + 4716)) + Math.floor(30.6001*(docmonth+1)) + docday + B - 1524.5
  return JD
}

function getTimeLocal(dochr, docmn, docsc, docpm, docdst)
{
  /* Commented out - Justin Braaten  06/07/2017
  var dochr = readTextBox("hrbox", 2, 1, 1, 0, 23, 12)
  var docmn = readTextBox("mnbox", 2, 1, 1, 0, 59, 0)
  var docsc = readTextBox("scbox", 2, 1, 1, 0, 59, 0)
  var docpm = document.getElementById("pmbox").checked
  var docdst = document.getElementById("dstCheckbox").checked
  */
  if ( (docpm) && (dochr < 12) ) {
    dochr += 12
  }
  if (docdst) {
    dochr -= 1
  }
  var mins = dochr * 60 + docmn + docsc/60.0
  return mins
}

function calcAzEl(output, T, localtime, latitude, longitude, zone) //calcAzEl(1, T, tl, lat, lng, tz)
{
  var eqTime = calcEquationOfTime(T)
  var theta  = calcSunDeclination(T)
  /* Commented out - Justin Braaten  06/07/2017
  if (output) {
    document.getElementById("eqtbox").value = Math.floor(eqTime*100 +0.5)/100.0
    document.getElementById("sdbox").value = Math.floor(theta*100+0.5)/100.0
  }
  */
  var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone
  var earthRadVec = calcSunRadVector(T)
  var trueSolarTime = localtime + solarTimeFix
  while (trueSolarTime > 1440)
  {
    trueSolarTime -= 1440
  }
  var hourAngle = trueSolarTime / 4.0 - 180.0;
  if (hourAngle < -180) 
  {
    hourAngle += 360.0
  }
  var haRad = degToRad(hourAngle)
  var csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(theta)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(theta)) * Math.cos(haRad)
  if (csz > 1.0) 
  {
    csz = 1.0
  } else if (csz < -1.0) 
  { 
    csz = -1.0
  }
  var zenith = radToDeg(Math.acos(csz))
  var azDenom = ( Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)) )
  if (Math.abs(azDenom) > 0.001) {
    azRad = (( Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith)) ) - Math.sin(degToRad(theta))) / azDenom
    if (Math.abs(azRad) > 1.0) {
      if (azRad < 0) {
	azRad = -1.0
      } else {
	azRad = 1.0
      }
    }
    var azimuth = 180.0 - radToDeg(Math.acos(azRad))
    if (hourAngle > 0.0) {
      azimuth = -azimuth
    }
  } else {
    if (latitude > 0.0) {
      azimuth = 180.0
    } else { 
      azimuth = 0.0
    }
  }
  if (azimuth < 0.0) {
    azimuth += 360.0
  }
  var exoatmElevation = 90.0 - zenith

// Atmospheric Refraction correction

  if (exoatmElevation > 85.0) {
    var refractionCorrection = 0.0;
  } else {
    var te = Math.tan (degToRad(exoatmElevation));
    if (exoatmElevation > 5.0) {
      var refractionCorrection = 58.1 / te - 0.07 / (te*te*te) + 0.000086 / (te*te*te*te*te);
    } else if (exoatmElevation > -0.575) {
      var refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711) ) );
    } else {
      var refractionCorrection = -20.774 / te;
    }
    refractionCorrection = refractionCorrection / 3600.0;
  }

  var solarZen = zenith - refractionCorrection;
  
  /*
  if ((output) && (solarZen > 108.0) ) {
    document.getElementById("azbox").value = "dark"
    document.getElementById("elbox").value = "dark"
  } else if (output) {
    document.getElementById("azbox").value = Math.floor(azimuth*100 +0.5)/100.0
    document.getElementById("elbox").value = Math.floor((90.0-solarZen)*100+0.5)/100.0
    if (document.getElementById("showae").checked) {
      showLineGeodesic2("azimuth", "#ffff00", azimuth)
    }
  }
  */
    
//######################################################################
//######################################################################    
// Added - Justin Braaten  06/07/2017
  var solEl = Math.floor((90.0-solarZen)*100+0.5)/100.0
  return (solEl)
//######################################################################    
//######################################################################

//  return (azimuth) // Commented out - Justin Braaten  06/07/2017
  
}

/* Commented out - Justin Braaten 06/07/2017     
function calcSolNoon(jd, longitude, timezone, dst)
{
  var tnoon = calcTimeJulianCent(jd - longitude/360.0)
  var eqTime = calcEquationOfTime(tnoon)
  var solNoonOffset = 720.0 - (longitude * 4) - eqTime // in minutes
  var newt = calcTimeJulianCent(jd + solNoonOffset/1440.0)
  eqTime = calcEquationOfTime(newt)
  solNoonLocal = 720 - (longitude * 4) - eqTime + (timezone*60.0)// in minutes
  if(dst) solNoonLocal += 60.0
  while (solNoonLocal < 0.0) {
    solNoonLocal += 1440.0;
  }
  while (solNoonLocal >= 1440.0) {
    solNoonLocal -= 1440.0;
  }
  document.getElementById("noonbox").value = timeString(solNoonLocal, 3)
}
 
function dayString(jd, next, flag)
{
// returns a string in the form DDMMMYYYY[ next] to display prev/next rise/set
// flag=2 for DD MMM, 3 for DD MM YYYY, 4 for DDMMYYYY next/prev
  if ( (jd < 900000) || (jd > 2817000) ) {
    var output = "error"
  } else {
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  if (z < 2299161) {
    var A = z;
  } else {
    alpha = Math.floor((z - 1867216.25)/36524.25);
    var A = z + 1 + alpha - Math.floor(alpha/4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1)/365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D)/30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = ((month > 2) ? C - 4716 : C - 4715);
  if (flag == 2)
    var output = zeroPad(day,2) + " " + monthList[month-1].abbr;
  if (flag == 3)
    var output = zeroPad(day,2) + monthList[month-1].abbr + year.toString();
  if (flag == 4)
    var output = zeroPad(day,2) + monthList[month-1].abbr + year.toString() + ((next) ? " next" : " prev");
  }
  return output;
}

function timeDateString(JD, minutes)
{
  var output = timeString(minutes, 2) + " " + dayString(JD, 0, 2);
  return output;
}

function timeString(minutes, flag)
// timeString returns a zero-padded string (HH:MM:SS) given time in minutes
// flag=2 for HH:MM, 3 for HH:MM:SS
{
  if ( (minutes >= 0) && (minutes < 1440) ) {
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    if (second > 59) {
      second = 0
      minute += 1
    }
    if ((flag == 2) && (second >= 30)) minute++;
    if (minute > 59) {
      minute = 0
      hour += 1
    }
    var output = zeroPad(hour,2) + ":" + zeroPad(minute,2);
    if (flag > 2) output = output + ":" + zeroPad(second,2);
  } else { 
    var output = "error"
  }
  return output;
}

function calcSunriseSetUTC(rise, JD, latitude, longitude)
{
  var t = calcTimeJulianCent(JD);
  var eqTime = calcEquationOfTime(t);
  var solarDec = calcSunDeclination(t);
  var hourAngle = calcHourAngleSunrise(latitude, solarDec);
  //alert("HA = " + radToDeg(hourAngle));
  if (!rise) hourAngle = -hourAngle;
  var delta = longitude + radToDeg(hourAngle);
  var timeUTC = 720 - (4.0 * delta) - eqTime;	// in minutes
  return timeUTC
}

function calcSunriseSet(rise, JD, latitude, longitude, timezone, dst)
// rise = 1 for sunrise, 0 for sunset
{
  var id = ((rise) ? "risebox" : "setbox")
  var timeUTC = calcSunriseSetUTC(rise, JD, latitude, longitude);
  var newTimeUTC = calcSunriseSetUTC(rise, JD + timeUTC/1440.0, latitude, longitude); 
  if (isNumber(newTimeUTC)) {
    var timeLocal = newTimeUTC + (timezone * 60.0)
    if (document.getElementById(rise ? "showsr" : "showss").checked) {
      var riseT = calcTimeJulianCent(JD + newTimeUTC/1440.0)
      var riseAz = calcAzEl(0, riseT, timeLocal, latitude, longitude, timezone)
      if (rise) {
        showLineGeodesic2("sunrise", "#00aa00", riseAz);
      } else {
        showLineGeodesic2("sunset", "#ff0000", riseAz);
      }
    }
    timeLocal += ((dst) ? 60.0 : 0.0);
    if ( (timeLocal >= 0.0) && (timeLocal < 1440.0) ) {
      document.getElementById(id).value = timeString(timeLocal,2)
    } else  {
      var jday = JD
      var increment = ((timeLocal < 0) ? 1 : -1)
      while ((timeLocal < 0.0)||(timeLocal >= 1440.0)) {
        timeLocal += increment * 1440.0
	jday -= increment
      }
      document.getElementById(id).value = timeDateString(jday,timeLocal)
    }
  } else { // no sunrise/set found
    var doy = calcDoyFromJD(JD)
    if ( ((latitude > 66.4) && (doy > 79) && (doy < 267)) ||
	((latitude < -66.4) && ((doy < 83) || (doy > 263))) )
    {   //previous sunrise/next sunset
      if (rise) { // find previous sunrise
        jdy = calcJDofNextPrevRiseSet(0, rise, JD, latitude, longitude, timezone, dst)
      } else { // find next sunset
        jdy = calcJDofNextPrevRiseSet(1, rise, JD, latitude, longitude, timezone, dst)
      }
      document.getElementById(((rise)? "risebox":"setbox")).value = dayString(jdy,0,3)
    } else {   //previous sunset/next sunrise
      if (rise == 1) { // find previous sunrise
        jdy = calcJDofNextPrevRiseSet(1, rise, JD, latitude, longitude, timezone, dst)
      } else { // find next sunset
        jdy = calcJDofNextPrevRiseSet(0, rise, JD, latitude, longitude, timezone, dst)
      }
      document.getElementById(((rise)? "risebox":"setbox")).value = dayString(jdy,0,3)
    }
  }
}

function calcJDofNextPrevRiseSet(next, rise, JD, latitude, longitude, tz, dst)
{
  var julianday = JD;
  var increment = ((next) ? 1.0 : -1.0);

  var time = calcSunriseSetUTC(rise, julianday, latitude, longitude);
  while(!isNumber(time)){
    julianday += increment;
    time = calcSunriseSetUTC(rise, julianday, latitude, longitude);
  }
  var timeLocal = time + tz * 60.0 + ((dst) ? 60.0 : 0.0)
  while ((timeLocal < 0.0) || (timeLocal >= 1440.0))
  {
    var incr = ((timeLocal < 0) ? 1 : -1)
    timeLocal += (incr * 1440.0)
    julianday -= incr
  }
  return julianday;
}

function clearOutputs()
{
  document.getElementById("eqtbox").value = ""
  document.getElementById("sdbox").value = ""
  document.getElementById("risebox").value = ""
  document.getElementById("noonbox").value = ""
  document.getElementById("setbox").value = ""
  document.getElementById("azbox").value = ""
  document.getElementById("elbox").value = ""
}
*/


    
function calculate(lat, lng, mon, day, yr, time, tz) {
  var jday = getJD(mon, day, yr) //docmonth, docday, docyear
  var tl = getTimeLocal(time, 0, 0, false, false) //dochr, docmn, docsc, docpm, docdst
  //var tz = -6 //readTextBox("zonebox", 5, 0, 0, -14, 13, 0)
  var dst = false //document.getElementById("dstCheckbox").checked
  var total = jday + tl/1440.0 - tz/24.0
  var T = calcTimeJulianCent(total)
  //var lat = 40 //parseFloat(document.getElementById("latbox").value.substring(0,9))
  //var lng = -100 //parseFloat(document.getElementById("lngbox").value.substring(0,10))
  return calcAzEl(1, T, tl, lat, lng, tz)
  
  /* Commented out - Justin Braaten 06/07/2017    
  calcSolNoon(jday, lng, tz, dst)
  var rise = calcSunriseSet(1, jday, lat, lng, tz, dst)
  var set  = calcSunriseSet(0, jday, lat, lng, tz, dst)
  alert("JD " + jday + "  " + rise + "  " + set + "  ")
  */
}


// draw the map, fill in data holders, initialize the plot
Esri_WorldTopoMap.addTo(map)
makeDataHolders()
plotSolEl()


 