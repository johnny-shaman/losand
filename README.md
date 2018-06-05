# losand
## losand is a monad imprementation on any Javascript

## Usage

This library's public folder can be determining html and misc folder

### node
~~~javascript
    let _ = require("losand");
~~~

### worker

ex. inside public folder's subfolder
~~~javascript
    importScripts("../lib/");
~~~

### html

ex. inside public folder's subfolder
~~~javascript
    <script src="https://cdn.jsdelivr.net/npm/losand/dist/losand.js">
    <script src="https://cdn.jsdelivr.net/npm/losand/dist/dsand.js">
~~~

~~~javascript
    //join
    _({a: 1}).join.a === 1;
    _({a: 1})._.a === 1;

    //map f(t1, t2)
    const t1 = {a: 1};
    const t2 = {b: 2};
    
    _(t1).map(Object.assign, t2)._ === t1;
    t1.b === 2;

    //fit f(t2, t1)
    _(t1).fit(Object.assign, t2)._ === t2;
    t2.a === 1


    /*  Monad Rows  */

    const a = {a: 1};
    const k = x => _({a: x.a + 5});
    const h = x => _({a: x.a * x.a});
    const m = x => _(x);


    /*
    **  Left Identity
    */
    
    //  map <- bind
    _(a).bind(k)._.a === k(a)._.a
    //  fit <- link
    _(a).link(k)._.a === k(a)._.a


    /*
    **  Right Identity
    */

    //  map <- bind
    m(a).bind(_)._.a === m(a)._.a
    //  fit <- link
    m(a).link(_)._.a === m(a)._.a


    /*
    **  Associativity
    */

    //  map <- bind
    m(a).bind(x => k(x).bind(h))._.a === m(a).bind(k).bind(h)._.a
    //  fit <- link
    m(a).link(x => k(x).link(h))._.a === m(a).link(k).link(h)._.a


    // $ methods Chainable method
    // ex1.
    _({
        b: 0,
        add (v) {this.b += v}
    })
    .$($ => $.add(5))
    .$($ => $.add(5))
    ._.b === 10
    // ex2. (prototype chain's method can work)
    _(
    	Object.create({
    		add (v) {this.b += v}
    	},{
    		b:{
    			writable: true,
    			value: 0
    		}
    	})
    )
    .$($ => $.add(5))
    .$($ => $.add(5))
    ._.b === 10

    _()

    it(
        "$$ have been chainable IO",
        () => expect(
            _(b(5))
            .$$((v, $) => $.adder(v), 5)
            .$$((v, $) => $.adder(v), 5)
            ._.b
        ).toBe(
            5
        )
    );

    it(
        ".keys get wrapped Object's keys Array",
        () => expect(
            _(a).keys._[0]
        ).toBe(
            "a"
        )
    );

    it(
        ".vals get wrapped Object's values Array",
        () => expect(
            _(a).vals._[0]
        ).toBe(
            1
        )
    );

    it(
        ".draw is wrapped Object assign from argumentate Object",
        () => expect(
            _(a).draw(b(2))._
        ).toBe(
            a
        )
    );

    it(
        ".drop is wrapped Object assign to argumentate Object",
        () => expect(
            _(b(5)).drop(a)._
        ).toBe(
            a
        )
    );

    it(
        ".define is wrapped Object doing defineProperties",
        () => expect(
            _(b(5)).define({
                defined: {
                    configurable: true,
                    value: 123
                }
            })._.defined
        ).toBe(
            123
        )
    );

    it(
        ".create is create a new Object inherit on wrapped Object ",
        () => expect(
            Object.getPrototypeOf(_(a).create({})._)
        ).toBe(
            a
        )
    );

    it(
        ".folk is create a new Object inherit on wrapped Object's ParentObject ",
        () => expect(
            _(a).folk({})._.constructor.prototype
        ).toBe(
            a.constructor.prototype
        )
    );

    it(
        ".give is a iterator of wrapped Object to apply on argumentate function",
        () => expect(
            (() => {
                _({a : 1}).give(qr);
                return rs.a;
            })()
        ).toBe(
            1
        )
    );

    it(
        ".json get's wrapped Object's JSONString",
        () => expect(
            _(a).json
        ).toBe(
            JSON.stringify(a)
        )
    );

    it(
        "_.none().join return undefined",
        () => expect(
            _.none({}).join
        ).toBe(
            undefined
        )
    );

    it(
        "_.none()._ return undefined",
        () => expect(
            _.none({})._
        ).toBe(
            undefined
        )
    );

    it(
        "_.none({}).map return _.none({}) and isn't to do any more",
        () => expect(
            _.none({}).map(k).constructor
        ).toBe(
            _.none
        )
    );

    it(
        "Array.prototype.each === Array.prototype.forEach",
        () => expect(
            ary.each
        ).toBe(
            ary.forEach
        )
    );

    it(
        "String.prototype.json get parsed after this value",
        () => expect(
            _(a).json.json._.a
        ).toBe(
            1
        )
    );
~~~
