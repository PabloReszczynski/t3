const interpr = require('./lib/interp.js');
const parser = require('./lib/parser.js');
const readLine = require('readline');

const interp = interpr.interp;
const Env = interpr.Env;
const parse = parser.parse;

const Val = interpr.Val;

/**
 * Interpreta un programa.
 * @param {string} prog - El programa a ejecutar.
 * @returns {string} -
 */
const run = (prog) => {
  intr = interp(parse(prog), Env.mtEnv())
  if(typeof intr === 'function')
    console.log('Function');
  else
    console.log(intr.n);
  return intr;
}

/**
 * Ejecuta una línea de comandos. Un programa por línea. No se guarda memoria.
 */
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
      console.log(err.message);
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });

};

/**
 * Función principal. Corre el argumento como un programa.
 * Si no hay argumento, corre prompt.
 */
const main = () => {
  program = process.argv[2];
  if (program) {
    try {
      run(program.trim());
    } catch(err) {
      console.log(err.message);
    }
  }
  else {
    prompt();
  }
};

main()
