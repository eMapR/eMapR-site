# -*- coding: utf-8 -*-
"""
Created on Fri Sept 10 10:51:30 2017

@author: braatenj
"""

import sqlite3
import os, sys
import subprocess
import datetime
if 'GDAL_DATA' not in os.environ:
    os.environ['GDAL_DATA'] = r'/usr/lib/anaconda/share/gdal'
from osgeo import ogr


def main(id, name, vector, data, email):
  
  # get the geojson driver        
  driver = ogr.GetDriverByName('GeoJSON')
  
  # read in the vector file and get the extent
  inDataSource = driver.Open(vector, 0)
  extent = inDataSource.GetLayer().GetExtent()
  
  # | sep the bounds
  bounds = '{}|{}|{}|{}'.format(extent[0], extent[3], extent[1], extent[2])
    
  # get the date
  date = datetime.datetime.now().date()
  date.strftime("%Y-%m-%d")
  
  # write to the db
  query = 'INSERT INTO requests (id, name, date, data, bounds, email) VALUES ('+id+', "'+name+'", "'+str(date)+'", "'+data+'", "'+bounds+'", "'+email+'");'
  cmd = '/usr/bin/sqlite3 data_requests.db '+"'"+query+"'"
  subprocess.call(cmd, shell=True)



if __name__ == "__main__":  
    args = sys.argv
    id = args[1]
    name = args[2]    
    vector = args[3]
    data = args[4]
    email = args[5]

    main(id, name, vector, data, email)