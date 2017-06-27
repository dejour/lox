import * as yargs from 'yargs';
import * as fs from 'fs';

const yarg = yargs // eslint-disable-line
  .command(
    'generate',
    'generate ast class',
    yargs => {},
    argv => {
      defineAst(argv.dir, 'Expr', [
        'Binary   - left: Expr, operator: Token, right: Expr',
        'Grouping - expression: Expr',
        'Literal  - value: Object',
        'Unary    - operator: Token, right: Expr'
      ]);
    }
  )
  .option('dir', {
    alias: 'f',
    default: './src'
  })
  .help().argv;

function defineAst(outputDir: string, baseName: string, types: Array<any>) {
  const path = outputDir + '/' + baseName + '.ts';
  const code = `abstract class ${baseName} {
  constructor(){}
}\n
  ${defineTypes(types, baseName)}`;


  fs.writeFile(path, code, 'utf-8', (err)=> {
    if(!err) {
      console.log('ok')
    }
  })
}

function defineTypes(types, baseName) {
  let code = ''
  for (let i = 0; i < types.length; i++) {
    let className = types[i].split('-')[0].trim();
    let fields = types[i].split('-')[1].trim();
    code += defineType(baseName, className, fields) + '\n';
  }
  return code
}

function defineType(baseName, className, fieldList) {
  // body
  let fieldInit = '';
  let fieldDeclarition = '';
  let fields = fieldList.split(',');
  for (let i = 0; i < fields.length; i++) {
    const name = fields[i].split(':')[0].trim();
    const type = fields[i].split(':')[1].trim();
    fieldInit += `\n    this.${name} = ${name};`;
    fieldDeclarition += `${name}: ${type};\n\t`;
  }
  let str = `\nclass ${className} extends ${baseName} {
  ${fieldDeclarition}
  construct(${fields}){${fieldInit}
  }
}`;
  return str;
}
