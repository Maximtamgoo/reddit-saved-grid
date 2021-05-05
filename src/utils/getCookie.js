export default function getCookie(key) {
  const cookiesArr = document.cookie ? document.cookie.split('; ') : []
  for (const cookieStr of cookiesArr) {
    const keyValue = cookieStr.split('=')
    if (key === keyValue[0]) {
      return keyValue[1]
    }
  }
  return undefined
}