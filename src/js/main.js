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
var modules = {};
window.state = {};
$.getScript('/js/ModuleFactory.js', function () {
	modules = new ModuleFactory();
	modules.fetch('culture');
});