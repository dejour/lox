import { TokenType } from './tokenType';

export class Token {
  type: string;
  lexeme: string;
  literal: string;
  line: number;
  constructor(type: TokenType, lexeme: string, literal: string, line: number) {
    this.type = TokenType[type];
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return `type:${this.type} lexeme:${this.lexeme} literal:${this.literal} line:${this.line}`;
  }
}
