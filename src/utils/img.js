
const key = 'imgUrl'

const setimgUrl = (imgUrl) => {
  return window.localStorage.setItem(key,imgUrl)
}

const getimgUrl = () => {
  return window.localStorage.getItem(key)
}

const removeimgUrl = () => {
  return window.localStorage.removeItem(key)
}

export {
  setimgUrl,
  getimgUrl,
  removeimgUrl
}