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
_
_red This text will be red. _
_dot This text will have a dotted bottom border. _
We just added a couple of lines to the end of simpleslide.css describing these properties.
