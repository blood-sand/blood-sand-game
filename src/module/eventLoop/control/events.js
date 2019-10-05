const self = this;

self.share.eventLoop = new (function eventLoop() {
    let lastUpdate = Date.now();
    const interval = 250;

    const events = {};
    const checkers = [];

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
        checkers.push(() => {
            if (checker()) {
                handler();
            }
        });
    };
    function tick () {
        let now = Date.now();
        if ((lastUpdate + interval) < now) {
            lastUpdate = now;
            checkers.forEach(fn => fn());
        }
        return window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
});