import * as regex from './regex';

const kinds = ['keyword', 'ident', 'symbol', 'delim', 'semicolon', 'number', 'string', 'comment', 'pragmatoken', 'eof'] as const;

type Kind = typeof kinds[number];

interface TokenCommon {
  kind: Kind;
  side?: 'left' | 'right';
  value: string;
  index: number;
}

type Token = TokenCommon & { kind: Exclude<Kind, 'delim'> }
           | TokenCommon & { kind: 'delim', side: NonNullable<TokenCommon['side']> };

export function lex(source: string): Token[] {
  const res = [];

  const normal = new RegExp(regex.normal.source, 'gy');
  let pragma;

  let mode = normal;

  while (true) {
    const m = mode.exec(source);

    if (m === null) {
      throw Error('lexer error');
    }

    const t = makeToken(m);

    res.push(t);

    if (t.kind === 'eof') {
      break;
    } else if (t.kind === 'keyword') {
      if (t.value === 'pragma') {
        pragma ??= new RegExp(regex.pragma.source, 'gy');
        pragma.lastIndex = mode.lastIndex;
        mode = pragma;
      }
    } else if (mode === pragma && t.kind === 'semicolon') {
      normal.lastIndex = mode.lastIndex;
      mode = normal;
    }
  }

  return res;
}

interface RegExpMatch {
  index?: number;
  groups?: { [key: string]: string };
}

const makeToken = (m: RegExpMatch): Token => {
  const g = m.groups!;
  const kind = kinds.find(k => g[k] !== undefined)!;
  const value = g[kind]!;
  const index = m.index!;
  const side = kind !== 'delim' ? undefined : g.rdelim !== undefined ? 'right' : 'left';
  const t: TokenCommon = { kind, value, index, side };
  return t as Token;
};
