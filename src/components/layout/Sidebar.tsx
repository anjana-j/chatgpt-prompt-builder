'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Preset, Workspace } from '@/lib/types';

export function Sidebar({
  userName,
  userPhoto,
  workspaces,
  currentWs,
  onChangeWorkspace,
  onCreateWorkspace,
  presets,
  onLoadPreset,
}: {
  userName: string;
  userPhoto?: string | null;
  workspaces: Workspace[];
  currentWs: string;
  onChangeWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
  presets: Preset[];
  onLoadPreset: (p: Preset) => void;
}) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <aside className="w-full border-r bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 lg:w-72">
      <div className="mb-4 flex items-center gap-3">
        <Image src={userPhoto || '/next.svg'} alt="avatar" width={32} height={32} className="rounded-full" />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{greeting}, {userName || 'John'}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Workspace</label>
        <Select value={currentWs} onValueChange={onChangeWorkspace}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select workspace" /></SelectTrigger>
          <SelectContent>
            {workspaces.map(w => (<SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Button className="w-full" onClick={onCreateWorkspace}>Create Workspace</Button>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-xs font-medium">Presets</div>
        {presets.length === 0 ? (
          <div className="text-xs text-neutral-500">No presets yet.</div>
        ) : (
          <ul className="divide-y rounded-md border text-sm dark:divide-neutral-800 dark:border-neutral-800">
            {presets.map(p => (
              <li key={p.id} className="flex items-center justify-between gap-2 p-2">
                <button className="truncate text-left underline-offset-2 hover:underline" onClick={() => onLoadPreset(p)}>{p.name}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
