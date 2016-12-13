const sex = require('sexpression');
const pun = require('pun').pun;

const parse_sex = (str) => sex.parse(str.replace(/{/g, '(').replace(/}/g, ')'));

// Me gustaria que se pueda hacer con tipos especificos
/* <s-expr> ::= <num>
 *          | {+ <s-expr> <s-expr>}
 *          | {- <s-expr> <s-expr>}
 *          | {if0 <s-expr> <s-expr> <s-expr>}
 */
const Expr = pun.ADT({
  Num: ['n'],
  Sum: ['left', 'right'],
  Sub: ['left', 'right'],
  if0: ['cond', 'then', 'else']
});

const parse = (str) => {
  if (typeof str === 'string') {
    str = parse_sex(str);
  }
  let $ = pun.$;
  let _ = pun._;

  let f = pun.match(
    $(Number), (n)                      => Expr.Num(n),
    [{name: '+'}, $, $], (n1, n2)       => Expr.Sum(parse(n1), parse(n2)),
    [{name: '-'}, $, $], (n1, n2)       => Expr.Sub(parse(n1), parse(n2)),
    [{name: 'if0'}, $, $, $], (c, t, e) => Expr.if0(parse(c),
                                                    parse(t),
                                                    parse(e)),
    _, ()                               => {throw new Error("bad syntax")}
  )

  return f(str);
}

module.exports.parse = parse;
module.exports.Expr = Expr;
