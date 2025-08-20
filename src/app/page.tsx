"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { StepsPanel } from "@/components/prompt/StepsPanel";
import type { FormState, Preset, Workspace } from "@/lib/types";
import { LS_FORM, LS_PRESETS, LS_WS, LS_WS_CUR } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWs, setCurrentWs] = useState<string>("");
  const [showWsModal, setShowWsModal] = useState(false);
  const [wsName, setWsName] = useState("");
  const [wsDesc, setWsDesc] = useState("");

  const [form, setForm] = useState<FormState>({
    task: "",
    context: "",
    references: "",
    format: "",
    persona: "",
    evaluation: "",
    extra: "",
  });
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");

  const [showInstructions, setShowInstructions] = useState(false);
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const wsRaw = localStorage.getItem(LS_WS);
    const cur = localStorage.getItem(LS_WS_CUR);
    if (wsRaw) {
      try {
        const list: Workspace[] = JSON.parse(wsRaw);
        setWorkspaces(list);
        if (list.length) {
          const wsId = cur && list.some((w) => w.id === cur) ? cur : list[0].id;
          setCurrentWs(wsId);
        } else {
          setShowWsModal(true);
        }
      } catch {
        setShowWsModal(true);
      }
    } else {
      setShowWsModal(true);
    }
  }, []);

  useEffect(() => {
    if (!currentWs) return;
    localStorage.setItem(LS_WS_CUR, currentWs);
    const pRaw = localStorage.getItem(LS_PRESETS(currentWs));
    const fRaw = localStorage.getItem(LS_FORM(currentWs));
    if (pRaw) {
      try {
        setPresets(JSON.parse(pRaw));
      } catch {}
    } else setPresets([]);
    if (fRaw) {
      try {
        setForm(JSON.parse(fRaw));
      } catch {}
    } else {
      setForm((prev) => ({ ...prev }));
    }
  }, [currentWs]);

  useEffect(() => {
    if (!currentWs) return;
    localStorage.setItem(LS_FORM(currentWs), JSON.stringify(form));
  }, [form, currentWs]);

  const saveWorkspaces = (ws: Workspace[]) => {
    setWorkspaces(ws);
    localStorage.setItem(LS_WS, JSON.stringify(ws));
  };
  const savePresets = (list: Preset[]) => {
    setPresets(list);
    if (!currentWs) return;
    localStorage.setItem(LS_PRESETS(currentWs), JSON.stringify(list));
  };
  const makePrompt = (f: FormState) => {
    const sections: string[] = [];
    const persona = f.persona?.trim();
    const task = f.task?.trim();
    const context = f.context?.trim();
    const references = f.references?.trim();
    const format = f.format?.trim();
    const evaluation = f.evaluation?.trim();
    const extra = f.extra?.trim();

    if (persona) sections.push(`**Persona:** ${persona}`);
    if (task) sections.push(`**Task:** ${task}`);
    if (context) sections.push(`**Context:** ${context}`);
    if (references) sections.push(`**References:** ${references}`);
    if (format) sections.push(`**Format:** ${format}`);
    if (evaluation) sections.push(`**Evaluation Criteria:** ${evaluation}`);
    if (extra) sections.push(`**Extra Instructions:** ${extra}`);

    return sections.join("\n\n");
  };
  const onGenerate = () => setOutput(makePrompt(form));
  const onCopy = async () => {
    const text = output || makePrompt(form);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  const onClear = () => {
    setForm({
      task: "",
      context: "",
      references: "",
      format: "",
      persona: "",
      evaluation: "",
      extra: "",
    });
    setOutput("");
  };
  const onSavePreset = () => {
    const name = presetName.trim() || prompt("Preset name:") || "";
    if (!name) return;
    const next: Preset = {
      id: uuidv4(),
      name,
      data: form,
      createdAt: Date.now(),
    };
    savePresets([next, ...presets]);
    setPresetName("");
  };
  const onLoadPreset = (p: Preset) => {
    setForm(p.data);
    setOutput("");
  };
  const onDeletePreset = (id: string) =>
    savePresets(presets.filter((p) => p.id !== id));
  const exportPresets = () => {
    if (!currentWs) return;
    const blob = new Blob(
      [JSON.stringify({ workspaceId: currentWs, presets }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presets_${currentWs}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importPresets = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data.presets)) {
          const merged: Preset[] = [...data.presets, ...presets];
          savePresets(merged);
        } else alert("Invalid file format");
      } catch {
        alert("Failed to import file");
      }
    };
    reader.readAsText(file);
  };

  const compiled = useMemo(() => output || makePrompt(form), [output, form]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-6xl p-6">
        {/* Top section: Title left; Greeting + workspace right */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4 backdrop-blur-sm dark:border-neutral-800">
          <h1 className="text-2xl font-semibold tracking-tight">
            ChatGPT 5 Prompt Builder
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="mr-2 text-sm text-neutral-600 dark:text-neutral-400">
              {greeting}
            </span>
            <Select value={currentWs} onValueChange={(v) => setCurrentWs(v)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full sm:w-auto"
              variant="default"
              onClick={() => setShowWsModal(true)}
            >
              Create Workspace
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="ghost"
              onClick={() => setShowInstructions(true)}
            >
              Instructions
            </Button>
          </div>
        </header>

        {/* Middle section: Steps with One-Line control integrated */}
        <StepsPanel
          form={form}
          setForm={(v) => setForm(v)}
          copied={copied}
          onCopy={onCopy}
          onGenerate={onGenerate}
          onClear={onClear}
        />

        {/* Divider between sections */}
        <div className="my-6 border-t dark:border-neutral-800" />

        {/* Bottom section: Output + Save Preset + utility actions */}
        <div className="mt-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[300px] rounded-xl"
                value={compiled}
                onChange={(e) => setOutput(e.target.value)}
              />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  className="w-full sm:w-48"
                />
                <Button className="w-full sm:w-auto" onClick={onSavePreset}>
                  Save Preset
                </Button>
              </div>
              {presets.length > 0 && (
                <div className="mt-4 text-sm">
                  <div className="mb-1 text-xs font-medium">Presets</div>
                  <ul className="divide-y rounded-md border dark:divide-neutral-800 dark:border-neutral-800">
                    {presets.map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {new Date(p.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLoadPreset(p)}
                          >
                            Load
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeletePreset(p.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-col items-stretch gap-2 border-t pt-4 dark:border-neutral-800 sm:flex-row sm:justify-end sm:items-center">
                <Button
                  className="w-full sm:w-auto"
                  variant="default"
                  onClick={() =>
                    document.documentElement.classList.toggle("dark")
                  }
                >
                  Toggle Theme
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={exportPresets}
                >
                  Export
                </Button>
                <input
                  ref={importRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importPresets(f);
                    e.currentTarget.value = "";
                  }}
                />
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => importRef.current?.click()}
                >
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-10 text-center text-xs text-neutral-500 dark:text-neutral-500">
          Built with Cursor AI • Next.js • shadcn/ui • Tailwind
        </footer>
      </div>

      <Dialog open={showWsModal} onOpenChange={setShowWsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
          </DialogHeader>
          <Input
            value={wsName}
            onChange={(e) => setWsName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={wsDesc}
            onChange={(e) => setWsDesc(e.target.value)}
            placeholder="Description"
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowWsModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!wsName.trim()) return;
                const ws: Workspace = {
                  id: uuidv4(),
                  name: wsName.trim(),
                  description: wsDesc.trim() || undefined,
                };
                const next = [...workspaces, ws];
                saveWorkspaces(next);
                setCurrentWs(ws.id);
                setWsName("");
                setWsDesc("");
                setShowWsModal(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="w-[800px] max-w-[95vw] h-[70vh]">
          <DialogHeader>
            <DialogTitle>Instructions</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(70vh-6rem)] overflow-y-auto space-y-6 text-sm leading-6 pr-1">
            <div>
              <div className="text-base font-medium">
                My recommended way to communicate with me
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Think of it like briefing a senior engineer you trust — but who
                works at warp speed.
              </div>
            </div>

            <ol className="list-decimal space-y-4 pl-5">
              <li>
                <div className="font-medium">Assign a Persona if It Helps</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>If you want a particular style, tell me.</li>
                  <li className="italic">
                    Examples: “Be a CTO giving blunt advice”, “Talk like an
                    experienced product manager”, “Explain like I’m 12”.
                  </li>
                  <li>
                    This is basically like setting my “voice” and “angle.”
                  </li>
                </ul>
              </li>
              <li>
                <div className="font-medium">Be Direct About the Task</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>
                    Tell me exactly what you want at the end (a plan, a code
                    snippet, a comparison, a prototype spec, etc.).
                  </li>
                  <li>
                    If you want me to think before answering, tell me
                    (&quot;reason step-by-step&quot; / &quot;check
                    assumptions&quot; / &quot;give 3 options first&quot;).
                  </li>
                </ul>
              </li>
              <li>
                <div className="font-medium">Give Me Context</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>
                    Who it’s for, what stage you’re at, constraints (budget,
                    timeline, tech stack, tone).
                  </li>
                  <li>This saves me from giving you generic answers.</li>
                </ul>
              </li>
              <li>
                <div className="font-medium">Supply References</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>Examples of what “good” looks like.</li>
                  <li>Existing docs, code, or articles to align with.</li>
                  <li>Competitor examples you like or hate.</li>
                </ul>
              </li>
              <li>
                <div className="font-medium">Specify Format</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>
                    Bullet points, numbered steps, comparison tables, markdown,
                    JSON — whatever works for you.
                  </li>
                  <li>Saves you time reformatting.</li>
                </ul>
              </li>
              <li>
                <div className="font-medium">Add Evaluation Criteria</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>
                    Tell me what you’ll use to judge the output so I can
                    self-check.
                  </li>
                  <li className="italic">
                    Example: “Make sure it’s under 200 words, in plain English,
                    with no jargon.”
                  </li>
                </ul>
              </li>
              <li>
                <div className="font-medium">Iterate Quickly</div>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                  <li>Don’t try to make the perfect prompt first time.</li>
                  <li>
                    Treat me like a collaborator — react to my answer and
                    refine.
                  </li>
                </ul>
              </li>
            </ol>

            <div className="border-t pt-4 dark:border-neutral-800">
              <div className="mb-2 text-base font-medium">
                Example of a high‑quality instruction
              </div>
              <div className="mb-3 text-neutral-700 dark:text-neutral-300">
                <div className="mb-1">Instead of:</div>
                <blockquote className="rounded-md border-l-4 border-neutral-300 bg-neutral-100 p-3 italic dark:border-neutral-700 dark:bg-neutral-900">
                  I want to build a travel website.
                </blockquote>
              </div>
              <div className="mb-1">Say:</div>
              <div className="space-y-1 rounded-md border bg-white/60 p-3 text-neutral-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/40 dark:text-neutral-100">
                <div>
                  <span className="font-semibold">Persona:</span> Act like a Product Manager advising a startup travel website.
                </div>
                <div>
                  <span className="font-semibold">Task:</span> Provide a detailed product roadmap for the first 6 months of building and launching the travel website.
                </div>
                <div>
                  <span className="font-semibold">Context:</span> I am leading a small remote team. We want a lean MVP that allows users to search, book, and review travel experiences. Budget is tight, speed-to-market is critical, and we want to validate product-market fit quickly.
                </div>
                <div>
                  <span className="font-semibold">References:</span> Existing travel platforms like Airbnb, TripAdvisor, and Skyscanner. Lean startup principles, user-centered design, and MVP-focused launch strategies.
                </div>
                <div>
                  <span className="font-semibold">Format:</span> Bullet points grouped by Discovery, MVP Build, Launch, and Post-Launch Iteration.
                </div>
                <div>
                  <span className="font-semibold">Criteria:</span> Must be practical for a small team, highlight critical milestones, and include risks and mitigation strategies.
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
