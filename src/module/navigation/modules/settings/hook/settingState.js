const self = this;
const settings = self.state.settings;

function putBetween (min, max) {
    return function (result) {

        val = Math.round(parseInt(result.value));
        if (val < min) {
            val = min;
        } else if (val > max) {
            val = max;
        } 

        if (isNaN(val)) {
            val = min;
        }

        result.value = val;
    };
}

// Ensure masterSound is 0 or 1.
settings.on('set', 'masterSound', putBetween(0, 1));

// Emit a master-sound event 
// This allows things outside of
// this module to listen for changes.
settings.on('set', 'masterSound', (result) => {
    self.share.eventLoop.emit('master-sound', result.value);
});

// Enable/Disable all Audio
settings.on('set', 'masterSound', (result) => {
    if (result.value) {
        Howler.mute(false);
    }
    if (!result.value) {
        Howler.mute(true);
    }
});

// Ensure masterVolume is between 0 and 100.
settings.on('set', 'masterVolume', putBetween(0, 100));

// Set Master Volume
settings.on('set', 'masterVolume', (result) => {
    Howler.volume(result.value / 100);
});

// Ensure musicVolume is between 0 and 100.
settings.on('set', 'musicVolume', putBetween(0, 100));

// Set Music Volume
settings.on('set', 'musicVolume', (result) => {
    self.share.sounds.music.volume(result.value / 100);
});

// Ensure fxVolume is between 0 and 100.
settings.on('set', 'fxVolume', putBetween(0, 100));

// Set Music Volume
settings.on('set', 'fxVolume', (result) => {
    let sounds = self.share.sounds;
    for (let sound in sounds) {
        if (sound === "music") {
            continue;
        }
        sounds[sound].volume(result.value / 100);
    }
});
