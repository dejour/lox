abstract class Expr {
  constructor() {}
}

class Binary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  construct(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class Grouping extends Expr {
  expression: Expr;

  construct(expression: Expr) {
    this.expression = expression;
  }
}

class Literal extends Expr {
  value: Object;

  construct(value: Object) {
    this.value = value;
  }
}

class Unary extends Expr {
  operator: Token;
  right: Expr;

  construct(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }
}
