import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMonitorCsv, analyzeMonitor, parsePowermetrics, flattenRatings, summarizeRatings } from './monitor.mjs';

const csv = [
  'epoch,kind,f1,f2,f3,f4',
  '1000,proc,1,100000,ollama,100000',
  '1000,sys,500,60,100,',
  '1000,mark,start:usage-sim,,,',
  '1010,proc,1,2100000,ollama,100000',
  '1010,proc,2,300000,python3,0',
  '1010,sys,500,40,100,',
  '1020,sys,520,30,100,',
  '1020,mark,end,,,',
  '1020,proc,1,2100000,ollama,100000',
  '1080,proc,1,2100000,ollama,100000',
  '1200,proc,1,150000,ollama,100000',
  '1320,proc,1,120000,ollama,100000',
  '1320,sys,520,35,100,',
].join('\n');

test('analyzeMonitor: peak added by name, swap delta, idle recovery, unload', () => {
  const a = analyzeMonitor(parseMonitorCsv(csv));
  assert.equal(a.peakTotalKb, 2000000 + 300000);
  assert.deepEqual(a.peakByName[0], ['ollama', 2000000]);
  assert.equal(a.swapDeltaPages, 20);
  assert.equal(a.minFreePct, 30);
  assert.equal(a.idle[60], 2000000);
  assert.equal(a.idle[180], 50000);
  assert.equal(a.idle[300], 20000);
  assert.equal(analyzeMonitor(parseMonitorCsv(csv.split('\n').slice(0, 12).join('\n'))).idle[300], null); // not enough samples
  assert.equal(a.unloaded, true);
});

test('analyzeMonitor without end mark / empty', () => {
  const a = analyzeMonitor(parseMonitorCsv('epoch,kind,f1,f2,f3,f4\n1,proc,1,10,x,10\n'));
  assert.equal(a.unloaded, null);
  assert.equal(a.peakTotalKb, 0);
  assert.equal(analyzeMonitor([]).swapDeltaPages, null);
});

test('parsePowermetrics', () => {
  const log = ['CPU Power: 1000 mW', 'GPU Power: 200 mW', 'ANE Power: 0 mW', 'Combined Power (CPU + GPU + ANE): 1200 mW', 'GPU HW active residency:  10.0% (1296 MHz: ...)',
    'CPU Power: 3000 mW', 'GPU Power: 400 mW', 'ANE Power: 50 mW', 'GPU HW active residency:  30.0% (...)'].join('\n');
  const p = parsePowermetrics(log);
  assert.equal(p.CPU.avgMw, 2000);
  assert.equal(p.GPU.maxMw, 400);
  assert.equal(p.ANE.samples, 2);
  assert.equal(p.gpuActivePct.avg, 20);
  assert.deepEqual(parsePowermetrics('nothing'), {});
});

test('ratings: nested (rate.js) and flat', () => {
  const nested = { lang: 'en', ratings: [{ blockId: 'a', candidates: [{ engine: 'e1', naturalness: 4, accuracy: 5, best: true }, { engine: 'e2', naturalness: 2, accuracy: 3, best: false }] }, { blockId: 'b', candidates: [{ engine: 'e1', naturalness: 2, accuracy: null, best: false }] }] };
  const s = summarizeRatings(flattenRatings(nested));
  const e1 = s.find((x) => x.engine === 'e1');
  assert.equal(e1.naturalness, 3);
  assert.equal(e1.accuracy, 5);
  assert.equal(e1.best, 1);
  const flat = summarizeRatings(flattenRatings([{ engine: 'z', lang: 'ja', naturalness: 5 }]));
  assert.equal(flat[0].lang, 'ja');
});
