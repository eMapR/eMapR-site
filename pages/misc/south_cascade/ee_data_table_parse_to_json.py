# -*- coding: utf-8 -*-
"""
Created on Tue Nov 28 09:43:57 2017

@author: braatenj
"""

import pandas as pd
import json


def parse_string(string, typ):
  strArray = string.replace('[','').replace(']', '').split(',')
  if typ == 'float':
    intArray = [float(thisOne.strip()) for thisOne in strArray]
  if typ == 'int':
    intArray = [int(thisOne.strip()) for thisOne in strArray]
  return intArray


fn = "D:/work/proj/peder/agu_2017/point_time_series/south_cascade/ltee_eval_peder_it_south_cascade_06010930.csv"
outFile = "D:/work/proj/peder/agu_2017/point_time_series/south_cascade/plotData.js"

df = pd.read_csv(fn)
data = []

for i in range(df.shape[0]):
  latLng = parse_string(df.iloc[i]['latLng'], 'float')
  thisRow = {
    'id':int(df.iloc[i]['id']),
    'seg':int(df.iloc[i]['maxSeg']),
    'lon':latLng[0],
    'lat':latLng[1],
    'year':parse_string(df.iloc[i]['year'], 'int'),
    'orig':parse_string(df.iloc[i]['orig'], 'int'),
    'fitted':parse_string(df.iloc[i]['fitted'], 'int')
  }
  data.append(thisRow)

jsonData = json.dumps(data)

jsonData = 'var data = '+jsonData

dataFile = open(outFile, "w")
dataFile.write(jsonData)
dataFile.close()



