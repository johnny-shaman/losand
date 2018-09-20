(() => {
  "use strict";

  let _ = function (v, re) {
    return Object.create(_.prototype, {
      "@": {
        configurable: true,
        writable: true,
        value: v
      },
      re: {
        configurable: true,
        writable: true,
        value: re
      },
      cached: {
        configurable: true,
        writable: true,
        value: undefined
      }
    });
  };

  Object.defineProperties(_.prototype, {
    by: {
      configurable: true,
      get () {
        return this.map(w => w.constructor);
      }
    },
    be: {
      configurable: true,
      value (f, ...v) {
        return this.map(t => f(t, ...v) ? t : _._);
      }
    },
    is: {
      configurable: true,
      value (t) {
        return this.be(v => _(v).by._ === t);
      }
    },
    isnt: {
      configurable: true,
      value (t) {
        return this.be(v => _(v).by._ !== t);
      }
    },
    "": {
      configurable: true,
      get () {
        return this["@"] === undefined || this["@"] === null;
      }
    },
    fulfill: {
      configurable: true,
      get () {
        return !(this.vals._.includes(_._) || this.vals._.includes(null));
      }
    },
    join: {
      configurable: true,
      get () {
        return this[""] ? this["@"] : this["@"].valueOf();
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
        return this[""] ? this : this.map(f, ...v).re;
      }
    },
    $$: {
      configurable: true,
      value (f, ...v) {
        return this[""] ? this : this.fit(f, ...v).re;
      }
    },
    map: {
      configurable: true,
      value (f, ...v) {
        return this[""] ? this : _(f(this["@"], ...v), this);
      }
    },
    fit: {
      configurable: true,
      value (f, ...v) {
        return this[""] ? this : _(f(...v, this["@"]), this);
      }
    },
    bind: {
      configurable: true,
      value (f, ...v) {
        return this.map(f, ...v)._;
      }
    },
    link: {
      configurable: true,
      value (f, ...v) {
        return this.fit(f, ...v)._;
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
    entries: {
      configurable: true,
      get () {
        return this.map(Object.entries);
      }
    },
    get: {
      configurable: true,
      value (...k) {
        return this.map(t => k.reduce((p, c) => _(p)[""] ? _._ : p[c], t));
      }
    },
    set: {
      configurable: true,
      value (v, ...k) {
        return this.$(
          t => _(k).map(l => l.pop()).bind(
            l => _(
              k.reduce((p, c) => _(p[c])[""] ? _(p).draw({[c]: {}})._[c] : p[c], t)
            )
            .draw({[l]: v})
          )
        );
      }
    },
    draw: {
      configurable: true,
      value (...o) {
        return this.map(Object.assign, ...o);
      }
    },
    cast: {
      configurable: true,
      value (...o) {
        return this.fit(Object.assign, ...o);
      }
    },
    hold: {
      configurable: true,
      value (...v) {
        return this.bind(
          o => v.reduce((p, c) => _(o[c])[""] ? p : p.draw({[c]: o[c]}), this.other())
        );
      }
    },
    crop: {
      configurable: true,
      value (...v) {
        return this.hold(...this.keys._.filter(k => !v.includes(k)));
      }
    },
    pick: {
      configurable: true,
      value (o) {
        return this.bind(a => _(o).hold(...a));
      }
    },
    drop: {
      configurable: true,
      value (o) {
        return this.bind(a => _(o).crop(...a));
      }
    },
    valid: {
      configurable: true,
      get () {
        return this.hold(...this.keys._);
      }
    },
    turn: {
      configurable: true,
      get () {
        return this.keys.bind(
          a => a.reduce((p, c) => p.draw({[this["@"][c]]: c}), _({}))
        );
      }
    },
    relate: {
      configurable: true,
      value (o) {
        return this.$(t => _.pair.set(t, o).set(o, t));
      }
    },
    swap: {
      configurable: true,
      get () {
        return this.map(m => _.pair.get(m));
      }
    },
    setUpper: {
      configurable: true,
      value (v) {
        return this.$(t => _.upper.set(t, v)).$(t => _.lower.set(v, t));
      }
    },
    setLower: {
      configurable: true,
      value (v) {
        return this.$(t => _.lower.set(t, v)).$(t => _.upper.set(v, t));
      }
    },
    upper: {
      configurable: true,
      get () {
        return this.map(t => _.upper.get(t));
      }
    },
    lower: {
      configurable: true,
      get () {
        return this.map(t => _.lower.get(t));
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
        return this.map(m => Object.create(_(m).by.from._, o));
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
        return this.$(t => _(t).entries.$(i => i.forEach(([k, v]) => f(k, v))));
      }
    },
    list: {
      configurable: true,
      get () {
        return this.bind(o => _(o).cast(this.keys["@"].filter(
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
        return this.bind(m => _(m.prototype || Object.getPrototypeOf(m)));
      }
    },
    affix: {
      configurable: true,
      value (...o) {
        return this.$(m => _(m).from.draw(...o));
      }
    },
    annex: {
      configurable: true,
      value (o) {
        return this.$(m => _(m).from.define(o));
      }
    },
    fork: {
      configurable: true,
      value (f) {
        return this.bind(
          m => _(f)
          .draw({prototype: _(m).from.create({
            constructor: {
              configurable: true,
              writable: true,
              enumerable: false,
              value: f
            }
          }).draw(f.prototype)._})
        );
      }
    },
    hybrid: {
      configurable: true,
      value (o) {
        return this.bind(
          m => _(m).draw({prototype: _(m).from.from.create({
            constructor: {
              configurable: true,
              writable: true,
              enumerable: false,
              value: _(m).from.by._
            }
          }).draw(o, _(m).from._)._})
        );
      }
    },
    part: {
      configurable: true,
      value (...v) {
        return _(v).fulfill
        ? this.map(f => f(...v))
        : (...vv) => this.part(...v.adapt(...vv));
      }
    },
    cache: {
      configurable: true,
      value (...v) {
        return this.cached === undefined
        ? _(this).draw({cached: this.map(f => f(...v))})._.cached
        : this.cached;
      }
    },
    recache: {
      configurable: true,
      value (...v) {
        return _(this).draw({cached: undefined})._.cache(...v);
      }
    }
  });

  _(_).draw({
    pair: new Map(),
    upper: new Map(),
    lower: new Map(),
    version: "losand@0.3.5",
    lib: "losand",
    get _ () {
      return void 0;
    }
  });

  _(Array).annex({
    each: {
      configurable: true,
      get () {
        return this.forEach;
      }
    },
    aMap: {
      configurable: true,
      value (a) {
        return Array.prototype.concat.call(
          [],
          ...(
            this.reduce((p, c) => c.constructor === Function || p, false)
            ? this
            : a
          )
        .map(
          f => (
            this.reduce((p, c) => c.constructor === Function || p, false)
            ? a.map(f)
            : this.map(f)
          )
        ));
      }
    },
    adapt: {
      configurable: true,
      value (...a) {
        return this.map(v => !(v === undefined || v === null) ? v : a.shift());
      }
    },
    adaptRight: {
      configurable: true,
      value (...a) {
        return this.adapt(...a.reverse());
      }
    }
  });

  _(String).annex({
    json: {
      configurable: true,
      get () {
        try {
          return _(JSON.parse(this));
        } catch (e) {
          return _(this);
        }
      }
    }
  });

  _(this).is(Object).$(t => _(_).annex({
    on: {
      configurable: true,
      value (d) {
        _(d).give(this["@"].on.bind(this["@"]));
        return this;
      }
    },
    once: {
      configurable: true,
      value (d) {
        _(d).give(this["@"].once.bind(this["@"]));
        return this;
      }
    }
  }));

  _(this).by._ === Object ? module.exports = _ : this._ = _;
})();
