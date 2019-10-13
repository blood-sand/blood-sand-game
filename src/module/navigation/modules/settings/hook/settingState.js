const self = this;
const settings = self.state.settings;

function putBetween (min, max) {
    return function (target, prop, val) {
        val = Math.round(parseInt(val));
        if (val < min) {
            val = min;
        } else if (val > max) {
            val = max;
        } 

        if (isNaN(val)) {
            val = min;
        }

        target[prop] = val;
        return true;
    };
}

// Ensure masterSound is 0 or 1.
settings.on('set', 'masterSound', putBetween(0, 1));

// Emit a master-sound event 
// This allows things outside of
// this module to listen for changes.
settings.on('set', 'masterSound', (target, prop, val) => {
    self.share.eventLoop.emit('master-sound', val);
}
);

// Enable/Disable all Audio
settings.on('set', 'masterSound', (target, prop, val) => {
    if (val) {
        Howler.mute(false);
    }
    if (!val) {
        Howler.mute(true);
    }
});

// Ensure masterVolume is between 0 and 100.
settings.on('set', 'masterVolume', putBetween(0, 100));

// Set Master Volume
settings.on('set', 'masterVolume', (target, prop, val) => {
    Howler.volume(val / 100);
});

// Ensure musicVolume is between 0 and 100.
settings.on('set', 'musicVolume', putBetween(0, 100));

// Set Music Volume
settings.on('set', 'musicVolume', (target, prop, val) => {
    self.share.sounds.music.volume(val / 100);
});

// Ensure fxVolume is between 0 and 100.
settings.on('set', 'fxVolume', putBetween(0, 100));

// Set Music Volume
settings.on('set', 'fxVolume', (target, prop, val) => {
    let sounds = self.share.sounds;
    for (let sound in sounds) {
        if (sound === "music") {
            continue;
        }
        sounds[sound].volume(val / 100);
    }
});
