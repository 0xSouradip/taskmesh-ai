'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from './AppProvider';

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONES = { success: 'text-ok', error: 'text-danger', info: 'text-warm' };

export default function Toast() {
  const { toastMessage, dismissToast } = useApp();

  return (
    // Region is always mounted so screen readers announce new messages.
    <div role="status" aria-live="polite" className="fixed bottom-5 right-5 left-5 sm:left-auto z-[60] sm:w-[380px]">
      {toastMessage && (
        <div key={toastMessage.id} className="glass p-4 pr-3 flex items-start gap-3 animate-[toast-in_500ms_var(--ease-spring)]">
          {(() => {
            const Icon = ICONS[toastMessage.type] ?? Info;
            return <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${TONES[toastMessage.type] ?? 'text-warm'}`} aria-hidden="true" />;
          })()}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[15px]">{toastMessage.title}</p>
            <p className="text-[14px] text-fg-2 mt-0.5">{toastMessage.message}</p>
          </div>
          <button type="button" onClick={dismissToast} aria-label="Dismiss" className="grid place-items-center w-8 h-8 rounded-full text-fg-2 hover:text-fg hover:bg-fg/[0.07]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
