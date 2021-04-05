var H5P = H5P || {};

H5P.Wordcount = (function ($, Word) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    this.$ = $(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      wordcountText: 'Hello world!'
    }, options);
    // Keep provided id.
    this.id = id;

  };


  C.prototype.createButton = function (callback){
      var self = this;

      const button = document.createElement('input');
      button.type = "button";
      button.value = "Count Words";
      button.onclick = callback;

      return button;
  };



  C.prototype.createInput = function (defaultString){
      const input = document.createElement('textarea');
      input.innerHTML = defaultString || '';
      input.textContent = this.currentInput;
      input.value = defaultString;
      input.rows = 6;

      return input;
  };

  C.prototype.splitText = function (text, $container) {
    var split = text.split(/\r?\n| /);

    for(var splitWord in split){
      var wordSpan = document.createElement('SPAN')
      wordSpan.innerHTML = split[splitWord]+' '
      wordSpan.classList.add('word')
      $container.append(wordSpan)
    }

    return split

  };

  C.prototype.countText = function (splitText, $container){

      var count = splitText.reduce(function(map, word) {
        word = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
        if (word in map)
          map[word]++;
        else
          map[word] = 1;
        return map;
      }, {}); 

      var sortable = [];
      for (var word in count) {
          sortable.push([word, count[word]]);
      }

      sortable.sort(function(a, b) {
          return a[1] < b[1];
      });

    for (var wordCount in sortable){
      $container.append('<div class = "count">' + sortable[wordCount][0] + ' ' + sortable[wordCount][1] + ' </div>')
    }

    $(".word").hover( function(event){
      var lookup = this.textContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~() ]/g,"");
      $("#h5p-hover").text(lookup+': ' + count[lookup]);
      $("#h5p-hover").css({top: event.clientY, left: event.clientX}).show();

    },
      function() {
        $("#h5p-hover").hide();
    });

  };

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    var self = this;
    $container.addClass("h5p-wordcount");

    $container.append("<div id='h5p-hover' style='position: fixed'>test</div>");
    $("#h5p-hover").css({ border: "2px solid #ccc", width: "100px", background:"white"});
    $("#h5p-hover").hide();



    //var split = this.splitText(this.options.wordcountText, $container)


    var newTextInput = this.createInput(this.options.wordcountText);
    newTextInput.class = "wordcount-input"

    $container.append(newTextInput)

    var submitButton = this.createButton( function(){
        console.log(newTextInput.value)
        $('.word').remove();
        $('.count').remove();
        var nSplit = self.splitText(newTextInput.value, $( ".h5p-split-text" ))
        self.countText(nSplit,  $( ".h5p-split-text" ) )
      }

    )

    $container.append("<div></div>").append(submitButton);

    $container.append("<div class='h5p-split-text'></div>")


   // var count = this.countText(split, $container);




    //have to expose these to user -- these are for examples
  };

  return C;
})(H5P.jQuery);
