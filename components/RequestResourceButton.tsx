"use client";

import { useState } from "react";

export default function RequestResourceButton({ ownerName }: { ownerName: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="kl-card border-field-300 bg-field-50 p-4 text-sm text-field-700">
        <p className="font-semibold text-field-800">Interest noted ✓</p>
        <p className="mt-1">
          In this prototype this only updates the screen — no message is actually sent yet.
          Once Supabase is connected, this will notify {ownerName} directly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setSent(true)} className="kl-btn-primary w-full">
        Request this Resource
      </button>
      <p className="text-center text-xs text-field-500">
        Prototype demo — connecting real messaging is planned for the next milestone.
      </p>
    </div>
  );
}
