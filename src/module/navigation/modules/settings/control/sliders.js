const self = this;
const settings = self.state.settings;

self.state.dialog.on('dialogcreate', () => {
    $('#user-settings-dialog .slider[name=master-sound]').slider({
        value: 0,
        min: 0,
        max: 1,
        step: 1,
        create () {
            settings.on('set', 'masterSound', (target, prop, val) => {
                $(this).
                    slider('value', val).
                    children('.custom-handle').text(val ? 'On' : 'Off');
                return val;
            });
        },
        slide (event, ui) {
            settings.masterSound = ui.value;
        },
        animate: 'fast'
    });

    $('#user-settings-dialog .slider[name=master-volume]').slider({
        value: 80,
        min: 0,
        max: 100,
        step: 5,
        create () {
            settings.on('set', 'masterVolume', (target, prop, val) => {
                $(this).slider('value', val);
                return val;
            });
        },
        slide (event, ui) {
            settings.masterVolume = ui.value;
        },
        animate: 'fast'
    });

    $('#user-settings-dialog .slider[name=music-volume]').slider({
        value: 80,
        min: 0,
        max: 100,
        step: 5,
        create () {
            settings.on('set', 'musicVolume', (target, prop, val) => {
                $(this).slider('value', val);
                return val;
            });
        },
        slide (event, ui) {
            settings.musicVolume = ui.value;
        },
        animate: 'fast'
    });

    $('#user-settings-dialog .slider[name=fx-volume]').slider({
        value: 80,
        min: 0,
        max: 100,
        step: 5,
        create: function() {
            settings.on('set', 'fxVolume', (target, prop, val) => {
                $(this).slider('value', val);
                return val;
            });
        },
        slide: function (event, ui) {
            settings.fxVolume = ui.value;
        },
        animate: 'fast'
    });
});