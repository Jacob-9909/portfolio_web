import { test } from "node:test";
import assert from "node:assert/strict";
import { SAMPLES } from "../src/lib/samples.ts";

type L = { ko: string; en: string };
const isL = (v: unknown): v is L =>
  !!v && typeof v === "object" && Object.keys(v).sort().join() === "en,ko";

function walkL(v: unknown, fn: (l: L, path: string) => void, path = "") {
  if (isL(v)) return fn(v, path);
  if (Array.isArray(v)) v.forEach((x, i) => walkL(x, fn, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkL(x, fn, `${path}.${k}`);
}

test("samples follow project order", () => {
  assert.deepEqual(SAMPLES.map((s) => s.id), ["seonil", "marketinghub", "nhrag", "matseon"]);
});

test("every sample text has ko and en", () => {
  let count = 0;
  walkL(SAMPLES, (l, path) => {
    count++;
    assert.ok(l.ko.trim(), `${path}.ko`);
    assert.ok(l.en.trim(), `${path}.en`);
  });
  assert.ok(count > 50);
});

test("sample cards are well formed", () => {
  for (const s of SAMPLES) {
    assert.ok(s.cards.length > 0, s.id);
    assert.ok(s.rail.groups.length > 0, s.id);
    for (const c of s.cards) {
      if (c.kind === "table") {
        for (const r of c.rows) assert.equal(r.length, c.head.length, s.id);
        if (c.tone) assert.equal(c.tone.length, c.rows.length, s.id);
      }
      if (c.kind === "sql") assert.ok(c.sql.trim(), s.id);
    }
  }
  const products = SAMPLES[3].cards.find((c) => c.kind === "products");
  assert.equal(products?.kind === "products" ? products.products.length : 0, 4);
});

test("no self third-person intro in samples", () => {
  assert.doesNotMatch(JSON.stringify(SAMPLES), /정우혁은/);
});
