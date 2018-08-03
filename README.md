# \_(losand).\_
## \_(losand).\_ is a monad imprementation on any Javascript
[![Maintainability](https://api.codeclimate.com/v1/badges/bb24ccbb4103dec4837f/maintainability)](https://codeclimate.com/github/johnny-shaman/losand/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/bb24ccbb4103dec4837f/test_coverage)](https://codeclimate.com/github/johnny-shaman/losand/test_coverage)
[![Build Status](https://travis-ci.org/johnny-shaman/losand.svg?branch=master)](https://travis-ci.org/johnny-shaman/losand)
## Usage

### node
~~~bash
npm install losand
~~~

~~~javascript
const _ = require("losand")
~~~
### worker
ex. inside ./lib subfolder
~~~javascript
importScripts("./lib/losand.js")
~~~
### browser
~~~html
<script src="https://cdn.jsdelivr.net/npm/losand@0.2.8/losand.js"></script>
~~~

~~~javascript
//join
_({a: 1}).join.a === 1
_({a: 1})._.a === 1

//map f(t1, t2)
const t1 = {a: 1}
const t2 = {b: 2}

_(t1).map(Object.assign, t2)._ === t1
t1.b === 2

//fit f(t2, t1)
_(t1).fit(Object.assign, t2)._ === t2
t2.a === 1


/*  Monad Rows  */

const a = {a: 1}
const k = x => _({a: x.a + 5})
const h = x => _({a: x.a * x.a})
const m = x => _(x)


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

// cash
_(3).map(n => n += 5)._    // 8
_(3).map(n => n += 5).re._ // 3

_({b: 1}).map(o => o.b += 1)._    // 2
_({b: 1}).map(o => o.b += 1).re._ // {b: 2}

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

// $$ have been chainable IO
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
.$$((v, $) => $.add(v), 5)
.$$((v, $) => $.add(v), 5)
._.b === 10

//is check type and after return it
_({a: 1}).is("Object")._ // {a: 1}
_({a: 1}).is("Array")._ // undefined
_({a: 1}).is("Array").re._ // {a: 1}

//isnt mismatch type and after return it
_({a: 1}).isnt("Array")._ // {a: 1}
_({a: 1}).isnt("Object")._ // undefined
_({a: 1}).isnt("Object").re._ // {a: 1}

//keys
_({r: 128}).keys._[0] === "r"

//vals
_({r: 128}).vals._[0] === 128

//draw is wrapped Object assign from argumentate Object
_({a: 3}).draw({b: 5}).$($ => {
    $.a === 3 // {a: 3} is wrapped on having
    $.b === 5
    
})

//cast is wrapped Object assign to argumentate Object
_({a: 3}).cast({b: 5}).$($ => {
    $.a === 3 
    $.b === 5 // {b: 5} is wrapped on having
})

//hold on wrapped Object from arguments and other object have same inheritance
_({a: 13, b: 24, c: 51, d: 40}).hold("a", "c")._ // {a: 13, c: 51}

//crop out of wrapped Object from arguments and other object have same inheritance
_({a: 13, b: 24, c: 51, d: 40}).crop("a", "c")._ // {b: 24, d: 40}

//pick up wrapped Array to argument Object and other object have same inheritance
_(["a", "c"]).pick({a: 13, b: 24, c: 51, d: 40})._ // {a: 13, c: 51}

//drop out wrapped Array from argument Object and other object have same inheritance
_(["a", "c"]).drop({a: 13, b: 24, c: 51, d: 40})._ // {b: 24, d: 40}

//exist on wrapped Object's keys from arguments
_({a: 13, b: 24, c: 51, d: 40}).crop("a", "c", "f")._ // ["a", "c"]

//list 
_({2: 24, 0: 1, 1: 35}).list._[1] === 35

//define is Object.defineProperties on wrapped Object
_({a: 68}).define({
    defined: {
        configurable: true,
        value: 123
    }
})._.defined === 123

//create is create a new Object inherit on wrapped Object
Object.getPrototypeOf(
    _(a).create({})._ // Object.create(a, {})
) === a

_(a).other({})._.constructor.prototype === a.constructor.prototype

//depend is create a new Object inherit on argumentate Object
Object.getPrototypeOf(
    _({}).depend(a)._
) === a

//.give is a iterator of wrapped Object to apply on argumentate function
_({a : 1}).give((key, val) => {
    console.log(key + ": " + val)
})

_({a: 1}).json === JSON.stringify({a: 1})

//[0, 1, 2].each
[2, 3, 4].each((v, k) => console.log(k * v))

//String.prototype.json get _(parsed_object)
_({a: 3}).json.json._.a === 3

//.from map in prototype
_(Object).from._ === Object.prototype

//.relate write up prototype object on constructor
_(function () {}).relate({
    a : 3
}).from._.a === 3

//.relate define properties mapping prototype object on constructor
_(function () {}).descript({
    b : {
        configurable: true,
        value: 5
    }
}).from._.b === 5

//.fork is easy chaining and mixin on constructor
Object.getPrototypeOf(_(Array).fork(function(){
    Array.call(this);
}).from._) === Array.prototype;

~~~
## Event driven development
### Only node.js...
~~~javascript
const EETest = _(EventEmitter).fork(function () {
    EventEmitter.call(this)
})._

const eeTest = new EETest()

//addLitener
_(eeTest).on({
    a: 3,
    "get" () {
        this.a === 3 // true
        this.put() // can call it
    },
    "put": () => {},
    "post": () => {},
    "delete": () => {}
})

//addOnce
_(eeTest).once({
    b: 10,
    "get" () {
        this.b === 10 // true
        this.put() // can call it
    },
    "put": () => {},
    "post": () => {},
    "delete": () => {}
})
~~~
### Worker
~~~javascript
const eo = {
    "message" () {},
    "fetch" () {}
}
//addLitener
_(EventTarget).on(eo)
_(EventTarget).on(eo, "fetch")

//removeListener
_(EventTarget).off(eo)
_(EventTarget).off(eo, "fetch")
~~~