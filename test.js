
const a = { num: 1 };
const k = x => _({ num: x.num + 5 });
const h = x => _({ num: x.num * x.num });
const m = x => _(x); // create monad without using 'of' method

const equal = (m1, m2) => m1.v.num === m2.v.num;

/**
 * 1) Left Identity
 * return a >>= k  =  k a
 */
const left1  = _(a).bind(k);
const right1 = k(a);
console.log(`First law: ${ equal(left1, right1) ? 'ok' : 'fail' }`);

/**
 * 2) Right Identity
 * m >>= return  =  m
 */
const left2  = m(a).bind(_);
const right2 = m(a);
console.log(`Second law: ${ equal(left2, right2) ? 'ok' : 'fail' }`);

/**
 * 3) Associativity
 * m >>= (\x -> k x >>= h)  =  (m >>= k) >>= h
 */
const left3 = m(a).bind(x => k(x).bind(h));
const right3 = m(a).bind(k).bind(h);
console.log(`Third law: ${ equal(left3, right3) ? 'ok' : 'fail' }`);
