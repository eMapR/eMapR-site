# -*- coding: utf-8 -*-
"""
Created on Fri May 12 13:39:27 2017

@author: braatenj
"""

from osgeo import gdal
import numpy as np
import math
import subprocess
from glob import glob
import os
import shutil


def get_dims(fileName):
  src = gdal.Open(fileName)
  ulx, xres, xskew, uly, yskew, yres  = src.GetGeoTransform()
  sizeX = src.RasterXSize
  sizeY = src.RasterYSize
  lrx = ulx + (sizeX * xres)
  lry = uly + (sizeY * yres)
  return [ulx,uly,lrx,lry,xres,-yres,sizeX,sizeY]

def make_geo_trans(fileName, trgtDim):
  src   = gdal.Open(fileName)
  ulx, xres, xskew, uly, yskew, yres  = src.GetGeoTransform()
  return((trgtDim[0], xres, xskew, trgtDim[1], yskew, yres))

def get_intersec(files):
  ulxAll=[]
  ulyAll=[]
  lrxAll=[]
  lryAll=[]
  for fn in files:
    dim = get_dims(fn)
    ulxAll.append(dim[0])
    ulyAll.append(dim[1])
    lrxAll.append(dim[2])
    lryAll.append(dim[3])
  return([max(ulxAll),min(ulyAll),min(lrxAll),max(lryAll)])

def get_offsets(fileName, trgtDim):
  dim = get_dims(fileName)
  xoff = math.floor(abs(dim[0]-trgtDim[0])/dim[4])
  yoff = math.ceil(abs(dim[1]-trgtDim[1])/dim[4])
  xsize = abs(trgtDim[0]-trgtDim[2])/dim[4]
  ysize = abs(trgtDim[1]-trgtDim[3])/dim[4]
  return([int(i) for i in [xoff, yoff, xsize, ysize]])

def get_band(fileName, trgtDim, band):
  offsets = get_offsets(fileName, trgtDim)
  src = gdal.Open(fileName)
  band = src.GetRasterBand(band)
  array = band.ReadAsArray(
            offsets[0],
            offsets[1],
            offsets[2],
            offsets[3])
  return(array)

def write_img(outFile, refImg, trgtDim, nBands, dataType, of):
  convertDT = {
    'uint8': 1,
    'int8': 1,
    'uint16': 2,
    'int16': 3,
    'uint32': 4,
    'int32': 5,
    'float32': 6,
    'float64': 7,
    'complex64': 10,
    'complex128': 11
  }
  dataType = convertDT[dataType]
  geoTrans = make_geo_trans(refImg, trgtDim)
  proj = gdal.Open(refImg).GetProjection()
  dims = get_offsets(refImg, trgtDim)
  driver = gdal.GetDriverByName(of)
  driver.Register()
  outImg = driver.Create(outFile, dims[2], dims[3], nBands, dataType) # file, col, row, nBands, dataTypeCode
  outImg.SetGeoTransform(geoTrans)
  outImg.SetProjection(proj)
  return(outImg)


def scale_to_8bit(img):
  mean = np.mean(img)
  stdev = np.std(img)
  n_stdev = 2
  imin = mean-(stdev*n_stdev)
  imax = mean+(stdev*n_stdev)
  if imin < 0:
    imin = 0
  img[np.where(img < imin)] = imin
  img[np.where(img > imax)] = imax
  img = np.round(((img-imin)/(imax-imin+0.0))*255)     
  return img


def scale_to_8bit_tc(img, tc):
  # standard TC stretch SR * 10000  
  n_stdev = 2  
  if tc == 'b':  
    imin = 3098-(1247*n_stdev)
    imax = 3098+(1247*n_stdev)
  if tc == 'g':
    imin = 1549-(799*n_stdev)
    imax = 1549+(799*n_stdev)
  if tc == 'w':  
    imin = -701-(772*n_stdev)
    imax = -701+(772*n_stdev)  
  
  img[np.where(img < imin)] = imin
  img[np.where(img > imax)] = imax
  img = np.round(((img-imin)/(imax-imin+0.0))*255)     
  return img


def write_bands(r, g, b, outFile, ref, trgtDim):
  outImg = write_img(outFile, ref, trgtDim, 3, 'int8', 'GTIFF')
  outBand = outImg.GetRasterBand(1) 
  outBand.WriteArray(r)
  outBand = outImg.GetRasterBand(2) 
  outBand.WriteArray(g)
  outBand = outImg.GetRasterBand(3) 
  outBand.WriteArray(b)
  outImg = None
  
def color_map(inFile, colorTable, outFile):
  trgtDim = get_intersec([inFile])
  img = get_band(inFile, trgtDim, 1)
  r = np.copy(img)
  g = np.copy(img)
  b = np.copy(img)
  
  l = colorTable.shape[0]
  for i in range(colorTable.shape[0]):
    print('working on class: '+str(i+1)+'/'+str(l))
    these = np.where(img == colorTable.ix[i,'value'])
    r[these] = colorTable.ix[i,'r']
    g[these] = colorTable.ix[i,'g']
    b[these] = colorTable.ix[i,'b']
  
  write_bands(r, g, b, outFile, inFile, trgtDim)


def make_even(value):
  if (value % 2) != 0:
    value -= 1
  return value



#############################################################################################################
#############################################################################################################
#############################################################################################################


  
  
#tcb = '/vol/v1/proj/nccn/2017/raster/mora/ltee_nccn_mora_06010930_20170806/ltee_nccn_mora_06010930_20170806_ftv_tcb.bsq'
#tcg = '/vol/v1/proj/nccn/2017/raster/mora/ltee_nccn_mora_06010930_20170806/ltee_nccn_mora_06010930_20170806_ftv_tcg.bsq' 
#tcw = '/vol/v1/proj/nccn/2017/raster/mora/ltee_nccn_mora_06010930_20170806/ltee_nccn_mora_06010930_20170806_ftv_tcw.bsq'

tcb = '/vol/v2/conus_tiles/vrts/lt_ee_conus_nbr_20170417_ftv_tcb.vrt'
tcg = '/vol/v2/conus_tiles/vrts/lt_ee_conus_nbr_20170417_ftv_tcg.vrt'
tcw = '/vol/v2/conus_tiles/vrts/lt_ee_conus_nbr_20170417_ftv_tcw.vrt'
clipFile = 0 #'/vol/v1/proj/nccn/2017/vector/LPa01_LEWI_MORA_NOCA_OLYM.shp' 
outDir = '/vol/v1/general_files/user_files/justin/temp/cascade_siskiyou_national_monument/tcb_rgb_vid'
targetWidth = 0 #1600
startYear = 1984
endYear = 2016
useFullImage = 0

source_srs = 'EPSG:5070' # what is the EPSG of the source imagery
target_srs = 'EPSG:3857' # what EPSG should the output images be - use EPSG
te_srs = 'EPSG:4326'# what EPSG are the following bounding coordinages in

ulxy = [-122.79693603515624, 42.28035698458569]
lrxy = [-122.11990356445312, 41.920672548686824]



#############################################################################################################



# adjust width so it is even - mp4 whats it that way
targetWidth = make_even(targetWidth)

# make sure outDir end in '/'
if outDir[-1] != '/':
  outDir += '/'

# make sure the outDir exists
outDir = os.path.join(outDir, '')
if not os.path.exists(outDir):
    os.makedirs(outDir)

# reduce the size of the images
print('reducing the size of the images')
for fn in [tcb, tcg, tcw]:

  outFile = outDir + os.path.splitext(os.path.basename(fn))[0] + '_small.tif'
  if useFullImage:
    #TODO deal with full size being less than targetWidth
    if targetWidth == 0:
      cmd = 'gdalwarp -s_srs '+source_srs+' -t_srs '+target_srs+' -of GTiff -r near '+fn+' '+outFile
    else: 
      cmd = 'gdalwarp -s_srs '+source_srs+' -t_srs '+target_srs+' -of GTiff -r near -ts '+str(targetWidth)+' 0 '+fn+' '+outFile
  else:
    te = '-te {} {} {} {} '.format(ulxy[0], lrxy[1], lrxy[0], ulxy[1])  
    if targetWidth == 0:
      cmd = 'gdalwarp -s_srs '+source_srs+' -t_srs '+target_srs+' -of GTiff -r near -te_srs '+te_srs+' '+te+fn+' '+outFile
    else:
      cmd = 'gdalwarp -s_srs '+source_srs+' -t_srs '+target_srs+' -of GTiff -r near -ts '+str(targetWidth)+' 0 '+'-te_srs '+te_srs+' '+te+fn+' '+outFile

  subprocess.call(cmd, shell=True)

# get image dims - adjust to even numbers and save them for later
outDims = get_dims(outFile)
vidSizeX = make_even(outDims[6])
vidSizeY = make_even(outDims[7])

# find the small files, get the dims, and read in the src   
smallFiles = glob(outDir+'*small.tif')
trgtDim = get_intersec(smallFiles)
src_ds = gdal.Open(smallFiles[0])

print('making RGB images')
for band in range(src_ds.RasterCount):
  band += 1
  r = scale_to_8bit_tc(get_band(smallFiles[0], trgtDim, band), 'b')
  g = scale_to_8bit_tc(get_band(smallFiles[1], trgtDim, band), 'g')
  b = scale_to_8bit_tc(get_band(smallFiles[2], trgtDim, band), 'w')
  
  outFile = outDir + 'tc_rgb_'+str(startYear+band-1)+'.tif'
  write_bands(r, g, b, outFile, smallFiles[0], trgtDim)

# find all the files that were just created
rgbFiles = glob(outDir+'*tc_rgb*.tif')

# burn in the background
if clipFile == 1:
  print('setting the background')
  for fn in rgbFiles:
    bands = ' '.join(['-b '+str(band) for band in range(1,4)])
    cmd = 'gdal_rasterize -i -burn 0 '+bands+' '+clipFile+' '+fn
    subprocess.call(cmd, shell=True)


# make a list of years
years = range(startYear, endYear+1) 

# add year label to each image
print('adding year label to images')
for fn, year in zip(rgbFiles, years):
  newFile = fn.replace('.tif', '.jpg') 
  cmd = 'convert -transparent black -extent '+str(vidSizeX)+'x'+str(vidSizeY)+' '+fn+' -pointsize 72 -fill white -annotate +25+70 '+'"'+str(year)+'" '+newFile
  subprocess.call(cmd, shell=True)  


#duplicate the frame to slow the vid down a little
jpgFiles = glob(outDir+'*.jpg')
for jpgFile in jpgFiles:
  for i in range(3):  
    newFile = jpgFile.replace('.jpg', '_'+str(i)+'.jpg')
    shutil.copyfile(jpgFile, newFile)
  os.remove(jpgFile)

  
# make webm and mp4 videos 
print('making videos')
search = outDir+'/*.jpg'
outWebm = outDir+'/vid.webm'
outMp4 = outWebm.replace('webm', 'mp4')

webmCmd = 'ffmpeg -framerate 25 -pattern_type glob -i "'+search+'" -c:v libvpx-vp9 -b:v 1M  '+outWebm #25
mp4Cmd = 'ffmpeg -framerate 25 -pattern_type glob -i "'+search+'" -vcodec libx264 -pix_fmt yuv420p '+outMp4 

subprocess.call(webmCmd, shell=True)  
subprocess.call(mp4Cmd, shell=True)   
  
"""  
# get corner coordinates for the various projections used and record in a text file 
targetCoords = get_dims(rgbFiles[0]) 
targetCoordsString = 'target coords; ulx: '+ str(targetCoords[0]) + ' uly: ' + str(targetCoords[1]) + ' lrx: ' + str(targetCoords[2]) + ' lry: ' + str(targetCoords[3])

srcCoordsFile = outDir+'source_coords.tif' 
cmd = 'gdalwarp -t_srs '+source_srs+' -of GTiff -r near ' +rgbFiles[0]+' '+srcCoordsFile
subprocess.call(cmd, shell=True)
srcCoords = get_dims(srcCoordsFile) 
srcCoordsString = 'target coords; ulx: '+ str(srcCoords[0]) + ' uly: ' + str(srcCoords[1]) + ' lrx: ' + str(srcCoords[2]) +  ' lry: ' + str(srcCoords[3])

latLonCoordsFile = outDir+'latlon_coords.tif' 
cmd = 'gdalwarp -t_srs '+te_srs+' -of GTiff -r near ' +rgbFiles[0]+' '+latLonCoordsFile
subprocess.call(cmd, shell=True)
latLonCoords = get_dims(latLonCoordsFile) 
latLonCoordsString = 'target coords; ulx: '+ str(latLonCoords[0]) + ' uly: ' + str(latLonCoords[1]) + ' lrx: ' + str(latLonCoords[2]) + ' lry: ' + str(latLonCoords[3])
"""
