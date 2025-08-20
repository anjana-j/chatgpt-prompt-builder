"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "./Field";
import { PERSONAS } from "@/lib/personas";
import type { FormState } from "@/lib/types";

export function StepsPanel({
  form,
  setForm,
  copied,
  onCopy,
  onGenerate,
  onClear,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  copied: boolean;
  onCopy: () => void;
  onGenerate: () => void;
  onClear: () => void;
}) {
  const cardClass =
    "rounded-2xl border border-white/40 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/40";
  const badge =
    "grid h-6 w-6 place-items-center rounded-full bg-white/70 text-xs shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/60";
  return (
    <div>
      {
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          <Card className={cardClass}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={badge}>1</div>
                <CardTitle className="text-sm">Persona</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Persona</label>
                <Select
                  onValueChange={(id) => {
                    const p = PERSONAS.find((x) => x.id === id);
                    if (p) setForm({ ...form, persona: p.text });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERSONAS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field
                label="Text"
                value={form.persona}
                onChange={(v) => setForm({ ...form, persona: v })}
                placeholder="Describe the persona (optional)"
              />
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={badge}>2</div>
                <CardTitle className="text-sm">Brief</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field
                label="Task"
                value={form.task}
                onChange={(v) => setForm({ ...form, task: v })}
                placeholder="What should be done?"
              />
              <Field
                label="Context"
                value={form.context}
                onChange={(v) => setForm({ ...form, context: v })}
                placeholder="Background, constraints, audience"
              />
              <Field
                label="References"
                value={form.references}
                onChange={(v) => setForm({ ...form, references: v })}
                placeholder="Links, examples, benchmarks"
              />
              <Field
                label="Format"
                value={form.format}
                onChange={(v) => setForm({ ...form, format: v })}
                placeholder="Bullet list, JSON, table, etc."
              />
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={badge}>3</div>
                <CardTitle className="text-sm">Quality Gate</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field
                label="Evaluation Criteria"
                value={form.evaluation}
                onChange={(v) => setForm({ ...form, evaluation: v })}
                placeholder="How will you judge the output?"
              />
              <Field
                label="Extra Instructions"
                value={form.extra}
                onChange={(v) => setForm({ ...form, extra: v })}
                placeholder="Tone, do/don'ts, assumptions"
              />
            </CardContent>
          </Card>
        </div>
      }

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          className="w-full sm:w-auto"
          variant="default"
          onClick={onGenerate}
        >
          Generate Prompt
        </Button>
        <Button className="w-full sm:w-auto" variant="outline" onClick={onCopy}>
          {copied ? "Copied ✓" : "Copy"}
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant="secondary"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
