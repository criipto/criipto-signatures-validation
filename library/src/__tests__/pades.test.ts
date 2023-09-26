import test from 'ava';
import fs from 'fs/promises';
import { validate } from '../index.js';

test('extracts JWT evidence and identity', async (t) => {
  const blob = await fs.readFile(new URL('./569c2bf9-0dd8-4c0a-bfc1-2f03d628c95a.pdf', import.meta.url));

  const actual = await validate(blob);

  t.is(actual.type, 'pades');
  t.is(actual.signatures.length, 1);

  const signature = actual.signatures[0];
  t.is(signature.type, 'criipto.signature.jwt');
  t.truthy(signature.timestamp);
  t.deepEqual(signature.timestamp?.date, new Date('2023-09-07T10:52:05.000Z'));
  
  
  if (signature.type === 'criipto.signature.jwt') {
    t.deepEqual(signature.identity, {
      birthdate: '1910-06-14',
      country: 'NO',
      id: '9578-6000-4-1433659',
      name: 'Ole Olsen',
    });
    t.truthy(signature.evidence.jwt);
    t.truthy(signature.evidence.jwks);

    t.true(signature.validity.valid);
    t.true(signature.validity.checks.length >= 4);
  }
});

test('extracts drawable evidence', async (t) => {
  const blob = await fs.readFile(new URL('./drawable.pdf', import.meta.url));

  const actual = await validate(blob);

  t.is(actual.type, 'pades');
  t.is(actual.signatures.length, 2); // also a doc-ts

  const signature = actual.signatures[0];
  t.is(signature.type, 'criipto.signature.drawable');
  if (signature.type === 'criipto.signature.drawable') {
    t.truthy(signature.evidence.image);
    t.truthy(signature.evidence.name);
    t.deepEqual(signature.identity, {
      name: 'Mick Testersen'
    });
    t.true(signature.validity.valid);
  }
});