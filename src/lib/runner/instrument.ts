import { parse } from 'acorn'

// Code instrumentation: parse the learner's code and insert small helper calls WITHOUT
// changing what the code does.
//
//   guard mode: adds __cm_tick() at the start of every loop body. The runner counts the
//               calls and stops an infinite loop with a clear error instead of freezing.
//   trace mode: also adds __cm_step(line, functionName, snapshot) before every statement.
//               The snapshot function reads every variable visible at that point, which
//               powers the step-by-step Visual Bug Execution Analyzer.
//
// Insertions never add new lines, so line numbers stay identical to the original code.

export const TICK = '__cm_tick'
export const STEP = '__cm_step'

export type InstrumentMode = 'guard' | 'trace'

type AstNode = {
  type: string
  start: number
  end: number
  loc?: { start: { line: number; column: number } }
  [key: string]: unknown
}

export class CodeSyntaxError extends Error {
  line: number | null

  constructor(message: string, line: number | null) {
    super(message)
    this.name = 'SyntaxError'
    this.line = line
  }
}

const isNode = (value: unknown): value is AstNode =>
  typeof value === 'object' && value !== null && typeof (value as AstNode).type === 'string'

const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])

// ── Scope helpers: which variable names are declared where ──────────────────
function patternNames(pattern: unknown, out: string[]) {
  if (!isNode(pattern)) return
  switch (pattern.type) {
    case 'Identifier':
      out.push(pattern.name as string)
      break
    case 'ObjectPattern':
      for (const property of pattern.properties as AstNode[]) {
        patternNames(property.type === 'RestElement' ? property.argument : property.value, out)
      }
      break
    case 'ArrayPattern':
      for (const element of pattern.elements as unknown[]) patternNames(element, out)
      break
    case 'AssignmentPattern':
      patternNames(pattern.left, out)
      break
    case 'RestElement':
      patternNames(pattern.argument, out)
      break
  }
}

function declarationNames(declaration: AstNode, out: string[]) {
  for (const declarator of declaration.declarations as AstNode[]) patternNames(declarator.id, out)
}

/** let/const/class declared directly in a list of statements. */
function lexicalNames(statements: AstNode[]): string[] {
  const names: string[] = []
  for (const statement of statements) {
    if (statement.type === 'VariableDeclaration' && statement.kind !== 'var') declarationNames(statement, names)
    if (statement.type === 'ClassDeclaration' && isNode(statement.id)) names.push(statement.id.name as string)
  }
  return names
}

/** var declarations anywhere inside a function body (they are function-scoped), not crossing into nested functions. */
function varNames(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const child of node) varNames(child, out)
    return out
  }
  if (!isNode(node)) return out
  if (node.type === 'VariableDeclaration' && node.kind === 'var') declarationNames(node, out)
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || FUNCTION_TYPES.has(isNode(value) ? value.type : '')) continue
    if (Array.isArray(value) || isNode(value)) varNames(value, out)
  }
  return out
}

function lineOf(node: AstNode) {
  return node.loc?.start.line ?? 0
}

export function instrument(code: string, mode: InstrumentMode): string {
  let ast: AstNode
  try {
    ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script', locations: true }) as unknown as AstNode
  } catch (error) {
    const syntax = error as { message?: string; loc?: { line: number } }
    const message = (syntax.message ?? 'Invalid syntax').replace(/\s*\(\d+:\d+\)$/, '')
    throw new CodeSyntaxError(message, syntax.loc?.line ?? null)
  }

  const inserts: { pos: number; text: string; seq: number }[] = []
  const insert = (pos: number, text: string) => inserts.push({ pos, text, seq: inserts.length })

  function stepCall(line: number, scopes: string[][], label: string) {
    const names = [...new Set(scopes.flat())]
    const reads = names.map((name) => `try{__cm_o[${JSON.stringify(name)}]=${name}}catch(__cm_e){}`).join('')
    return `;${STEP}(${line},${JSON.stringify(label)},function(){var __cm_o={};${reads}return __cm_o});`
  }

  function visitStatements(statements: AstNode[], scopes: string[][], label: string) {
    for (const statement of statements) {
      if (mode === 'trace' && statement.type !== 'FunctionDeclaration' && statement.type !== 'EmptyStatement') {
        insert(statement.start, stepCall(lineOf(statement), scopes, label))
      }
      visit(statement, scopes, label)
    }
  }

  // Loop/if bodies: wrap single statements in { } so inserted calls stay inside the body.
  function visitBody(body: AstNode, scopes: string[][], label: string, isLoop: boolean) {
    const guard = isLoop ? `${TICK}();` : ''
    if (body.type === 'BlockStatement') {
      if (guard) insert(body.start + 1, guard)
      visit(body, scopes, label)
    } else {
      insert(body.start, `{${guard}`)
      visitStatements([body], scopes, label)
      insert(body.end, '}')
    }
  }

  function visitFunction(node: AstNode, scopes: string[][], label: string) {
    const params: string[] = []
    for (const param of node.params as AstNode[]) patternNames(param, params)
    const name = isNode(node.id) ? (node.id.name as string) : label === 'top level' ? 'anonymous' : `${label} → callback`
    const body = node.body as AstNode
    if (body.type === 'BlockStatement') {
      const statements = body.body as AstNode[]
      const scope = [...params, ...lexicalNames(statements), ...varNames(statements)]
      visitStatements(statements, [...scopes, scope], name)
    } else {
      visit(body, [...scopes, params], name)
    }
  }

  function visitChildren(node: AstNode, scopes: string[][], label: string) {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc') continue
      if (Array.isArray(value)) {
        for (const child of value) if (isNode(child)) visit(child, scopes, label)
      } else if (isNode(value)) {
        visit(value, scopes, label)
      }
    }
  }

  function visit(node: AstNode, scopes: string[][], label: string): void {
    if (FUNCTION_TYPES.has(node.type)) {
      visitFunction(node, scopes, label)
      return
    }
    switch (node.type) {
      case 'BlockStatement': {
        const statements = node.body as AstNode[]
        visitStatements(statements, [...scopes, lexicalNames(statements)], label)
        return
      }
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement': {
        const loopScope: string[] = []
        const head = (node.type === 'ForStatement' ? node.init : node.left) as AstNode | null
        if (head?.type === 'VariableDeclaration' && head.kind !== 'var') declarationNames(head, loopScope)
        const inner = [...scopes, loopScope]
        for (const key of ['init', 'test', 'update', 'left', 'right']) {
          const part = node[key]
          if (isNode(part)) visit(part, inner, label)
        }
        visitBody(node.body as AstNode, inner, label, true)
        return
      }
      case 'WhileStatement':
      case 'DoWhileStatement':
        visit(node.test as AstNode, scopes, label)
        visitBody(node.body as AstNode, scopes, label, true)
        return
      case 'IfStatement': {
        visit(node.test as AstNode, scopes, label)
        visitBody(node.consequent as AstNode, scopes, label, false)
        const alternate = node.alternate as AstNode | null
        if (alternate) {
          if (alternate.type === 'IfStatement') visit(alternate, scopes, label)
          else visitBody(alternate, scopes, label, false)
        }
        return
      }
      case 'SwitchStatement': {
        visit(node.discriminant as AstNode, scopes, label)
        const cases = node.cases as AstNode[]
        const caseScope = lexicalNames(cases.flatMap((item) => item.consequent as AstNode[]))
        for (const item of cases) {
          if (isNode(item.test)) visit(item.test, scopes, label)
          visitStatements(item.consequent as AstNode[], [...scopes, caseScope], label)
        }
        return
      }
      case 'TryStatement': {
        visit(node.block as AstNode, scopes, label)
        const handler = node.handler as AstNode | null
        if (handler) {
          const params: string[] = []
          patternNames(handler.param, params)
          visit(handler.body as AstNode, [...scopes, params], label)
        }
        if (isNode(node.finalizer)) visit(node.finalizer, scopes, label)
        return
      }
      default:
        visitChildren(node, scopes, label)
    }
  }

  const program = ast.body as AstNode[]
  visitStatements(program, [[...lexicalNames(program), ...varNames(program)]], 'top level')

  // Apply insertions from the end so earlier positions stay valid.
  let output = code
  const ordered = [...inserts].sort((a, b) => b.pos - a.pos || b.seq - a.seq)
  for (const { pos, text } of ordered) output = output.slice(0, pos) + text + output.slice(pos)
  return output
}
