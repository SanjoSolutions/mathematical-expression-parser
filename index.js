const EXPRESSION_REGEXP = /^\(?([^\(]+) ([\+]) (.+)\)?$/

const NUMBER_REGEXP_STRING = '\\d+(?:\\.\\d+)?'

const OPERAND_REGEXP = new RegExp(NUMBER_REGEXP_STRING)

export const Operator = {
  PLUS: '+',
}

export function parse(expression) {
  return new Tree(parseSubexpression((expression)))
}

function parseSubexpression(expression) {
  const match = EXPRESSION_REGEXP.exec(expression)
  if (match) {
    const [_, firstOperand, operator, secondOperand] = match
    return new OperationNode(parseSubexpression(firstOperand), parseOperator(operator), parseSubexpression(secondOperand))
  } else {
    try {
      return parseOperand(expression)
    } catch (error) {
      throw new Error(`Invalid expression: "${ expression }"`)
    }
  }
}

function parseOperand(operand) {
  const match = OPERAND_REGEXP.exec(operand)
  if (match) {
    const value = Number(match[0])
    const node = new OperandNode(value)
    return node
  } else {
    throw new Error('Invalid operand')
  }
}

function parseOperator(operator) {
  if (operator === '+') {
    return Operator.PLUS
  } else {
    throw new Error('Unknown operator')
  }
}

export function extractNextGroupedSubexpression(expression) {
  const a = expression.indexOf('(')
  if (a !== -1) {
    let openGroups = 0
    let fromIndex = a + 1
    do {
      const b = expression.indexOf('(', fromIndex)
      const c = expression.indexOf(')', fromIndex)
      if (b === -1 || c < b) {
        if (openGroups === 0) {
          return {
            fromIndex: a,
            toIndex: c + 1,
            value: expression.slice(a + 1, c),
          }
        } else if (c !== -1) {
          openGroups--
          if (openGroups < 0) {
            throw new Error('Invalid expression: more closing parenthesis than opening parenthesis.')
          }
        }
      } else {
        openGroups++
      }
      fromIndex = b !== -1 ? b + 1 : c + 1
    } while (true)
  }
}

export class Tree {
  constructor(root) {
    this.root = root
  }
}

export class Node {

}

export class OperandNode extends Node {
  constructor(value) {
    super()
    this.value = value
  }
}

export class OperationNode extends Node {
  constructor(firstOperand, operator, secondOperand) {
    super()
    this.firstOperand = firstOperand
    this.operator = operator
    this.secondOperand = secondOperand
  }
}
