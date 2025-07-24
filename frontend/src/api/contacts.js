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
  // 获取统计信息
  getStats() {
    return api.get('/contacts/stats')
  },

  // 获取所有联系人
  getAllContacts(params = {}) {
    return api.get('/contacts', { params })
  },
  
  // 获取收藏联系人
  getFavoriteContacts(params = {}) {
    return api.get('/contacts', { params: { ...params, favorites_only: true } })
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
  
  // 切换收藏状态
  toggleFavorite(id) {
    return api.patch(`/contacts/${id}/favorite`)
  },
  
  // 删除联系人
  deleteContact(id) {
    return api.delete(`/contacts/${id}`)
  },
  
  // 搜索联系人
  searchContacts(query) {
    return api.get(`/contacts/search/${query}`)
  },

  // 添加通话记录
  addCallHistory(id) {
    return api.post(`/contacts/${id}/call`)
  },

  // 添加邮箱联系记录
  addEmailHistory(id) {
    return api.post(`/contacts/${id}/email`)
  },

  // 撤销最后一次通话记录
  undoLastCall(id) {
    return api.delete(`/contacts/${id}/call`)
  },

  // 删除指定的历史记录
  deleteHistoryRecord(id, historyIndex) {
    return api.delete(`/contacts/${id}/history/${historyIndex}`)
  }
}

export default api
