'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RiskMatrix() {
  const matrix = [
    [5, 10, 15, 20, 25],
    [4, 8, 12, 16, 20],
    [3, 6, 9, 12, 15],
    [2, 4, 6, 8, 10],
    [1, 2, 3, 4, 5],
  ];

  const getColor = (value: number) => {
    if (value <= 5) return 'bg-green-200';
    if (value <= 12) return 'bg-yellow-200';
    if (value <= 20) return 'bg-orange-200';
    return 'bg-red-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>5x5 Risk Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            <div className="text-xs font-medium flex items-end justify-center pb-2">Impact →</div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="text-xs text-center font-medium">{i}</div>
            ))}
            
            {matrix.map((row, i) => (
              <React.Fragment key={i}>
                <div className="text-xs font-medium flex items-center justify-end pr-2">
                  {i === 2 && <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>Likelihood</span>}
                  {5 - i}
                </div>
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={`${getColor(cell)} border border-gray-300 h-12 flex items-center justify-center text-sm font-semibold`}
                  >
                    {cell}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border" />
              <span>Low (1-5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 border" />
              <span>Medium (6-12)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-200 border" />
              <span>High (13-20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border" />
              <span>Critical (21-25)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React from 'react';