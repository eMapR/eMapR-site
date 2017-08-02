
Here is the url for the division shapefile
ftp://ftp.ncdc.noaa.gov/pub/data/cirs/climdiv/


Here is where the Palmer Drought index data came from - a link under the video - note that there are four options for Palmer indicies:
-palmer drough severity index
-palmer hydrological drought index
-palmer modified drough index
-palmer z-index
https://www.ncdc.noaa.gov/temp-and-precip/drought/historical-palmers/



Here is what you get when you request data by division
https://www7.ncdc.noaa.gov/CDO/CDODivisionalSelect.jsp#

StateCode,Division,YearMonth,    PCP,   TAVG,   PDSI,   PHDI,   ZNDX,   PMDI,    CDD,    HDD,   SP01,   SP02,   SP03,   SP06,   SP09,   SP12,   SP24,   TMIN,   TMAX,
       10,      10,   201601,   2.62,   23.4,   1.27,   1.27,    .78,    1.2,      0,   1290,    .37,    .46,     .4,    .82,   1.42,    .73,   1.12,   16.1,   30.6,
       10,      10,   201602,    .94,   28.6,    .69,    .69,  -1.37,   -.23,      0,   1019,  -1.21,    -.4,   -.11,     .3,    .42,    .66,    .75,   19.6,   37.6,
       10,      10,   201603,   3.44,   35.5,   1.33,   1.33,   2.16,   1.33,      0,    914,    1.4,    .46,    .46,    .48,   1.07,   1.27,    .82,     26,     45,
       10,      10,   201604,   1.98,   44.5,    .99,    .99,   -.63,    .54,      0,    615,    .22,   1.18,    .46,    .47,    .84,    1.4,    .81,   32.8,   56.3,
       10,      10,   201605,   2.83,   49.1,   1.39,   1.39,   1.51,   1.39,      0,    493,    .77,    .66,   1.26,    .69,    .89,    .95,   1.09,   36.9,   61.3,
       10,      10,   201606,     .4,     62,   -.85,   -.85,  -2.54,   -.85,     44,    134,  -1.45,   -.18,    -.1,    .15,    .25,    .83,    .94,   46.8,   77.2,
       10,      10,   201607,    .39,   65.8,  -1.44,  -1.44,  -2.04,  -1.44,     83,     59,     -1,  -1.64,   -.53,    -.1,    .09,    .44,    .96,   49.9,   81.6,
       10,      10,   201608,    .16,   64.7,  -2.18,  -2.18,  -2.67,  -2.18,     63,     72,  -1.65,  -2.18,  -1.89,   -.07,   -.19,     .1,    .22,   48.3,   81.1,
       10,      10,   201609,   3.26,   54.8,   1.17,   -.78,   3.52,    .86,      6,    312,   1.93,      1,    .57,    .13,    .32,    .41,    .33,   41.7,   67.8,
       10,      10,   201610,    4.6,   45.7,   2.89,   2.89,    5.5,   2.89,      0,    598,   2.47,   3.09,   2.29,   1.25,   1.18,   1.09,   1.05,   35.5,   55.9,
       10,      10,   201611,   1.19,   37.8,   2.37,   2.37,   -.67,   2.03,      0,    816,   -.69,   1.66,   2.34,    .76,    1.2,    .92,    .84,   27.7,   47.9,
       10,      10,   201612,   3.72,   18.5,   3.11,   3.11,   2.97,   3.11,      0,   1442,   1.28,    .53,   1.89,   1.66,   1.19,   1.21,   1.07,    9.9,     27,



metadata: ftp://ftp.ncdc.noaa.gov/pub/data/cirs/climdiv/drought-readme.txt

ftp: ftp://ftp.ncdc.noaa.gov/pub/data/cirs/climdiv/



The shapefile was exported in QGIS as geojson and the precision was reduced. The geojson file was then imported into mapshaper and simplified by 99.25%
CONUS_CLIMATE_DIVISIONS.shp.zip