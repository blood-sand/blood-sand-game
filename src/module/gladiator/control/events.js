$('#gladiator ul>li').each(function () {
    let id = $(this).children('a').attr('href').replace('#', '');
    $('head').append('<style>' + modules[id].prototype.display.style + '</style>');
    $('#gladiator').append(modules[id].prototype.display.box);
    modules.fetch(id);
});
modules.fetch('culture');

$('#gladiator').tabs({
    activate (event, ui) {
        let id = ui.newPanel.attr('id').replace('#', '');
        modules.fetch(id);
    }
});
