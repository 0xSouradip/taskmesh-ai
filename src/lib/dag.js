// Turns a plan whose tasks say `dependsOn: [index, ...]` into a valid DAG:
// drops self, unknown and duplicate references, breaks cycles, and returns the tasks in
// topological order with `dependsOn` rewritten as indices into the returned array.
// Used on AI output and again on publish, because the plan round-trips through the browser.
export function normalizePlan(tasks) {
  const n = tasks.length;
  const deps = tasks.map((t, i) => {
    const raw = Array.isArray(t.dependsOn) ? t.dependsOn : [];
    return [...new Set(raw.map(Number).filter((d) => Number.isInteger(d) && d >= 0 && d < n && d !== i))];
  });

  // Kahn's algorithm. When it stalls, the remaining tasks form cycles: cut the
  // remaining (unsatisfied) edges of the earliest stuck task and continue.
  const order = [];
  const placed = new Array(n).fill(false);
  while (order.length < n) {
    let next = -1;
    for (let i = 0; i < n; i++) {
      if (!placed[i] && deps[i].every((d) => placed[d])) {
        next = i;
        break;
      }
    }
    if (next === -1) {
      next = placed.findIndex((p) => !p);
      deps[next] = deps[next].filter((d) => placed[d]); // ponytail: drops all back-edges of one task; fine for <=20 tasks
    }
    placed[next] = true;
    order.push(next);
  }

  const newIndex = new Array(n);
  order.forEach((oldI, newI) => (newIndex[oldI] = newI));
  return order.map((oldI) => ({ ...tasks[oldI], dependsOn: deps[oldI].map((d) => newIndex[d]).sort((a, b) => a - b) }));
}

// Remove task `i` from a normalized plan and fix everyone's indices.
export function removeFromPlan(plan, i) {
  return plan
    .filter((_, j) => j !== i)
    .map((t) => ({ ...t, dependsOn: (t.dependsOn ?? []).filter((d) => d !== i).map((d) => (d > i ? d - 1 : d)) }));
}
