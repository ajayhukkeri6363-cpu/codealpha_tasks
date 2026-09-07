import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Check, AlertOctagon } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const steps = [
  { id: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { id: 'Processing', label: 'Processing', icon: Package },
  { id: 'Shipped', label: 'In Transit', icon: Truck },
  { id: 'Delivered', label: 'Delivered', icon: Check },
];

export const OrderTracker = ({ status, statusHistory = [] }) => {
  if (status === 'Cancelled') {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700">
        <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-semibold text-sm">Order Cancelled</h4>
          <p className="text-xs text-rose-600 mt-0.5">
            This order has been cancelled and any payments/stock have been refunded.
          </p>
        </div>
      </div>
    );
  }

  const getStepIndex = (st) => {
    switch (st) {
      case 'Pending':
      case 'Confirmed':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0 mx-6">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          // Find date from history if available
          const historyItem = statusHistory.find((h) => h.status === step.id);

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-110'
                    : isCompleted
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`text-xs mt-2 font-medium text-center ${
                  isCurrent ? 'text-indigo-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>

              {historyItem && (
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {formatDate(historyItem.timestamp)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
