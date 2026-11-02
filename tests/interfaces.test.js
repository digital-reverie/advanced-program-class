import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveCall,printWork} from '../src/lib/lessons/interface-model.js';
test('assignments and available calls obey declared types',()=>{
  for(const declared of ['List61B','SLList','AList']) for(const actual of ['SLList','AList']) for(const call of ['print','capacity','label']) {
    const allowedAssignment=declared==='List61B'||declared===actual;
    assert.equal(resolveCall(declared,actual,call).ok,allowedAssignment && (call!=='capacity'||declared==='AList'));
  }
});
test('overrides use runtime class while overloads use expression type',()=>{
  assert.equal(resolveCall('List61B','SLList','print').result,'SLList.print()');
  assert.equal(resolveCall('List61B','AList','print').result,'List61B default print()');
  assert.equal(resolveCall('List61B','SLList','label').result,'WordTools.label(List61B<String>)');
  assert.equal(resolveCall('SLList','SLList','label').result,'WordTools.label(SLList<String>)');
  assert.equal(resolveCall('AList','AList','label').result,'WordTools.label(List61B<String>)');
});
test('cost model matches explicit traversals',()=>{
  for(let n=1;n<=40;n++){
    let visits=0;for(let i=0;i<n;i++)for(let j=0;j<=i;j++)visits++;
    assert.deepEqual(printWork(n),{indexed:visits,direct:n,array:n});
  }
});
