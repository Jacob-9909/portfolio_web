import { test } from "node:test";
import assert from "node:assert/strict";
import { translations } from "../src/lib/data.ts";

for (const lang of ["ko", "en"] as const) {
  test(`${lang} projects have facts and 1-3 metrics`, () => {
    for (const p of translations[lang].projects) {
      assert.ok(p.facts.length >= 3 && p.facts.every((f) => f.label && f.value), p.id);
      assert.ok(p.metrics.length >= 1 && p.metrics.length <= 3, p.id);
      assert.ok(p.number.startsWith(p.metrics[0].value), p.id);
      assert.ok(p.kindLabel.trim(), p.id);
    }
  });

  test(`${lang} hero sub has three evidence notes`, () => {
    assert.equal(translations[lang].hero.sub.filter((s) => typeof s !== "string").length, 3);
  });

  test(`${lang} skills: icon keys and variants`, () => {
    const groups = translations[lang].skills;
    assert.deepEqual(
      groups.map((g) => g.variant ?? null),
      ["main", "lang", null, null, null, "cert"],
    );
    for (const g of groups) {
      if (g.variant === "cert") continue;
      for (const i of g.items) assert.match(i.icon, /^[a-z0-9-]+$/, i.name);
    }
  });
}

test("ko and en share shape", () => {
  const { ko, en } = translations;
  assert.equal(ko.principles.length, 3);
  assert.equal(en.principles.length, 3);
  assert.deepEqual(ko.principles.map((p) => p.fig), en.principles.map((p) => p.fig));
  assert.equal(ko.career.length, en.career.length);
  assert.deepEqual(ko.skills.map((g) => g.items.length), en.skills.map((g) => g.items.length));
  assert.deepEqual(ko.skills.map((g) => g.items.map((i) => i.icon)), en.skills.map((g) => g.items.map((i) => i.icon)));
  assert.deepEqual(ko.projects.map((p) => p.metrics.length), en.projects.map((p) => p.metrics.length));
  assert.deepEqual(ko.projects.map((p) => p.kind), en.projects.map((p) => p.kind));
  assert.equal(ko.clients.length, en.clients.length);
});

test("marketinghub metric keeps team-result label", () => {
  assert.match(translations.ko.projects[1].metrics[0].label, /팀 성과/);
  assert.match(translations.en.projects[1].metrics[0].label, /team result/);
});

test("no self third-person intro anywhere", () => {
  assert.doesNotMatch(JSON.stringify(translations.ko), /정우혁은/);
});
