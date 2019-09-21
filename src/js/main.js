var socket = io();
(function hotReload() {
    let reloadOnConnect = false;
    socket.on("disconnect", function () {
        reloadOnConnect = true;
    });

    socket.on("connect", function () {
        if (reloadOnConnect) {
            window.location.reload();
        }
    });
}());
$(document).tooltip();
socket.emit("session-id", document.cookie.session)

modules.fetch('gladiator');
modules.fetch('settings');
