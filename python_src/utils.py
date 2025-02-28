import numpy as np

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

def read_simulation_data(output_dir='outputs'):
    """Read all simulation output files."""
    temp = read_matrix_file(f'{output_dir}/temp.o')
    phase = read_matrix_file(f'{output_dir}/phase.o')
    enth = read_matrix_file(f'{output_dir}/enth.o')
    values = read_values_file(f'{output_dir}/values.o')
    
    return {
        'temperature': temp,
        'phase': phase,
        'enthalpy': enth,
        'values': values
    } 