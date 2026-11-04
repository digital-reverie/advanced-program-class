import { inheritanceExtension } from './inheritance-extension.js';
const p=text=>({type:'paragraph',text});
const code=text=>({type:'code',text});
const note=(title,text)=>({type:'callout',title,text});
const reveal=(id,question,answer)=>({type:'reveal',id,question,answer});
const quiz=(id,question,options,answer,explanation)=>({type:'quiz',id,question,options,answer,explanation});
const slides=[
 {title:'Interfaces & Shared Behavior',section:'Section 3 · One client, several implementations',notes:'Core lesson, 50–60 minutes: 10 minutes problem and contract, 15 minutes static/runtime types, 15 minutes default methods and cost, 10–15 minutes overload lab and exit ticket. Allow an additional 25–35 minutes for the inheritance and ADT extension before the exit ticket. Revisit list structure only as needed.',blocks:[
  p('An array-backed list and a linked list store items differently. A client that only asks for size() and get(i) should be able to work with either one.'),
  note('Today’s goal','Write code against a shared interface, then explain which operations the compiler permits and which implementation runs.'),
  reveal('start','What does a method that finds the longest word need to know about storage?','It needs a way to inspect the words. It does not need the backing array, nodes, or sentinel, provided the list offers the necessary operations.')
 ]},
 {title:'The cost of copying a utility',section:'Problem · Overloading alone',notes:'These are signatures, not complete methods. Overloading is legal and useful, but duplicating identical bodies to cover every list representation is the problem here.',blocks:[
  code('static String longest(SLList<String> words) { /* scan */ }\nstatic String longest(AList<String> words)  { /* same scan */ }'),
  p('The parameter types differ, so these are overloaded methods. If their bodies perform the same job, every bug fix must be repeated in each copy.'),
  quiz('duplication','A third list implementation arrives. What would avoid a third copy?',['Make all three lists expose a shared contract','Rename the utility for every list','Replace every list with Object and hope'],0,'A common interface lets one parameter type describe the operations the utility needs.')
 ]},
 {title:'A small list contract',section:'Interface · The available operations',notes:'This is a deliberately reduced List61B, not java.util.List and not the full project API. Interface abstract methods are public even without the explicit keyword. State non-null items as a lesson precondition.',blocks:[
  code('public interface List61B<T> {\n    void addLast(T item);\n    T get(int index);\n    int size();\n}'),
  p('This interface names operations without choosing a storage representation. Implementations must also honor their meaning: get(0) is the first item, and size() counts stored items.'),
  note('Types and promises','SLList and AList can both be subtypes of List61B. List61B is an interface, not a concrete superclass that supplies their node or array storage.'),
  reveal('new-interface','Can you create an object with new List61B<String>() by itself?','No. An interface cannot be instantiated directly. Create a concrete implementing class, such as AList, and store its reference in an interface-typed variable.')
 ]},
 {title:'implements makes the promise explicit',section:'Implementation · Compiler checks',notes:'Class declarations below are excerpts: existing classes must supply all required methods. A concrete class missing one fails compilation. An abstract class can defer implementation. @Override checks intent but is not what creates overriding.',blocks:[
  code('public class AList<T> implements List61B<T> {\n    // Existing fields, constructor, get, and addLast omitted.\n    @Override\n    public int size() {\n        return size;\n    }\n}'),
  p('The class must provide compatible public implementations of the required methods. @Override asks the compiler to verify that a method really overrides or implements a declaration.'),
  quiz('override','You write @Override above public int sze(). What happens?',['It silently replaces size()','The compiler reports an error','Java fixes the spelling'],1,'sze() does not match the interface method. Without the annotation, a concrete class still must implement size(); the misspelled method does not fulfill that requirement.')
 ]},
 {title:'One longest method',section:'Client · Use the shared interface',notes:'Chosen contract: empty list returns null, ties keep the earliest word, stored strings are non-null. This is original classroom code. On a linked list, repeated get(i) can be costly; correctness and performance are separate questions.',blocks:[
  code('static String longest(List61B<String> words) {\n    if (words.size() == 0) return null;\n    String best = words.get(0);\n    for (int i = 1; i < words.size(); i++) {\n        String candidate = words.get(i);\n        if (candidate.length() > best.length()) {\n            best = candidate;\n        }\n    }\n    return best;\n}'),
  note('Same behavior, either storage','A caller may supply an AList<String> or SLList<String> that implements this contract. Neither input is converted into another list.'),
  reveal('tie','For [sun, moon, star], which word is returned?','moon. It replaces sun, then star ties its length. The strict > comparison keeps the earlier word.')
 ]},
 {title:'The reference type and the object type',section:'Model · Two different roles',notes:'The variable has a declared/static type. Its referenced object has a runtime class. Reassigning a variable can change which object it refers to; it does not change the class of an existing object.',blocks:[
  code('List61B<String> words = new SLList<>();\nwords.addLast("comet");'),
  note('Declared type: List61B<String>','The compiler uses this type to check which instance methods may be called through words.'),
  note('Runtime class: SLList','The object still uses linked-list storage. For overridden instance methods, the runtime object determines the implementation.'),
  reveal('assignment','Does assigning an SLList to a List61B variable copy its nodes?','No. The variable stores a reference to the same object. The assignment changes how the reference is typed, not how the list is stored.')
 ]},
 {title:'Which assignments are legal?',section:'Puzzle · The is-a relationship',notes:'Use compile-time assignability without casts. Do not generalize this to List61B<Object> accepting List61B<String>; generic type arguments are invariant here.',blocks:[
  code('SLList<String> linked = new SLList<>();\nList61B<String> view = linked;\n// Both references now identify the same object.'),
  quiz('assignment','Assuming both classes implement List61B, which additional assignment compiles?',['AList<String> other = linked;','List61B<String> other = new AList<>();','SLList<String> other = new AList<>();'],1,'Either implementation fits an interface reference. Sharing an interface does not make AList and SLList subtypes of each other.'),
  reveal('has-a','An AList has an array. Does that mean an AList is an array?','No. Containing a value is a has-a relationship. Implementing an interface expresses an is-a relationship to the interface type.')
 ]},
 {title:'A default method supplies shared code',section:'Default methods · A reusable body',notes:'Add this to the reduced interface. Modern interfaces can contain method bodies; avoid the blanket claim that interfaces never implement behavior. This example has no conflicting defaults.',blocks:[
  code('default void print() {\n    for (int i = 0; i < size(); i++) {\n        System.out.print(get(i) + " ");\n    }\n    System.out.println();\n}'),
  p('An implementing class can inherit this body. It uses only the interface operations, so it can work with either representation.'),
  note('Shared code still calls concrete behavior','When the default body calls get(i), the actual list provides that operation. A shared algorithm can therefore have different costs on different implementations.'),
  reveal('conflict','Extension: what if two unrelated interfaces supply the same default method signature?','The implementing class must resolve the conflict, typically by providing its own override. Java does not arbitrarily choose between unrelated competing defaults.')
 ]},
 {title:'Same output, different amount of work',section:'Lab · Repeated indexed access',kind:'interface-cost',notes:'Assume size() is O(1), SLList.get(i) starts at the first item, and direct traversal visits each item once. Count item-node inspections, not pointer hops. Both versions print the same items in the same order.'},
 {title:'An override can follow the nodes once',section:'Implementation · Preserve the behavior',notes:'This SLList uses a front sentinel and ends at null. For a circular DLList, the stopping condition would instead be p != sentinel. Preserve the trailing newline from the default version.',blocks:[
  code('@Override\npublic void print() {\n    for (Node p = sentinel.next; p != null; p = p.next) {\n        System.out.print(p.item + " ");\n    }\n    System.out.println();\n}'),
  p('This implementation prints the same sequence and newline as the default. It saves work by visiting the nodes once rather than restarting from the front for every index.'),
  quiz('dispatch','List61B<String> x refers to an SLList that overrides print(). Which body does x.print() run?',['The interface default because x is declared List61B','The SLList override','Neither; interface references cannot call methods'],1,'The declared type permits the call. The runtime SLList supplies the overriding instance method.')
 ]},
 {title:'Overloading chooses a signature',section:'Contrast · Compile time',notes:'Use distinct output labels so students can separate overload selection from overridden instance-method dispatch. These static helpers are overloaded, not overridden. Selection considers applicable signatures and chooses the most specific one in this simple example.',blocks:[
  code('static String label(List61B<String> x) { return "general"; }\nstatic String label(SLList<String> x)  { return "linked"; }\n\nSLList<String> a = new SLList<>();\nList61B<String> b = a;\nlabel(a);  // "linked"\nlabel(b);  // "general"'),
  p('a and b identify the same object, but their expressions have different declared types. Java resolves these overloads at compile time.'),
  note('Two decisions','First choose an applicable method signature using compile-time types. For a virtual instance call, runtime dispatch then selects the override of that signature. Static helper calls do not use runtime override dispatch.')
 ]},
 {title:'Predict the selected method',section:'Lab · Assignment, lookup, dispatch',kind:'interface-dispatch',notes:'In this model SLList overrides print, AList inherits the default, and only AList declares capacity. WordTools has the two label overloads from the previous slide. Try List61B + SLList + label, then change only the declared type.'},
 {title:'One contract, shared tests',section:'Connect · Testing the abstraction',notes:'Bridge to the testing lesson. These are snippets for an existing test class. Test multiple implementations with the same expectations; implementation-specific tests can additionally check their own invariants.',blocks:[
  code('List61B<String> words = new AList<>();\nwords.addLast("sun");\nwords.addLast("planet");\nassertEquals("planet", longest(words));\n// Repeat with new SLList<>() and the same expectation.'),
  p('The test describes observable behavior. It does not depend on array capacity or node layout. Add cases for an empty list, ties, one item, and preserving the input order.'),
  reveal('contract','If an override prints items backward, is it acceptable because the method still compiles?','No. The compiler checks types and signatures, but the implementation must also honor the intended behavior. An override should preserve the contract clients rely on.')
 ]},
 {title:'Exit ticket: types and behavior',section:'Check · Explain the decision',notes:'Ask students to distinguish compile errors from runtime behavior before naming a method. Possible follow-up: add a default isEmpty() using size(), then test it through both implementations.',blocks:[
  reveal('exit1','1. List61B<String> x = new AList<>(); Can x.capacity() compile if capacity is only in AList?','No. The declared List61B type does not expose that method in this example.'),
  reveal('exit2','2. Why can x.print() work even when AList has no print method body?','The interface declares a default print body, which AList inherits in this example.'),
  reveal('exit3','3. An SLList object is referenced through List61B. Does its print override disappear?','No. Calls to print still dispatch to the SLList override. The reference type limits available operations but does not erase the object’s class.'),
  reveal('exit4','4. Why might the default indexed print be quadratic for an SLList?','get(i) inspects i + 1 item nodes from the front. Across n indices the total is 1 + 2 + … + n. A direct traversal inspects only n item nodes.')
 ]}
];
slides.splice(13, 0, ...inheritanceExtension);
export default {id:'interfaces',title:'Interfaces & Shared Behavior',subject:'Advanced Programming · Section 3',description:'Use one list contract, explore default methods, and distinguish overload selection from runtime dispatch.',slides:slides.map(s=>({...s,source:'Hug61B chapter 4.1 and CS61B Spring 2026 Lecture 9: Interface and Implementation Inheritance. Original examples with a reduced List61B contract.'}))};
