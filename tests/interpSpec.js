const parser = require('../lib/parser.js');
const parse = parser.parse;
const Expr = parser.Expr;
const interp = require('../lib/interp.js').interp;
const Env = require('../lib/interp.js').Env;

describe('P1 interpreter', () => {
  it('should interpret a simple sum', () => {
    let parsed = parse('{+ 1 2}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(3);
  });

  it('should interpret a simple sub', () => {
    let parsed = parse('{- 3 2}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(1);
  });

  it('should interpret a nested program', () => {
    let parsed = parse('{+ {+ 1 2} {- 3 2}}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(4);
  });

  it('should interpret a simple if0', () => {
    let parsed = parse('{if0 0 {+ 1 2} 5}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(3);
  });
});

describe("P2 interpreter", () => {
  it('should interpret with', () => {
    let parsed = parse('{with {x 5} x}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(5);
  });

  it('should interpret a fun', () => {
    let parsed = parse('{fun {x} 5}');
    let interpreted = interp(parsed, Env.mtEnv());
    for (let i = 0; i < 100; i++) {
      let o = Math.random();
      expect(interpreted(o).n).toEqual(5);
    }
  });

  it('should interpret a second fun', () => {
    let parsed = parse('{fun {x} x}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted).toEqual(jasmine.any(Function));
  });

  it('should interpret an app', () => {
    let parsed = parse('{{fun {x} {+ x x}} 5}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(10);
  });

  it('should throw an error when interpreting a free id', () => {
    let parsed = parse('y');
    expect(() => interp(parsed, Env.mtEnv()))
    .toThrow('error: identificador libre!! y');
  })
});

describe("P3 interpreter", () => {
  it ('should interpret a set', () => {
    let parsed = parse('{with {x 0} {set x 101}}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(101);
  });

  it('should interpret a seqn', () => {
    let parsed = parse('{seqn 5 6}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(6);
  });
});

describe('utils funs', () => {
  let set_env = require('../lib/interp.js').set_env;
  let pe = require('../lib/interp.js').prettifyEnv;
  it('set_env should modify an env', () => {
    let myEnv = Env.anEnv('a', Expr.Id(1),
                Env.anEnv('b', Expr.Id(2),
                Env.anEnv('c', Expr.Id(3), Env.mtEnv())));
    let newEnv = set_env('b', Expr.Id(5), myEnv);
    expect(pe(newEnv)).toEqual(pe (
      Env.anEnv('a', Expr.Id(1),
      Env.anEnv('b', Expr.Id(5),
      Env.anEnv('c', Expr.Id(3), Env.mtEnv())))));
  });
});
