/**
 * Exhaustiveness guard for discriminated-union `switch` statements.
 *
 * If every `case` is handled, TypeScript narrows the `default` binding to `never`
 * and a missing branch becomes a compile-time error.
 */
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}
