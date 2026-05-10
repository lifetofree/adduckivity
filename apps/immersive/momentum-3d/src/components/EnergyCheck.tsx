import React, { useState } from 'react';
import { ET } from '@/lib/theme';
import { motion } from 'framer-motion';

interface Props {
  onContinue: () => void;
  onRest: () => void;
  stepCount: number;
}

export default function EnergyCheck({ onContinue, onRest, stepCount }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (submitting) return;
    setSubmitting(true);
    await onContinue();
  };

  const handleRest = async () => {
    if (submitting) return;
    setSubmitting(true);
    await onRest();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(10, 15, 30, 0.8)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="energy-check-title"
    >
      <div className="max-w-md w-full bg-surface p-8 rounded-3xl border text-center" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
        <h2 id="energy-check-title" className="text-2xl font-bold mb-4">Energy Check</h2>
        <p className="text-sm mb-8" style={{ color: ET.sub }}>
            You&apos;ve completed {stepCount} atomic steps. Respect your system.
            Do you have the energy to continue, or is it time for a 5-minute reset?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleContinue}
            disabled={submitting}
            aria-disabled={submitting}
            className="w-full py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: ET.accent, color: ET.surface }}
          >
            I have energy. Continue →
          </button>
          <button
            onClick={handleRest}
            disabled={submitting}
            aria-disabled={submitting}
            className="w-full py-4 rounded-2xl font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: ET.border, color: ET.mid }}
          >
            Take 5 mins. (Protect the System)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
