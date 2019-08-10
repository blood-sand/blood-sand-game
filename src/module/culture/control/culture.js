let culture = -1;
$('#culture').on('change', e => {
    const pick = e.target.selectedIndex - 1;
    if (pick < 0) {
        e.target.selectedIndex = culture + 1;
        return;
    }
    //$('p.cultureInfo').text(cultureInfo[$(e.target).val()]);
    //generateName();
    culture = pick;
    console.log(culture);
    //socket.emit("gladiator-culture", culture);
});