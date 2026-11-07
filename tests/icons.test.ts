import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { translations } from "../src/lib/data.ts";

test("every skill icon is a vendored svg tile with no external refs", () => {
  for (const g of translations.ko.skills) {
    if (g.variant === "cert") continue;
    for (const i of g.items) {
      const path = `public/icons/${i.icon}.svg`;
      assert.ok(existsSync(path), path);
      const svg = readFileSync(path, "utf8");
      assert.ok(svg.trimStart().startsWith("<svg"), path);
      assert.doesNotMatch(svg, /https?:\/\/(?!www\.w3\.org)/, path);
    }
  }
});
