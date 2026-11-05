import { test } from "node:test";
import assert from "node:assert/strict";
import { FLOWS } from "../src/lib/flows.ts";
import { translations } from "../src/lib/data.ts";

const ids = ["seonil", "marketinghub", "nhrag", "matseon"] as const;

test("project order", () => {
  assert.deepEqual(translations.ko.projects.map((p) => p.id), ids);
  assert.deepEqual(translations.en.projects.map((p) => p.id), ids);
});

for (const id of ids) {
  test(`${id} flow is consistent`, () => {
    const f = FLOWS[id];
    const nodeIds = new Set(f.nodes.map((n) => n.id));
    assert.equal(nodeIds.size, f.nodes.length);
    for (const n of f.nodes) assert.ok(n.step >= 0 && n.step < f.steps.length, n.id);
    for (const e of [...f.edges, ...f.loops]) {
      assert.ok(nodeIds.has(e.from), e.from);
      assert.ok(nodeIds.has(e.to), e.to);
      assert.ok(e.step < f.steps.length);
    }
    assert.ok(f.nodes.some((n) => n.step === 0));
    for (const s of f.steps) {
      assert.ok(s.ko.trim());
      assert.ok(s.en.trim());
    }
    for (const n of f.nodes) {
      assert.ok(n.x >= 0 && n.y >= 0 && n.x + n.w <= f.width && n.y + n.h <= f.height, n.id);
    }
  });
}

test("marketinghub keeps team-result label", () => {
  const ko = translations.ko.projects.find((p) => p.id === "marketinghub");
  const en = translations.en.projects.find((p) => p.id === "marketinghub");
  assert.match(ko!.number, /팀 성과/);
  assert.match(en!.number, /team result/);
});

test("no self third-person intro", () => {
  assert.doesNotMatch(JSON.stringify(translations.ko.hero), /정우혁은/);
});
