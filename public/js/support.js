(function() {
  var element = function(id) {
    return document.getElementById(id);
  }

  // Get Elements
  var status = element('status');
  var messages = element('messages');
  var textarea = element('textarea');
  var username = element('username');

  // Set default status
  var statusDefault = status.textContent;

  var setStatus = function(s) {
    // Set status
    status.textContent = s;

    if (s !== statusDefault) {
      var delay = setTimeout(() => {
        setStatus(statusDefault);
      }, 4000);
    }
  }

  // Connect to socket.io
  // add "http://127.0.0.1:4000" to io.connect() arg if needed
  var socket = io({transports: ['websocket']});

  // Check for connection
  if (socket !== undefined) {
    console.log('Connected to socket...');

    // Handle Output
    socket.on('output', function(data) {
      //console.log(data);

      if (data.length) {
        for (let x = 0; x < data.length; x++) {
          // Build out messages
          var message = document.createElement('div');
          message.setAttribute('class', 'chat-message');
          message.textContent = data[x].name + ": " + data[x].message;
          messages.appendChild(message);
          messages.insertBefore(message, messages.firstChild);
        }
      }
    });

    // Get Status from server
    socket.on('status', function(data) {
      // get message status
      setStatus((typeof data === 'object')? data.message : data);

      // if status is clear, clear text
      if (data.clear) {
        textarea.value = '';
      }
    });

    // Handle input
    textarea.addEventListener('keydown', (e) => {
      // keycode 13 in js is the 'enter' key
      if (e.which === 13 && e.shiftKey === false) {
        // emit to server input
        socket.emit('input', {
          name: username.value,
          message: textarea.value
        });

        e.preventDefault();
      }
    });
  }

})();
