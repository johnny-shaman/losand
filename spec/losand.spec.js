describe("test of is", function () {
    const _ = require("../losand.js");
    const EventEmitter = require("events").EventEmitter;
    
    const a = {a: 1};

    const b = (v) => ({b: v});

    const c = b(15);
    const k = x => _({a: x.a + 5});
    const h = x => _({a: x.a * x.a});
    const m = x => _(x);
    
    const ary = [];
    const rs = {a : 0};
    const qr = (k, v) => rs.a = v;

    const EETest = function () {
        EventEmitter.call(this);
    };

    EETest.prototype = _(EventEmitter.prototype).create({
        constructor: {
            configurable: true,
            writable: true,
            value: EETest
        }
    })._;

    const eeTest = _(new EETest());

    it("testing b", () => expect(b(10).b).toBe(10));

    it(
        "join",
        () => expect(
            _(a).join.a
        ).toBe(
            1
        )
    );

    it(
        "map is fmap (liftM)",
        () => expect(
            _(c).map(Object.assign, a)._
        ).toBe(
            c
        )
    );

    it(
        "fit is Hold IO just function's result",
        () => expect(
            _(a).fit(Object.assign, c)._
        ).toBe(
            c
        )
    );

    it(
        "_ i join",
        () => expect(
            _(a)._.a
        ).toBe(
            1
        )
    );

    it(
        "Left Identity (.bind test#1)",
        () => expect(
            _(a).bind(k)._.a
        ).toBe(
            k(a)._.a
        )
    );

    it(
        "Right Identity (.bind test#2)",
        () => expect(
            m(a).bind(_)._.a
        ).toBe(
            m(a)._.a
        )
    );

    it(
        "Associativity (.bind test#3)",
        () => expect(
            m(a).bind(x => k(x).bind(h))._.a
        ).toBe(
            m(a).bind(k).bind(h)._.a
        )
    );

    it(
        "Left Identity (.link test#1)",
        () => expect(
            _(a).link(k)._.a
        ).toBe(
            k(a)._.a
        )
    );

    it(
        "Right Identity (.link test#2)",
        () => expect(
            m(a).link(_)._.a
        ).toBe(
            m(a)._.a
        )
    );

    it(
        "Associativity (.link test#3)",
        () => expect(
            m(a).link(x => k(x).link(h))._.a
        ).toBe(
            m(a).link(k).link(h)._.a
        )
    );

    it(
        "$ is chainable method",
        () => expect(
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
            ._.b
        ).toBe(
            10
        )
    );

    it(
        "$$ have been chainable IO",
        () => expect(
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
            .$$($ => $.add(5))
            .$$($ => $.add(5))
            ._.b
        ).toBe(
            10
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
            _(a).draw({b : 2})._
        ).toBe(
            a
        )
    );

    it(
        ".drop is wrapped Object assign to argumentate Object",
        () => expect(
            _({b: 2}).drop(a)._
        ).toBe(
            a
        )
    );

    it(
        ".define is wrapped Object doing defineProperties",
        () => expect(
            _({b: 5}).define({
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
        ".list get's wrapped Array like Object's to Array",
        () => expect(
            _({0: 3, 1: 7, 2: 12, a: 0}).list._[2]
        ).toBe(
            12
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
        ".once",
        () => expect(
            eeTest.once({
                "put" (e) {return e}
            })._.emit("put")
        ).toBe(true)
    );

    it(
        ".on",
        () => expect(
            eeTest.on({
                "get" (e) {return e}
            })._.emit("get")
        ).toBe(true)
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

});