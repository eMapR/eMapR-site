# -*- coding: utf-8 -*-
"""
Created on Fri Jun 30 10:51:30 2017

@author: braatenj
"""

import os
import sys
from osgeo import ogr
from osgeo import gdal
import subprocess


######################################################################################################################
#inShape = '/vol/v2/stem/multi_lt_test/spatial/conus_tiles_northeast_epsg5070.geojson'
#inRaster = '/vol/v1/general_files/datasets/spatial_data/nlcd/nlcd_2001_v2/nlcd_2001_landcover_3x3_equal.tif'
#outRaster = '/vol/v2/stem/multi_lt_test/spatial/nlcd_2001_landcover_3x3_equal_ne.tif'
#clipRaster = 'true'
#burnValue = 0
######################################################################################################################

def main(inRaster, outRaster, inShape, clipRaster, burnValue):
  
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
  
  # format the exent as -projwin arguments for gdal translate
  projwin = '-projwin {} {} {} {} '.format(extent[0], extent[3], extent[1], extent[2])  
  
  # figure out what file to make
  outExt = os.path.splitext(outRaster)[1]  
  if outExt == '.bsq':   
    of = 'ENVI'
  elif outExt == '.tif':
    of = 'GTiff'
  
  # make gdal_translate cmd and run it as subprocess
  cmd = 'gdal_translate -of '+of+' -tr 30 30 ' + projwin + inRaster +' '+ outRaster
  subprocess.call(cmd, shell=True)
  
  # if values outside the inShape should be chagned to some 
  if clipRaster.lower() == 'true':
    
    src_ds = gdal.Open(outRaster)
    src_ds.RasterCount 
    bands = ' '.join(['-b '+str(band+1) for band in range(src_ds.RasterCount)])
    cmd = 'gdal_rasterize -i -burn '+burnValue+' '+bands+' '+inShape+' '+outRaster
    subprocess.call(cmd, shell=True)

if __name__ == "__main__":  
    args = sys.argv    
    inRaster = args[1]
    outRaster = args[2]
    inShape = args[3]
    clipRaster = args[4]
    burnValue = args[5]
    
    main(inRaster, outRaster, inShape, clipRaster, burnValue)