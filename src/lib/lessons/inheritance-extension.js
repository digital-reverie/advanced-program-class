const p=text=>({type:'paragraph',text});
const code=text=>({type:'code',text});
const note=(title,text)=>({type:'callout',title,text});
const reveal=(id,question,answer)=>({type:'reveal',id,question,answer});
export const inheritanceExtension = [
 {title:'Inherit a promise, inherit a body',section:'Inheritance · What versus how',notes:'Connect to the default print example. An interface is a supertype, not a concrete superclass. This lecture focuses on implements and defaults; class inheritance with extends can be taught separately.',blocks:[
  p('Interface inheritance lets one client rely on a shared set of operations. Implementation inheritance lets a class reuse an existing method body. A default interface method provides both a callable operation and reusable code.'),
  code('public interface List61B<T> {\n    int size();                 // Required operation\n    default boolean isEmpty() { // Shared implementation\n        return size() == 0;\n    }\n}'),
  note('What comes from where?','AList and SLList supply their own size(). Both can inherit isEmpty(). Calling isEmpty() on either object runs the shared body, which calls that object’s size() implementation.'),
  reveal('inherit-body','Does inheriting isEmpty() also give the class an array, nodes, or a size field?','No. This default body uses an operation, not an inherited storage layout. Each concrete class still owns and maintains its representation.')
 ]},
 {title:'A signature puzzle: did you override it?',section:'Predict · Compiler checks and behavior',notes:'Assume Animal declares abstract void speak(). Dog is concrete with no superclass implementation. Parameter names and return types do not distinguish overloads. Covariant reference returns are outside this example.',blocks:[
  code('interface Animal { void speak(); }\n\nclass Dog implements Animal {\n    public void speak(String mood) {\n        System.out.println(mood);\n    }\n}'),
  p('The names match, but the parameter lists differ. Before running anything, decide whether this concrete class fulfills the interface.'),
  reveal('signature-fix','Does this compile? What is the smallest repair?','No. speak(String) does not implement speak(). Add public void speak() with a body, or change the existing method to take no parameters and provide its own message. Once speak() exists, speak(String) may coexist as an overload.'),
  note('Use @Override to check intent','Adding @Override to speak(String) exposes the mismatch; it does not change the signature. A different parameter name alone would not create a new overload. A return-type change alone cannot create an overload either.'),
  reveal('signature-body','If speak() exists but prints nothing, has the compiler proved the behavior is correct?','No. Compilation checks type obligations. Tests and the documented contract check behavior. A syntactically valid implementation can still violate the intended promise.')
 ]},
 {title:'An abstract data type describes behavior',section:'ADT · Operations before storage',notes:'An ADT is a conceptual specification, not the Java abstract class keyword. Interfaces express the API, but documentation and tests supply behavioral rules. Use the actual Canvas contract for project naming and empty-case behavior.',blocks:[
  p('An abstract data type (ADT) specifies operations and what they mean. Its implementation chooses the storage and algorithms. A deque promises access at both ends; it can use a circular array or linked nodes.'),
  code('// A small teaching contract, not the complete project API.\ninterface Deque61B<T> {\n    void addFirst(T item);\n    void addLast(T item);\n    T removeFirst();\n    T removeLast();\n    int size();\n}'),
  note('Names are not the whole contract','Specify order, empty-removal behavior, allowed values, and any required performance. Two implementations are interchangeable only when they honor the promises the client relies on.'),
  reveal('adt-design','A client needs only addLast and removeFirst. Must it know whether resizing occurs?','Not to get the right sequence of values. But if it has strict latency requirements, the performance contract matters: a resizing array operation can take O(n).')
 ]},
 {title:'A stack is a rule about order',section:'ADT · Last in, first out',notes:'Use linked head operations, not singly linked tail removal. Complexity assumes O(1) maintained size and ordinary allocation model. Real speed depends on allocation, cache locality, workload and implementation; do not claim linked storage is always faster.',blocks:[
  code('push("A");\npush("B");\npush("C");\npop(); // Predict the returned item.'),
  p('A stack returns the most recently pushed item first. A linked implementation can push and pop at the head in O(1). A geometrically growing array can push and pop at the end in amortized O(1), with an O(n) operation when it resizes.'),
  reveal('stack-order','What do three consecutive pops return?','C, then B, then A. The storage representation must preserve this last-in, first-out behavior.'),
  note('Choose the end carefully','Removing the tail of a singly linked list generally needs O(n) traversal to find its predecessor, even with a tail reference. Putting the stack top at the head avoids that search.'),
  reveal('stack-speed','Both implementations have constant-time bounds. Which is faster in practice?','The bound alone cannot decide. Arrays often benefit from locality; linked nodes avoid bulk resizing but allocate nodes. Measure the relevant workload and consider worst-case latency as well as total time.')
 ]},
 {title:'A grab bag can trade order for speed',section:'Lab · Remove an arbitrary item',kind:'grab-bag',notes:'Model a dense array bag. The selected index stands in for a uniformly sampled random index; selection is explicit for repeatable classroom predictions. Bag semantics preserve multiplicity, not ordering. Sample is O(1); removal is O(1) here because this lab does not shrink. A suitable resizing policy gives amortized O(1).'},
 {title:'Choose the operations, then the representation',section:'Think · Costs follow the contract',notes:'Assume random-index generation is O(1), a dense array, and a singly linked list without an auxiliary index. Empty sample/remove requires a stated guard. Do not extend this bag optimization to lists with an order contract.',blocks:[
  p('For a grab bag, sampling a uniformly chosen array index takes O(1). A singly linked representation must walk to that index, taking O(n) in the worst case and O(n) expected time for a uniform choice.'),
  note('Removal can exploit the lack of order','An array bag overwrites the chosen slot with the last item and reduces size. No shifting is needed. With geometric growth and a suitable shrink policy, insertion and removal can be amortized O(1).'),
  reveal('bag-list','Can an ordered list use the same swap-with-last removal?', 'Generally no. Removing B from [A, B, C, D] would produce [A, D, C], changing the order of the remaining items. The bag permits that; the ordered list does not.'),
  reveal('bag-duplicate','If the bag contains [A, A, B], should sampling distinct values give each value a 50% chance?','Not for a uniform choice among stored items. There are two A occurrences, so A has probability 2/3 and B has probability 1/3. A bag preserves duplicates.')
 ]},
 {title:'Recognize the pattern in Java collections',section:'Connect · Interfaces and implementations',notes:'Names here are java.util types. List61B is our teaching interface. Map is not a subinterface of Collection. No need to memorize the whole collection hierarchy.',blocks:[
  code('List<String> words = new ArrayList<>();\nSet<String> unique = new HashSet<>();\nMap<String, Integer> scores = new HashMap<>();'),
  p('The left side names the client’s contract; the right side creates a concrete implementation. List preserves a sequence, Set excludes duplicate elements, and Map associates keys with values.'),
  note('A small hierarchy','List and Set extend the Collection interface. Map is a separate interface. A class implements an interface; an interface can extend another interface to add requirements. None of this makes ArrayList and LinkedList subtypes of one another.'),
  reveal('collections-exit','Name one behavioral promise and one performance question before choosing an implementation.','For a stack: return the most recently inserted item. For performance: must every operation have bounded latency, or is amortized constant time sufficient? For a bag: preserve duplicates, then ask how efficiently it can sample and remove a random occurrence.')
 ]}
];
