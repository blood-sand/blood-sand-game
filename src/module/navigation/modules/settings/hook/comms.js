const self = this;
const state = self.state;
let pendingMessage = true;

let settings = self.state.settings = waject({
    masterSound: 0,
    masterVolume: 0,
    musicVolume: 0,
    fxVolume: 0,
    serverSettings: {}
});
self.share.soundSettings = settings;

Howler.mute(true);
let sounds = self.share.sounds = {
    music: new Howl({
        src: ['/sound/Paint_the_Arena_with_Red.mp3'],
        loop: true,
        autoplay: true,
        volume: 0.5
    }),
    forward: new Howl({
        src: ['/sound/harp_2.mp3']
    }),
    back: new Howl({
        src: ['/sound/harp_1.mp3']
    }),
    up: new Howl({
        src: ['/sound/stone_scraping_1.mp3']
    }),
    down: new Howl({
        src: ['/sound/stone_scraping_2.mp3']
    }),
    switch: new Howl({
        src: ['/sound/stone_6.mp3']
    }),
    dice1: new Howl({
        src: ['/sound/stone_2.mp3']
    }),
    dice2: new Howl({
        src: ['/sound/stone_3.mp3']
    }),
    dice3: new Howl({
        src: ['/sound/stone_4.mp3']
    }),
    bow: new Howl({
        src: ['/sound/fire_bow_sound-mike-koenig.mp3']
    })
};

function sendUpdate(target) {
    target.serverSettings = {
        masterSound: target.masterSound,
        masterVolume: target.masterVolume,
        musicVolume: target.musicVolume,
        fxVolume: target.fxVolume
    };
    socket.emit('sound-settings', target.serverSettings);
    pendingMessage = false;
}

// initialize settings state
new self.hook.settingState;


// Emit a socket sound-settings event.
// This allows the server to stay in-sync
// with the client when changes occur.
settings.on('set', result => {
    if (pendingMessage) {
        return;
    }
    if (!self.share.utility.isServerUpdatable(result)) {
        return;
    }
    pendingMessage = true;
    if (self.share.mouseIsDown) {
        $(document).one('mouseup', () => sendUpdate(result.target));
    } else {
        sendUpdate(result.target);
    }
});


socket.on('sound-settings', serverSettings => {
    settings.serverSettings = serverSettings;
    settings['*'] = serverSettings;
    pendingMessage = false;
});

socket.emit("sound-settings-ready");