import fs from 'fs';
import fc from 'fast-check';
import assert from 'assert/strict'
import { lex } from './lex';

const keyword = fc.constantFrom(
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
);

const bytes = fc.integer({ min: 1, max: 32 }).map(n => `bytes${n}`);
const integer = fc
  .tuple(fc.constantFrom('', 'u'), fc.integer({ min: 1, max: 32 }))
  .map(([u, i]) => `${u}int${8*i}`);
const fixed = fc
  .tuple(fc.constantFrom('', 'u'), fc.integer({ min: 1, max: 99 }), fc.integer({ min: 1, max: 99 }))
  .map(([u, i, j]) => `${u}fixed${i}x${j}`);

it('keywords', () => {
  fc.assert(
    fc.property(keyword, k => {
      const { kind, value } = lex(k)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: k });
    }),
    { ignoreEqualValues: true },
  );
});

it('bytes', () => {
  fc.assert(
    fc.property(bytes, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }),
    { ignoreEqualValues: true },
  );
});

it('integers', () => {
  fc.assert(
    fc.property(integer, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }),
    { ignoreEqualValues: true },
  );
});

it('fixed', () => {
  fc.assert(
    fc.property(fixed, w => {
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }),
    { ignoreEqualValues: true },
  );
});
