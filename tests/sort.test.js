import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,runCase,sortFrames,swapFrames,selectionSort} from '../src/lib/lessons/sort-model.js';
test('independent expected cases catch mutants and accept the complete sort',()=>{
  for(const c of cases) assert.equal(runCase(c,'correct').pass,true,c.id);
  assert.equal(runCase(cases[0],'noop').pass,true);
  assert.equal(runCase(cases.find(c=>c.id==='reverse'),'one-pass').pass,false);
});
test('every trace preserves items and the fixed prefix, including repeats and empty input',()=>{
  const inputs=[[],['a'],...Array.from({length:81},(_,n)=>Array.from({length:4},(_,i)=>['a','b','c'][Math.floor(n/3**i)%3]))];
  for(const input of inputs){
    const expected=[...input].sort();
    for(const frame of sortFrames(input)){
      assert.deepEqual([...frame.a].sort(),expected);
      assert.deepEqual(frame.a.slice(0,frame.start),expected.slice(0,frame.start));
    }
    assert.deepEqual(sortFrames(input).at(-1).a,expected);
    assert.deepEqual(selectionSort(input),expected);
  }
});
test('swap trace demonstrates overwrite and repair',()=>{
  assert.deepEqual(swapFrames(false).at(-1).a,['ant','ant']);
  assert.deepEqual(swapFrames(true).at(-1).a,['ant','owl']);
});
