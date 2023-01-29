import fs from 'fs';
import fc from 'fast-check';
import assert from 'assert/strict'
import { lex } from './lex';
import * as solidityParser from '@solidity-parser/parser';

const keywords = new Set([
  'abstract', 'address', 'after', 'alias', 'anonymous',
  'apply', 'as', 'assembly', 'auto', 'bool',
  'break', 'byte', 'bytes', 'calldata', 'case',
  'catch', 'constant', 'constructor', 'continue', 'contract',
  'copyof', 'days', 'default', 'define', 'delete',
  'do', 'else', 'emit', 'enum', 'ether',
  'event', 'external', 'fallback', 'false', 'final', 'fixed',
  'for', 'function', 'gwei', 'hex', 'hours',
  'if', 'immutable', 'implements', 'import', 'in', 'int',
  'indexed', 'inline', 'interface', 'internal', 'is',
  'let', 'library', 'macro', 'mapping', 'match',
  'memory', 'minutes', 'modifier', 'mutable', 'new',
  'null', 'of', 'override', 'partial', 'payable',
  'pragma', 'private', 'promise', 'public', 'pure',
  'receive', 'reference', 'relocatable', 'return', 'returns',
  'sealed', 'seconds', 'sizeof', 'static', 'storage',
  'string', 'struct', 'supports', 'switch', 'true',
  'try', 'type', 'typedef', 'typeof', 'uint', 'ufixed', 'unchecked',
  'using', 'var', 'view', 'virtual', 'weeks',
  'wei', 'while', 'years',
]);

const keyword = fc.constantFrom(...keywords);

const keywordBytes = fc.integer({ min: 1, max: 32 }).map(n => `bytes${n}`);
const keywordInteger = fc
  .tuple(fc.constantFrom('', 'u'), fc.integer({ min: 1, max: 32 }))
  .map(([u, i]) => `${u}int${8*i}`);
const keywordFixed = fc
  .tuple(fc.constantFrom('', 'u'), fc.integer({ min: 1, max: 99 }), fc.integer({ min: 1, max: 99 }))
  .map(([u, i, j]) => `${u}fixed${i}x${j}`);

const identStart = fc.constantFrom(...'_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const identAfter = fc.constantFrom(...'_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
const ident = fc
  .tuple(identStart, fc.stringOf(identAfter)).map(([s, a]) => s + a)
  .filter(id => !keywords.has(id));

const text = fc.oneof(fc.asciiString(), fc.unicodeString());

const string = fc
  .tuple(fc.constantFrom(`'`, `"`), text)
  .map(([d, s]) => `${d}${s.replace(new RegExp(`${d}|[\\\\\n\r]`, 'g'), '\\$&')}${d}`);

const scomment = fc.tuple(text, fc.boolean()).map(([t, d]) => '//' + ((d ? '/' : '') + t).replace(/[\n\r\u2028\u2029]/g, ''));
const mcomment = fc.tuple(text, fc.boolean()).map(([t, d]) => '/*' + ((d ? '*' : '') + t).replace(/\*\//g, '') + '*/');
const comment = fc.oneof(scomment, mcomment);

const whitespace = fc.stringOf(fc.constantFrom(...' \t\r\n\u000C'), { minLength: 1 });

const solidity = fc.tuple(
  fc.array(
    fc.oneof(
      keyword,
      keywordBytes,
      keywordInteger,
      keywordFixed,
      ident,
      string,
    ),
    { size: 'large' },
  ),
  fc.infiniteStream(
    fc.oneof(
      whitespace,
      mcomment,
      scomment.map(c => c + '\n'),
    )
  ),
).map(([toks, sepsStream]) => {
  const seps = [...sepsStream.take(toks.length)];
  return toks.reduce((code, tok, i) => code + seps[i] + tok, '');
});

it('keywords', () => {
  fc.assert(
    fc.property(keyword, k => {
      const { kind, value } = lex(k)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: k });
    }),
    { ignoreEqualValues: true },
  );
});

it('keywords: bytes types', () => {
  fc.assert(
    fc.property(keywordBytes, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }),
    { ignoreEqualValues: true },
  );
});

it('keywords: integer types', () => {
  fc.assert(
    fc.property(keywordInteger, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }),
    { ignoreEqualValues: true },
  );
});

it('keywords: fixed types', () => {
  fc.assert(
    fc.property(keywordFixed, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }),
    { ignoreEqualValues: true },
  );
});

it('strings', () => {
  fc.assert(
    fc.property(string, w => {
      const { kind, value, utf8Length } = lex(w)[0]!;
      assert.deepEqual({ kind, value, utf8Length }, {
        kind: 'string',
        value: w,
        utf8Length: Buffer.from(w, 'utf8').length,
      });
    }),
  );
});

it('comments', () => {
  fc.assert(
    fc.property(comment, w => {
      const { kind, value, utf8Length } = lex(w)[0]!;
      assert.deepEqual({ kind, value, utf8Length }, {
        kind: 'comment',
        value: w,
        utf8Length: Buffer.from(w, 'utf8').length,
      });
    }),
  );
});

it('identifiers', () => {
  fc.assert(
    fc.property(ident, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'ident', value: w });
    }),
  );
});

it('start + length', () => {
  fc.assert(
    fc.property(solidity, code => {
      const utf8Code = Buffer.from(code, 'utf8');
      for (const { value, start, utf8Start, utf8Length } of lex(code)) {
        assert.equal(
          value,
          code.slice(start, start + value.length),
        );
        assert.equal(
          value,
          utf8Code.slice(utf8Start, utf8Start + utf8Length).toString('utf8'),
        );
      }
    })
  );
});

it('solidity-parser baseline', () => {
  fc.assert(
    fc.property(solidity, code => {
      const j = lex(code).map(t => t.value);
      const b = solidityParser.tokenize(code).map((t: any) => t.value);
      assert.deepEqual(j, b);
    })
  );
});
