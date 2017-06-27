import { Token } from './Token';
import { TokenType } from './tokenType';
import { lox } from './index';

const keywords = {
  and: TokenType.AND,
  class: TokenType.CLASS,
  else: TokenType.ELSE,
  false: TokenType.FALSE,
  for: TokenType.FOR,
  fun: TokenType.FUN,
  if: TokenType.IF,
  nil: TokenType.NIL,
  or: TokenType.OR,
  print: TokenType.PRINT,
  return: TokenType.RETURN,
  super: TokenType.SUPER,
  this: TokenType.THIS,
  true: TokenType.TRUE,
  var: TokenType.VAR,
  while: TokenType.WHILE
};
export class Scanner {
  source: string;
  tokens: Array<Token>;
  start: number;
  current: number;
  line: number;
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokens;
  }
  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanToken() {
    const c = this.advance();
    switch (c) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case '-':
        this.addToken(TokenType.MINUS);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this.match('/')) {
          // comment line
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
      case ' ':
      case '\r':
      case '\t':
        break;

      case '\n':
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          lox.error(this.line, 'unexpected character!');
        }
    }
  }
  // only consume the character when matches;
  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.substring(this.start, this.current);

    let type = keywords[text];
    if (!type) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }
  // don't consume the character
  peek() {
    if (this.current > this.source.length) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();

    // fraction part
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // consume '.'
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }

    this.addTokenImp(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }
  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      lox.error(this.line, 'Unterminated string.');
    }

    // closing "
    this.advance();

    // trim the surrounding quotes
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addTokenImp(TokenType.STRING, value);
  }
  // consume the character
  advance() {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  addToken(type) {
    this.addTokenImp(type, null);
  }

  addTokenImp(type, literal) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}
