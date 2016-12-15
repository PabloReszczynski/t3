const parser = require('../lib/parser.js');
const parse = parser.parse;
const Expr = parser.Expr;
const pp = parser.pp;

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

});

describe('P2 parser', () => {
  it ('should parse a with', () => {
    let parsed = parse('{with {n 5} n}');
    expect(parsed).
      toEqual(Expr.App(Expr.Fun(Expr.Id('n'),
              Expr.Id('n')), Expr.Num(5)));
  });

  it ('should parse a fun', () => {
    let parsed = parse('{fun {x} {+ x x}}');
    expect(parsed).
      toEqual(Expr.Fun(Expr.Id('x'),
                       Expr.Sum(Expr.Id('x'),
                                Expr.Id('x'))));
  });

  it('should parse an application', () => {
    let parsed = parse('{{fun {x} {+ x x}} 5}');
    //console.log(pp(parsed));
    expect(parsed).
      toEqual(Expr.App(
        Expr.Fun(
          Expr.Id('x'),
          Expr.Sum(
            Expr.Id('x'),
            Expr.Id('x'))),
        Expr.Num(5)));
  });

});

describe('P3 parser', () => {
  it('should parse a set', () => {
    let parsed = parse('{with {x 0} {set x 101}}');
    expect(parsed).
      toEqual(Expr.App(Expr.Fun(Expr.Id('x'),
                       Expr.Set(Expr.Id('x'),
                                Expr.Num(101))),
              Expr.Num(0)));
  });

  it ('should parse a seqn', () => {
    let parsed = parse('{seqn 5 6}');
    expect(parsed).toEqual(Expr.Seqn(Expr.Num(5), Expr.Num(6)));
  });
});

describe('Exception error output:', () => {
  it('should throw invalid expression when given a bad expression', () => {
    expect(() => parse('{10 2}'))
    .toThrow(new Error("error: expresion invalida {10 2}"));

    expect(() => parse('{10 2 1}'))
    .toThrow(new Error("error: expresion invalida {10 2 1}"));
  });
});
