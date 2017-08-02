
library(tidyr)
library(dplyr)
library(rjson)

# pdsi csv file path
pdsiFile = "D:/work/proj/palmer_index/pdsi.csv"

# pdsi json outfile path
outfile = "D:/work/proj/palmer_index/pdsi.json"

# read the file
pdsi = read.csv(pdsiFile, colClasses = c('character', rep('numeric',13)))

# make key/valeu pairs of the month month cols and their pdsi values
pdsi = tidyr::gather(pdsi, 'rMonth', 'pdsi', 3:ncol(pdsi))

# make a lookup table and join a two digit month
rMonth = unique(pdsi$rMonth)
properMonth = c('01','02','03','04','05','06','07','08','09','10','11','12')
luTbl = data.frame(rMonth, properMonth)
luTbl$rMonth = as.character(luTbl$rMonth)
luTbl$properMonth = as.character(luTbl$properMonth)
pdsi = dplyr::full_join(pdsi, luTbl, by='rMonth')

# add a yyyy-mm column
pdsi$yrmo = paste0(pdsi$year,'-',pdsi$properMonth,'-','15') 

# add a climdiv column that can be a key in json
pdsi$CD = paste0('CD',pdsi$climdiv)


##########################################################################################
# for testing subset some years
pdsi = dplyr::filter(pdsi, year >= 1970)

# get the order by year-mo
pdsi = pdsi[order(pdsi$yrmo),]

# get unique cds
cds = unique(pdsi$CD)

# write out the data as json
len = length(cds)
write('var pdsi = {', file = outfile)
for(i in 1:len){
  pdsiSub = dplyr::filter(pdsi, CD == cds[i])
  pdsiSubSort = pdsiSub[order(pdsiSub$yrmo),]
  data = list(yrmo=pdsiSubSort$yrmo, pdsi=pdsiSubSort$pdsi) %>%
    toJSON() %>%
    substr(1,nchar(.)-1)
  if(i == len){line = paste0('"',cds[i],'":',data,'}')} else{
    line = paste0('"',cds[i],'":',data,'},')
  }
  write(line, file = outfile, append = T)
}
write('}', file = outfile, append = T)


