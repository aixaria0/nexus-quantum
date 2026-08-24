'use client';
import React from 'react';

interface MetricsChartProps {
  metrics: any[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metrics }) => {
  // Simple bar chart rendering using divs
  const maxFidelity = Math.max(...metrics.map(m => m.fidelity));

  return (
    <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6 text-quantum-accent">Fidelity by Qubit</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const fidelityPercent = (metric.fidelity / maxFidelity) * 100;
          const barColor = metric.fidelity > 0.99 ? 'bg-quantum-accent' : 'bg-quantum-warning';
          
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-quantum-primary font-mono">Qubit {metric.qubit}</span>
                <span className="text-quantum-accent font-medium">{(metric.fidelity * 100).toFixed(3)}%</span>
              </div>
              <div className="w-full h-6 bg-quantum-surface rounded-full overflow-hidden border border-quantum-accent/20">
                <div
                  className={`h-full transition-all duration-300 ${barColor} opacity-80`}
                  style={{ width: `${fidelityPercent}%` }}
                  aria-label={`Fidelity: ${metric.fidelity * 100}%`}
                />
              </div>
              {metric.caveat && (
                <p className="text-xs text-quantum-warning/70 ml-1">{metric.caveat}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsChart;