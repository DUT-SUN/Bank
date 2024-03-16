// 封装ls存取token

const key = 'username'

const setName = (name) => {
  return window.localStorage.setItem(key, name)
}

const getName = () => {
  return window.localStorage.getItem(key)
}

const removeName = () => {
  return window.localStorage.removeItem(key)
}

export {
  setName,
  getName,
  removeName
}