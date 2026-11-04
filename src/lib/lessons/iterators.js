const p=text=>({type:'paragraph',text});
const code=text=>({type:'code',text});
const note=(title,text)=>({type:'callout',title,text});
const reveal=(id,question,answer)=>({type:'reveal',id,question,answer});
const quiz=(id,question,options,answer,explanation)=>({type:'quiz',id,question,options,answer,explanation});
const slides=[
 {title:'Iterators & Object Methods',section:'Section 4 · Make a collection usable',notes:'Allow 60–75 minutes, or split after iterator testing. Use existing interface knowledge. Bonus factory slide is optional. Our ArraySet is a teaching class, not a full java.util.Set implementation.',blocks:[
  p('A useful collection does more than store values. Clients need to visit its elements, display its contents, and compare it with other collections.'),
  note('Three questions','How does for-each obtain each value? What should printing a collection show? When should two separate objects count as equal?'),
  reveal('set-start','How does a set differ from the grab bag in the previous lesson?','A set keeps at most one occurrence of each equal value. A bag preserves duplicates. Neither concept alone promises an iteration order.')
 ]},
 {title:'Start with an array-backed set',section:'Representation · Unique active items',notes:'Snippets assume an existing T[] items, int size, and ensureCapacity helper using the previous lesson’s geometric growth. Reject null consistently. contains(Object) will also support equals against ArraySet<?> later.',blocks:[
  code('public boolean contains(Object x) {\n    for (int i = 0; i < size; i++) {\n        if (items[i].equals(x)) return true;\n    }\n    return false;\n}\npublic void add(T x) {\n    java.util.Objects.requireNonNull(x);\n    if (contains(x)) return;\n    ensureCapacity(size + 1);\n    items[size++] = x;\n}'),
  p('Only indices 0 through size − 1 contain set members. Adding an equal value leaves size unchanged. This lesson rejects null; an alternative design could support it with null-safe comparisons.'),
  quiz('set-size','After add("red"), add("blue"), add(new String("red")), what is size?',['2','3','1'],0,'String.equals compares contents. The second red is an equal value even though it is a different String object.'),
  note('Cost model','With O(1) element comparisons, contains is O(n) worst case. add must check membership, so it is O(n) worst case even when the final array write is O(1). size is O(1).')
 ]},
 {title:'For-each asks for a traversal object',section:'Iteration · Unpack the syntax',notes:'For arrays, enhanced for uses different machinery. This translation applies to an Iterable object. Import java.util.Iterator. Use ordinary println rather than source lecture’s newer IO shorthand.',blocks:[
  code('for (String word : words) {\n    System.out.println(word);\n}\n\n// Equivalent traversal for this Iterable<String>:\nIterator<String> cursor = words.iterator();\nwhile (cursor.hasNext()) {\n    String word = cursor.next();\n    System.out.println(word);\n}'),
  p('The collection creates an iterator. The iterator remembers the traversal position. hasNext() checks for a remaining element; next() returns one and advances.'),
  reveal('cursor-not-container','Does next() remove the returned value from the set?','No. Traversal changes the iterator’s position, not the set’s membership.')
 ]},
 {title:'Iterable makes iterators; Iterator moves',section:'Interfaces · Separate responsibilities',notes:'Show only the methods needed here; these are abbreviated API shapes, not replacements for the standard interfaces. remove is optional and not implemented in this lesson.',blocks:[
  code('// Collection role:\nIterable<T>  →  Iterator<T> iterator()\n\n// Traversal role:\nIterator<T>  →  boolean hasNext()\n                T next()'),
  p('ArraySet implements Iterable<T>. Its iterator object implements Iterator<T>. Merely naming a method iterator() does not make a class Iterable in Java.'),
  quiz('roles','Which declaration enables for-each over our collection?',['ArraySet<T> implements Iterable<T>','ArraySet<T> implements Iterator<T>','Adding a method named next to ArraySet'],0,'The collection supplies iterator(). Each returned iterator supplies hasNext() and next().'),
  note('Independent state','Each call to iterator() should create a new cursor for this collection. Keeping one shared position in ArraySet would make nested loops interfere.')
 ]},
 {title:'Two cursors, one collection',section:'Lab · Predict before calling',kind:'iterator-lab',notes:'Try hasNext twice, then next twice on A and once on B. Exhaust A and call next again. Switch to empty data. Model uses a fixed array, no mutation during iteration, and reports the Java exception without throwing a browser error.'},
 {title:'Build the iterator one responsibility at a time',section:'Implementation · Position and bounds',notes:'Inside ArraySet<T> implements Iterable<T>. Import java.util.Iterator and java.util.NoSuchElementException. The non-static inner object can access the outer items and size; its position is private per iterator. Assumes no structural mutation during traversal.',blocks:[
  code('@Override\npublic Iterator<T> iterator() {\n    return new ArrayCursor();\n}\nprivate class ArrayCursor implements Iterator<T> {\n    private int position = 0;\n    public boolean hasNext() { return position < size; }\n    public T next() {\n        if (!hasNext()) throw new NoSuchElementException();\n        T value = items[position];\n        position += 1;\n        return value;\n    }\n}'),
  note('A useful invariant','position is the index of the next unvisited item, from 0 through size. hasNext does not advance it. A successful next advances exactly once; an exhausted next throws before reading an unused slot.'),
  reveal('iterator-cost','What are the costs of creating a cursor and traversing n items?','Creation, hasNext, and each next are O(1). A complete traversal is O(n), and each cursor uses O(1) extra space. It does not copy the entire collection.')
 ]},
 {title:'Catch iterator bugs with small tests',section:'Puzzle · Boundaries and independence',notes:'Test traces are language-independent expectations. This simplified iterator does not detect concurrent modification. Do not promise fail-fast behavior for every Iterable.',blocks:[
  code('Iterator<String> a = words.iterator();\nIterator<String> b = words.iterator();\na.hasNext();\na.hasNext();\na.next();\nb.next();'),
  reveal('iterator-tests','For [red, blue], what do the two next calls return?','Both return red. Repeated hasNext must not skip items, and advancing a must not advance b.'),
  note('Boundary tests','Empty: hasNext is false and next throws NoSuchElementException. One item: next returns it once, then throws. Two cursors: advance independently. Full traversal: visits each stored item exactly once.'),
  reveal('iterator-mutation','What if you add an element while iterating?','Do not assume a universal result. Our simple implementation requires no structural mutation during traversal. Production collections define policies; some detect changes and throw ConcurrentModificationException. That behavior is not guaranteed by Iterable alone.')
 ]},
 {title:'Integer values and int variables',section:'Brief bridge · Boxing and unboxing',notes:'Keep to two minutes. Do not teach wrapper identity caches. Generic type arguments must be reference types; unboxing a null Integer throws NullPointerException.',blocks:[
  code('ArraySet<Integer> numbers = new ArraySet<>();\nnumbers.add(7);                 // int → Integer (boxing)\nint value = numbers.iterator().next(); // Integer → int'),
  p('The iterator returns an Integer because that is the generic element type. Java can unbox it into int. Use value equality for wrapper objects rather than relying on reference identity.'),
  reveal('unbox-null','What happens when Integer missing = null; is followed by int x = missing;?','Unboxing null throws NullPointerException. Our set rejects null, but other APIs may allow it.')
 ]},
 {title:'Object supplies behavior you can replace',section:'Object methods · Defaults and overrides',notes:'Do not describe default toString suffix as a guaranteed memory address. Object is the root class; focus on equals, hashCode, and toString rather than deprecated or concurrency methods.',blocks:[
  p('An ArraySet inherits Object methods even before we write them. Object.equals uses identity. Object.toString normally produces a class name, @, and the hexadecimal result of hashCode().'),
  code('@Override public String toString() { /* return text */ }\n@Override public boolean equals(Object other) { /* compare */ }\n@Override public int hashCode() { /* consistent with equals */ }'),
  note('A display is not an identity proof','The @ suffix is not a guaranteed memory address or unique ID. Two objects can also print identical contents without being the same object.'),
  reveal('this-ref','What does this mean inside equals or toString?','It refers to the current object. this == other asks whether both references identify that same object.')
 ]},
 {title:'Build readable text without a trailing comma',section:'toString · Use a builder',notes:'Assume no self-containing collection and reasonable element toString implementations. Output order reflects this implementation’s storage, not an ordering requirement for all sets.',blocks:[
  code('@Override\npublic String toString() {\n    StringBuilder text = new StringBuilder("{");\n    String separator = "";\n    for (T item : this) {\n        text.append(separator).append(item);\n        separator = ", ";\n    }\n    return text.append("}").toString();\n}'),
  p('The first item gets no separator; later items get comma-space. Empty sets naturally produce {}. The iterator lets this method avoid direct knowledge of storage indices.'),
  reveal('format-single','What text results for an empty set, a singleton red, and red plus blue?','{}, {red}, and {red, blue}. There is no extra comma before the closing brace.'),
  note('Complexity depends on output length','A builder avoids repeatedly copying the entire accumulated prefix. For bounded-size item text, this construction is O(n); more generally count total output characters plus item-conversion costs. Repeated String concatenation in a loop can take quadratic copying work.')
 ]},
 {title:'Same object or equal contents?',section:'Lab · Identity versus set equality',kind:'equality-lab',notes:'Identity labels are model identifiers, not addresses. Our teaching ArraySet is final and compares only with other ArraySet objects. It does not implement java.util.Set. Sets ignore ordering; lists generally do not.'},
 {title:'Override equals(Object), not equals(ArraySet)',section:'Equality · Check before comparing',notes:'Choose a final ArraySet class so subclasses cannot weaken this equality policy. Java 16+ pattern matching shown. contains accepts Object as on slide 2. Elements must honor their own equals contracts; avoid mutable equality-relevant state.',blocks:[
  code('// In public final class ArraySet<T> implements Iterable<T>:\n@Override\npublic boolean equals(Object other) {\n    if (this == other) return true;\n    if (!(other instanceof ArraySet<?> that)) return false;\n    if (size != that.size) return false;\n    for (T item : this) {\n        if (!that.contains(item)) return false;\n    }\n    return true;\n}'),
  p('First handle identity, then require a compatible type, equal size, and matching membership. instanceof also rejects null. Equal set contents do not require equal storage order.'),
  quiz('equals-signature','Why is boolean equals(ArraySet<T> other) insufficient?',['It overloads instead of overriding Object.equals(Object)','It always compares arrays by value','It prevents duplicate insertion'],0,'The parameter must be Object to override this inherited method. @Override catches the mistaken signature.'),
  note('Complexity','Comparing different ArraySets of size n may make n linear membership searches: O(n²) worst-case time, assuming O(1) element comparisons. Identity and size mismatch can return immediately.')
 ]},
 {title:'Equality comes with a hash-code promise',section:'Contract · Equal means equal hash codes',notes:'Hash tables can be deferred; teach the obligation now so students do not copy an incomplete value-equality implementation. Sum is order independent, can collide, and uses Java int arithmetic. Null is rejected by add.',blocks:[
  code('@Override\npublic int hashCode() {\n    int hash = 0;\n    for (T item : this) hash += item.hashCode();\n    return hash;\n}'),
  p('If a.equals(b) is true, their hash codes must match. Adding element hashes makes this teaching set’s hash independent of iteration order. Different sets may still have the same hash.'),
  note('Test the whole equality contract','Check reflexivity, symmetry, transitivity, repeated results without mutation, and false for null. Test reordered equal sets, different contents, empty sets, and matching hash codes for equal sets.'),
  reveal('hash-collision','Two unequal sets have the same hash code. Is that necessarily a bug?','No. Equal objects must have equal hash codes; equal hash codes do not prove objects equal. Hash-based collections must still compare equality when necessary.')
 ]},
 {title:'Bonus: a convenient factory',section:'Optional · ArraySet.of',notes:'SafeVarargs is justified only because this method reads the varargs array without unsafe writes or exposing it. Generic method type U belongs to this static method. The capacity helper and add contract still apply.',blocks:[
  code('@SafeVarargs\npublic static <U> ArraySet<U> of(U... values) {\n    ArraySet<U> result = new ArraySet<>();\n    for (U value : values) result.add(value);\n    return result;\n}\n// ArraySet.of("red", "blue", "red") has size 2.'),
  p('The factory accepts a variable number of arguments and reuses add to enforce uniqueness. It returns our mutable teaching set; its behavior is not identical to Java’s Set.of.'),
  reveal('factory-cost','Does a one-line factory call make building an n-item set O(1)?','No. For n distinct inputs, repeated linear membership checks make this array-backed construction O(n²). Convenient syntax does not eliminate the work.')
 ]},
 {title:'Exit ticket: traversal, display, equality',section:'Check · Explain before running',notes:'Ask for predictions plus a test that would expose each bug. Finish by connecting the lesson to the user’s actual deque interface and assignment requirements.',blocks:[
  reveal('exit-iter','1. Why should position belong to the iterator rather than the set?','Each traversal needs independent state. Nested loops and two clients must not move each other’s cursor.'),
  reveal('exit-end','2. An exhausted iterator has spare array slots. Should next return null?','No. It must throw NoSuchElementException; capacity is not the number of remaining members.'),
  reveal('exit-equal','3. Two new sets contain the same values in opposite insertion orders. Compare == and equals.','Identity is false for two distinct objects. Our value-based equals is true because size and membership match; order is irrelevant.'),
  reveal('exit-tests','4. Which tests catch a trailing separator and an incomplete equality method?','Format empty, singleton, and multi-item sets. Compare equal sets in different orders, null, unrelated types, differing members, and equal hash codes. Call equals through an Object reference to expose accidental overloading.')
 ]}
];
export default {id:'iterators',title:'Iterators & Object Methods',subject:'Advanced Programming · Section 4',description:'Build ArraySet traversal, explore independent iterators, and implement display and value equality with complexity checks.',slides:slides.map(s=>({...s,source:'CS61B Spring 2026 Lecture 10: Iterators, Object Methods; Java Iterator and Object API contracts. Original teaching examples.'}))};
