const self = this;
let dialog = $('#user-settings-dialog');
dialog.dialog({
    autoOpen: false,
    modal: true,
    width: 720,
    show: {
        effect: 'explode',
        duration: 250
    }, 
    hide: {
        effect: 'explode',
        duration: 250
    },
    beforeClose () {
        delete self.share.query.soundSettings;
    },
    close: function() {
        
        self.share.sounds.bow.play();
        self.state.masterSound = $(this).find('[name=master-sound]').slider('value');
        self.state.masterVolume = $(this).find('[name=master-volume]').slider('value');
        self.state.musicVolume = $(this).find('[name=music-volume]').slider('value');
        self.state.fxVolume = $(this).find('[name=fx-volume]').slider('value');
    },
    open: function () {
        self.share.query.soundSettings = true;
        self.share.sounds.switch.play();
        $('.ui-widget-overlay').one('click', () => $(this).dialog('close'));
    }
});

let masterSoundOn = $('#user-settings-dialog .slider[name=master-sound]').slider({
    value: 0,
    min: 0,
    max: 1,
    step: 1,
    create: function() {
        let value = $(this).slider('value');
        $(this).children('.custom-handle').text(value ? 'On' : 'Off');
    },
    slide: function (event, ui) {
        $(this).children(".custom-handle").text(ui.value ? 'On' : 'Off');
        self.state.masterSound = ui.value;
    },
    animate: 'fast'
});

let masterVolume = $('#user-settings-dialog .slider[name=master-volume]').slider({
    value: 80,
    min: 0,
    max: 100,
    step: 5,
    create: function() {},
    slide: function (event, ui) {
        self.state.masterVolume = ui.value;
    },
    animate: 'fast'
});

let musicVolume = $('#user-settings-dialog .slider[name=music-volume]').slider({
    value: 80,
    min: 0,
    max: 100,
    step: 5,
    create: function() {},
    slide: function (event, ui) {
        self.state.musicVolume = ui.value;
    },
    animate: 'fast'
});

let fxVolume = $('#user-settings-dialog .slider[name=fx-volume]').slider({
    value: 80,
    min: 0,
    max: 100,
    step: 5,
    create: function() {},
    slide: function (event, ui) {
        self.state.fxVolume = ui.value;
    },
    animate: 'fast'
});

$('body').on('click', '.user-settings-btn', function (e) {
    dialog.dialog('open');
});

$('body').on('click', '.next,.previous,.ui-tab a', () => {
    self.share.sounds.switch.play();
});

$('body').on('selectric-before-open', 'select', () => {
    self.share.sounds.up.play();
});

$('body').on('selectric-before-close', 'select', () => {
    self.share.sounds.down.play();
});

$('body').on('slide', '.slider', function (e, ui) {
    let before = $(this).slider('value');
    let after = ui.value;
    if (before < after && !self.share.sounds.up.playing()) {
        self.share.sounds.up.play();
    } else if (before > after && !self.share.sounds.down.playing()) {
        self.share.sounds.down.play();
    }
})

$('body').on('click', '.dice', () => {
    function randomDie () {
        return 1 + (3 * Math.random() << 0);
    };
    let r = randomDie();
    let sound = self.share.sounds["dice" + r];
    sound.play();
});

self.share.eventLoop.when(() => (
        self.share.query.soundSettings === true &&
        !$('#user-settings-dialog').dialog('isOpen')
    ), () => {
    $('#user-settings-dialog').dialog('open');
});
