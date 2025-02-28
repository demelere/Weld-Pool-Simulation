import numpy as np
import os

def read_matrix_file(filename):
    """Read space-separated matrix data from file."""
    data = []
    with open(filename, 'r') as f:
        for line in f:
            if line.strip():  # Skip empty lines
                row = [float(x) for x in line.strip().split()]
                data.append(row)
    return np.array(data)

def read_values_file(filename):
    """Read the values.o file containing timestep data."""
    data = []
    with open(filename, 'r') as f:
        # Skip header line
        next(f)
        for line in f:
            if line.strip():
                # nstep, time(ms), width(cm), depth(cm), energy(J)
                values = [float(x) for x in line.strip().split()]
                data.append(values)
    return np.array(data)

def read_simulation_data(output_dir):
    """Read all simulation output files."""
    print(f"Reading files from: {output_dir}")
    print(f"Files in directory: {os.listdir(output_dir)}")
    
    temp_file = os.path.join(output_dir, 'temp.o')
    phase_file = os.path.join(output_dir, 'phase.o')
    enth_file = os.path.join(output_dir, 'enth.o')
    values_file = os.path.join(output_dir, 'values.o')
    
    print(f"Reading temperature data from: {temp_file}")
    temp = read_matrix_file(temp_file)
    phase = read_matrix_file(phase_file)
    enth = read_matrix_file(enth_file)
    values = read_values_file(values_file)
    
    return {
        'temperature': temp,
        'phase': phase,
        'enthalpy': enth,
        'values': values
    } 