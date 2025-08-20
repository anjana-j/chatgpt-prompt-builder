'use client';

import { Textarea } from '@/components/ui/textarea';

export function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
