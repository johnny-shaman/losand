(()=>{
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
            value (f, ...v) {
              return Object.assign(this.map(f, ...v)._, {re: this});
            }
        },
        link: {
            configurable: true,
            value (f, ...v) {
              return Object.assign(this.fit(f, ...v)._, {re: this});
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
              return this.map(Object.values);
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
                return this.map($ => Object.create($.constructor.prototype), o);
            }
        },
        give: {
            configurable: true,
            value (f, ...v) {
                this.keys._.forEach(k => f(k, this.v[k], ...v));
                return this;
            }
        },
        take: {
            configurable: true,
            value (f, ...v) {
                return _(
                    this.keys._
                        .map(k => ({[k] : f(k, this.v[k], ...v)}))
                        .reduce((p, c) => Object.assign(p, c), this.folk),
                    this
                );
            }
        },
        json: {
            configurable: true,
            get () {
                return JSON.stringify(this._);
            }
        }
    });

    _._ = (...f) => (v) => f.reduceRight((p, c) => c(p), v);
    _.$ = (...v) => v.includes(undefined) || v.includes(null) ? (...vv) => _.$(_(v).drop(vv)._) : (f) => f(...v);

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
        },
        take: {
            configurable: true,
            value (f, ...a) {
                return this.map((v, k) => f(v, ...a, k));
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
