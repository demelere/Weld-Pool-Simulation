import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from utils import read_simulation_data

def plot_temperature(data, save_path=None):
    """Plot temperature distribution."""
    plt.figure(figsize=(10, 8))
    temp = data['temperature']
    
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
    fig, ax = plt.subplots(figsize=(10, 8))
    
    x = np.linspace(0, 1, temp.shape[1])
    y = np.linspace(0, 1, temp.shape[0])
    X, Y = np.meshgrid(x, y)
    
    def update(frame):
        ax.clear()
        cf = ax.contourf(X, Y, temp, levels=20, cmap='hot')
        ax.set_title(f'Temperature Distribution - Frame {frame}')
        return cf,
    
    anim = FuncAnimation(fig, update, frames=len(temp), interval=100)
    
    if save_path:
        anim.save(save_path, writer='pillow')
    plt.show()

if __name__ == "__main__":
    # Read the simulation data
    data = read_simulation_data()
    
    # Create output directory for plots
    import os
    os.makedirs('plots', exist_ok=True)
    
    # Generate all plots
    plot_temperature(data, 'plots/temperature.png')
    plot_phase(data, 'plots/phase.png')
    plot_pool_size(data, 'plots/pool_size.png')
    create_animation(data, 'plots/temperature_animation.gif') 