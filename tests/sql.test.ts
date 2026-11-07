import { test } from "node:test";
import assert from "node:assert/strict";
import { highlightSql } from "../src/lib/sql.ts";

test("highlightSql marks keywords and words, and keeps the text intact", () => {
  const src = "select a from t where b = 'x'";
  const toks = highlightSql(src, ["a"]);
  assert.deepEqual(
    toks.filter((t) => t.k === "kw").map((t) => t.t.toUpperCase()),
    ["SELECT", "FROM", "WHERE"],
  );
  assert.equal(toks.find((t) => t.k === "mark")?.t, "a");
  assert.equal(toks.map((t) => t.t).join(""), src);
});

test("highlightSql only matches whole words", () => {
  const toks = highlightSql("SELECT prod_qty AS qty FROM prod", ["prod"]);
  assert.deepEqual(toks.filter((t) => t.k === "mark").map((t) => t.t), ["prod"]);
  assert.deepEqual(toks.filter((t) => t.k === "kw").map((t) => t.t), ["SELECT", "AS", "FROM"]);
});
