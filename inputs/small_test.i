TIME
factor  dtout   tend
1.0     0.001   1
SPACE
MM  a   b
50  0   1
MATERIAL
rho     L       Tm      h       Tinf
2702    398000  933     500     298
Cs      Cl      ks      kl
.903    1.146   237     218
INITIAL CONDITIONS
T0      BC      BCType(0=Temp, 1=Flux)  FType(0=Gaussian, 1=Uniform)
298     8000    1                       0 