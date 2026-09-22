import { SSEEvent } from "../types";

type RunContext = {
  events: SSEEvent[];
  controllers: Set<ReadableStreamDefaultController>;
};

// Next.js development server clears module cache often, but global persists
const globalAny = global as any;
const activeRuns = globalAny.activeRuns || (globalAny.activeRuns = new Map<string, RunContext>());

export const runBroker = {
  startRun(sessionId: string) {
    activeRuns.set(sessionId, { events: [], controllers: new Set() });
  },

  attach(sessionId: string, controller: ReadableStreamDefaultController): boolean {
    const run = activeRuns.get(sessionId);
    if (!run) return false;

    const encoder = new TextEncoder();
    // replay all events
    for (const ev of run.events) {
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
      } catch {
        // stream might be closed already
      }
    }
    run.controllers.add(controller);
    return true;
  },

  push(sessionId: string, ev: SSEEvent) {
    const run = activeRuns.get(sessionId);
    if (!run) return;
    run.events.push(ev);
    const chunk = new TextEncoder().encode(`data: ${JSON.stringify(ev)}\n\n`);
    for (const ctrl of run.controllers) {
      try {
        ctrl.enqueue(chunk);
      } catch {
        run.controllers.delete(ctrl);
      }
    }
  },

  finishRun(sessionId: string) {
    const run = activeRuns.get(sessionId);
    if (!run) return;
    for (const ctrl of run.controllers) {
      try {
        ctrl.close();
      } catch {}
    }
    activeRuns.delete(sessionId);
  },
};
