import { parse, Tree, Operator, extractNextGroupedSubexpression, OperationNode, OperandNode } from './index.js'

describe('parse', () => {
  it('parses "1 + 2"', () => {
    const tree = parse('1 + 2')
    expect(tree).toEqual(
      new Tree(new OperationNode(new OperandNode(1), Operator.PLUS, new OperandNode(2)))
    )
  })

  it('parses "1 - 2"', () => {
    const tree = parse('1 - 2')
    expect(tree).toEqual(
      new Tree(new OperationNode(new OperandNode(1), Operator.MINUS, new OperandNode(2)))
    )
  })

  it('parses "1 * 2"', () => {
    const tree = parse('1 * 2')
    expect(tree).toEqual(
      new Tree(new OperationNode(new OperandNode(1), Operator.MULTIPLIED_BY, new OperandNode(2)))
    )
  })

  it('parses "1 / 2"', () => {
    const tree = parse('1 / 2')
    expect(tree).toEqual(
      new Tree(new OperationNode(new OperandNode(1), Operator.DIVIDED_BY, new OperandNode(2)))
    )
  })

  it('parses "1 + 2 + 3"', () => {
    const tree = parse('1 + 2 + 3')
    expect(tree).toEqual(
      new Tree(new OperationNode(
        new OperationNode(new OperandNode(1), Operator.PLUS, new OperandNode(2)),
        Operator.PLUS,
        new OperandNode(3)
      ))
    )
  })

  it('parses "1 + (2 + 3)"', () => {
    const tree = parse('1 + (2 + 3)')
    expect(tree).toEqual(
      new Tree(new OperationNode(
        new OperandNode(1),
        Operator.PLUS,
        new OperationNode(new OperandNode(2), Operator.PLUS, new OperandNode(3))
      ))
    )
  })
})

describe('extract next grouped subexpression', () => {
  it('works with one group', () => {
    expect(extractNextGroupedSubexpression('1 + (2 + 3)')).toEqual({
      fromIndex: 4,
      toIndex: 11,
      value: '2 + 3'
    })
  })

  it('works with nested groups', () => {
    expect(extractNextGroupedSubexpression('((1 + 2) + 3)')).toEqual({
      fromIndex: 0,
      toIndex: 13,
      value: '(1 + 2) + 3'
    })
  })
})
