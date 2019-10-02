const self = this;

let activeTab = 0;
const baseTitle = "Blood & Sand";
const baseContent = document.getElementsByTagName('html')[0].outerHTML;
let stateLoad = false;

function setWindowTitle (url) {
    url = url.replace('/', '');
    let parts = url.split('-');
    let title = baseTitle + " |";
    parts.forEach((part, i) => {
        let newPart = "";
        for (let i = 0; i < part.length; i += 1) {
            if (i === 0) {
                newPart = " " + part[i].toUpperCase();
            } else if (part[i] === part[i].toUpperCase()) {
                newPart += " " + part[i];
            } else {
                newPart += part[i]
            }
        }
        title += newPart;
    });
    document.title = title;
}

$('#gladiator ul>li:has(a[href])').each(function (i) {
    let id = $(this).children('a').attr('href').replace('#', '');
    if (!(id in modules)) {
        return;
    }
    $('head').append('<style>' + modules[id].prototype.display.style + '</style>');
    $('#gladiator').append(modules[id].prototype.display.box);
    modules.fetch(id);
    if (window.location.pathname === ('/gladiator-' + id)) {
        setWindowTitle('gladiator-' + id);
        activeTab = i;
    }
});

if (activeTab === 0) {
    setWindowTitle('gladiator-culture');
    window.history.replaceState({
        id: '#culture'
    }, baseTitle + " | gladiator culture", "gladiator-culture" + location.search + location.hash);
}
modules.fetch('culture');

$('#gladiator').tabs({
    active: activeTab,
    beforeActivate (event, ui) {
        let newUrl = ui.newTab.children('a').attr('href').replace("#", "gladiator-");
        let content = baseContent;
        setWindowTitle(newUrl);
        if (!stateLoad) {
            window.history.pushState({
                id: ui.newTab.children('a').attr('href')
            }, "", newUrl + location.search + location.hash);
        }
    },
    activate (event, ui) {
        stateLoad = false;
        let id = ui.newPanel.attr('id').replace('#', '');
        if (id in modules) {
            modules.fetch(id);
        }
    }
});

window.onpopstate = function (e) {
    if (e.state && e.state.id) {
        stateLoad = true;
        $('#gladiator').tabs()
        $(`a[href="${e.state.id}"]`).trigger('click');
    }
};

let path = window.location.pathname;

self.share.eventLoop.when(() => (
        window.location.pathname !== path &&
        window.location.pathname.substring(1,10) === "gladiator"
    ), () => {
    path = window.location.pathname;
    let id = path.replace('/gladiator-', '');
    if (!$(`#${id}`).is(':visible')) {
        $(`#gladiator a[href="#${id}"]`).trigger('click');
    }
});