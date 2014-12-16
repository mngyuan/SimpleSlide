Making presentations with SimpleSlide
====
SimpleSlide is a simple language for creating slideshow presentations
Let's walk through some of the features that it offers

Hello World
====
To start off, we need to create pages.
Pages are created with an optional title, followed by 4 equal signs '====' on a new line.
This is how you can create a page titled Hello World
_code
Hello World
\====
#content goes here
_
And this is how you can create a page with no title
_code
\====
# content goes here
_

Adding Content
====
To add content, just type it in normally.
There's no need to deal with annoying <br> or <p> tags like normal HTML.
To list off items as unordered lists, begin each item with a *
You can even make nested lists through indenting.
_code
*item 1
*item 2
  *subitem 1
  *subitem 2
*item 3
_
*item 1
*item 2
  *subitem 1
  *subitem 2
*item 3

Introduction to tags
====
This all seems nice if all you want to make are bulleted slides, but we can use tags to do much more.
Tags are like HTML tags, except much simplier.
They all words that start with an underscore \_ and are all closed by a single underscore.
They don't have to be matched up. You can leave unclosed tags or start with a close tag.
In that case the parser will issue a warning in the console.

Working with tags
====
Lets start with some of the most basic, the image and the link tag.
An image tag looks like this:
_code
\_img https://www.google.com/logos/doodles/2014/wassily-kandinskys-148th-birthday-5655681428357120-hp.jpg \\ 
| This text will appear on hover | This will be a caption \_
_
_img https://www.google.com/logos/doodles/2014/wassily-kandinskys-148th-birthday-5655681428357120-hp.jpg \
| This text will be hovered | This will be a caption _
Links are also simple. They use the \_a tag.
_code
\_a link to Google | www.google.com \_
_
_a a link to Google | www.google.com _

Working with tags
====
Tables are also straightfoward.
_code
\_table
a | b | c
e | f | g
h | i | j
\_
_
_table
a | b | c
e | f | g
h | i | j
_
As you can see, columns are delimited with a '|' and rows by newlines.
Here's an interesting tag: embedded youtube links.
_code
\_yt https://www.youtube.com/watch?v=sW6O6C5zjYM \_
_
This is the video from our PA6 report on reveal.js, where we got most of the inspiration for this project from.
_yt https://www.youtube.com/watch?v=sW6O6C5zjYM _

Code and escaping
====
You may be wondering how I'm able to get the actual code used to produce content as text and not content.
Escaping is done with the backslash \\ character.
Be sure to place one before every word that starts with an underscore.
And code can be placed between \_code and \_hl tags, and \_hl tags uses highlight.js to give syntax highlighting.
Here's an excerpt from the interpreter:
_hl
// factory for making tag functions that want to map evalNode over their children
function makeEvalTag(fn) {
  return function(node) {
    var children = node.children.map(evalNode);
    return fn(node, children);
  }
}
_

Fragments
====
Here is an interesting feature. Fragments allow you to add more flair to your presentations.
_f You _ _f can _ _f reveal _ _f parts _ _f one _ _f at _ _f a _ _f time. _
Simply nest whatever you want to hide inside \_f tags.
Numbered fragments are tags that begin with \_[number] like \_1 or \_2 .
These are also fragments, but reveal according to their number, instead of their position on the page.
_code
So \_2 this section \_ will come before \_1 this other section \_ .
_
So _2 this section _ will come before _1 this other section _ .

Auto fragments
====
_ff
Wrapping everything around fragment tags can get tedious.
Have no fear, auto fragments solve this issue!
Simply wrap a series of lines inside an \_ff tag, and every item will automatically become a fragment.
You can even _f nest fragments _ instead of auto fragments.
Here is the some example code:
_code
\_ff
Wrapping everything around fragment tags can get tedious.
Have no fear, auto fragments solve this issue!
Simply wrap a series of lines inside an \_ff tag, and every item will automatically become a fragment.
You can even \_f nest fragments \_ instead of auto fragments.
\_
Simple, isn't it!
_
