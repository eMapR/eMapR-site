
library(jsonlite)
library(wordcloud)
library(tm)
library(stringr)


Trim = function (x) gsub("^\\s+|\\s+$,.", "", x)

breaker = function(x) unlist(strsplit(x, "[[:space:]]|(?=[.!?*,])", perl=TRUE)) #"[[:space:]]|(?=[.!?*-])"

strip = function(x, digit.remove = TRUE, apostrophe.remove = FALSE){
  strp = function(x, digit.remove, apostrophe.remove){
    x2 = Trim(tolower(gsub("[,.?:()]", "\\1", as.character(x))))
    x2 = if(apostrophe.remove) gsub("'", "", x2) else x2
    ifelse(digit.remove==TRUE, gsub("[[:digit:]]", "", x2), x2)
    for(i in 1:nrow(mods)){
      x2 = gsub(mods[i,1], mods[i,2], x2)
    }
    return(x2)
  }
  ls = unlist(lapply(x, function(x) Trim(strp(x =x, digit.remove = digit.remove, 
                                              apostrophe.remove = apostrophe.remove))))
  return(ls)
}

unblanker = function(x)subset(x, nchar(x)>0)


json = "D:/work/eMapR-site/eMapR-site/resources/data/publications.json"

document = fromJSON(json)
holder = vector()
for(year in 1:length(document$years$year)){
  pubDF = as.data.frame(document$years$pubs[year])
  for(pub in 1:nrow(pubDF)){
    holder = c(holder, pubDF$title[pub])
  }
}

titles = paste(holder, collapse = ' ')

mods = list(
    list("forests","forest"),
    list("time series", "time-series"),
    list("remote sensing", "remote-sensing"),
    list("pacific northwest", "pacific-northwest"),
    list("landsat-8", "landsat"),
    list("climate-induced", "climate"),
    list("timesync-tools", "timesync"),
    list("landsat-based", "landsat"),
    list("trajectories-important", "trajectory"),
    list("trajectory-based", "trajectory"),
    list("using", " "),
    list("landsat-derived", "landsat"),
    list("maps", "map"),
    list("land use", "land-use"),
    list("change detection","change-detection"),
    list("land cover", "land-cover"),
    list("landtrendr-temporal","landtrendr"),
    list("puget sound", "puget-sound")
  )

mods =  matrix(unlist(mods),nrow=length(mods), ncol=2, byrow=T)

stopwords_regex = paste(stopwords('en'), collapse = '\\b|\\b')
stopwords_regex = paste0('\\b', stopwords_regex, '\\b')
titles = stringr::str_replace_all(strip(titles), stopwords_regex, '')

words = unblanker(breaker(titles))
textDF = as.data.frame(table(words))
textDF$characters = sapply(as.character(textDF$words), nchar)
textDF2 = textDF[order(-textDF$characters, textDF$Freq), ]
textDF2 = subset(textDF2, characters > 2)


svg(filename = "D:/work/temp/Rplots6.svg",
    width = 10, height = 3, pointsize = 12,
    onefile = FALSE, family = "sans", bg = "white",
    antialias = c("default", "none", "gray", "subpixel"))

wordcloud(textDF2$words, 
          textDF2$Freq, 
          min.freq =2,
          scale=c(5, 0.7), 
          random.order = F, 
          random.color = FALSE,
          rot.per = 0,
          fixed.asp = F)#,
          #colors= c('#A0A0A0', '#878787', '#6E6E6E', '#3C3C3C', '#0A0A0A'))
          #colors= c('#A0A0A0', '#5b6875ff', '#59b0d3ff', '#76d03bff', '#d62851ff'))

dev.off()











