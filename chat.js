// Firebase

// before you do this step make sure you have the Firebase JavaScript Library installed.

// create firebase reference 
var myDataRef = new Firebase('https://vivid-inferno-6632.firebaseio.com/');
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) { // if enter key is pressed
          var name = $('#nameInput').val();
          var text = $('#messageInput').val();
          myDataRef.push({name: name, text: text}); // immediately push the user inputs to the database
          $('#messageInput').val(''); // clear the messageInput box for the next message
        }
      });
      myDataRef.on('child_added', function(snapshot) { // when chat arrives
        var message = snapshot.val(); // store the value of items added
        displayChatMessage(message.name, message.text); // pass name and text to displayChatMessage()
        console.log(snapshot.val());
        // scroll to the last message
      $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
      });

      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messages'));
        $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
      };
      
// end Firebase

