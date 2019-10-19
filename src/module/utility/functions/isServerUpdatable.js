this.share.utility.isServerUpdatable = function isServerUpdatable(result) {
    let target = result.target;
    let s = target.serverSettings;
    
    if (Object.keys(s).length !== Object.keys(target).length - 1) {
        return false;
    }
    if (result.target.serverSettings[result.key] !== result.value) {
        return true;
    }
    for (let setting in s) {
        if (target[setting] !== s[setting]) {
            return true;
        }
    }

    return false;
}