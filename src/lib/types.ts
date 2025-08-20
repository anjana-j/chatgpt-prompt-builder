export interface Workspace { id: string; name: string; description?: string }

export interface FormState {
  task: string;
  context: string;
  references: string;
  format: string;
  persona: string;
  evaluation: string;
  extra: string;
}

export interface Preset { id: string; name: string; data: FormState; createdAt: number }
