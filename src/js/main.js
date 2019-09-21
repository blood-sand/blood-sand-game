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

socket.emit("session-id", document.cookie.session)

modules.fetch('culture');
modules.fetch('settings');