const self = this;

self.share.mouseIsDown = false;

$(document).on('mousedown', () => {
    self.share.mouseIsDown = true;
});

$(document).on('mouseup', () => {
    self.share.mouseIsDown = false;
});