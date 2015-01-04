
var latexMath = $('#editable-math'), latexSource = $('#latex-source');

$(function() {
  latexMath.bind('keydown keypress', function() {
    setTimeout(function() {
      var latex = latexMath.mathquill('latex');
      latexSource.val(latex);
    },15);
  }).keydown().focus();

  latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        latexMath.mathquill('latex', newtext);
      }
    },15);
  });

  if(location.hash && location.hash.length > 1)
    latexMath.mathquill('latex', decodeURIComponent(location.hash.slice(1))).focus();
});