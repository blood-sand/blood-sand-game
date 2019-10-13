const self = this;

$('body').on('click', '.user-settings-btn', function (e) {
    self.state.dialog.dialog('open');
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