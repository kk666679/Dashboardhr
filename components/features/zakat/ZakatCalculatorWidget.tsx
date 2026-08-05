"use client";

import React, { useState } from 'react';
import { GlassmorphicCard, GlassButton, GlassInput } from '@/components/GlassmorphicCard';
import { Calculator, DollarSign, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZakatAsset {
  type: 'income' | 'savings' | 'gold' | 'property' | 'business' | 'shares';
  amount: number;
  nisabCompliant: boolean;
}

export function ZakatCalculatorWidget() {
  const [assets, setAssets] = useState<ZakatAsset[]>([
    { type: 'income', amount: 0, nisabCompliant: false },
    { type: 'savings', amount: 0, nisabCompliant: false },
    { type: 'gold', amount: 0, nisabCompliant: false },
    { type: 'property', amount: 0, nisabCompliant: false },
    { type: 'business', amount: 0, nisabCompliant: false },
    { type: 'shares', amount: 0, nisabCompliant: false },
  ]);
  const [totalWealth, setTotalWealth] = useState(0);
  const [zakatAmount, setZakatAmount] = useState(0);
  const [nisabThreshold, setNisabThreshold] = useState(16250); // Approx RM16,250 for gold nisab

  const updateAsset = (index: number, amount: number) => {
    const newAssets = [...assets];
    newAssets[index].amount = amount;
    newAssets[index].nisabCompliant = amount >= nisabThreshold / 6; // Simplified
    setAssets(newAssets);
    
    const total = newAssets.reduce((sum, asset) => sum + asset.amount, 0);
    setTotalWealth(total);
    
    if (total >= nisabThreshold) {
      const zakat = total * 0.025; // 2.5%
      setZakatAmount(zakat);
    } else {
      setZakatAmount(0);
    }
  };

  const resetCalculator = () => {
    setAssets(assets.map(asset => ({ ...asset, amount: 0, nisabCompliant: false })));
    setTotalWealth(0);
    setZakatAmount(0);
  };

  const isNisabReached = totalWealth >= nisabThreshold;

  return (
    <GlassmorphicCard 
      gradient="from-emerald-500/10 to-teal-500/10" 
      blur="backdrop-blur-xl"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Calculator className="w-8 h-8 text-emerald-600 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Zakat Calculator</h3>
            <p className="text-gray-600">
              Calculate your Zakat al-Mal obligation based on Malaysian nisab (85g gold ≈ RM16,250)
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {assets.map((asset, index) => (
            <div key={asset.type} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {asset.type.replace('_', ' ')}
              </label>
              <GlassInput
                type="number"
                placeholder="Enter amount (RM)"
value={asset.amount.toString()}
                onChange={(e) => updateAsset(index, parseFloat(e.target.value) || 0)}
                icon={<DollarSign className="w-4 h-4" />}
              />
              {asset.nisabCompliant && (
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle className="w-3 h-3" />
                  Meets nisab threshold
                </div>
              )}
            </div>
          ))}
        </div>

        <GlassmorphicCard gradient="from-gray-50/50 to-white/60" blur="backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                RM {totalWealth.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-1">Total Wealth</p>
            </div>
            <div className="text-center border-l border-gray-200 md:border-l-0 md:border-r md:border-gray-200">
              <div className={cn(
                'text-3xl font-bold',
                isNisabReached ? 'text-emerald-600' : 'text-orange-600'
              )}>
                {isNisabReached ? '✓' : '✗'} RM {nisabThreshold.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-1">Nisab Threshold</p>
            </div>
            <div className="text-center">
              <div className={cn(
                'text-3xl font-bold',
                isNisabReached ? 'text-emerald-600' : 'text-gray-400'
              )}>
                RM {zakatAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-gray-600 mt-1">Zakat Payable (2.5%)</p>
            </div>
          </div>
        </GlassmorphicCard>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/20">
          <GlassButton 
            variant="primary" 
            onClick={resetCalculator}
            className="flex-1"
          >
            Reset Calculator
          </GlassButton>
          {isNisabReached && (
            <GlassButton variant="secondary" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Record Zakat Payment
            </GlassButton>
          )}
        </div>

        {!isNisabReached && (
          <div className="p-4 bg-orange-50/50 border border-orange-200/50 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-900 mb-1">
                  Nisab Not Reached
                </p>
                <p className="text-sm text-orange-800">
                  Your total wealth is below the nisab threshold of RM16,250. Zakat is not obligatory at this time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassmorphicCard>
  );
}

