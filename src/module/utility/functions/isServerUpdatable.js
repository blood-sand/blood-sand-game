this.share.utility.isServerUpdatable = function isServerUpdatable(target, prop, val) {
    let s = target.serverSettings;

    if (Object.keys(s).length !== Object.keys(target).length - 1) {
        return false;
    }

    for (let setting in s) {
        if (target[setting] !== s[setting]) {
            return true;
        }
    }

    return false;
}