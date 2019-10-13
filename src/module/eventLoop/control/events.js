const self = this;

self.share.eventLoop = new (function eventLoop() {
    let lastUpdate = Date.now();
    const interval = 250;

    const events = {};
    const whenCheckers = [];
    const afterCheckers = [];

    this.on = function on(title, handle) {
        if (events[title] === undefined) {
            events[title] = [handle];
        } else {
            events[title].push(handle);
        }
    };

    this.emit = function emit(title, data) {
        if (events[title] === undefined) {
            return;
        }
        events[title].forEach(handle => handle(data));
    };

    this.when = function (checker, handler) {
        whenCheckers.push(() => {
            if (checker()) {
                handler();
            }
        });
    };

    this.after = function (checker, handler) {
        afterCheckers.push(function action () {
            if (checker()) {
                afterCheckers.splice(
                    afterCheckers.indexOf(action), 
                    1
                );
                handler();
            }
        });
    };

    function tick () {
        let now = Date.now();
        if ((lastUpdate + interval) < now) {
            lastUpdate = now;
            whenCheckers.forEach(fn => fn());
            afterCheckers.forEach(fn => fn());
        }
        return window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
});