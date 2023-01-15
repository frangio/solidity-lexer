import fs from 'fs';
import assert from 'assert/strict'
import { lex } from './lex';

it('keywords', () => {
  const keywords = [
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
  ];

  for (const k of keywords) {
    const { kind, value } = lex(k)[0]!;
    assert.deepEqual({ kind, value }, { kind: 'keyword', value: k });
  }
});

it('bytes', () => {
  for (let i = 1; i <= 32; i++) {
    const w = `bytes${i}`;
    const { kind, value } = lex(w)[0]!;
    assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
  }
});

it('integers', () => {
  for (const u of ['', 'u']) {
    for (let i = 1; i <= 32; i++) {
      const w = `${u}int${i * 8}`;
      const { kind, value } = lex(w)[0]!;
      assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
    }
  }
});

it('fixed', () => {
  for (const u of ['', 'u']) {
    for (let i = 1; i <= 99; i++) {
      for (let j = 1; j <= 99; j++) {
        const w = `${u}fixed${i}x${j}`;
        const { kind, value } = lex(w)[0]!;
        assert.deepEqual({ kind, value }, { kind: 'keyword', value: w });
      }
    }
  }
});
