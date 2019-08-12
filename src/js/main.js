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

$.getScript('/js/ModuleFactory.js', function () {
	let m = new ModuleFactory();
	m.fetch('culture');
	//console.log("culture module:", culture)
});