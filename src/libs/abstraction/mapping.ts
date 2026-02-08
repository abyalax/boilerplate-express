/* eslint-disable @typescript-eslint/no-explicit-any */
// biome-ignore lint/suspicious/noExplicitAny: <generic function>
export function mapJson<T>(data: any): T {
  return data as T
}
