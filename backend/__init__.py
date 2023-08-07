import os
import sys

# Setting root directory in import path for every file in the project
# Get the absolute path of the current directory (myproject package)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the absolute path of the project root (two levels up)
project_root = os.path.dirname(os.path.dirname(current_dir))

# Add the project root to sys.path
sys.path.insert(0, project_root)