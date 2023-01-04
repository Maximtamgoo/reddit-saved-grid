export default class HttpError extends Error {
  readonly name: string
  readonly message: string

  constructor(
    readonly status: number,
    readonly statusText: string,
  ) {
    super()
    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText
    this.message = `${status} ${statusText}`
  }
}