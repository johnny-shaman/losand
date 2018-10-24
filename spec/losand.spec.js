describe("test of losand", function () {
  const _ = require("../losand.min.js");
  const EventEmitter = require("events").EventEmitter;

  const a = {a: 1};

  const b = (v) => ({b: v});

  const c = b(15);
  const k = x => _({a: x.a + 5});
  const h = x => _({a: x.a * x.a});
  const m = x => _(x);

  const ary = [1, 3, 2];
  const aryf = [v => v += 2, v => v *= 2, v => v -= 2];
  const rs = {a : 0};
  const qr = (k, v) => rs.a = v;

  const nulledAry0 = [null,2,3];
  const nulledAry1 = [1,null,3];
  const nulledAry2 = [1,2,null];
  const voidAry0 = [_._,2,3];
  const voidAry1 = [1,_._,3];
  const voidAry2 = [1,2,_._];

  const nulledObj0 = {a: null, b: 2, c: 3};
  const nulledObj1 = {a: 1, b: null, c: 3};
  const nulledObj2 = {a: 1, b: 2, c: null};
  const voidObj0 = {a: _._, b: 2, c: 3};
  const voidObj1 = {a: 1, b: _._, c: 3};
  const voidObj2 = {a: 1, b: 2, c: _._};

  const fulfillObj = {a: 0, b: true, c: false};
  const fulfillAry = [0, true, false];
  const toposObj = {a: {b: {c: 3}}};

  const triargF = (x, y, z) => (x + y) * z;

  const EETest = function () {
    EventEmitter.call(this);
  };

  EETest.prototype = Object.create(EventEmitter.prototype, {
    constructor: {
      configurable: true,
      writable: true,
      value: EETest
    }
  });

  const eeTest = _(new EETest());

  it("testing b", () => expect(b(10).b).toBe(10));
  it("_._", () => expect(_._).toBe(undefined));
  
  const _beenTest = _(function (v) {
    this.v = v;
  })
  .affix({
    a (v) {
      this.v += v;
      return this.v;
    },
    b (v) {
      this.v += v;
      return this;
    },
    c (v) {
      this.v += v;
    },
  })._;

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
      _(_._).join
    ).toBe(
      _._
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
      _(_._).map(Object.assign, a)._
    ).toBe(
      _._
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
      _(_._).fit(Object.assign, c)._
    ).toBe(
      _._
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
      _(_._)
      .$(b)
      .$(b)
      ._
    ).toBe(
      _._
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
      _(_._)
      .$$(b)
      .$$(b)
      ._
    ).toBe(
      _._
    )
  );

  it(
    ".by return wrapped Object's constructor",
    () => expect(
      _(a).by._
    ).toBe(
      Object
    )
  );

  it(
    ".is test case and truely return just",
    () => expect(
      _(a).is(Object)._
    ).toBe(
      a
    )
  );

  it(
    ".is test case and truely return just",
    () => expect(
      _(a).is(Array)._
    ).toBe(
      _._
    )
  );

  it(
    ".isnt test case and falsy return just",
    () => expect(
      _(a).isnt(Object)._
    ).toBe(
      _._
    )
  );

  it(
    ".isnt test case and falsy return just",
    () => expect(
      _(a).isnt(Array)._
    ).toBe(
      a
    )
  );

  it(
    ".fullen test all and truely return just",
    () => {
      expect(
        _(nulledAry0).fullen
      ).toBe(
        false
      );
      expect(
        _(nulledAry1).fullen
      ).toBe(
        false
      );
      expect(
        _(nulledAry2).fullen
      ).toBe(
        false
      );
      expect(
        _(voidAry0).fullen
      ).toBe(
        false
      );
      expect(
        _(voidAry1).fullen
      ).toBe(
        false
      );
      expect(
        _(voidAry2).fullen
      ).toBe(
        false
      );
      expect(
        _(nulledObj0).fullen
      ).toBe(
        false
      );
      expect(
        _(nulledObj1).fullen
      ).toBe(
        false
      );
      expect(
        _(nulledObj2).fullen
      ).toBe(
        false
      );
      expect(
        _(voidObj0).fullen
      ).toBe(
        false
      );
      expect(
        _(voidObj1).fullen
      ).toBe(
        false
      );
      expect(
        _(voidObj2).fullen
      ).toBe(
        false
      );
      expect(
        _(fulfillAry).fullen
      ).toBe(
        true
      );
      expect(
        _(fulfillObj).fullen
      ).toBe(
        true
      );
    }
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
    ".entries get wrapped Object's entries Array",
    () => expect(
      _(a).entries._[0][0]
    ).toBe(
      "a"
    )
  );

  it(
    ".get get Object's property's property's ... ",
    () =>{
      expect(
        _(toposObj).get("a", "b", "c")._
      ).toBe(
        3
      );
      expect(
        _(toposObj).get("a", "c", "b")._
      ).toBe(
        _._
      );
    }
  );

  it(
    ".set set Object's property's property's ... ",
    () => {
      _(toposObj).set(8, "a", "b", "c");
      _(toposObj).set(4, "a", "c", "b");
      expect(
        toposObj.a.b.c
      ).toBe(
        8
      );
      expect(
        toposObj.a.c.b
      ).toBe(
        4
      );
    }
  );

  it(
    ".been wraped Object's method chaining",
    () => {
      expect(
        _(new _beenTest(3)).been.a(3).b(3).c(3)._.v
      ).toBe(
        12
      );
      expect(
        _(new _beenTest(3)).been.d(3, "e").to._.d.e
      ).toBe(
        3
      );
      expect(
        _(null).been.d(3, "e").to._
      ).toBe(
        null
      );
    }
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
      _({a: 13, b: 24, c: 51, d: 40}).hold("a", "c", "f").vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      13 + 51
    )
  );

  it(
    ".crop out arguments keys return copied new one",
    () => expect(
      _({a: 13, b: 24, c: 51, d: 39}).crop("a", "c", "f").vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      24 + 39
    )
  );

  it(
    ".pick up keys return copied new one",
    () => expect(
      _(["a", "c", "f"]).pick({a: 13, b: 24, c: 51, d: 40}).vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      13 + 51
    )
  );

  it(
    ".drop out arguments keys return copied new one",
    () => expect(
      _(["a", "c", "f"]).drop({a: 13, b: 24, c: 51, d: 39}).vals._.reduce((p, c) => p + c, 0)
    ).toBe(
      24 + 39
    )
  );

  it(
    ".valid get valid Object on Wraped Object",
    () => expect(
      _({a: _._, b: null, c: false}).valid.keys._
    ).toEqual(
      ["c"]
    )
  );

  it(
    ".turn get turn overed wraped Object's key <-> value",
    () => expect(
      _({a: 13, b: 24, c: 51, d: 39}).turn._[24]
    ).toBe(
      "b"
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
    ".relate and swap is wrapped Object pairing argumentate Object #1",
    () => expect(
      _(b).relate(a).swap._
    ).toBe(
      a
    )
  );

  it(
    ".relate and swap is wrapped Object pairing argumentate Object #2",
    () => expect(
      _(b).relate(a).swap.swap._
    ).toBe(
      b
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
      Object.getPrototypeOf(_({b: 5}).depend(a)._)
    ).toBe(
      a
    )
  );

  it(
    ".depend is create a new Object inherit on argumentate Object ",
    () => expect(
      _({b: 5}).depend(a)._.b
    ).toBe(
      5
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
    ".from is returning wrapped constructor's prototype or  wrapped Object's prototype",
    () => expect(
      _(EETest).from._
    ).toBe(
      EETest.prototype
    )
  );

  it(
    ".from is returning wrapped constructor's prototype or  wrapped Object's prototype",
    () => expect(
      _([]).from._
    ).toBe(
      Array.prototype
    )
  );

  it(
    ".affix is wrapped constructor's prototype's assigning argumentate object",
    () => expect(
      _(new Function).affix({
        c : 328
      }).from._.c
    ).toBe(
      328
    )
  );

  it(
    ".annex is wrapped constructor's prototype's defining argumentate description",
    () => expect(
      _(new Function).annex({
        d : {
          configurable: true,
          value: 564
        }
      }).from._.d
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
      _(new Function()).fork(
        _(new Function()).affix({
          childStaticValue: 283
        })._
      ).from._.childStaticValue
    ).toBe(
      283
    )
  );

  it(
    ".hybrid is inserting to Wrapped Object's Prototype chain",
    () => {
      let t = _(EETest).fork(
        _(new Function()).hybrid({
          childStaticValue: 283
        })._
      );
      expect(
        t.from._.childStaticValue
      ).toBe(
        283
      );
      expect(
        t.from.from._
      ).toBe(
        EETest.prototype
      );
    }
  );

  it(
    ".part is carrying function",
    () => { 
      expect(
        _(triargF).part(_._, 4, 2)(1)._
      ).toBe(
        10
      );
      expect(
        _(triargF).part(_._, null, 2)(1)(4)._
      ).toBe(
        10
      );
      expect(
        _(triargF).part(null, 4, _._)(1)(2)._
      ).toBe(
        10
      );
    }
  );

  it(
    ".done & .redo presence delay evaluation",
    () => {
      const _triargF = _(triargF);
      _triargF.done(1, 4, 2);
      _triargF.done(3, 5, 7);
      _triargF.done(9, 11, 13);
      expect(_triargF.done()._).toBe(10);
      _triargF.redo(4, 6, 2);
      _triargF.done(3, 5, 7);
      _triargF.done(9, 11, 13);
      expect(_triargF.done()._).toBe(20);
    }
  );

  it(
    ".apply to apply function's chain on wrapped value",
    () => expect(_(10).apply(v => v + 10, v => v * 3)._).toBe(60)
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
    "Array.prototype.foldR === Array.prototype.reduceRight",
    () => expect(
      ary.foldR
    ).toBe(
      ary.reduceRight
    )
  );

  it(
    "Array.prototype.aMap is ApplicativeMap method on Array #1",
    () => expect(
      ary.aMap(aryf)
    ).toEqual(
      [3, 5, 4, 2, 6, 4, -1, 1, 0]
    )
  );

  it(
    "Array.prototype.aMap is ApplicativeMap method on Array #2",
    () => expect(
      aryf.aMap(ary)
    ).toEqual(
      [3, 5, 4, 2, 6, 4, -1, 1, 0]
    )
  );

  it(
    "Array.prototype.adapt is ApplicativeMap method on Array #1",
    () => expect(
      [0,1, _._,3, _._].adapt(2, 5)
    ).toEqual(
      [0, 1, 2, 3, 5]
    )
  );

  it(
    "Array.prototype.adapt is ApplicativeMap method on Array #1",
    () => expect(
      [0,1, null,3, null].adapt(2, 5)
    ).toEqual(
      [0, 1, 2, 3, 5]
    )
  );

  it(
    "Array.prototype.adaptRight is ApplicativeMap method on Array #1",
    () => expect(
      [0,1, _._,3, _._].adaptRight(2, 5)
    ).toEqual(
      [0, 1, 5, 3, 2]
    )
  );

  it(
    "Array.prototype.adaptRight is ApplicativeMap method on Array #1",
    () => expect(
      [0,1, null,3, null].adaptRight(2, 5)
    ).toEqual(
      [0, 1, 5, 3, 2]
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
      "test".json._
    ).toBe(
      "test"
    )
  );
});
