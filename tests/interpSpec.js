const parser = require('../lib/parser.js');
const parse = parser.parse;
const interp = require('../lib/interp.js').interp;
const Env = require('../lib/interp.js').Env;

describe('The P1 interpreter', () => {
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

describe("The P2 interpreter", () => {
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

  it('should interpret an app', () => {
    let parsed = parse('{{fun {x} {+ x x}} 5}');
    let interpreted = interp(parsed, Env.mtEnv());
    expect(interpreted.n).toEqual(10);
  });
});
