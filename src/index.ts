import * as Vorpal from 'vorpal';
import * as repl from 'vorpal-repl';
import * as fs from 'fs';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import { Scanner } from './Scanner';
class Lox {
  hadError: boolean;
  constructor() {
    this.hadError = false;
  }
  start() {
    const yarg = yargs // eslint-disable-line
      .command(
        'run',
        'interprete file',
        yargs => {
          yargs.option('port', {
            describe: 'port to bind on',
            default: 5000
          });
        },
        argv => {
          this.runfile(argv.file);
        }
      )
      .option('file', {
        alias: 'f',
        default: './test.lox'
      })
      .help().argv;
  }

  runfile(file) {
    fs.readFile(file, 'utf8', (err, data) => {
      this.run(data);
    });

    // ????
    if (this.hadError) process.exit(1);
  }

  run(source) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    // For now, just print the tokens.
    for (var i = 0; i < tokens.length; i++) {
      console.log(chalk.blue(tokens[i]));
    }
  }

  // good engineering practice to separate the code that generates the error
  // from the code roports them
  error(line, message) {
    this.report(line, '', message);
  }

  report(line, where, message) {
    console.error('[line ' + line + '] Error' + where + ': ' + message);
    this.hadError = true;
  }
}

export const lox = new Lox();
lox.start();
