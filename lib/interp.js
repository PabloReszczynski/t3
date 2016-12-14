const Expr = require('../lib/parser.js').Expr;
const pun = require('pun').pun;

const Env = pun.ADT({
  mtEnv: [],
  anEnv: ['id', 'loc', 'env']
});

const extend = Env.anEnv

// lookup_x :: Expr.Id Env -> Val
const lookup_x = (x, env) => {
  let $ = pun.$;
  let _ = pun._;

  let f = pun.match(
    Env.mtEnv, () => {throw new Error("Error: Identificador libre! " + x)},
    Env.anEnv($, $, $), (id, loc, restoEnv) => {
      if (x === id.id)
        return loc
      else
        return lookup_x(x, restoEnv);
    },
    _, () => {throw new Error("not an env!");}
  );
  return f(env);
};

// set_env :: Expr.Id Val Env -> Env
const set_env = (id, loc, env) => {
  let $ = pun.$;
  let _ = pun._;


  let f = pun.match(
    Env.mtEnv, () => {throw new Error("Error: Identificador libre! " + id)},
    Env.anEnv($, $, $), (i, l, e) => {
      if (typeof i === 'object') i = i.id;
      if (id === i) {
        return Env.anEnv(i, loc, e);
      }
      else {
        let newEnv = set_env(id, loc, e);
        return Env.anEnv(i, l, newEnv);
      }
    }
  );

  return f(env);
};

const prettifyEnv = (env) => {
  let $ = pun.$;
  let _ = pun._;

  if (env === undefined) return 'udef';

  let f = pun.match(
    Env.mtEnv, () => '()',
    Env.anEnv($, $, $), (id, loc, e) => '('+id+','+loc.id+') -> '+prettifyEnv(e),
    _, () => 'udef'
  );

  return f(env);
}

const Val = pun.ADT({
  NumV: ['n', 'env'],
});

// apOperacion :: (Integer -> Integer) -> NumV -> NumV -> NumV
const apOperacion = (op, n1, n2) => {
  return Val.NumV(op(n1.n, n2.n));
}

const zero = (n) => {
  let $ = pun.$;
  let _ = pun._;

  let f = pun.match(
    Val.NumV(0, $), () => true,
    pun._, ()          => false
  );

  return f(n);
}

// interp :: Expr Env -> Val
const interp = (expr, env) => {
  let $ = pun.$;
  let _ = pun._;

  let f = pun.match(
    // P1
    Expr.Num($), (n)                => Val.NumV(n, env),
    Expr.Sum($, $), (n1, n2)        => apOperacion((a, b) => a + b,
                                                   interp(n1, env),
                                                   interp(n2, env)),
    Expr.Sub($, $), (n1, n2)        => apOperacion((a, b) => a - b,
                                                   interp(n1, env),
                                                   interp(n2, env)),
    Expr.if0($, $, $), (n1, n2, n3) => {
      if (zero(interp(n1, env)))
        return interp(n2, env);
      else
        return interp(n3, env);
    },

    // P2
    Expr.Id($), (id)        => lookup_x(id, env),
    Expr.Fun($, $), (id, b) => (argVal) => {
      let newEnv = Env.anEnv(id, argVal, env);
      return interp(b, newEnv);
    },
    Expr.App($, $), (f, a)  => {
      let fun = interp(f, env);
      let arg = interp(a, env);
      return fun(arg);
    },

    //P3
    Expr.Seqn($, $), (e1, e2) => {
      let newEnv = interp(e1, env).env;
      return interp(e2, newEnv);
    },
    Expr.Set($, $), (id, val) => {
      let newVal = interp(val, env);
      let newEnv = set_env(id.id, newVal.n, env);
      newVal.env = newEnv;
      return newVal;
    },
    _, ()                     => {throw new Error("bad interpretation")}
  );

  return f(expr);
}

module.exports.interp = interp;
module.exports.Env = Env;
module.exports.set_env = set_env
module.exports.prettifyEnv = prettifyEnv;
module.exports.Val = Val;
