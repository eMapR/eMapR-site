
library(raster)
library(networkD3)
library(dplyr)

#################################################################################################################################################
#####  INPUTS  ##################################################################################################################################
#################################################################################################################################################
 
# define file info
fileInfo <- data.frame(         nodeCol=1, rasterFile="D:/work/code_library/eMapR-site/pages/education/how_to/sankey_diagram/emapr_sankey_diagram_land_cover_change_demo/emapr_nlcd_prediction_1990.tif", rasterBand=1) %>%
               rbind(data.frame(nodeCol=2, rasterFile="D:/work/code_library/eMapR-site/pages/education/how_to/sankey_diagram/emapr_sankey_diagram_land_cover_change_demo/emapr_nlcd_prediction_2000.tif", rasterBand=1)) %>%
               rbind(data.frame(nodeCol=3, rasterFile="D:/work/code_library/eMapR-site/pages/education/how_to/sankey_diagram/emapr_sankey_diagram_land_cover_change_demo/emapr_nlcd_prediction_2010.tif", rasterBand=1))

# define node info
nodeInfo <- data.frame(         nodeName="1990 Developed, Open Space"       , nodeID=0,  mapClass=21, nodeCol=1, nodeGroup='a') %>%
               rbind(data.frame(nodeName="1990 Developed, Low Intensity"    , nodeID=1,  mapClass=22, nodeCol=1, nodeGroup='b')) %>%
               rbind(data.frame(nodeName="1990 Developed, Medium Intensity" , nodeID=2,  mapClass=23, nodeCol=1, nodeGroup='c')) %>%
               rbind(data.frame(nodeName="1990 Developed, High Intensity"   , nodeID=3,  mapClass=24, nodeCol=1, nodeGroup='d')) %>%
               rbind(data.frame(nodeName="1990 Barren Land"                 , nodeID=4,  mapClass=31, nodeCol=1, nodeGroup='e')) %>%
               rbind(data.frame(nodeName="1990 Shrub/Scrub"                 , nodeID=5,  mapClass=52, nodeCol=1, nodeGroup='f')) %>%
                 
               rbind(data.frame(nodeName="2000 Developed, Open Space"       , nodeID=6,  mapClass=21, nodeCol=2, nodeGroup='a')) %>%
               rbind(data.frame(nodeName="2000 Developed, Low Intensity"    , nodeID=7,  mapClass=22, nodeCol=2, nodeGroup='b')) %>%
               rbind(data.frame(nodeName="2000 Developed, Medium Intensity" , nodeID=8,  mapClass=23, nodeCol=2, nodeGroup='c')) %>%
               rbind(data.frame(nodeName="2000 Developed, High Intensity"   , nodeID=9,  mapClass=24, nodeCol=2, nodeGroup='d')) %>%
               rbind(data.frame(nodeName="2000 Barren Land"                 , nodeID=10, mapClass=31, nodeCol=2, nodeGroup='e')) %>%
               rbind(data.frame(nodeName="2000 Shrub/Scrub"                 , nodeID=11, mapClass=52, nodeCol=2, nodeGroup='f')) %>%
                 
               rbind(data.frame(nodeName="2010 Developed, Open Space"       , nodeID=12, mapClass=21, nodeCol=3, nodeGroup='a')) %>%
               rbind(data.frame(nodeName="2010 Developed, Low Intensity"    , nodeID=13, mapClass=22, nodeCol=3, nodeGroup='b')) %>%
               rbind(data.frame(nodeName="2010 Developed, Medium Intensity" , nodeID=14, mapClass=23, nodeCol=3, nodeGroup='c')) %>%
               rbind(data.frame(nodeName="2010 Developed, High Intensity"   , nodeID=15, mapClass=24, nodeCol=3, nodeGroup='d')) %>%
               rbind(data.frame(nodeName="2010 Barren Land"                 , nodeID=16, mapClass=31, nodeCol=3, nodeGroup='e')) %>%
               rbind(data.frame(nodeName="2010 Shrub/Scrub"                 , nodeID=17, mapClass=52, nodeCol=3, nodeGroup='f')) 

# define group color - note that the colors correspond to the nodeGroups, one for each unique group, we have used (a, b, c, d, e, f) - color is applied in order
groupColor <- c("#E8D1D1","#E29E8C", "#FF0000", "#B50000", "#D2CDC0", "#DCCA8F")

# define plot features
fontSize <- 12
fontFamily <- "sans-serif"
nodeWidth <- 30


#################################################################################################################################################
#################################################################################################################################################
#################################################################################################################################################


# collapse groupColor to a string
groupColor <- paste0('"',paste(groupColor, collapse = '", "'),'"')

# join fileInfo to nodeInfo
nodeInfo <- dplyr::left_join(nodeInfo, fileInfo, by='nodeCol')

# convert factors to characters
nodeInfo$nodeName <- as.character(nodeInfo$nodeName)
nodeInfo$rasterFile <- as.character(nodeInfo$rasterFile)

# define the the links
NodeCols <- sort(unique(nodeInfo$nodeCol))
linkInfo <- data.frame()
for(i in 1:(length(NodeCols)-1)){
  fromCol <- dplyr::filter(nodeInfo, nodeCol==NodeCols[i])
  toCol <- dplyr::filter(nodeInfo, nodeCol==NodeCols[i+1])
  fromR <- values(raster(fromCol$rasterFile[1], fromCol$rasterBand[1]))
  toR <- values(raster(toCol$rasterFile[1], toCol$rasterBand[1]))
  for(f in 1:nrow(fromCol)){
    for(t in 1:nrow(toCol)){
      nFromTo <- length(which(fromR == fromCol$mapClass[f] & toR == toCol$mapClass[t]))
      linkInfo <- rbind(linkInfo, data.frame(source=fromCol$nodeID[f], target=toCol$nodeID[t], value=nFromTo))
    }
  }
}

# make the sankey plot
sankeyNetwork(Links = linkInfo, Nodes = nodeInfo,
              Source = "source",
              Target = "target",
              Value = "value",
              NodeID = "nodeName",
              NodeGroup = "nodeGroup",
              fontSize = fontSize,
              fontFamily = fontFamily,
              nodeWidth = nodeWidth,
              colourScale = paste0('d3.scaleOrdinal().range([',groupColor,'])'))
              
