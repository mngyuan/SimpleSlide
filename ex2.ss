:background yellow
Extending SimpleSlide
====
One of the strengths of SimpleSlides is its modularity.
The way the components are built allows for multiple ways to extend it to add your own features.
We'll cover 3 ways, CSS styling, writing tag modules, and writing macros.

CSS styling
====
_ff
Because SimpleSlide is rendered in the browser, all the elements you see on the page are really DOM nodes.
There are a set number of special tags like \_img and \_table and of course fragments with special meaning.
But the parser will parse any word that starts with \_ as a tag.
What does this mean? What does the interpreter do when creating nodes from unknown tags?
_

CSS styling
====
_ff
Simpleslide simply takes anything inside an unknown tag, converts its children into DOM nodes, and \
then puts everything inside a CSS class.
That means you can write your own CSS styles for whatever tag you want!
Here's an example:
_code
\_red This text will be red. \_
\_dot This text will have a dotted bottom border. \_
\_red \_dot This text will have both these properties. \_ \_
_
_red This text will be red. _
_dot This text will have a dotted bottom border. _
_red _dot This text will have both these properties. _ _
We just added a couple of lines to the end of simpleslide.css describing these properties.
Simple isn't it?
_

Writing modules
====
Adding support for custom CSS styles is nice, but it won't always give you what you want.
Sometimes we need something more powerful, and that's where creating support for new tags comes in.
Every tag supported except for fragments come from this.

Writing modules
====
_ff
Let's take a look at an example from modules.js
_hl
// autofragment: makes every children a fragment
function evalFF(node) {
  node.children = node.children.map(function (child) {
     return { type: 'tag', tag: 'f', children: [child] };
  });
  node.tag = '';
  return evalNode(node);
}
_
Lets look at what this code does.
First, it takes in an argument called node. This represents a node in the AST that the parser outputs.
The node has a field called children, and what do we do with the children?
We wrap them all in a new node with a tag of 'f', which stands for fragment.
So now there is an added level on all of the node's children, with a fragment surrounding each one.
Then we remove the tag of the node itself so we don't get into an endless recursive loop, and call evalNode again.
_

Writing modules
====
_ff
What is evalNode? It's the general all purpose recursive function for turning parser ASTs into DOM nodes.
This is part of its implementation:
_hl
var tags = [ { tag: /^[0-9]+$/, function: evalNumberedFragment} ,
             { tag: /^f$/, function: evalFragment } ];

function findEvalTag(string) { // look for the function to eval a tag node
  var fn;
  tags.forEach(function(tag) {
    if (string.match(tag.tag)) {
      fn = tag.function;
    }
  });
  return fn || defaultEvalTag;
}

function evalNode(node) {
  if (node.type === 'tag') {
    return findEvalTag(node.tag)(node);
  } 
...
_
If it encouters a node of type 'tag', it searches for the proper function to convert the node into a DOM node.
If it can't find one, it just wraps it inside a CSS class as stated before.
_

Writing modules
====
evalFF was an interesting example because it made use of evalNode, but a lot of times tags won't.
Let's look at a more traditional example: the \_img tag
_hl
// links are created with _a url text _
// or _a text | url _
// or _a url _
function evalLink(node) {
  var link = document.createElement('a');
  var text = node.text.split('|');
  var href = ''
  if (text.length > 1) {
    href = trim(text[text.length - 1]);
    link.innerHTML = text.slice(0, text.length - 1).join('|');
  } else {
    text = text[0].split(' ');
    if (text.length === 1) {
      text.push(text[0]);
    }
    href = trim(text[0]);
    link.innerHTML = text.slice(1).join(' ');
  }
  if (!href.match(/^http/)) {
    href = 'https://' + href;
  }
  link.href = href;
  return link;
}
_
The implementation seems pretty basic, but it makes use of a new field, node.text.
node.text is simple just the text contained between 2 matching tags.
It's used when you don't care about the recursive structure and you just want to process a literal string.
In this case, evalLink processes this string into a <a> element.
All tag modules take in an AST node from the parser and return a HTML DOM node, so they are all compatible with evalNode.
As long as you keep this interface in mind, you can write parsers and evaluators for whatever crazy tags you want to implement.

Using the macro system
====
Simpleslide uses a very simple macro system to let you write standard javascript code to make slides.
Any text within \_\$( and \_\$) tags will be evaluated and replaced with its result.
Lets try a simple example:
_hl
\_\$(
     var str = '';
     for (var i = 0; i < 5; i++) {
       str += i + '\n';
     }
     return str;
\_\$)
_
_$(
     var str = '';
     for (var i = 0; i < 5; i++) {
       str += i + '\n';
     }
     return str;
_$)
As expected, the result is taken as SimpleSlide markup code.

Using the macro system
====
You can write more complicated macros using the library functions provided in the ss object passed in with every eval.
You can even extend the ss object with your own functions to create your own custom structures.
Look in macros.js and earleyparser.ss for more examples on this topic.

Conclusion
====
We hope this presentation has shown you what you can really do with SimpleScript.
It's syntax is very basic, but that's what makes it so powerful.
Because it's syntax is so simple, we can add new ways to extend the language very easily, kind of like the Lisp/ML family.
Don't forget to try out the live preview editor!

