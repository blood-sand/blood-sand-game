
$('#gladiator ul>li').each(function () {
	let id = $(this).children('a').attr('href').replace('#', '');
	$('head').append('<style>' + modules[id].prototype.display.style + '</style>');
	$('#gladiator').append(modules[id].prototype.display.box);
	modules.fetch(id);
	console.log(modules[id].prototype)
});
let baseHeight = $('#gladiator ul').height();
console.log(baseHeight)
modules.fetch('culture');
$('#gladiator').css({
	'height': $('#culture').outerHeight(),
	'width': $('#culture').outerWidth()
});
$('#gladiator').tabs({
	activate (event, ui) {
		//console.log(ui);
		let id = ui.newPanel.attr('id').replace('#', '');
		modules.fetch(id);
		$('#gladiator').css({
			'height': ui.newPanel.outerHeight(),
			'width': ui.newPanel.outerWidth()
		});
	}
});