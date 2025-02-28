import os
import numpy as np

def read_file(filename):
    with open(filename, 'r') as f:
        print(f"Successfully opened {filename}")
        data = f.read()
        print(f"First 100 characters: {data[:100]}")

current_dir = os.path.dirname(os.path.abspath(__file__))
outputs_dir = os.path.join(os.path.dirname(current_dir), 'outputs')

print(f"Current directory: {current_dir}")
print(f"Outputs directory: {outputs_dir}")

files = ['temp.o', 'phase.o', 'enth.o', 'values.o']
for file in files:
    filepath = os.path.join(outputs_dir, file)
    print(f"\nTrying to read {filepath}")
    read_file(filepath) 