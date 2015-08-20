// Firebase

// before you do this step make sure you have the Firebase JavaScript Library installed.

// create firebase reference 
var myDataRef = new Firebase('https://vivid-inferno-6632.firebaseio.com/');
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) { // if enter key is pressed
          var name = $('#nameInput').val(); // get the value from nameInput field
          var text = $('#messageInput').val(); // get the value from messageInput field
          myDataRef.push({name: name, text: text}); // immediately push those user inputs to the database
          $('#messageInput').val(''); // clear the messageInput box for the next message
        }
      });
      myDataRef.on('child_added', function(snapshot) { // when chat arrives
        var message = snapshot.val(); // store the value of items added
        displayChatMessage(message.name, message.text); // pass name and text to displayChatMessage()
      });

      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messages'));
        $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
      };
// end Firebase

// An object that will eventually let us look up movies by a unique ID.
var moviesDictionary = {};

function fetchData() {
  // empty the container
  $('#cards-container').html('');

  var query = $('#searchbox').val();
  console.log(query);
  var rawTemplate = $('#thumbnail-template').html();

  $.get('https://ga-movies-lite.firebaseio.com/movies.json', function(movies) {
    // Stamp out cards and append them into <div id="cards-container"></div>
    for (var i = 0; i < movies.length; i++) {
      var currentMovie = movies[i];
      var title = currentMovie.title;

      if (title.includes(query) == true) {
        var stampedTemplate = Mustache.render(rawTemplate, currentMovie);
        $('#cards-container').append(stampedTemplate);
      }
      
    };

    // Our "pre-processing" step where we take the movies array we got from
    // our database and creates an object out of it.
    buildDictionary(movies);
    bindEventListeners();
  });

}

function bindEventListeners() {
  // Whenever any card gets clicked, show the lightbox.
  $('.card').click(function(e) {
    // e.target is the <div> that got clicked. The ID of that div holds a key
    // we can use to "look up" movie info in our moviesDictionary. Tricky.
    var targetId = e.target.id;
    var info = moviesDictionary[targetId];

    // Hack to make it so cast members are comma + space separated.
    if (Array.isArray(info.cast)) {
      info.cast = info.cast.join(', ');
    }

    // Now that we have our info, simply stamp out our lightbox template.
    var rawTemplate = $('#lightbox-template').html();
    var stampedTemplate = Mustache.render(rawTemplate, info);
    $('#lightbox-container').html(stampedTemplate);
    $('#lightbox-container').fadeIn();
    $('#mask').fadeIn();

  });

  // Fade out the lightbox and dimmer mask when the mask is clicked.
  $('#mask').click(function() {
    $('#lightbox-container').fadeOut();
    $('#mask').fadeOut();
  });
}

function buildDictionary(movies) {
  // Take the movies array and convert it into an object.
  // moviesDictionary holds that object and we can use it to do lookups.
  for (var i = 0; i < movies.length; i++) {
    var currentMovie = movies[i];
    moviesDictionary[currentMovie.id] = currentMovie;
  }
}

// fetchData();
// init is waiting for something to happen.
function init() {
  $('#searchbox').keypress(function(e) {
    console.log(e.keyCode);
    // the enter key has the keycode of 13
    if (e.keyCode == 13) {
      fetchData();
    }
  });
}

init();

// implement search
