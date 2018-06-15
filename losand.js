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
                    return this.v !== undefined ||  this.v !== null ? this.v.valueOf() : this.v;
                }
            }
        });
    };

    _.version = "0.0.45";

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
                return this.v !== undefined ||  this.v !== null ? _(f(this.v, ...v), this) : this;
            }
        },
        fit: {
            configurable: true,
            value (f, ...v) {
                return this.v !== undefined ||  this.v !== null ? _(f(...v, this.v), this) : this;
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
        list: {
            configurable: true,
            get () {
                return this.bind(o => _(o).drop(this.keys._.filter((v, k) => !isNaN(Number(k)))));
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
            value (d) {
                _(d).give(this.v.on.bind(this.v));
                return this;
            }
        },
        once: {
            configurable: true,
            value (d) {
                _(d).give(this.v.once.bind(this.v));
                return this;
            }
        }
    });

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
