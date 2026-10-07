import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const J = createRequire(import.meta.url)('../extension/lib/josa.js');

test('josa: hasBatchim table', () => {
  for (const c of ['문', '를', '각', '값', '밖', '달']) assert.equal(J.hasBatchim(c), true, c);
  for (const c of ['가', '서', '리', '키', '로']) assert.equal(J.hasBatchim(c), false, c);
  for (const c of ['A', '3', ' ', '', 'ㄱ', '漢', undefined]) assert.equal(J.hasBatchim(c), false, String(c));
  assert.equal(J.isHangulSyllable('가'), true);
  assert.equal(J.isHangulSyllable('a'), false);
});

test('josa: resolveParticle pairs', () => {
  assert.equal(J.resolveParticle('문', '을(를)'), '을');
  assert.equal(J.resolveParticle('서', '을(를)'), '를');
  assert.equal(J.resolveParticle('문', '은(는)'), '은');
  assert.equal(J.resolveParticle('서', '는(은)'), '는');
  assert.equal(J.resolveParticle('문', '이(가)'), '이');
  assert.equal(J.resolveParticle('서', '이(가)'), '가');
  assert.equal(J.resolveParticle('문', '와(과)'), '과');
  assert.equal(J.resolveParticle('서', '와(과)'), '와');
  assert.equal(J.resolveParticle('문', '이다'), '이다');
  assert.equal(J.resolveParticle('서', '이다'), '다');
});

test('josa: (으)로 with rieul exception', () => {
  assert.equal(J.resolveParticle('집', '(으)로'), '으로');
  assert.equal(J.resolveParticle('서', '(으)로'), '로');
  assert.equal(J.resolveParticle('달', '(으)로'), '로'); // ㄹ받침
  assert.equal(J.resolveParticle('달', '으로(로)'), '로');
  assert.equal(J.resolveParticle('책', '으로(로)'), '으로');
});

test('josa: non-Hangul prev is not guessed', () => {
  for (const c of ['A', 'n', '3', ')', ' ']) assert.equal(J.resolveParticle(c, '을(를)'), null);
  assert.equal(J.resolveParticle('문', '??'), null);
});

test('josa: fixPairedParticles', () => {
  assert.equal(J.fixPairedParticles('문서을(를) 열고 설정는(은) 바꿉니다'), '문서를 열고 설정은 바꿉니다');
  assert.equal(J.fixPairedParticles('책으로(로) 집(으)로 달으로(로)'), '책으로 집으로 달로');
  assert.equal(J.fixPairedParticles('파일이(가) 없고 사과와(과)'), '파일이 없고 사과와'.replace('사과와', '사과와'));
  assert.equal(J.fixPairedParticles('집와(과) 방'), '집과 방');
});

test('josa: Latin/digit/space before pair stays unchanged', () => {
  for (const s of ['API을(를) 호출', 'Python은(는) 좋다', '3이(가) 맞다', ' 을(를) 쓴다', '을(를) 쓴다', '문서 을(를)']) {
    assert.equal(J.fixPairedParticles(s), s);
  }
});

test('josa: idempotent and no-op without pairs', () => {
  const s = '문서을(를) 읽고 값이(가) 같다 달(으)로';
  const once = J.fixPairedParticles(s);
  assert.equal(J.fixPairedParticles(once), once);
  for (const t of ['', '그냥 문장입니다', 'hello (world)', '문서를 (참고)']) assert.equal(J.fixPairedParticles(t), t);
  assert.equal(J.fixPairedParticles(null), '');
});

test('josa: fixLeadingParticle', () => {
  assert.equal(J.fixLeadingParticle('문서', '을(를) 클릭하세요'), '를 클릭하세요'.replace('를', '을'));
  assert.equal(J.fixLeadingParticle('here 설정', '은(는) 중요'), '은 중요');
  assert.equal(J.fixLeadingParticle('API', '을(를) 클릭'), '을(를) 클릭');
  assert.equal(J.fixLeadingParticle('Python3', '이(가) 필요'), '이(가) 필요');
  assert.equal(J.fixLeadingParticle('문서', '그리고 을(를)'), '그리고 을(를)');
  assert.equal(J.fixLeadingParticle('', '을(를)'), '을(를)');
});
