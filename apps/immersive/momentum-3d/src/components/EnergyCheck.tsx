import React from 'react';
import { ET } from '@/lib/theme';
import { motion } from 'framer-motion';

interface Props {
  onContinue: () => void;
  onRest: () => void;
}

export default function EnergyCheck({ onContinue, onRest }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(10, 15, 30, 0.8)' }}
    >
      <div className="max-w-md w-full bg-surface p-8 rounded-3xl border text-center" style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
        <h2 className="text-2xl font-bold mb-4">Energy Check</h2>
        <p className="text-sm mb-8" style={{ color: ET.sub }}>
            You've completed 6 atomic steps. Respect your system.
            Do you have the energy to continue, or is it time for a 5-minute reset?
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onContinue}
            className="w-full py-4 rounded-2xl font-bold transition-all"
            style={{ backgroundColor: ET.accent, color: ET.surface }}
          >
            I have energy. Continue →
          </button>
          <button 
            onClick={onRest}
            className="w-full py-4 rounded-2xl font-bold border transition-all"
            style={{ borderColor: ET.border, color: ET.mid }}
          >
            Take 5 mins. (Protect the System)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
