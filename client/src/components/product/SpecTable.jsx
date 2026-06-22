import React from "react";

const SpecTable = ({ specs = [] }) => {
  if (!specs || specs.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic py-4">
        No technical specifications listed for this device.
      </div>
    );
  }

  return (
    <div className="border border-slate-900 rounded-2xl overflow-hidden glass">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900/50 border-b border-slate-900">
            <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-400">Technical Property</th>
            <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-400">Specification Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900 text-sm">
          {specs.map((spec, idx) => (
            <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
              <td className="py-3.5 px-5 font-semibold text-gray-300">{spec.key}</td>
              <td className="py-3.5 px-5 text-gray-400">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecTable;
