import type { FormState, Preset, Workspace } from '@/lib/types';

export const LS_WS = 'pb_workspaces_v1';
export const LS_WS_CUR = 'pb_current_workspace_v1';
export const LS_PRESETS = (ws: string) => `pb_presets_${ws}_v1`;
export const LS_FORM = (ws: string) => `pb_form_${ws}_v1`;

export function saveWorkspacesToStorage(ws: Workspace[]) {
  localStorage.setItem(LS_WS, JSON.stringify(ws));
}

export function loadWorkspacesFromStorage(): Workspace[] {
  const raw = localStorage.getItem(LS_WS);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function savePresetsToStorage(wsId: string, presets: Preset[]) {
  localStorage.setItem(LS_PRESETS(wsId), JSON.stringify(presets));
}

export function loadPresetsFromStorage(wsId: string): Preset[] {
  const raw = localStorage.getItem(LS_PRESETS(wsId));
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveFormToStorage(wsId: string, form: FormState) {
  localStorage.setItem(LS_FORM(wsId), JSON.stringify(form));
}

export function loadFormFromStorage(wsId: string, fallback: FormState): FormState {
  const raw = localStorage.getItem(LS_FORM(wsId));
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
