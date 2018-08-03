describe("test of losand", function () {
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
    "join on null",
    () => expect(
      _(null).join
    ).toBe(
      null
    )
  );

  it(
    "join on undefined",
    () => expect(
      _(undefined).join
    ).toBe(
      undefined
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
    "map is fmap (liftM) on null",
    () => expect(
      _(null).map(Object.assign, a)._
    ).toBe(
      null
    )
  );

  it(
    "map is fmap (liftM) on undefined",
    () => expect(
      _(undefined).map(Object.assign, a)._
    ).toBe(
      undefined
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
    "fit is Hold IO just function's on null",
    () => expect(
      _(null).fit(Object.assign, c)._
    ).toBe(
      null
    )
  );

  it(
    "fit is Hold IO just function's on undefined",
    () => expect(
      _(undefined).fit(Object.assign, c)._
    ).toBe(
      undefined
    )
  );

  it(
    "_ is join",
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
    "$ is chainable method on undefined",
    () => expect(
      _(undefined)
      .$(b)
      .$(b)
      ._
    ).toBe(
      undefined
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
    "$$ have been chainable IO on undefined",
    () => expect(
      _(undefined)
      .$$(b)
      .$$(b)
      ._
    ).toBe(
      undefined
    )
  );

  it(
    ".is is type matching of value's constructor return either _ or undefined",
    () => expect(
      _(a).is("Object")._
    ).toBe(
      a
    )
  );

  it(
    ".is is type matching of value's constructor return either _ or undefined",
    () => expect(
      _(a).is("Array")._
    ).toBe(
      undefined
    )
  );

  it(
    ".isnt is type dismatching of value's constructor return either _ or undefined",
    () => expect(
      _(a).isnt("Object")._
    ).toBe(
      undefined
    )
  );

  it(
    ".is is type dismatching of value's constructor return either _ or undefined",
    () => expect(
      _(a).isnt("Array")._
    ).toBe(
      a
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
    ".cast is wrapped Object assign to argumentate Object",
    () => expect(
      _({b: 2}).cast(a)._
    ).toBe(
      a
    )
  );

  it(
    ".hold on arguments keys return copied new one",
    () => expect(
      _({a: 13, b: 24, c: 51, d: 40}).hold("a", "c").vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      13 + 51
    )
  );

  it(
    ".crop out arguments keys return copied new one",
    () => expect(
      _({a: 13, b: 24, c: 51, d: 39}).crop("a", "c").vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      24 + 39
    )
  );

  it(
    ".pick up keys return copied new one",
    () => expect(
      _(["a", "c"]).pick({a: 13, b: 24, c: 51, d: 40}).vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      13 + 51
    )
  );

  it(
    ".drop out arguments keys return copied new one",
    () => expect(
      _(["a", "c"]).drop({a: 13, b: 24, c: 51, d: 39}).vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      24 + 39
    )
  );

  it(
    ".exist on arguments keys return copied new one",
    () => expect(
      _({a: 13, b: 24, c: 51, d: 39}).exist("a", "c", "f")._.join()
    ).toBe(
      "a,c"
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
    ".other is create a new Object inherit on wrapped Object's ParentObject",
    () => expect(
      _(a).other({})._.constructor.prototype
    ).toBe(
      a.constructor.prototype
    )
  );

  it(
    ".depend is create a new Object inherit on argumentate Object ",
    () => expect(
      Object.getPrototypeOf(_({}).depend(a)._)
    ).toBe(
      a
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
    ".from is returning wrapped constructor's prototype",
    () => expect(
      _(EETest).from._
    ).toBe(
      EETest.prototype
    )
  );

  it(
    ".from is returning wrapped constructor's prototype",
    () => expect(
      _(EETest).from._
    ).toBe(
      EETest.prototype
    )
  );

  it(
    ".relate is wrapped constructor's prototype's assigning argumentate object",
    () => expect(
      _(EETest).relate({
        related : 0
      }).from._.related
    ).toBe(
      0
    )
  );

  it(
    ".descript is wrapped constructor's prototype's defining argumentate description",
    () => expect(
      _(EETest).descript({
        descripted : {
          configurable: true,
          value: 564
        }
      }).from._.descripted
    ).toBe(
      564
    )
  );

  it(
    ".fork is argumentate constructor inherit on wrapped constructor's prototype's defining description",
    () => expect(
      Object.getPrototypeOf(_(EETest).fork(new Function()).from._)
    ).toBe(
      EETest.prototype
    )
  );

  it(
    ".fork test #2",
    () => expect(
      _(EETest).fork(
        _(new Function()).relate({
          childStaticValue: 283
        })._
      ).from._.childStaticValue
    ).toBe(
      283
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
  it(
    "String.prototype.json get parsed after this value",
    () => expect(
      "test".json
    ).toBe(
      "test"
    )
  );
});