const sex = require('sexpression');
const pun = require('pun').pun;

/** Parser de s-expressions a lista recursiva de valores y nombres. */
const parse_sex = (str) => sex.parse(str.replace(/{/g, '(').replace(/}/g, ')'));

/**
 * <s-expr> ::= <num>
 *          | {+ <s-expr> <s-expr>}
 *          | {- <s-expr> <s-expr>}
 *          | {if0 <s-expr> <s-expr> <s-expr>}
 *          | {with {<id> <s-expr>} <s-expr>}
 *          | <id>
 *          | {fun {<id>} <s-expr>}
 *          | {<s-expr> <s-expr>}
 *          | {seqn <s-expr> <s-espr>}
 *          | {set <id> <s-expr>}
 */

/**
 * ADT de expresiones del lenguaje.
 * Aquí se especifica la gramática del lenguaje.
 */
const Expr = pun.ADT({
  // P1
  Num: ['n'],
  Sum: ['left', 'right'],
  Sub: ['left', 'right'],
  if0: ['cond', 'then', 'else'],

  //P2
  App: ['fun', 'arg'],
  Fun: ['fun_id', 'body'],
  Id: ['id'],

  //P3
  Seqn: ['expr1', 'expr2'],
  Set: ['set-id', 'val-expr']

});

/**
 * Dibuja una Expr de manera de ser más entendible.
 * Con propósitos de testeo y depuración.
 *
 * @param {Expr} expr
 * @returns {String}
 *
 * pp :: Expr -> String
 */
const pp = (expr) => {
  let $ = pun.$;
  let _ = pun._;

  let f = pun.match(
    Expr.Num($), (n)             => n + '',
    Expr.Sum($, $), (a, b)       => '('+pp(a) + '+' + pp(b)+')',
    Expr.Sub($, $), (a, b)       => '('+pp(a) + '-' + pp(b)+')',
    Expr.if0($, $, $), (c, t, e) => 'if0(' + pp(c) +
                                    ') {' + pp(t) +
                                    '} {' + pp(e) + '}',

    Expr.App($, $), (a, b)       => pp(a) + '(' + pp(b)  + ')',
    Expr.Fun($, $), (a, b)       => '(' + pp(a)  + '->' + pp(b)  + ')',
    Expr.Id($), (id)             => "'s",
    Expr.Seq($, $), (a, b)       => a + " " + b
  );

  return f(expr);
};

/**
 * Parser con manejo de excepciones. Cuando haya un error en el parseo de un
 * input, atrapa el error y tira uno de 'expresión inválida'.
 * Funciona como wrapper de parser y debe ser usado en vez de ese.
 *
 * @param {String} str - input del programa a parsear.
 * @param {Boolean} _DEBUG - (opcional) imprime información adicional.
 *
 * @returns {Expr} - Expresión parseada y lista para ser interpretada.
 *
 * parseWithException :: String -> Expr
 */
const parseWithException = (str, _DEBUG=false) => {
  try {
    return parse(str, _DEBUG);
  } catch (err) {
    throw new Error('error: expresion invalida ' + str);
  }
}

/**
 * Parser del intérprete.
 * Toma un string con la sintáxis establecida y devuelve una cadena de
 * expresiones recursivas con la gramática del lenguaje.
 *
 * @param {String} str - input del programa a parsear.
 * @param {Boolean} _DEBUG - (opcional) imprime información adicional.
 *
 * @returns {Expr} - Expresión parseada y lista para ser interpretada.
 *
 * parse :: String -> Expr
 */
const parse = (str, _DEBUG=false) => {
  if (typeof str === 'string') {
    str = parse_sex(str);
  }
  let $ = pun.$;
  let _ = pun._;

  if(_DEBUG) console.log(str)

  let f = pun.match(
    // P1
    $(Number), (n)                      => Expr.Num(n),
    [{name: '+'}, $, $], (n1, n2)       => Expr.Sum(parse(n1), parse(n2)),
    [{name: '-'}, $, $], (n1, n2)       => Expr.Sub(parse(n1), parse(n2)),
    [{name: 'if0'}, $, $, $], (c, t, e) => Expr.if0(parse(c),
                                                    parse(t),
                                                    parse(e)),
    [$(Number), $(Number)], ()          => {
      throw new Error('error: expresion invalida ' + str)
    },

    // P2
    {name: $(String)}, (s)              => Expr.Id(s),
    [{name: 'fun'}, [{name: $(String)}], $], (id, body)   => {
      return Expr.Fun(Expr.Id(id), parse(body));
    },
    [{name: 'with'}, [$, $], $], (id, ne, body)  => {
      return Expr.App(Expr.Fun(parse(id), parse(body)),
                      parse(ne));
    },
    [$, $], (a, b)                      => Expr.App(parse(a), parse(b)),

    // P3
    [{name: 'seqn'}, $, $], (e1, e2)    => Expr.Seqn(parse(e1), parse(e2)),
    [{name: 'set'}, {name: $(String)}, $], (id, e) =>
      Expr.Set(Expr.Id(id), parse(e)),
    _, ()                               => {throw new Error("bad syntax")}
  )

  return f(str);
}

module.exports.parse = parseWithException;
module.exports.Expr = Expr;
module.exports.pp = pp;
