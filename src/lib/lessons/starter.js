// Copy this file, choose a unique id, then register it in index.js.
// Text and code in these blocks are escaped automatically by Svelte.
export default {
  id: 'starter', title: 'Your next lesson', subject: 'Lesson template',
  description: 'A reusable example with explanations, code, a prediction, and an exit ticket.',
  slides: [
    {title:'A clear learning goal',section:'Start here',notes:'Replace this example with a concrete outcome students can demonstrate.',blocks:[
      {type:'paragraph',text:'By the end of this lesson, you will predict how a loop changes a value.'},
      {type:'callout',title:'The question',text:'What information changes on each iteration, and what stays the same?'}
    ]},
    {title:'A small worked example',section:'Explain',notes:'Have students record total after each iteration.',blocks:[
      {type:'paragraph',text:'The variable total starts at 0. Each iteration adds the current value of i.'},
      {type:'code',text:'int total = 0;\nfor (int i = 1; i <= 3; i++) {\n    total += i;\n}'},
      {type:'quiz',id:'loop',question:'What is the final value of total?',options:['3','6','9'],answer:1,explanation:'The updates add 1, then 2, then 3. The final total is 6.'}
    ]},
    {title:'A prediction to discuss',section:'Think',notes:'Give partners one minute before revealing.',blocks:[
      {type:'reveal',id:'prediction',question:'What changes if the condition becomes i < 3?',answer:'The loop runs for i = 1 and i = 2 only. The final total is 3.'}
    ]},
    {title:'Exit ticket',section:'Check',notes:'Ask for an explanation as well as a number.',blocks:[
      {type:'paragraph',text:'Write the value of total after each iteration if the loop runs through i = 4.'},
      {type:'reveal',id:'exit',question:'Check your reasoning',answer:'The totals are 1, 3, 6, and 10. Each update adds the current i to the previous total.'}
    ]}
  ]
};
