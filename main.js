const interpr = require('./lib/interp.js');
const parser = require('./lib/parser.js');
const pun = require('pun').pun;

const interp = interpr.interp;
const parse = parser.parse;

const Val = interpr.Val;

const run = (prog) => {
  console.log(interp(parse(prog)).n + '');
}

:
