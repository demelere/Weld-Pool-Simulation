import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from utils import read_simulation_data
import os

# Hardcode the paths for testing
WORKSPACE_DIR = '/Users/stephenlin/Developer/Robotics/weld-pool-sim/weld-pool'
OUTPUTS_DIR = os.path.join(WORKSPACE_DIR, 'outputs')
PLOTS_DIR = os.path.join(WORKSPACE_DIR, 'python_src/plots')

print(f"Looking for output files in: {OUTPUTS_DIR}")
print(f"Will save plots to: {PLOTS_DIR}")

def analyze_temperature_data(temp):
    """Analyze the temperature data structure and changes."""
    print(f"\nTemperature data shape: {temp.shape}")
    print(f"Temperature range: {np.min(temp):.2f} K to {np.max(temp):.2f} K")
    
    if len(temp.shape) == 2:
        print("WARNING: Temperature data appears to be a single 2D array, not a time series!")
        return
    
    # If we have multiple timesteps, analyze the changes
    temp_changes = np.diff(temp, axis=0)
    max_change = np.max(np.abs(temp_changes))
    print(f"Maximum temperature change between timesteps: {max_change:.2f} K")
    
    # Print some statistics about the changes
    nonzero_changes = np.count_nonzero(temp_changes)
    total_elements = temp_changes.size
    print(f"Number of temperature changes: {nonzero_changes} out of {total_elements} elements")
    print(f"Percentage of elements that change: {100 * nonzero_changes / total_elements:.2f}%")

def plot_temperature(data, save_path=None):
    """Plot temperature distribution."""
    plt.figure(figsize=(10, 8))
    temp = data['temperature']
    
    # Analyze the temperature data
    analyze_temperature_data(temp)
    
    # Create a mesh grid for plotting
    x = np.linspace(0, 1, temp.shape[1])
    y = np.linspace(0, 1, temp.shape[0])
    X, Y = np.meshgrid(x, y)
    
    # Plot temperature contours
    plt.contourf(X, Y, temp, levels=20, cmap='hot')
    plt.colorbar(label='Temperature (K)')
    plt.title('Temperature Distribution')
    plt.xlabel('X Position')
    plt.ylabel('Y Position')
    
    if save_path:
        plt.savefig(save_path)
    plt.show()

def plot_phase(data, save_path=None):
    """Plot phase distribution (liquid fraction)."""
    plt.figure(figsize=(10, 8))
    phase = data['phase']
    
    # Analyze the phase data
    print(f"\nPhase data shape: {phase.shape}")
    print(f"Phase values range: {np.min(phase):.2f} to {np.max(phase):.2f}")
    print(f"Unique phase values: {np.unique(phase)}")
    
    x = np.linspace(0, 1, phase.shape[1])
    y = np.linspace(0, 1, phase.shape[0])
    X, Y = np.meshgrid(x, y)
    
    plt.contourf(X, Y, phase, levels=2, cmap='coolwarm')
    plt.colorbar(label='Liquid Fraction')
    plt.title('Phase Distribution')
    plt.xlabel('X Position')
    plt.ylabel('Y Position')
    
    if save_path:
        plt.savefig(save_path)
    plt.show()

def plot_pool_size(data, save_path=None):
    """Plot weld pool size evolution."""
    plt.figure(figsize=(12, 6))
    values = data['values']
    
    time_ms = values[:, 1]  # time in milliseconds
    width = values[:, 2]    # width in cm
    depth = values[:, 3]    # depth in cm
    
    print(f"\nTime range: {np.min(time_ms):.3f} ms to {np.max(time_ms):.3f} ms")
    print(f"Width range: {np.min(width):.3f} cm to {np.max(width):.3f} cm")
    print(f"Depth range: {np.min(depth):.3f} cm to {np.max(depth):.3f} cm")
    
    plt.plot(time_ms, width, 'b-', label='Width')
    plt.plot(time_ms, depth, 'r-', label='Depth')
    plt.xlabel('Time (ms)')
    plt.ylabel('Size (cm)')
    plt.title('Weld Pool Size Evolution')
    plt.legend()
    plt.grid(True)
    
    if save_path:
        plt.savefig(save_path)
    plt.show()

def create_animation(data, save_path=None):
    """Create an animation of the temperature evolution."""
    temp = data['temperature']
    
    # Check if we have time series data
    if len(temp.shape) == 2:
        print("\nWARNING: Cannot create animation - temperature data is a single frame!")
        return
        
    fig, ax = plt.subplots(figsize=(10, 8))
    
    x = np.linspace(0, 1, temp.shape[1])
    y = np.linspace(0, 1, temp.shape[0])
    X, Y = np.meshgrid(x, y)
    
    def update(frame):
        ax.clear()
        cf = ax.contourf(X, Y, temp[frame], levels=20, cmap='hot')
        ax.set_title(f'Temperature Distribution - Frame {frame}')
        return cf,
    
    anim = FuncAnimation(fig, update, frames=temp.shape[0], interval=100)
    
    if save_path:
        anim.save(save_path, writer='pillow')
    plt.show()

if __name__ == "__main__":
    # Create output directory for plots
    os.makedirs(PLOTS_DIR, exist_ok=True)
    
    # Read the simulation data with explicit output directory
    data = read_simulation_data(OUTPUTS_DIR)
    
    # Generate all plots
    plot_temperature(data, os.path.join(PLOTS_DIR, 'temperature.png'))
    plot_phase(data, os.path.join(PLOTS_DIR, 'phase.png'))
    plot_pool_size(data, os.path.join(PLOTS_DIR, 'pool_size.png'))
    create_animation(data, os.path.join(PLOTS_DIR, 'temperature_animation.gif')) 