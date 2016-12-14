const Expr = require('../lib/parser.js').Expr;
const pun = require('pun').pun;

const Env = pun.ADT({
  mtEnv: [],
  anEnv: ['id', 'loc', 'env']
});

const extend = Env.anEnv

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
}

const Val = pun.ADT({
  NumV: ['n'],
  ClosureV: ['param', 'body', 'env'],
  refCloseV: ['param', 'body', 'env']
});

// apOperacion :: (Integer -> Integer) -> NumV -> NumV -> NumV
const apOperacion = (op, n1, n2) => {
  return Val.NumV(op(n1.n, n2.n));
}

const zero = (n) => {
 let f = pun.match(
    Val.NumV(0), () => true,
    pun._, ()       => false
  );

  return f(n);
}

// interp :: Expr Env -> Val
const interp = (expr, env) => {
  let $ = pun.$;
  let _ = pun._;

  let f = pun.match(
    // P1
    Expr.Num($), (n)                => Val.NumV(n),
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
    _, ()                   => {throw new Error("bad interpretation")}
  );

  return f(expr);
}

module.exports.interp = interp;
module.exports.Env = Env;
