import pandas as pd
import numpy as np

# Constants
kg_to_kip = 0.0022046226  # Conversion factor from kg to kips
pt_val = 2.5  # Terminal serviceability index (adjustable)
sn_val = 5  # Structural number for flexible pavement (adjustable)
d_val = 8.0  # Slab thickness for rigid pavement (adjustable, in inches)

# Dictionary mapping configurations to axle names
config_to_name = {
    "Single vehicle with 2 axles": [1, 1],
    "Single vehicle with 3 axles A": [1, 2],
    "Single vehicle with 3 axles B": [1, 1, 1],
    "Single vehicle with 4 axles A": [1, 3],
    "Single vehicle with 4 axles B": [1, 1, 2],
    "Single vehicle with 4 axles C": [1, 2, 1],
    "Single vehicle with 5 axles A": [1, 1, 3],
    "Single vehicle with 5 axles B": [1, 1, 2, 1],
    "Articulator with 4 axles A": [1, 3],
    "Articulator with 4 axles B": [1, 1, 2],
    "Articulator with 5 axles A": [1, 1, 3],
    "Articulator with 5 axles B": [1, 1, 2, 1],
    "Articulator with 6 axles": [1, 2, 3],
    "Articulator with 7 axles A": [1, 3, 3],
    "Articulator with 7 axles B": [1, 2, 2, 2],
    "Articulator with 7 axles C": [1, 2, 4],
    "Articulator with 8 axles A": [1, 3, 4],
    "Articulator with 8 axles B": [1, 2, 3, 2],
    "Articulator with 9 axles": [1, 2, 3, 3]
}

# Function to interpret axle types from the configuration
def interpret_axle_type(config):
    axle_types = []
    for group in config:
        if group == 1:
            axle_types.append('Single')
        elif group == 2:
            axle_types.append('Tandem')
        elif group == 3:
            axle_types.append('Tridem')
    return axle_types

# Function to apply L2 value based on axle type
def apply_l2_value(axle_type):
    if axle_type == 'Single':
        return 1
    elif axle_type == 'Tandem':
        return 2
    elif axle_type == 'Tridem':
        return 3
    return 1  # Default value for unexpected axle types

# Function to process the configuration and combine axle loads
def process_configuration(config, axles):
    combined_axles = []
    idx = 0
    for group in config:
        if group == 1:  # Single axle (no combination)
            combined_axles.append(axles[idx])
            idx += 1
        else:  # Grouped axles (combine the loads)
            combined_load = sum(axles[idx:idx + group])
            combined_axles.append(combined_load)
            idx += group
    return combined_axles

# Function to calculate EALF for Flexible Pavement
def calculate_ealf_flexible(lx, axle_type):
    l2 = apply_l2_value(axle_type)
    return 1 / (10 ** (6.1252 - 4.79 * np.log10(lx + l2) + 4.33 * np.log10(l2) +
                      np.log10((4.2 - pt_val) / (4.2 - 1.5)) * (
                              0.40 + (0.081 * (lx + l2) ** 3.23) / ((sn_val + 1) ** 5.19 * (l2 ** 3.23)) - 
                              (0.40 + (0.081 * (18 + 1) ** 3.23) / ((sn_val + 1) ** 5.19 * (1 ** 3.23))))))

# Function to calculate EALF for Rigid Pavement
def calculate_ealf_rigid(lx, axle_type):
    l2 = apply_l2_value(axle_type)
    return 1 / (10 ** (5.908 - 4.62 * np.log10(lx + l2) + 3.28 * np.log10(l2) +
                      np.log10((4.5 - pt_val) / (4.5 - 1.5)) * (
                              1.0 + (3.63 * (lx + l2) ** 5.20) / ((d_val + 1) ** 8.46 * (l2 ** 3.52)) - 
                              (1.0 + (3.63 * (18 + 1) ** 5.20) / ((d_val + 1) ** 8.46 * (1 ** 3.52))))))

# Function to process CSV and calculate EALF
def process_csv(file_path):
    # Read CSV file
    try:
        data = pd.read_csv(file_path)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return None

    # Validate required columns
    required_columns = ['Axle Type', 'Configuration'] + [f'Axle {i}' for i in range(1, 10)]
    if not all(col in data.columns for col in required_columns):
        print(f"CSV file is missing required columns. Expected: {required_columns}")
        return None

    # Parse configurations
    data['Configuration'] = data['Configuration'].fillna("")  # Replace NaN with empty string
    configurations = data['Configuration'].apply(
        lambda x: [int(i) for i in x.strip().split(',')] if x.strip() else []
    ).tolist()

    # Extract axle loads and convert from kg to kips
    axle_columns = [f'Axle {i}' for i in range(1, 10)]
    axle_loads = data[axle_columns].fillna(0).to_numpy()
    axle_loads_kips = axle_loads * kg_to_kip  # Convert loads to kips

    # Combine axles based on configuration
    combined_loads_kips = []
    for idx, config in enumerate(configurations):
        combined_loads_kips.append(process_configuration(config, axle_loads_kips[idx]))

    # Map configuration to axle names using the provided dictionary
    axle_names = [next((name for name, conf in config_to_name.items() if conf == config), 'Unknown') for config in configurations]

    # Prepare results
    ealf_results = []
    for idx, combined_loads in enumerate(combined_loads_kips):
        axle_type = interpret_axle_type(configurations[idx])  # Get the axle types for this row
        axle_name = axle_names[idx]  # Get the axle name from the configuration
        ealf_flexible = sum([calculate_ealf_flexible(lx, axle_type[i]) for i, lx in enumerate(combined_loads)])
        ealf_rigid = sum([calculate_ealf_rigid(lx, axle_type[i]) for i, lx in enumerate(combined_loads)])
        ealf_results.append({
            "Axle Name": axle_name,  # Use the axle name instead of generic axle types
            "Configuration": data['Configuration'][idx],
            "Combined Loads (Kips)": combined_loads,
            "EALF Flexible": ealf_flexible,
            "EALF Rigid": ealf_rigid
        })

    # Create DataFrame for results
    results_df = pd.DataFrame(ealf_results)

    # Ensure the number of rows in the output matches the input
    results_df = results_df.head(len(data))  # Ensure rows are equal to input

    return results_df

# File path to your CSV
file_path = "C:\Users\FUJITSU\Music\project\project\Axle Data Template.xlsx"

# Process CSV and display/save results
results_df = process_csv(file_path)
if results_df is not None:
    print(results_df)
    results_df.to_csv("ealf_results_with_axle_name.csv", index=False)
