TIME
factor  dtout   tend
1.0       0.00001       0.003
SPACE
MM  a   b
5000 0   0.04
MATERIAL
rho     L       Tm      h       Tinf
2702    398     933     50      298
Cs      Cl      ks      kl
.903    1.146   237     218
INITIAL CONDITIONS
T0      BC      Tmax    BCType(0=Temp, 1=Flux)  FType(0=Gaussian, 1=Uniform)
298     2000    1300    0                       0
