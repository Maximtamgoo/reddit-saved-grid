export default (name: string, message: string) => {
  const error = Error()
  error.name = name
  error.message = message
  return error
}