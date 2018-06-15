/*
    global
        _
        location
        Option
        ul
        ol
        li
        EventTarget
*/

(() => {
    let $ = function (n) {
        return _(
            (n.tagName !== undefined && $[n.tagName]) ?
            $[n.tagName].prototype :
            $.prototype
        )
        .create({
            n: {
                configurable: true,
                writable: true,
                value: n
            }
        })._;
    };

    $.$  = s => $(document.createElement(s));
    $._  = s => $(document.querySelector(s));
    $.__ = s => $(document.querySelectorAll(s));

    _($.prototype).define({
        f: {
            configurable: true,
            value (f, ...v) {
                f(this.n, ...v);
                return this;
            }
        },
        _: {
            configurable: true,
            value (o) {
                return this.f($ => _(o)
                    .draw(o["#"] !== undefined ? this["#"](o) : {})
                    .draw(o["."] !== undefined ? this["."](o) : {})
                    .draw(o.css  !== undefined ? this.css(o)  : {})
                    .$(_o => {
                        _o.$ !== undefined && this.$(...o.$);
                        _o.on !== undefined && this.on(_o.on);
                        delete _o["#"];
                        delete _o["."];
                        delete _o.$;
                        delete _o.on;
                        return _o;
                    })
                    .give($.setAttribute.bind($))
                );
            }
        },
        css: {
            configurable: true,
            value (o) {
                _(this.n.style).draw(o);
                o = void 0;
                return this;
            }
        },
        "#": {
            configurable: true,
            value (o) {
                return {id: o["#"]};
            }
        },
        ".": {
            configurable: true,
            value (o) {
                return {"class": o["."]};
            }
        },
        on: {
            configurable: true,
            value (d, ...a) {
                a.length !== 0 ? a.forEach(v => this.n.on.call(this.n, v, d)) : _(d).keys._.forEach(k => this.n.on.call(this.n, k, d));
                return this;
            }
        },
        off: {
            configurable: true,
            value (d, ...a) {
                a.length !== 0 ? a.forEach(v => this.n.off.call(this.n, v, d)) : _(d).keys._.forEach(k => this.n.off.call(this.n, k, d));
                return this;
            }
        },
        $: {
            configurable: true,
            value (...n) {
                (n[0] !== null ? (
                    n === undefined ?
                    void 0 :
                    this.n.append.call(this.n, ...n.map(v => v instanceof $ ? v.n : v))
                ) :
                this.n.remove.call(this.n));
                return this;
            }
        },
        pick: {
            configurable: true,
            get () {
                return (
                    this.n.children.length > 1 ?
                    $(this.n.children) :
                    $(this.n.children[0])
                );
            }
        },
        each: {
            configurable: true,
            value (f, ...v) {
                _(this.n.children).list._.forEach(vv => f($(vv), ...v));
                return this;
            }
        },
        now: {
            configurable: true,
            get () {
                return this.n.innerText;
            },
            set (v) {
                return this.n.innerText = v;
            }
        }
    });

    $.TABLE = function () {};
    $.TABLE.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.TABLE
        },
        $: {
            configurable: true,
            value (n) {
                n.each(v => $(this.n.insertRow.call(this.n)).$(v));
                return this;
            }
        },
        cell: {
            configurable: true,
            get () {
                return new Proxy(this.n.rows, {
                    get (r, y) {
                        return new Proxy(r[y], {
                            get (c, x) {
                                return $(c[x]);
                            }
                        });
                    }
                });
            }
        },
        cols: {
            get () {
                return new Proxy ([], {
                    get (t, k) {
                        Array.from(this.n.rows).forEach(r => t.push($(r.n.cells[k])));
                        return t;
                    }
                });
            }
        },
        each: {
            configurable: true,
            value (f, ...v) {
                return $(this.n.rows).each(f);
            }
        }
    })._;

    $.TR = function () {};
    $.TR.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.TR
        },
        $: {
            configurable: true,
            value (n) {
                n.each(v => $(this.n.insertCell.call(this.n)).$(v));
                return this;
            }
        },
        each: {
            configurable: true,
            value (f, ...v) {
                return $(this.n.cells).each(f);
            }
        }
    })._;

    $.TD = function () {};
    $.TD.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.TD
        },
        each: {
            configurable: true,
            value (f, ...v) {
                return f(this.n.children, ...v);
            }
        }
    })._;

    $.SELECT = function () {};
    $.SELECT.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.SELECT
        },
        $: {
            configurable: true,
            value (n) {
                (n.constructor = Object ?
                    _(n).keys._.map(k => new Option(k, n[k])) :
                    n.map(v => v.constructor === Option ? v : new Option(v, v))
                ).forEach(v => this.n.options.add.call(this.n, v));
                return this;
            }
        },
        now: {
            configurable: true,
            get () {
                return this.n.value.json;
            },
            set (v) {
                this.n.value = v;
                v = void 0;
            }
        }
    })._;

    $.UL = function () {};
    $.UL.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.UL
        },
        $: {
            configurable: true,
            value (a) {
                this.n.append.call(this.n, ...a.map(v => v.constructor === Array ? ul.$(v) : li.$(v)));
                return this.n;
            }
        }
    })._;

    $.OL = function () {};
    $.OL.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.OL
        },
        $: {
            configurable: true,
            value (a) {
                this.n.append.call(this.n, ...a.map(v => v.constructor === Array ? ol.$(v) : li.$(v)));
                return this.n;
            }
        }
    })._;

    $.INPUT = function () {};
    $.INPUT.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.INPUT
        },
        now: {
            configurable: true,
            get () {
                return (
                    (this.n.type === "checkbox" || this.n.type === "radio") ?
                    this.n.checked :
                    this.n.value.json
                );
            },
            set (v) {
                (this.n.type === "checkbox" || this.n.type === "radio") ?
                this.n.checked = v :
                this.n.value = v;
                v = void 0;
            }
        }
    })._;

    $.TEXTAREA = function () {};
    $.TEXTAREA.prototype = _($.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: $.TEXTAREA
        },
        now: {
            configurable: true,
            get () {
                return this.n.value;
            },
            set (v) {
                this.n.value = v;
                v = void 0;
            }
        }
    })._;

    _(EventTarget.prototype).define({
        on: {
            configurable: true,
            get () {
                return this.addEventListener;
            }
        },
        off: {
            configurable: true,
            get () {
                return this.removeEventListener;
            }
        }
    });

    this === window && _(Object.prototype).define({
        handleEvent: {
            configurable: true,
            writable: true,
            value(e) {
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

    this === window && _(window)
    .draw({
        get html () {
            return document.documentElement;
        },
        get head () {
            return $(document.head);
        },
        get body () {
            return $(document.body);
        },
        env: {
            get https () {
                return location.https;
            },
            get here () {
                return location.hostname;
            },
            get port () {
                return location.port;
            },
            get path () {
                return location.pathname;
            }
        }
    })
    .define({
        article:    {get: () => $(document.createElement("article"))},
        div:        {get: () => $(document.createElement("div"))},
        section:    {get: () => $(document.createElement("section"))},
        nav:        {get: () => $(document.createElement("nav"))},
        aside:      {get: () => $(document.createElement("aside"))},
        header:     {get: () => $(document.createElement("header"))},
        footer:     {get: () => $(document.createElement("footer"))},
        h1:         {get: () => $(document.createElement("h1"))},
        h2:         {get: () => $(document.createElement("h2"))},
        h3:         {get: () => $(document.createElement("h3"))},
        h4:         {get: () => $(document.createElement("h4"))},
        h5:         {get: () => $(document.createElement("h5"))},
        h6:         {get: () => $(document.createElement("h6"))},
        p:          {get: () => $(document.createElement("p"))},
        br:         {get: () => $(document.createElement("br"))},
        table:      {get: () => $(document.createElement("table"))},
        ul:         {get: () => $(document.createElement("ul"))},
        ol:         {get: () => $(document.createElement("ol"))},
        li:         {get: () => $(document.createElement("li"))},
        dl:         {get: () => $(document.createElement("dl"))},
        dt:         {get: () => $(document.createElement("dt"))},
        dd:         {get: () => $(document.createElement("dd"))},
        form:       {get: () => $(document.createElement("form"))},
        label:      {get: () => $(document.createElement("label"))},
        input:      {get: () => $(document.createElement("input"))},
        checkbox:   {get: () => $(document.createElement("input")._({type: "checkbox"}))},
        text:       {get: () => $(document.createElement("input")._({type: "text"}))},
        radio:      {value: (n) => $(document.createElement("input")._({type: "radio", name: n}))},
        textarea:   {get: () => $(document.createElement("textarea"))},
        button:     {get: () => $(document.createElement("button"))},
        img:        {get: () => $(document.createElement("img"))},
        area:       {get: () => $(document.createElement("area"))},
        map:        {get: () => $(document.createElement("map"))},
        iframe:     {get: () => $(document.createElement("iframe"))},
        select:     {get: () => $(document.createElement("select"))},
        a:          {get: () => $(document.createElement("a"))},
        em:         {get: () => $(document.createElement("em"))},
        strong:     {get: () => $(document.createElement("strong"))},
        span:       {get: () => $(document.createElement("span"))}
    });

    this.$ = $;
})();