export function resolveCall(declared, actual, call) {
  if (declared !== 'List61B' && declared !== actual) return {ok:false,stage:'Assignment rejected',result:'Does not compile',reason:`A ${actual} object is not a ${declared}. Both implement List61B, but neither concrete class is a subtype of the other.`};
  if (call === 'capacity' && declared !== 'AList') return {ok:false,stage:'Method lookup rejected',result:'Does not compile',reason:`${declared} does not declare capacity(). The compiler checks the reference type, even if the object is an AList.`};
  if (call === 'capacity') return {ok:true,stage:'Instance method',result:'AList.capacity()',reason:'The declared AList type exposes capacity(), and the object supplies that method.'};
  if (call === 'label') return {ok:true,stage:'Compile-time overload selection',result:declared==='SLList'?'WordTools.label(SLList<String>)':'WordTools.label(List61B<String>)',reason:declared==='SLList'?'The SLList overload is the more specific applicable signature.':'The List61B overload is applicable. The SLList overload cannot accept this declared type without a different expression type.'};
  return {ok:true,stage:'Runtime instance-method selection',result:actual==='SLList'?'SLList.print()':'List61B default print()',reason:actual==='SLList'?'The runtime SLList object overrides print, so its implementation runs.':'AList has no print override in this example, so it inherits the default implementation.'};
}
export const printWork = n => ({indexed:n*(n+1)/2,direct:n,array:n});
