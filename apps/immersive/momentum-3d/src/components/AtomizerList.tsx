import React from 'react';
import { AtomicStep } from '@/lib/atomizer';
import { ET } from '@/lib/theme';

interface Props {
  steps: AtomicStep[];
  onComplete: (id: string) => void;
}

export default function AtomizerList({ steps, onComplete }: Props) {
  const remaining = steps.filter(s => !s.completed);

  return (
    <div className="flex flex-col gap-6 max-w-lg w-full">
      {remaining.map((step, index) => {
        let style: React.CSSProperties = {};
        let label = '';
        const isBlurred = index >= 3;

        if (index === 0) {
          style = { color: ET.ink, opacity: 1, transform: 'scale(1.05)' };
          label = 'Active Action';
        } else if (index < 3) {
          style = { color: ET.mid, opacity: 0.6 };
          label = 'Next Up';
        } else {
          style = { color: ET.sub, opacity: 0.3, filter: 'blur(4px)' };
        }

        return (
          <div
            key={step.id}
            className="p-6 rounded-2xl border transition-all duration-500 cursor-pointer group"
            style={{
              backgroundColor: index === 0 ? ET.surface : 'transparent',
              borderColor: index === 0 ? ET.accent : ET.border,
              pointerEvents: isBlurred ? 'none' : undefined,
              ...style
            }}
            aria-hidden={isBlurred ? true : undefined}
            tabIndex={isBlurred ? -1 : undefined}
            onClick={() => index === 0 && onComplete(step.id)}
          >
            {label && (
              <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: ET.accent }}>
                {label}
              </span>
            )}
            <p className="text-lg font-medium leading-relaxed">{step.text}</p>
            {index === 0 && (
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: ET.accent }}>
                Done →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
