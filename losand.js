/*
  global
    Node,
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

  _.version = "losand@0.2.2";

  Object.defineProperties(_.prototype, {
    is: {
      configurable: true,
      value (c) {
        return this.map(w => w.constructor === c ? w : undefined);
      }
    },
    only: {
      configurable: true,
      value (f, ...v) {
        return this.map(o => f(o, ...v) ? o : undefined);
      }
    },
    valid: {
      configurable: true,
      get () {
        return !(this.v === undefined || this.v === null);
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
        return this.valid ? _(f(this.v, ...v), this): this;
      }
    },
    fit: {
      configurable: true,
      value (f, ...v) {
        return this.valid ? _(f(...v, this.v), this): this;
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
    pick: {
      configurable: true,
      value (...v) {
        return this.bind(
          o => v.reduce((p, c) => p.draw({[c]: o[c]}), this.other())
        );
      }
    },
    omit: {
      configurable: true,
      value (...v) {
        return this.pick(...this.keys._.filter(k => !v.includes(k)));
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
        return this.bind(o => _(o).drop(this.keys.v.filter(
          (v, k) => !isNaN(Number(k))
        )));
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
        return _(this.v.prototype);
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
        : this.keys.v.forEach(k => d.addEventListener(k, this.v));
        return this;
      }
    },
    off: {
      configurable: true,
      value (d, ...a) {
        a.length !== 0
        ? a.forEach(v => d.removeEventListener(v, this.v))
        : this.keys.v.forEach(k => d.removeEventListener(k, this.v));
        return this;
      }
    },
  });
  
  this.constructor !== Object && _(Object).descript({
    handleEvent: {
      configurable: true,
      writable: true,
      value(e) {
        e.$ = e.target instanceof Node && $(e.target);
        e._ = e.data && e.data.json;
        this[e.type].constructor === Object
        ? this[e.type][
          JSON.parse(e.data).type
          ? JSON.parse(e.data).type
          : this[e.type].type
        ].call(this, e)
        : this[e.type](e);
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
