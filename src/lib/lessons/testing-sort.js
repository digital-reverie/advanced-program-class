const p=text=>({type:'paragraph',text});
const code=text=>({type:'code',text});
const note=(title,text)=>({type:'callout',title,text});
const quiz=(id,question,options,answer,explanation)=>({type:'quiz',id,question,options,answer,explanation});
const reveal=(id,question,answer)=>({type:'reveal',id,question,answer});
const source='Hug61B, chapter 3.1: Testing and Selection Sort. Original classroom examples.';
const slides=[
  {title:'Testing & Selection Sort',section:'Next lesson · Purpose',notes:'Suggested pacing: one 50–60 minute class, or stop after the swap lab and continue next class. Use the first test-lab run before discussing implementation.',blocks:[
    p('A sorting method should put items in order while preserving every original item. Today we will make that claim precise, test it, and trace one algorithm that fulfills it.'),
    note('Scope','Selection sort is our worked example. The main skill is using small tests to guide implementation and debugging. Other sorting algorithms come later.'),
    reveal('opening','Could [ant, ant] be a correct sorted result for [owl, ant]?','No. It is ordered, but owl disappeared and ant was duplicated. Correctness includes preserving the original items and their counts.')
  ]},
  {title:'A test starts with a promise',section:'Specify · Input and expected result',notes:'Destructive means the caller’s array is modified. It does not mean items may be lost. Use non-null arrays containing non-null strings for this lesson.',blocks:[
    p('Our contract: sort(String[] x) changes x into ascending String.compareTo order. It keeps the same length and the same items, including duplicates. It returns no new array.'),
    code('String[] input = {"pear", "fig", "kiwi"};\nString[] expected = {"fig", "kiwi", "pear"};\nSort.sort(input);\n// Compare input with expected after the call.'),
    note('Arrange · Act · Assert','Arrange independent input and expected values. Act by calling the method. Assert that the observed result matches the promise.')
  ]},
  {title:'Would your tests catch this?',section:'Lab · Test strength',kind:'test-suite',notes:'Start with the do-nothing implementation and only the sorted case. Then add reverse order. Try the one-pass implementation: it happens to pass the mixed example but fails reverse order. Ask what each failure tells you.'},
  {title:'Equal contents, different objects',section:'Think · References',notes:'Java arrays inherit identity-based equals from Object. Arrays.equals compares contents for these one-dimensional String arrays. Keep expected independent of input.',blocks:[
    code('String[] a = {"ant", "bee"};\nString[] b = {"ant", "bee"};\nString[] alias = a;'),
    quiz('identity','Which expression is true?',['a == b','a == alias','a.equals(b)'],1,'alias holds the same array reference as a. b is a separate array even though its contents match.'),
    reveal('alias-test','Why is String[] expected = input a weak test setup?','Both variables refer to the same array. A destructive bug changes what both variables see. Construct expected separately so it can disagree with the result.')
  ]},
  {title:'An assertion makes a failure explicit',section:'JUnit 4 · A repeatable check',notes:'JUnit 4 syntax matches the assigned reading. Do not mix org.junit.Test with JUnit Jupiter imports. Run through the configured JUnit runner in the school IDE. This browser shows modeled activities, not a Java compiler.',blocks:[
    code('import org.junit.Test;\nimport static org.junit.Assert.assertArrayEquals;\n\npublic class SortTest {\n    @Test\n    public void sortsThreeWords() {\n        String[] actual = {"pear", "fig", "kiwi"};\n        String[] expected = {"fig", "kiwi", "pear"};\n        Sort.sort(actual);\n        assertArrayEquals(expected, actual);\n    }\n}'),
    note('Read the first mismatch','Expected is the requirement; actual is the observed result. A mismatch at index 0 points you toward the first incorrect position, not necessarily the exact faulty line.')
  ]},
  {title:'One failure, one useful change',section:'Practice · Test-first development',notes:'A compilation error is not the same as an assertion failure. First make the test runnable with a stub, then check that it detects wrong behavior. Ordinary JUnit assertion failures do not prevent other test methods from running.',blocks:[
    p('Write a small test that exposes missing behavior. Run it and understand why it fails. Implement enough correct behavior to pass it, then add a case that challenges your assumptions.'),
    note('Refactoring','Once the tests pass, improve names or structure without changing behavior. Rerun the tests after the change. Passing tests provide evidence for the tested cases, not a proof for every input.'),
    quiz('hardcoded','A helper always returns index 2. Which test challenges it?',['Only an array whose smallest item is at index 2','Another array whose smallest item is at index 0','Rerun the same passing test ten times'],1,'Change the relevant property of the input. Repeating one example cannot reveal a hard-coded answer that happens to fit it.')
  ]},
  {title:'Selection sort fixes one position',section:'Algorithm · The boundary',notes:'Connect the fixed prefix to the invariants from List Lab. The fixed part is ordered and contains the globally smallest items. A sorted prefix alone is not enough.',blocks:[
    p('At index start, scan the remaining suffix for its smallest item. Swap that item into start, then move the boundary one position to the right.'),
    code('[pear, kiwi, lime, fig]\n start = 0: smallest is fig at index 3\n[fig, kiwi, lime, pear]\n      start = 1: search only the remaining suffix'),
    note('The invariant','Before each pass, positions before start hold the smallest items in their final order. Later passes must leave those positions alone.'),
    reveal('suffix','Why must the next search exclude index 0?','fig is already fixed. Searching the whole array could select it again and swap it out of its correct position.')
  ]},
  {title:'Smallest value or smallest index?',section:'Helper · A clear result',notes:'findSmallest is package-private here so a test in the same package can call it. Its precondition is 0 <= start < x.length. The sorting helper must stop before calling it on an empty suffix.',blocks:[
    p('A swap needs two positions. Return the index of the smallest item in the suffix, rather than returning the item itself.'),
    code('static int findSmallest(String[] x, int start) {\n    int best = start;\n    for (int i = start + 1; i < x.length; i++) {\n        if (x[i].compareTo(x[best]) < 0) {\n            best = i;\n        }\n    }\n    return best;\n}'),
    quiz('min-index','For [ant, owl, bee, cat] and start = 1, what index should the helper return?',['0','1','2','3'],2,'Index 2 contains bee, the smallest item in the allowed suffix. ant is outside that suffix.')
  ]},
  {title:'The sign of compareTo',section:'Java · String order',notes:'String ordering is case-sensitive UTF-16 lexicographic ordering, not locale-aware dictionary sorting. Examples use lowercase ASCII words. The method need not return exactly -1 or 1.',blocks:[
    p('For strings, compareTo reports ordering through its sign: negative means before, zero means equal contents, and positive means after. Java does not allow the < operator between String values.'),
    code('"ant".compareTo("owl") < 0   // true\n"bee".compareTo("bee") == 0  // true\n"owl".compareTo("ant") > 0   // true'),
    quiz('comparison','Which condition recognizes any smaller candidate?',['candidate.compareTo(best) == -1','candidate.compareTo(best) < 0','candidate == best'],1,'Any negative result means the candidate comes first. Testing only -1 misses other negative results.')
  ]},
  {title:'A swap can silently lose an item',section:'Lab · Step through the bug',kind:'swap-trace',notes:'Run the broken version first. Ask where owl went. Then switch to the repaired version and predict why a duplicate intermediate state is harmless when temp preserves the old value.'},
  {title:'Recursion needs progress and a stop',section:'Implementation · The same array',notes:'This wrapper and helper are overloaded methods. They share the array; no slice is created. This simple recursive implementation uses O(n) call-stack space. A loop can express the same selection-sort algorithm without that recursive stack.',blocks:[
    code('public static void sort(String[] x) {\n    sort(x, 0);\n}\n\nprivate static void sort(String[] x, int start) {\n    if (start >= x.length) return;\n    int best = findSmallest(x, start);\n    swap(x, start, best);\n    sort(x, start + 1);\n}'),
    note('Why it ends','start increases on each call while length stays fixed. Check the base case before looking up any array item. An empty array returns immediately.'),
    reveal('progress','What if the final call uses sort(x, start) instead?','The remaining problem never gets smaller. For a nonempty suffix the calls keep repeating until the call stack overflows.')
  ]},
  {title:'Trace the search, swap, and boundary',section:'Lab · Selection sort',kind:'selection-trace',notes:'Pause before each comparison or swap for a prediction. Try duplicates and the empty array. The lab models the recursive helper’s array states; it is not executing Java. Next-step labels identify code phases.'},
  {title:'A test for each responsibility',section:'Puzzle · Localize the failure',notes:'Use assertEquals for the helper’s integer result and assertArrayEquals for the modified array. Tests should isolate the smallest useful behavior before checking their integration.',blocks:[
    code('// In a JUnit 4 test class with the relevant static imports:\nassertEquals(2, Sort.findSmallest(\n    new String[]{"ant", "owl", "bee", "cat"}, 1));\n\nString[] pair = {"owl", "ant"};\nSort.swap(pair, 0, 1);\nassertArrayEquals(new String[]{"ant", "owl"}, pair);'),
    quiz('isolate','The first pass succeeds, but later passes move the smallest item backward. What should you inspect first?',['Whether findSmallest respects start','Whether the array has enough capacity','Whether the test class has a main method'],0,'A whole-array minimum search can reach back into the fixed prefix. Test the helper with a nonzero start.'),
    reveal('suite','Which additional whole-sort cases would you keep?','Keep empty, singleton, reverse-ordered, already-sorted, and duplicate-containing arrays. Check exact expected results so missing or duplicated items cannot hide behind sorted order.')
  ]},
  {title:'Exit ticket: evidence and reasoning',section:'Check · Five minutes',notes:'Ask students to commit answers before revealing them. Follow-up activity: implement the three helpers in the school Java project and run the tests using its configured JUnit version.',blocks:[
    reveal('exit-test','1. A do-nothing sorter passes on [ant, bee]. What does this prove?','Only that this input already matches the expected output. It does not establish that the method can reorder anything.'),
    reveal('exit-suffix','2. For [ant, dog, bee, cat] with start = 1, what happens next?','The suffix minimum is bee at index 2. Swap indices 1 and 2 to get [ant, bee, dog, cat]. The next start is 2.'),
    reveal('exit-empty','3. Why must the base-case check come before findSmallest?','For an empty suffix, start is not a valid item index. Stop before reading x[start].'),
    reveal('exit-cost','4. Extension: how many item comparisons does this scan make for four items?','3 + 2 + 1 = 6. In general it makes n(n − 1)/2 comparisons, even for already-sorted input. This selection-sort implementation has quadratic comparison growth.')
  ]}
];
export default {id:'testing-sort',title:'Testing & Selection Sort',subject:'Advanced Programming · Section 2',description:'Build confidence with tests, debug helpers, and trace selection sort. Includes three interactive labs.',slides:slides.map(s=>({...s,source}))};
