# -*- coding: utf-8 -*-
"""
Created on Fri Jun 30 10:51:30 2017

@author: braatenj
"""

import os, sys
import subprocess
if 'GDAL_DATA' not in os.environ:
    os.environ['GDAL_DATA'] = r'/usr/lib/anaconda/share/gdal'
from osgeo import gdal, ogr


def nearestExt(ulx, uly, lrx, lry):        

    ulxAdj = round(ulx / 30.0) * 30 - 15
    ulyAdj = round(uly / 30.0) * 30 + 15
    lrxAdj = round(lrx / 30.0) * 30 + 15
    lryAdj = round(lry / 30.0) * 30 - 15
                       
    return [ulxAdj, ulyAdj, lrxAdj, lryAdj]


def main(inRaster, outRaster, inShape, clipRaster, burnValue):
  print('Clipping raster(s)\n')
  
  # make sure that burnValue is a str 
  if type(burnValue) is int:
    burnValue = str(burnValue)
  
  # get the driver from the inShape file ext  
  ext = str.lower(os.path.splitext(inShape)[-1])
  drivers = {'.shp'    :'ESRI Shapefile', 
             '.geojson': 'GeoJSON'}           
  driver = ogr.GetDriverByName(drivers[ext])
  
  # read in the inShape file and get the extent
  inDataSource = driver.Open(inShape, 0)
  extent = inDataSource.GetLayer().GetExtent()
  
  # snap coords to grid center
  ententSnap = nearestExt(extent[0], extent[3], extent[1], extent[2])
  projwin = '-projwin {} {} {} {} '.format(ententSnap[0], ententSnap[1], ententSnap[2], ententSnap[3])
  
  # figure out what file to make
  outExt = os.path.splitext(outRaster)[1]  
  if outExt == '.bsq':   
    of = 'ENVI'
  elif outExt == '.tif':
    of = 'GTiff'
  
  # make gdal_translate cmd and run it as subprocess
  cmd = '/usr/lib/anaconda/bin/gdal_translate --config GDAL_DATA /usr/lib/anaconda/share/gdal -of '+of+' -tr 30 30 -a_srs EPSG:5070 ' + projwin + inRaster +' '+ outRaster
  subprocess.call(cmd, shell=True)
  
  # if values outside the inShape should be chagned to some 
  if clipRaster.lower() == 'true':
    
    src_ds = gdal.Open(outRaster)
    src_ds.RasterCount 
    bands = ' '.join(['-b '+str(band+1) for band in range(src_ds.RasterCount)])
    cmd = '/usr/lib/anaconda/bin/gdal_rasterize --config GDAL_DATA /usr/lib/anaconda/share/gdal -i -burn '+burnValue+' '+bands+' '+inShape+' '+outRaster
    subprocess.call(cmd, shell=True)

if __name__ == "__main__":  
    args = sys.argv    
    inRaster = args[1]
    outRaster = args[2]
    inShape = args[3]
    clipRaster = args[4]
    burnValue = args[5]
    
    main(inRaster, outRaster, inShape, clipRaster, burnValue)