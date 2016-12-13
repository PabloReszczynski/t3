const parser = require('../lib/parser.js');
const parse = parser.parse;
const Expr = parser.Expr;

describe('P1 parser', () => {
  it('should parse a simple sum', () => {
    let parsed = parse('{ + 1 2 }');
    expect(parsed).toEqual(Expr.Sum(Expr.Num(1), Expr.Num(2)));
  });

  it('should parse a number', () => {
    let parsed = parse('5');
    expect(parsed).toEqual(Expr.Num(5));
  });

  it('should parse a substraction', () => {
    let parsed = parse('{ - 2 3 }');
    expect(parsed).
      toEqual(Expr.Sub(Expr.Num(2), Expr.Num(3)));
  });

  it('should parse a nested expression', () => {
    let parsed = parse('{ + { - 2 3 } { + 7 8 } }');
    expect(parsed).
      toEqual(Expr.Sum(
        Expr.Sub(Expr.Num(2), Expr.Num(3)),
        Expr.Sum(Expr.Num(7), Expr.Num(8))
      ));
  });

  it('should parse a condition', () => {
    let parsed = parse('{if0 2 3 5}');
    expect(parsed).
      toEqual(Expr.if0(
        Expr.Num(2),
        Expr.Num(3),
        Expr.Num(5)
      ));
  });

})
