export default function createError(name, message) {
  const error = Error()
  error.name = name
  error.message = message
  return error
}