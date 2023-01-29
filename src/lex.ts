import * as regex from './regex';
import { getUtf8Length } from './utils/utf8-length';

const kinds = ['keyword', 'ident', 'symbol', 'delim', 'semicolon', 'number', 'hexnumber', 'string', 'hexstring', 'comment', 'pragmatoken', 'eof', 'yulbuiltin'] as const;
const utf8Kinds = ['comment', 'string', 'pragmatoken'];

type Kind = typeof kinds[number];
type Side = 'left' | 'right';

interface TokenCommon {
  kind: Kind;
  side?: Side;
  doc?: boolean;
  value: string;
  start: number;
  utf8Start: number;
  utf8Length: number;
}

type Token = TokenCommon & { kind: Exclude<Kind, 'delim' | 'comment' | 'eof'> }
           | TokenCommon & { kind: 'delim', side: Side }
           | TokenCommon & { kind: 'comment', doc: boolean };

type TokenOrEOF = Token | { kind: 'eof' };

export function lex(source: string): Token[] {
  const res = [];
  let utf8Offset = 0;

  const normal = new RegExp(regex.normal.source, 'gy');
  const pragma = new RegExp(regex.pragma.source, 'gy');
  const assembly = new RegExp(regex.assembly.source, 'gy');
  const yul = new RegExp(regex.yul.source, 'gy');

  let mode = normal;
  let yulDepth = 0;

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
      case 'pragmatoken': {
        utf8Offset += t.utf8Length - t.value.length;
        break;
      }

      case 'keyword': {
        if (t.value === 'pragma') {
          pragma.lastIndex = mode.lastIndex;
          mode = pragma;
        }
        else if (t.value === 'assembly') {
          assembly.lastIndex = mode.lastIndex;
          mode = assembly;
        }
        break;
      }
    }

    switch (mode) {
      case pragma: {
        if (t.kind === 'semicolon') {
          normal.lastIndex = mode.lastIndex;
          mode = normal;
        }
        break;
      }

      case assembly: {
        if (t.kind === 'delim' && t.value === '{') {
          yulDepth += 1;
          yul.lastIndex = mode.lastIndex;
          mode = yul;
        }
        break;
      }

      case yul: {
        if (t.kind === 'delim') {
          if (t.value === '{') {
            yulDepth += 1;
          } else if (t.value === '}') {
            yulDepth -= 1;
            if (yulDepth === 0) {
              normal.lastIndex = mode.lastIndex;
              mode = normal;
            }
          }
        }
        break;
      }
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
  const utf8Length = utf8Kinds.includes(kind) ? getUtf8Length(value) : value.length;
  const side = kind === 'delim' ? g.rdelim !== undefined ? 'right' : 'left' : undefined;
  const doc = kind === 'comment' ? (g.sdcomment ?? g.mdcomment) !== undefined : undefined;
  const t: TokenCommon = { kind, side, doc, value, start, utf8Start, utf8Length };
  return t as TokenOrEOF;
};
