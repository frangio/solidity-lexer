import * as regex from './regex';
import { getUtf8Length } from './utils/utf8-length';

const kinds = ['keyword', 'ident', 'symbol', 'delim', 'semicolon', 'number', 'string', 'comment', 'pragmatoken', 'eof'] as const;

type Kind = typeof kinds[number];
type Side = 'left' | 'right';

interface TokenCommon {
  kind: Kind;
  side?: Side;
  value: string;
  start: number;
  utf8Start: number;
  utf8Length: number;
}

type Token = TokenCommon & { kind: Exclude<Kind, 'delim' | 'eof'> }
           | TokenCommon & { kind: 'delim', side: Side };

type TokenOrEOF = Token | { kind: 'eof' };

export function lex(source: string): Token[] {
  const res = [];
  let utf8Offset = 0;

  const normal = new RegExp(regex.normal.source, 'gy');
  const pragma = new RegExp(regex.pragma.source, 'gy');

  let mode = normal;

  while (true) {
    const m = mode.exec(source);

    if (m === null) {
      throw Error('lexer error');
    }

    if (m.groups!.whitespace !== undefined) {
      continue;
    }

    const t = makeToken(m, utf8Offset);

    if (t.kind === 'eof') {
      break;
    }

    res.push(t);

    switch (t.kind) {
      case 'string':
      case 'comment':
      case 'pragmatoken':
        utf8Offset += t.utf8Length - t.value.length;
        break;

      case 'keyword':
        if (t.value === 'pragma') {
          pragma.lastIndex = mode.lastIndex;
          mode = pragma;
        }
        break;

      case 'semicolon':
        if (mode === pragma) {
          normal.lastIndex = mode.lastIndex;
          mode = normal;
        }
        break;
    }
  }

  return res;
}

interface RegExpMatch {
  index?: number;
  groups?: { [key: string]: string };
}

const makeToken = (m: RegExpMatch, utf8Offset: number): TokenOrEOF => {
  const g = m.groups!;
  const kind = kinds.find(k => g[k] !== undefined);
  if (kind === undefined) {
    throw Error('unrecognized token');
  }
  const value = g[kind]!;
  const start = m.index!;
  const utf8Start = start + utf8Offset;
  const utf8Length = getUtf8Length(value);
  const side = kind !== 'delim' ? undefined : g.rdelim !== undefined ? 'right' : 'left';
  const t: TokenCommon = { kind, value, start, utf8Start, utf8Length, side };
  return t as TokenOrEOF;
};
