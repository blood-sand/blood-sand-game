const self = this;

$('#combatStats [name=name]').val(self.share.name);
$('[name="combatStatsPrevious').on('click', e => {
    self.state.previous = true;
});

$('[name="combatStatsNext').on('click', e => {
    self.state.next = true;
});