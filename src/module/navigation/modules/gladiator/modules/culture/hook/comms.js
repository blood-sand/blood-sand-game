const self = this;

let updatable = self.share.utility.isServerUpdatable;

self.state.settings = waject({
    name: '',
    culture: '',
    sex: '',
    serverSettings: {}
});
let settings = self.state.settings;
self.share.cultureSettings = settings;

self.state.names = {};

function updateServer(target) {
    for (setting in target.serverSettings) {
        val = target.serverSettings[setting];
        if (val !== target[setting]) {
            target.serverSettings[setting] = target[setting];
            socket.emit(`gladiator-${setting}`, target[setting]);
        }
    }
}

settings.on('set', (target, prop, val) => {
    target[prop]=val;
    if (!updatable(target, prop, val)) {
        return;
    }
    updateServer(target);
});

socket.emit("gladiator-culture-ready");

socket.on("gladiator-names", d => {
    self.state.names = d;
});
socket.on("gladiator-culture-info", d => {
    self.state.cultureInfo = d;
});
socket.on("gladiator-name", d => {
    settings.serverSettings.name = d;
    settings.name = d;
});
socket.on("gladiator-sex", d => {
    settings.serverSettings.sex = d;
    settings.sex = d;
});
socket.on("gladiator-culture", d => {
    settings.serverSettings.culture = d;
    settings.culture = d;
});

