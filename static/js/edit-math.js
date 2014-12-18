
var latexMath = $('#editable-math'), latexSource = $('#latex-source');

$(function() {
  latexMath.bind('keydown keypress', function() {
    setTimeout(function() {
      var latex = latexMath.mathquill('latex');
      latexSource.val(latex);
    });
  }).keydown().focus();

  latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        latexMath.mathquill('latex', newtext);
      }
    });
  });

  if(location.hash && location.hash.length > 1)
    latexMath.mathquill('latex', decodeURIComponent(location.hash.slice(1))).focus();
});

//print the HTML source as an indented tree. TODO: syntax highlight
function printTree(html) {
  html = html.match(/<[a-z]+|<\/[a-z]+>|./ig);
  if (!html) return '';
  var indent = '\n', tree = [];
  for (var i = 0; i < html.length; i += 1) {
    var token = html[i];
    if (token.charAt(0) === '<') {
      if (token.charAt(1) === '/') { //dedent on close tag
        indent = indent.slice(0,-2);
        if (html[i+1] && html[i+1].slice(0,2) === '</') //but maintain indent for close tags that come after other close tags
          token += indent.slice(0,-2);
      }
      else { //indent on open tag
        tree.push(indent);
        indent += '  ';
      }

      token = token.toLowerCase();
    }

    tree.push(token);
  }
  return tree.join('').slice(1);
}