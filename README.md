# weld-pool

This is an adaptation of Rekesh Ali and Eric Heikkenen's work to simulate a molten weld puddle.  This attempts to produce a higher fidelity weld pool simulation from the underlying phase changes.

This code intends to simulate a weld pool from a tungsten inert
gas (TIG) welding process.

## Getting Started

This should run on an OSX or Linux computer with no errors.

### Prerequisites

You will need a C compiler such as "gcc" and a MATLAB installation
for graphing.

```
gcc --version
```

### Installing

A makefile is included for convenience.

```
make
```

### Parallel Operation

The code supports parallel operation.

```
make parallel
```

Note: GCC on OSX is actually Clang. The version of Clang typically
included with OSX does not support OpenMP. If you want to use all your CPU
cores on OSX, you'll have to install the actual GCC compiler. The easiest
way to do this is to install the [Homebrew](https://brew.sh) package manager
and install the real GCC with it.


## Running a test

Test it to see if it works properly.

```
make test
```

## Graphing

You can then graph the results with the included MATLAB code.

## Cool Features

* The makefile will only compile whats necessary after changes.
* Parallel computation via OpenMP. Test case went from 16 seconds to 3 seconds

## Built With

* C
* OpenMP
* MATLAB

## Authors
Rekesh Ali - Initial work - GitHub
Eric Heikkenen - Edits - GitHub

# Acknowledgments
Professor V. Alexiades