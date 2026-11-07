/* 문구 안의 **굵게** 표기만 해석한다. 짝이 맞지 않는 ** 는 글자 그대로 둔다. */

export type RichPart = string | { b: string };

export function rich(s: string): RichPart[] {
  const out: RichPart[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push({ b: m[1] });
    last = m.index + m[0].length;
  }
  if (last < s.length || out.length === 0) out.push(s.slice(last));
  return out;
}
