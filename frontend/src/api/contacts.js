import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const contactsAPI = {
  // 获取所有联系人
  getAllContacts() {
    return api.get('/contacts')
  },
  
  // 获取单个联系人
  getContact(id) {
    return api.get(`/contacts/${id}`)
  },
  
  // 创建联系人
  createContact(contactData) {
    return api.post('/contacts', contactData)
  },
  
  // 更新联系人
  updateContact(id, contactData) {
    return api.put(`/contacts/${id}`, contactData)
  },
  
  // 删除联系人
  deleteContact(id) {
    return api.delete(`/contacts/${id}`)
  },
  
  // 搜索联系人
  searchContacts(query) {
    return api.get(`/contacts/search/${query}`)
  }
}

export default api
