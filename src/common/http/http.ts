export class HttpException extends Error {
  public statusCode: number
  public message: string
  public errors?: unknown[]

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    return this
  }
}
