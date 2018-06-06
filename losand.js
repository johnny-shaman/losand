(() => {
    Object.values = Object.values || function (o) {
        return Object.keys(o).map(k => o[k]);
    };

    let _ = function (v, re) {
        return Object.create(_.prototype, {
            v: {
                configurable: true,
                writable: true,
                value: v
            },
            re: {
                configurable: true,
                writable: true,
                value: re
            },
            join: {
                configurable: true,
                get () {
                    return this.v.valueOf();
                }
            }
        });
    };
    
    Object.defineProperties(_.prototype, {
        _: {
            configurable: true,
            get () {
                return this.join;
            }
        },
        $: {
            configurable: true,
            value (f, ...v) {
                return this.map(f, ...v).re;
            }
        },
        $$: {
            configurable: true,
            value (f, ...v) {
                return this.fit(f, ...v).re;
            }
        },
        map: {
            configurable: true,
            value (f, ...v) {
                return _(f(this.v, ...v), this);
            }
        },
        fit: {
            configurable: true,
            value (f, ...v) {
                return _(f(...v, this.v), this);
            }
        },
        bind: {
            configurable: true,
            value (...v) {
                return Object.assign(this.map(...v)._, {re: this});
            }
        },
        link: {
            configurable: true,
            value (...v) {
                return Object.assign(this.fit(...v)._, {re: this});
            }
        },
        keys: {
            configurable: true,
            get () {
                return this.map(Object.keys);
            }
        },
        vals: {
            configurable: true,
            get () {
                return this.map(Object.values.bind(this._));
            }
        },
        draw: {
            configurable: true,
            value (...o) {
                return this.map(Object.assign, ...o);
            }
        },
        drop: {
            configurable: true,
            value (...o) {
                return this.fit(Object.assign, ...o);
            }
        },
        define: {
            configurable: true,
            value (o = {}) {
                return this.map(Object.defineProperties, o);
            }
        },
        create: {
            configurable: true,
            value (o = {}) {
                return this.map(Object.create, o);
            }
        },
        folk: {
            configurable: true,
            value (o = {}) {
                return this.map($ => Object.create($.constructor.prototype, o));
            }
        },
        give: {
            configurable: true,
            value (f, ...v) {
                this.keys._.forEach(k => f(k, this.v[k], ...v));
                return this;
            }
        },
        json: {
            configurable: true,
            get () {
                return JSON.stringify(this._);
            }
        }
    });

    this.constructor === Object && _(_.prototype).define({
        on: {
            configurable: true,
            value (d, ...a) {
                a.length !==0 ? a.forEach(v => this.v.on.call(this.v, v, d)) : _(d).keys._.forEach(k => this.v.on.call(this.v, k, d[k].bind(d)));
                return this;
            }
        },
        once: {
            configurable: true,
            value (d, ...a) {
                a.length !==0 ? a.forEach(v => this.v.once.call(this.v, v, d)) : _(d).keys._.forEach(k => this.v.once.call(this.v, k, d[k].bind(d)));
                return this;
            }
        },
        off: {
            configurable: true,
            value (d, ...a) {
                a.length !==0 ? a.forEach(v => this.v.off.call(this.v, v, d)) : _(d).keys._.forEach(k => this.v.off.call(this.v, k, d[k].bind(d)));
                return this;
            }
        }
    });

    _.none = function (re) {
        return _(_.none.prototype).create({
        v: {
            configurable: true,
            writable: true,
            value: {}
        },
        k: {
            configurable: true,
            writable: true,
            value: undefined
        },
        re: {
            configurable: true,
            get () {
                return re;
            }
        },
        join: {
            configurable: true,
            get () {
                return undefined;
            }
        }
        })._;
    };

    _.none.prototype = _(_.prototype).create({
        constructor: {
            configurable:true,
            writable: true,
            value: _.none
        },
        map: {
            value () {
                return this;
            }
        }
    })._;

    _(Array.prototype).define({
        each: {
            configurable: true,
            get () {
                return this.forEach;
            }
        }
    });

    _(String.prototype).define({
        json: {
            configurable:true,
            get () {
                return _(JSON.parse(this));
            }
        }
    });

    this.constructor === Object ? module.exports = _ : this._ = _;
})();
