import React from 'react';
import { formatGrowthRate } from './design-esal/utils';

export interface VehicleEsalData {
  vehicleClass: string;
  percentOfAadt: number;
  aadt: number;
  directionalAadt: number;
  designLaneAadt: number;
  growthRate: number | number[];
  growthFactor: number;
  yearlyTraffic: number;
  truckFactor: number;
  designEsals: number;
}

interface DesignEsalTableProps {
  vehicleData: VehicleEsalData[];
  totalAadt: number;
  designPeriod: number;
  directionalDistributionFactor: number;
  laneDistributionFactor: number;
  totalDesignEsals: number;
  baseYear?: number;
}

const DesignEsalTable: React.FC<DesignEsalTableProps> = ({
  vehicleData,
  totalAadt,
  designPeriod,
  directionalDistributionFactor,
  laneDistributionFactor,
  totalDesignEsals,
  baseYear = new Date().getFullYear()
}) => {
  return (
    <div className="w-full overflow-auto border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-3">
          Computation of {designPeriod}-Year Design ESALs for Flexible Pavement Design
        </h2>
        
        <div className="w-full">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="bg-gray-200">
                <th className="h-12 px-4 text-left align-middle font-bold text-center">Vehicle Class</th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">Percent of AADT</th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  {baseYear} <br />2-Way AADT
                  <br />[a]
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  Design Direction AADT
                  <br />[b] = [a] × {directionalDistributionFactor.toFixed(2)}
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  Design Lane AADT
                  <br />[c] = [b] × {laneDistributionFactor.toFixed(2)}
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  Traffic Growth Rate, r<br />(%)
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  Traffic Growth Factor, G<br />[d]
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  {designPeriod} Year Design Traffic
                  <br />[e] = [c] × [d] × 365
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  Truck Factor<br />[d]
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold text-center">
                  Design ESALs<br />[e] × [d]
                </th>
              </tr>
            </thead>
            
            <tbody className="[&_tr:last-child]:border-0">
              {vehicleData.map((row, index) => (
                <tr key={index} className="border-b transition-colors hover:bg-gray-100">
                  <td className="p-4 align-middle text-center">{row.vehicleClass}</td>
                  <td className="p-4 align-middle text-center">{row.percentOfAadt}</td>
                  <td className="p-4 align-middle text-center">{row.aadt.toLocaleString()}</td>
                  <td className="p-4 align-middle text-center">{row.directionalAadt.toLocaleString()}</td>
                  <td className="p-4 align-middle text-center">{row.designLaneAadt.toLocaleString()}</td>
                  <td className="p-4 align-middle text-center">
                    {formatGrowthRate(row.growthRate)}
                  </td>
                  <td className="p-4 align-middle text-center">{row.growthFactor.toFixed(3)}</td>
                  <td className="p-4 align-middle text-center">{row.yearlyTraffic.toLocaleString()}</td>
                  <td className="p-4 align-middle text-center">{row.truckFactor.toFixed(3)}</td>
                  <td className="p-4 align-middle text-center">{row.designEsals.toLocaleString()}</td>
                </tr>
              ))}
              
              <tr className="border-b transition-colors hover:bg-gray-100 font-bold">
                <td className="p-4 align-middle text-center">Total</td>
                <td className="p-4 align-middle text-center">100</td>
                <td className="p-4 align-middle text-center">{totalAadt.toLocaleString()}</td>
                <td className="p-4 align-middle text-center">{(totalAadt * directionalDistributionFactor).toLocaleString()}</td>
                <td className="p-4 align-middle text-center">{(totalAadt * directionalDistributionFactor * laneDistributionFactor).toLocaleString()}</td>
                <td colSpan={3}></td>
                <td className="p-4 align-middle text-center" colSpan={2}>
                  {designPeriod}-Year Design ESALs: {totalDesignEsals.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="col-span-1">
            <div className="bg-gray-200 p-3">
              <div className="grid grid-cols-2 gap-2">
                <div>{baseYear} AADT</div>
                <div className="text-right">{totalAadt.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Design Period</div>
                <div className="text-right">{designPeriod}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Days in Year</div>
                <div className="text-right">365</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-gray-200 p-3">
              <div className="grid grid-cols-2 gap-2">
                <div>Parameters</div>
                <div></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Directional Distribution Factor (DDF)</div>
                <div className="text-right">{directionalDistributionFactor.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Lane Distribution Factor (LDF)</div>
                <div className="text-right">{laneDistributionFactor.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEsalTable;
