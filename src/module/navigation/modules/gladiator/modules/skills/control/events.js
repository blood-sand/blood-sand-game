const self = this;

socket.on('gladiator-rank', data => {
    let rank = data;
    let rankMax = rank * 2;
    for (let label in self.share.skillMaxes) {
        let skillMax = self.share.skillMaxes[label];
        let max = (rankMax < skillMax) ? rankMax : skillMax;
        $(`#skills .slider-container:has(.slider[name=${label}])`).
                attr('title', `Maximum of ${max} for rank ${rank}`);
    }
});

$( "#skills .slider" ).slider({
    create: function() {
        let name = $(this).attr('name');
        let max = self.share.skillMaxes[name];
        let rank = self.share.biometrics.rank || 1;
        let rankMax = rank * 2;
        $('#skills .slider-container').attr('title', `Maximum of ${rankMax} for rank ${rank}`);
        $(this).slider('option', 'max', max);
        $(this).children('.custom-handle').text( $(this).slider("value"));
    },
    slide: function( event, ui ) {
        
        let name = $(this).attr('name');
        let max = $(this).slider('option', 'max');
        let highestPoint = self.state.skillPoints + $(this).slider('value');
        let rank = self.share.biometrics.rank || 1;
        let rankMax = rank * 2;
        let skillCeiling = rankMax;
        if (skillCeiling < highestPoint) {
            highestPoint = skillCeiling;
        }
        if (max < highestPoint) {
            highestPoint = max;
        }
        
        if (ui.value > highestPoint) {
            ui.value = highestPoint;
        }
        $(this).children('.custom-handle').text(ui.value);
        if (self.state.skills && name in self.state.skills) {
            self.state.skills[name] = ui.value;
        }
        if (ui.value !== self.state.skills[name]) {
            ui.value = self.state.skills[name];
            $(this).children('.custom-handle').text(ui.value);
            return false;
        }
    },
    stop: function (event, ui) {
        let name = $(this).attr('name');
        if (ui.value !== self.state.skills[name]) {
            $(this).slider('option', 'value', self.state.skills[name]);
        }
    },
    min: 0,
    max: 16,
    animate: 'slow'
});