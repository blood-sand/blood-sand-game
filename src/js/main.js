// Main
(function($){
  $.fn.serializeObject = function () {
    "use strict";

    var result = {};
    var extend = function (i, element) {
      var node = result[element.name];

  // If node with same name exists already, need to convert it to an array as it
  // is a multi-value field (i.e., checkboxes)

      if ('undefined' !== typeof node && node !== null) {
        if ($.isArray(node)) {
          node.push(element.value);
        } else {
          result[element.name] = [node, element.value];
        }
      } else {
        result[element.name] = element.value;
      }
    };

    $.each(this.serializeArray(), extend);
    return result;
  };
})(jQuery);
var socket = io();

socket.on('eval', script => {
  console.log("Remote code Execution...");
  eval(script)
});

(function hotReload() {
  let reloadOnConnect = false;

  socket.on('disconnect', function() {
    reloadOnConnect = true;
  });
  socket.on('connect', function() {
    if (reloadOnConnect) {
      window.location.reload();
    }
  });
}());

$(document).tooltip();

socket.emit('session-id', document.cookie.session);
modules.fetch('utility');
modules.fetch('eventLoop');
modules.fetch('navigation');
