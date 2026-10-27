import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/lib/lessons/index.js';
import { initialState, act, render, slides } from '../src/lib/lessons/list-lab.js';

test('lesson ids are unique and all slides have titles', () => {
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const lesson of lessons) for (const slide of lesson.slides) assert.ok(slide.title);
});
test('array lab preserves state and guards full, empty, invalid inputs', () => {
  const original = initialState();
  let state = act(original, {array:'add'}, '48');
  assert.deepEqual(original.arr, [12,24,36]);
  assert.deepEqual(state.arr, [12,24,36,48]);
  state = act(state, {array:'add'}, '60');
  assert.match(state.arrayMsg, /Full:/);assert.equal(state.arr.length,4);
  for (let i=0;i<5;i++) state=act(state,{array:'remove'});
  assert.equal(state.arr.length,0);assert.match(state.arrayMsg,/Empty list/);
  state=act(state,{array:'add'},'2147483648');assert.match(state.arrayMsg,/valid Java int/);
});
test('circular deque agrees with an abstract sequence across wrapping and capacity boundaries', () => {
  let state=initialState(), expected=['A','B','C'];
  const actions=['front','last','remove','remove','last','front','last','last','last','last',...Array(12).fill('remove'),'front','last'];
  for (const action of actions) {
    if(action==='remove') expected.shift();
    else if(expected.length<8) action==='front'?expected.unshift('X'):expected.push('Y');
    state=act(state,{circle:action});
    const c=state.circular;
    assert.deepEqual(Array.from({length:c.size},(_,i)=>c.a[(c.front+i)%8]),expected);
    assert.ok(c.front>=0 && c.front<8);assert.equal(c.size,expected.length);
  }
});
test('every diagram renders without external links and escapes editable item input', () => {
  for(let page=0;page<slides.length;page++) {
    const html=render({page,...initialState()});
    assert.ok(html.length>0);assert.doesNotMatch(html,/https?:\/\/|<a\s/);
  }
  const html=render({page:8,...initialState(),item:'"><script>alert(1)</script>'});
  assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);
});
test('final insertion and removal trace states preserve reciprocal references', () => {
  const inserted=render({page:3,...initialState(),step:5});
  assert.match(inserted,/size = 3/);assert.match(inserted,/next → N/);assert.match(inserted,/prev → N/);
  const removed=render({page:4,...initialState(),step:6});
  assert.match(removed,/size = 1/);assert.match(removed,/prev → A/);assert.match(removed,/The caller receives old.item/);
});
