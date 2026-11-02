// Java String.compareTo ordering for the non-null strings in these examples.
export const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export function selectionSort(input, mode = 'correct') {
  const a = [...input];
  if (mode === 'noop') return a;
  for (let start = 0; start < a.length; start++) {
    let min = start;
    for (let i = start + 1; i < a.length; i++) if (compare(a[i], a[min]) < 0) min = i;
    [a[start], a[min]] = [a[min], a[start]];
    if (mode === 'one-pass') break;
  }
  return a;
}
export const cases = [
  {id:'sorted',label:'Already sorted',input:['ant','bee','cat'],expected:['ant','bee','cat']},
  {id:'mixed',label:'Mixed order',input:['pear','kiwi','lime','fig'],expected:['fig','kiwi','lime','pear']},
  {id:'reverse',label:'Reverse order',input:['dog','cat','bee','ant'],expected:['ant','bee','cat','dog']},
  {id:'duplicates',label:'Repeated items',input:['bee','ant','bee'],expected:['ant','bee','bee']},
  {id:'empty',label:'Empty array',input:[],expected:[]},
  {id:'single',label:'One item',input:['fox'],expected:['fox']}
];
export function runCase(testCase, mode) {
  const actual = selectionSort(testCase.input, mode);
  const mismatch = testCase.expected.findIndex((item,i)=>item !== actual[i]);
  const pass = actual.length === testCase.expected.length && mismatch === -1;
  return {...testCase,actual,pass,mismatch};
}
export function sortFrames(input) {
  const a=[...input], frames=[];
  const record=(start,min,scan,line,message)=>frames.push({a:[...a],start,min,scan,line,message});
  record(0,-1,-1,0,'Start with the full array. No positions are fixed yet.');
  for(let start=0;start<a.length;start++) {
    let min=start;
    record(start,min,-1,2,`Call sort(x, ${start}). Search only indices ${start} through ${a.length-1}.`);
    for(let i=start+1;i<a.length;i++) {
      const old=min;
      if(compare(a[i],a[min])<0) min=i;
      record(start,min,i,2,`Compare "${a[i]}" at ${i} with "${a[old]}" at ${old}. ${min===old?'Keep':'Update'} smallestIndex = ${min}.`);
    }
    [a[start],a[min]]=[a[min],a[start]];
    record(start,-1,-1,3,`Swap indices ${start} and ${min}. Index ${start} now holds its final item${start===min?' (a self-swap changes nothing)':''}.`);
    record(start+1,-1,-1,4,`Continue with start = ${start+1}. The first ${start+1} item(s) are fixed.`);
  }
  record(a.length,-1,-1,1,`Base case: start equals length (${a.length}). Return without indexing the array.`);
  return frames;
}
export function swapFrames(fixed) {
  return fixed ? [
    {a:['owl','ant'],temp:'—',line:-1,message:'Exchange the items at indices 0 and 1.'},
    {a:['owl','ant'],temp:'owl',line:0,message:'Save the old x[0] before overwriting it.'},
    {a:['ant','ant'],temp:'owl',line:1,message:'Both slots now contain ant, but temp still preserves owl.'},
    {a:['ant','owl'],temp:'owl',line:2,message:'Write the saved item into x[1]. Both original items survive.'}
  ] : [
    {a:['owl','ant'],temp:'—',line:-1,message:'Predict what each assignment reads.'},
    {a:['ant','ant'],temp:'—',line:0,message:'Overwriting x[0] loses owl from the array.'},
    {a:['ant','ant'],temp:'—',line:1,message:'The second line reads the updated x[0]. It copies ant again.'}
  ];
}
