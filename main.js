const interpr = require('./lib/interp.js');
const parser = require('./lib/parser.js');
const readLine = require('readline');

const interp = interpr.interp;
const parse = parser.parse;

const Val = interpr.Val;

const run = (prog) => {
  intr = interp(parse(prog)).n + ''
  console.log(intr);
  return intr;
}

const prompt = () => {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  rl.prompt();

  rl.on('line', (line) => {
    try {
      run(line.trim());
    } catch(err) {
      console.log(err);
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });

};

const main = () => {
  program = process.argv[2];
  if (program) {
    run(program.trim());
  }
  else {
    prompt();
  }
};

main()
