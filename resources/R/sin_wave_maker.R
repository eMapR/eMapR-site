
f = 1000
f_c = 0.01
bigT = 1 / f
t = seq(0,6,bigT)
A = t
out = sin(2*pi*(f_c + A)*t) 
svg("D:/work/temp/sin.svg")
plot(t, out, type="n")
lines(t, out) 
dev.off()
