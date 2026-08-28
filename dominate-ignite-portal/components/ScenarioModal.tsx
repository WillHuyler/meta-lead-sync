'use client';

import { useState } from 'react';

interface BaselineProps {
  currentCalls: number;
  currentConversions: number;
  googleCpa: number;
  metaCpa: number;
}

export default function ScenarioModal({ baseline }: { baseline?: BaselineProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetIncrease, setTargetIncrease] = useState<number>(15);

  // Fallback defaults if baseline query is loading
  const data = baseline || {
    currentCalls: 100,
    currentConversions: 50,
    googleCpa: 45,
    metaCpa: 30,
  };

  const callIncrease = Math.round(data.currentCalls * (targetIncrease / 100));
  const conversionIncrease = Math.round(data.currentConversions * (targetIncrease / 100));

  const additionalGoogleBudget = Math.round((conversionIncrease * 0.6) * data.googleCpa);
  const additionalMetaBudget = Math.round((conversionIncrease * 0.4) * data.metaCpa);
  const totalAdditionalBudget = additionalGoogleBudget + additionalMetaBudget;

  return (
    <div className="my-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
      >
        🚀 Open Growth Projection Engine
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Growth Projection Engine</h2>
            <p className="text-xs text-gray-500 mb-4">
              Select a target growth scenario based on 30-day historical CPA baseline math.
            </p>

            {/* Target Selector */}
            <div className="flex space-x-2 mb-6">
              {[5, 10, 15, 25].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTargetIncrease(pct)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
                    targetIncrease === pct
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  +{pct}% Target
                </button>
              ))}
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 font-bold uppercase">Target Call Increase</p>
                <p className="text-2xl font-extrabold text-blue-900">+{callIncrease} Calls</p>
                <p className="text-xs text-blue-700 mt-1">GMB Projection</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs text-emerald-600 font-bold uppercase">Required Monthly Budget</p>
                <p className="text-2xl font-extrabold text-emerald-900">+${totalAdditionalBudget}/mo</p>
                <p className="text-xs text-emerald-700 mt-1">Split across Google/Meta CPA</p>
              </div>
            </div>

            {/* Actionable Strategy Output */}
            <div className="p-4 bg-gray-50 border rounded-lg text-sm space-y-2 text-gray-700 mb-6">
              <p className="font-bold text-gray-900">Platform Allocation Plan:</p>
              <p>• <strong>Google Ads:</strong> Shift +${additionalGoogleBudget}/mo to active search terms to yield ~{Math.round(conversionIncrease * 0.6)} conversions.</p>
              <p>• <strong>Meta Ads:</strong> Reallocate +${additionalMetaBudget}/mo to dynamic retargeting graphics for ~{Math.round(conversionIncrease * 0.4)} conversions.</p>
              <p>• <strong>GMB Profile:</strong> Publish 2 extra monthly updates + optimize local category tags to support the +{callIncrease} calls target.</p>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition text-sm"
            >
              Print / Save Action Plan PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}