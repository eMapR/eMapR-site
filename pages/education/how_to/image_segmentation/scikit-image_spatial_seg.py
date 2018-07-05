# -*- coding: utf-8 -*-
"""
Created on Thu May 25 16:24:16 2017

@author: braatenj
"""


import numpy as np
from skimage import segmentation, color, io
from skimage.future import graph
from skimage.segmentation import mark_boundaries
from matplotlib import pyplot as plt
from osgeo import gdal
import os


"""
references
RAG: https://vcansimplify.wordpress.com/2014/07/06/scikit-image-rag-introduction/
hierarchical merging: http://scikit-image.org/docs/dev/auto_examples/segmentation/plot_boundary_merge.html
"""

def weight_mean_color(graph, src, dst, n):
  """Callback to handle merging nodes by recomputing mean color.

  The method expects that the mean color of `dst` is already computed.

  Parameters
  ----------
  graph : RAG
      The graph under consideration.
  src, dst : int
      The vertices in `graph` to be merged.
  n : int
      A neighbor of `src` or `dst` or both.

  Returns
  -------
  data : dict
      A dictionary with the `"weight"` attribute set as the absolute
      difference of the mean color between node `dst` and `n`.
  """
  diff = graph.node[dst]['mean color'] - graph.node[n]['mean color']
  diff = np.linalg.norm(diff)
  return {'weight': diff}


def merge_mean_color(graph, src, dst):
  """Callback called before merging two nodes of a mean color distance graph.

  This method computes the mean color of `dst`.

  Parameters
  ----------
  graph : RAG
      The graph under consideration.
  src, dst : int
      The vertices in `graph` to be merged.
  """
  graph.node[dst]['total color'] += graph.node[src]['total color']
  graph.node[dst]['pixel count'] += graph.node[src]['pixel count']
  graph.node[dst]['mean color'] = (graph.node[dst]['total color'] /
                                   graph.node[dst]['pixel count'])

def make_display_image(img, bgPixels):
  """Function to apply 2 stdev stretch and compress to image to 8-bit for
  higher contrast viewing

  Parameters
  ----------
  img : np.array
      The image converted to np.array
  bgPixels : np.array
      np.array of indexes for background pixels
  """
  img = img.astype(np.float)
  img[bgPixels] = np.nan
  imgMean = np.nanmean(img)
  imgStd = np.nanstd(img)
  imgMinOrig = np.nanmin(img)
  imgMinCalc = imgMean-(imgStd*2)
  if imgMinCalc < imgMinOrig:
    imgMin = imgMinOrig
  else:
    imgMin = imgMinCalc
  img[bgPixels] = imgMin
  imgMax = imgMean+(imgStd*2)
  img[img < imgMin] = imgMin
  img[img > imgMax] = imgMax
  img = np.round(((img-imgMin) / (imgMax-imgMin+0.0)) * 255).astype(np.uint8)
  return img


############################################################################################################################################################
###   INPUTS    ############################################################################################################################################
############################################################################################################################################################


# define the image file path
inFile = 'D:/work/code_library/eMapR-site/pages/education/how_to/image_segmentation/emapr_hja_biomass.tif'

# define the out file name - if extension is not .tif, it will be forced to .tif
outFile = 'D:/work/code_library/eMapR-site/pages/education/how_to/image_segmentation/emapr_hja_biomass_seg.tif'

# set background value - what is it in the image?
bgValue = -9999

############################################################################################################################################################
############################################################################################################################################################
############################################################################################################################################################


# activate the GDAL plugin so that skimage will read GeoTIFF
io.use_plugin('gdal')

# read in the image
img = io.imread(inFile)

# get the index of the background pixels
bgPixels = np.where(img == bgValue)

# create the display image
displayImg = make_display_image(img, bgPixels)

# plot the display image
plt.imshow(displayImg, cmap='gray')

# create the image to segment - set background NA values -100 and scale data froom 0-600 - iterative testing
img[bgPixels] = -100
img = np.round(((img-np.min(img)) / (np.max(img)-np.min(img)+0.0)) * 600)

# use k-means to perform an initial segmentation of the image - need to play with the values, use next section to evaluate
imgKmeans = segmentation.slic(img, compactness=110, n_segments=4000)

# compare the original image to the initial segmentation
kMeansLabelsAve = color.label2rgb(imgKmeans, img, kind='avg')
fig, (ax0, ax1) = plt.subplots(1, 2 ,figsize=(20,10), dpi=72)
ax0.imshow(displayImg, cmap='gray')
ax1.imshow(kMeansLabelsAve)
ax0.axis('off')
ax1.axis('off')

# create a region adjacency graph for the k-mean clustered image
rag = graph.rag_mean_color(img, imgKmeans, mode='distance')

# merge similar clusters together
imgLabels = graph.merge_hierarchical(imgKmeans, rag, thresh=75, rag_copy=True,
                                     in_place_merge=True,
                                     merge_func=merge_mean_color,
                                     weight_func=weight_mean_color)

# set the background pixels to the same label
imgLabels[bgPixels] = imgLabels[0,0]

# plot the result as an overlay on the display image
plt.figure(1, figsize=(10,10), dpi=72)
plt.imshow(mark_boundaries(displayImg, imgLabels))

# write out the labeled segmentation image
src = gdal.Open(inFile)
driver = gdal.GetDriverByName('GTiff')
labelMax = np.max(imgLabels)

if labelMax <= 255:
  dataType = 1
elif labelMax <= 65535:
  dataType = 2
elif labelMax <= 4294967295:
  dataType = 4

outFile = os.path.splitext(outFile)[0]+'.tif'
outImg = driver.Create(outFile, src.RasterXSize, src.RasterYSize, 1, dataType) # file, col, row, nBands, dataTypeCode
outImg.SetGeoTransform(src.GetGeoTransform())
outImg.SetProjection(src.GetProjection())
outBand = outImg.GetRasterBand(1) 
outBand.WriteArray(imgLabels)
outImg = None