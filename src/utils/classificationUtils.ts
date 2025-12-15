/**
 * Utility functions for vehicle classification
 */

// Standard classification map for known vehicle types
export const CLASSIFICATION_MAP: { [key: string]: string } = {
    "SB": "Small Buses",
    "MB": "Medium Buses",
    "LB2": "Large Buses (2-axle)",
    "LB3": "Large Buses (3-axle)",
    "LT": "Light Trucks",
    "MT1": "Medium Trucks",
    "MT2": "Medium Trucks",
    "HT5": "Heavy Trucks",
    "HT4": "Heavy Trucks",
    "3T1": "3-axle trailers",
    "3T2": "3-axle trailers",
    "4T1": "4-axle trailers",
    "4T2": "4-axle trailers",
    "5T1": "5-axle trailers",
    "5T2": "5-axle trailers",
    "5T3": "5-axle trailers",
    "6T1": "6-axle trailers",
    "6T2": "6-axle trailers",
    "7T1": "7-axle trailers",
    "7T2": "7-axle trailers",
    "7T3": "7-axle trailers",
    "8T1": "8-axle trailers",
    "8T2": "8-axle trailers",
    "9T1": "9-axle trailers",
    "9T2": "9-axle trailers",
    "10T": "10-axle trailers",
  };
  
  /**
   * Determines the vehicle classification by code, handling both predefined and dynamic classification
   * @param code The vehicle type code (e.g., "8T4", "9T3")
   * @returns The human-readable classification
   */
  export const getVehicleClassification = (code: string): string => {
    const upperCode = code.trim().toUpperCase();
    
    // First check if there's a direct match in the classification map
    if (CLASSIFICATION_MAP[upperCode]) {
      return CLASSIFICATION_MAP[upperCode];
    }
    
    // If not, try to extract the axle number for dynamic classification
    // Pattern: digit followed by 'T' and optionally more characters
    const axleMatch = upperCode.match(/^(\d+)T\d*$/);
    
    if (axleMatch && axleMatch[1]) {
      const axleCount = axleMatch[1];
      return `${axleCount}-axle trailers`;
    }
    
    // For bus types with new configurations
    if (upperCode.startsWith('LB')) {
      const axleMatch = upperCode.match(/^LB(\d+)$/);
      if (axleMatch && axleMatch[1]) {
        return `Large Buses (${axleMatch[1]}-axle)`;
      }
      return "Large Buses";
    }
    
    // Fall back to using the code itself if no classification is found
    return upperCode;
  };