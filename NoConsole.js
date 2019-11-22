/**
 * NoConsole - simple js lib to watch/block console usage, undetectable as posible
 * 
 * @param {String} mode - Work mode [
 *      'allow', // do nothing
 *      'watch', // return proxy, all calls to console will be handled by Handler function
 *      'hide',  // return proxy, all calls to console will return empty function/string/object/0
 *      'block'  // return undefind, like there is no console at all
 * ]
 * @param {Function} handler - Handler function, do nothing by default
 * 
 * @author Gusev Danila <wannabeyourdrug@wbydcloud.com>
 */
function NoConsole(mode, handler) {
    if (!window || !window.console) throw 'Not in browser';
    if (!['allow', 'watch', 'hide', 'block'].includes(mode)) mode = 'allow';
    if (typeof handler !== 'function') handler = (original, prop) => original[prop];

    // Rewrite common toString to hide proxy if used
    const toString = (name) => {
        const value = 'function %name%() {' + ((typeof InstallTrigger !== 'undefined' || /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification))) ? "\n    [native code]\n" : " [native code] ") + '}';
        const inner = () => {
            return value.replace('%name%', name);
        };
        Object.defineProperty(inner, 'toString', {
            get: () => toString('toString')
        });
        return inner;
    };

    const original = window.console;
    Object.defineProperty(window, 'console', {
        get: function () {
            // not switch because I can
            if (mode === 'allow') return original;
            else if (mode === 'watch') {
                let proxy = new Proxy(original, {
                    get(target, prop) {
                        let handled = handler(original, prop);
                        handled.toString = toString(prop);
                        return handled;
                    }
                });

                proxy.toString = () => "[object Console]";
                proxy.toString.toString = toString('toString');

                return proxy;
            } else if (mode === 'hide') {
                let proxy = new Proxy(original, {
                    get(target, prop) {
                        if (typeof original[prop] == 'function') {
                            let handled = () => { };
                            handled.toString = toString(prop);
                            return handled;
                        } else if (typeof original[prop] == 'object') return {};
                        else if (typeof original[prop] == 'string') return '';
                        else if (typeof original[prop] == 'number') return 0;
                    }
                });

                proxy.toString = () => "[object Console]";
                proxy.toString.toString = toString('toString');

                return proxy;
            } else if (mode === 'block') {
                return;
            }
        },
        set: function () { }
    });
    return original;
}