const self = this;


$('[name="combatStatsPrevious').on('click', e => {
    self.state.previous = true;
});

$('[name="combatStatsNext').on('click', e => {
    self.state.next = true;
});