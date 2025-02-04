import pandas as pd
import numpy as np

# Constants
kg_to_kip = 0.0022046226  # Conversion factor from kg to kips
pt_val = 2.5  # Terminal serviceability index (adjustable)
sn_val = 5  # Structural number for flexible pavement (adjustable)
d_val = 8.0  # Slab thickness for rigid pavement (adjustable, in inches)

# Function to apply L2 value based on axle type
def apply_l2_value(axle_type):
    if axle_type == 'Single':
        return 1
    elif axle_type == 'Tandem':
        return 2
    elif axle_type == 'Tridem':
        return 3
    return 1  # Default value for unexpected axle types

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
def process_csv(file_path, calculation_type="flexible"):
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

    # Extract axle loads and convert from kg to kips
    axle_columns = [f'Axle {i}' for i in range(1, 10)]
    axle_loads = data[axle_columns].fillna(0).to_numpy()
    axle_loads_kips = axle_loads * kg_to_kip  # Convert loads to kips

    # Parse configurations
    configurations = data['Configuration'].fillna("").apply(
        lambda x: [int(i) for i in x.strip().split(',')] if x.strip() else []
    ).tolist()

    # Map configuration to axle types
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

    # Process combined axle loads based on configuration
    def process_configuration(config, axles):
        combined_axles = []
        idx = 0
        for group in config:
            if group == 1:  # Single axle
                combined_axles.append(axles[idx])
                idx += 1
            else:  # Grouped axles
                combined_load = sum(axles[idx:idx + group])
                combined_axles.append(combined_load)
                idx += group
        return combined_axles

    # Calculate EALF based on the selected calculation type
    def calculate_ealf(lx, axle_type):
        if calculation_type == "flexible":
            return calculate_ealf_flexible(lx, axle_type)
        elif calculation_type == "rigid":
            return calculate_ealf_rigid(lx, axle_type)
        else:
            raise ValueError("Invalid calculation type. Choose 'flexible' or 'rigid'.")

    # Compute results
    ealf_results = []
    for idx, config in enumerate(configurations):
        combined_loads = process_configuration(config, axle_loads_kips[idx])
        axle_type = interpret_axle_type(config)
        ealf = sum([calculate_ealf(lx, axle_type[i]) for i, lx in enumerate(combined_loads)])
        ealf_results.append({
            "Axle Type": data['Axle Type'][idx],
            "Configuration": data['Configuration'][idx],
            "Average ESAL": ealf
        })

    # Aggregate results for average
    results_df = pd.DataFrame(ealf_results)
    avg_results_df = results_df.groupby('Axle Type', as_index=False).agg({
        "Average ESAL": "mean"
    })

    return avg_results_df

# File path to your CSV
file_path = "C:/Users/DELL/Desktop/Axle_Data_Template.csv"

# User selects calculation type
calculation_type = input("Enter calculation type (flexible/rigid): ").strip().lower()

# Process CSV and display average results
avg_results_df = process_csv(file_path, calculation_type=calculation_type)
if avg_results_df is not None:
    print("\nAverage Results:")
    print(avg_results_df)
    avg_results_df.to_csv(f"average_ealf_results_{calculation_type}.csv", index=False)
