'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Workspace } from '@/lib/types';

export function WorkspaceModal({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (ws: Workspace) => void;
}) {
  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Workspace</DialogTitle></DialogHeader>
        <Input value={wsName} onChange={(e) => setWsName(e.target.value)} placeholder="Name" />
        <Input value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} placeholder="Description" />
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!wsName.trim()) return;
            const ws: Workspace = { id: uuidv4(), name: wsName.trim(), description: wsDesc.trim() || undefined };
            onAdd(ws);
            setWsName(''); setWsDesc(''); onOpenChange(false);
          }}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
