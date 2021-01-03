import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  if (!token) {
    console.warn('Missing token!')
  }
  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const update = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  if (!token) {
    console.warn('Missing token!')
  }
  const response = await axios.put(`${baseUrl}/${blogObject.id}/`, blogObject, config)
  return response.data
}

const _delete = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  if (!token) {
    console.warn('Missing token!')
  }
  const response = await axios.delete(`${baseUrl}/${blogObject.id}/`, config)
  return response.data
}

export default { setToken, getAll, create, update, delete: _delete }