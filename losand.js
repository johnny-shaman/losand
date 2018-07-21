/*
    global
    Node
    $
*/
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
            }
        });
    };

    _.version = "losand@0.2.1";

    Object.defineProperties(_.prototype, {
        valid: {
            configurable: true,
            get () {
                return this.v !== undefined && this.v !== null;
            }
        },
        join: {
            configurable: true,
            get () {
                return this.valid ? this.v.valueOf() : this.v;
            }
        },
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
                return this.valid ? _(f(this.v, ...v), this) : this;
            }
        },
        fit: {
            configurable: true,
            value (f, ...v) {
                return this.valid ? _(f(...v, this.v), this) : this;
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
        other: {
            configurable: true,
            value (o = {}) {
                return this.map($ => Object.create($.constructor.prototype, o));
            }
        },
        depend: {
            configurable: true,
            value (o) {
                return this.bind(m => _(o).create().draw(m));
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
                return this.bind(
                    o => _(o).drop(
                        this.keys._.filter(
                            (v, k) => !isNaN(Number(k))
                        )
                    )
                );
            }
        },
        json: {
            configurable: true,
            get () {
                return JSON.stringify(this._);
            }
        },
        from: {
            configurable: true,
            get () {
                return _(this._.prototype);
            }
        },
        relate: {
            configurable: true,
            value (...o) {
                return this.$($ => _($).from.draw(...o));
            }
        },
        descript: {
            configurable: true,
            value (o) {
                return this.$($ => _($).from.define(o));
            }
        },
        fork: {
            configurable: true,
            value (f) {
                return this.bind($ => _(f).draw({prototype: this.from.create({
                    constructor: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: f
                    }
                }).draw(f.prototype)._}));
            }
        }
    });

    this.constructor === Object && _(_).descript({
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
    
    this.constructor !== Object && _(_).descript({
        on: {
            configurable: true,
            value (d, ...a) {
                a.length !== 0
                ? a.forEach(v => d.addEventListener(v, this.v))
                : this.keys._.forEach(k => d.addEventListener(k, this.v));
                return this;
            }
        },
        off: {
            configurable: true,
            value (d, ...a) {
                a.length !== 0
                ? a.forEach(v => d.removeEventListener(v, this.v))
                : this.keys._.forEach(k => d.removeEventListener(k, this.v));
                return this;
            }
        },
    });
    
    this.constructor !== Object && _(Object).descript({
        handleEvent: {
            configurable: true,
            writable: true,
            value(e) {
                e.$ = Node && e.target instanceof Node && $(e.target);
                e._ = e.data && e.data.json;
                this[e.type].constructor === Object ? 
                this[e.type][
                    JSON.parse(e.data).type ?
                    JSON.parse(e.data).type :
                    this[e.type].type
                ].call(this, e) :
                this[e.type](e);
                e = null;
            }
        }
    });

    _(Array).descript({
        each: {
            configurable: true,
            get () {
                return this.forEach;
            }
        }
    });

    _(String).descript({
        json: {
            configurable:true,
            get () {
                return _(JSON.parse(this));
            }
        }
    });

    this.constructor === Object ? module.exports = _ : this._ = _;
})();
