/* 앱 창 샘플 SQL 의 글자 색을 정한다. 키워드와 강조할 단어만 토큰으로 나누고,
   나머지는 이어 붙인 평문으로 둔다. 토큰을 이어 붙이면 원문과 같다. */

export type SqlToken = { t: string; k?: "kw" | "mark" };

const KEYWORDS = new Set(
  "WITH SELECT TOP FROM WHERE AND OR JOIN LEFT ON AS GROUP BY ORDER DESC ASC BETWEEN CAST DECIMAL NULLIF RANK OVER COUNT DISTINCT SUM MIN MAX ROUND".split(" "),
);

export function highlightSql(sql: string, marks: string[] = []): SqlToken[] {
  const out: SqlToken[] = [];
  const push = (t: string, k?: SqlToken["k"]) => {
    const prev = out[out.length - 1];
    if (!k && prev && !prev.k) prev.t += t;
    else out.push(k ? { t, k } : { t });
  };
  for (const part of sql.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b)/)) {
    if (!part) continue;
    if (marks.includes(part)) push(part, "mark");
    else if (KEYWORDS.has(part.toUpperCase())) push(part, "kw");
    else push(part);
  }
  return out;
}
