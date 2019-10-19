const self = this;
const settings = self.state.settings;

self.state.dialog.on('dialogcreate', () => {
    $('#user-settings-dialog .slider[name=master-sound]').slider({
        value: 0,
        min: 0,
        max: 1,
        step: 1,
        create () {
            settings.on('set', 'masterSound', result => 
                $(this).
                    slider('value', result.value).
                    children('.custom-handle').text(result.value ? 'On' : 'Off'));
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
            settings.on('set', 'masterVolume', result => 
                $(this).slider('value', result.value));
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
            settings.on('set', 'musicVolume', result => 
                $(this).slider('value', result.value));
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
            settings.on('set', 'fxVolume', result => 
                $(this).slider('value', result.value));
        },
        slide: function (event, ui) {
            settings.fxVolume = ui.value;
        },
        animate: 'fast'
    });
});