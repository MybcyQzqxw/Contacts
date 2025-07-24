import { defineStore } from 'pinia'
import { contactsAPI } from '@/api/contacts'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    contacts: [],
    stats: {
      total_contacts: 0,
      favorite_contacts: 0,
      contacts_with_email: 0,
      contacts_with_address: 0
    },
    currentContact: null,
    loading: false,
    error: null,
    showFavoritesOnly: false
  }),

  getters: {
    getContactById: (state) => (id) => {
      return state.contacts.find(contact => contact.id === parseInt(id))
    },
    
    contactsCount: (state) => state.contacts.length,
    
    favoriteContacts: (state) => {
      return state.contacts.filter(contact => contact.is_favorite)
    },

    // 按姓氏首字母排序的联系人列表
    sortedContacts: (state) => {
      return [...state.contacts].sort((a, b) => {
        // 获取姓氏首字母（中文转拼音首字母或英文首字母）
        const getFirstLetter = (name) => {
          const firstChar = name.charAt(0).toLowerCase()
          // 如果是英文字母，直接返回
          if (/[a-z]/.test(firstChar)) {
            return firstChar
          }
          // 如果是中文，使用简单的拼音映射
          const pinyinMap = {
            '安': 'a', '啊': 'a', '阿': 'a', '爱': 'a',
            '白': 'b', '包': 'b', '北': 'b', '本': 'b',
            '陈': 'c', '程': 'c', '曹': 'c', '崔': 'c',
            '丁': 'd', '邓': 'd', '董': 'd', '杜': 'd',
            '方': 'f', '范': 'f', '费': 'f', '冯': 'f',
            '高': 'g', '郭': 'g', '龚': 'g', '顾': 'g',
            '韩': 'h', '何': 'h', '黄': 'h', '胡': 'h',
            '姜': 'j', '金': 'j', '江': 'j', '贾': 'j',
            '康': 'k', '孔': 'k',
            '李': 'l', '刘': 'l', '林': 'l', '卢': 'l',
            '马': 'm', '毛': 'm', '孟': 'm', '苗': 'm',
            '倪': 'n', '聂': 'n',
            '潘': 'p', '彭': 'p', '裴': 'p',
            '钱': 'q', '秦': 'q', '邱': 'q',
            '任': 'r', '荣': 'r',
            '孙': 's', '宋': 's', '沈': 's', '石': 's',
            '唐': 't', '田': 't', '谭': 't',
            '王': 'w', '吴': 'w', '武': 'w', '魏': 'w',
            '谢': 'x', '徐': 'x', '许': 'x', '夏': 'x',
            '杨': 'y', '姚': 'y', '叶': 'y', '于': 'y',
            '张': 'z', '赵': 'z', '周': 'z', '朱': 'z'
          }
          return pinyinMap[firstChar] || firstChar
        }

        const aFirst = getFirstLetter(a.name)
        const bFirst = getFirstLetter(b.name)
        
        if (aFirst !== bFirst) {
          return aFirst.localeCompare(bFirst)
        }
        // 如果首字母相同，按完整姓名排序
        return a.name.localeCompare(b.name)
      })
    },

    // 排序后的收藏联系人
    sortedFavoriteContacts: (state, getters) => {
      return getters.sortedContacts.filter(contact => contact.is_favorite)
    }
  },

  actions: {
    async fetchStats() {
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.getStats()
        this.stats = response.data
      } catch (error) {
        this.error = '获取统计信息失败'
        console.error('Fetch stats error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchContacts(favoritesOnly = false) {
      this.loading = true
      this.error = null
      
      try {
        const response = favoritesOnly 
          ? await contactsAPI.getFavoriteContacts()
          : await contactsAPI.getAllContacts()
        this.contacts = response.data
        this.showFavoritesOnly = favoritesOnly
        // 同时更新统计信息
        await this.fetchStats()
      } catch (error) {
        this.error = '获取联系人失败'
        console.error('Fetch contacts error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchContact(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.getContact(id)
        this.currentContact = response.data
        return response.data
      } catch (error) {
        this.error = '获取联系人详情失败'
        console.error('Fetch contact error:', error)
      } finally {
        this.loading = false
      }
    },

    async createContact(contactData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.createContact(contactData)
        this.contacts.push(response.data)
        await this.fetchStats() // 更新统计信息
        return response.data
      } catch (error) {
        this.error = '创建联系人失败'
        console.error('Create contact error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateContact(id, contactData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.updateContact(id, contactData)
        const index = this.contacts.findIndex(contact => contact.id === id)
        if (index !== -1) {
          this.contacts[index] = response.data
        }
        await this.fetchStats() // 更新统计信息
        return response.data
      } catch (error) {
        this.error = '更新联系人失败'
        console.error('Update contact error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.toggleFavorite(id)
        const index = this.contacts.findIndex(contact => contact.id === id)
        if (index !== -1) {
          this.contacts[index] = response.data
        }
        await this.fetchStats() // 更新统计信息
        return response.data
      } catch (error) {
        this.error = '更新收藏状态失败'
        console.error('Toggle favorite error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteContact(id) {
      this.loading = true
      this.error = null
      
      try {
        await contactsAPI.deleteContact(id)
        this.contacts = this.contacts.filter(contact => contact.id !== id)
        await this.fetchStats() // 更新统计信息
      } catch (error) {
        this.error = '删除联系人失败'
        console.error('Delete contact error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchContacts(query) {
      if (!query.trim()) {
        await this.fetchContacts()
        return
      }
      
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.searchContacts(query)
        this.contacts = response.data
      } catch (error) {
        this.error = '搜索联系人失败'
        console.error('Search contacts error:', error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    async addCallHistory(contactId) {
      try {
        const response = await contactsAPI.addCallHistory(contactId)
        // 更新本地联系人数据
        const contactIndex = this.contacts.findIndex(c => c.id === contactId)
        if (contactIndex !== -1) {
          this.contacts[contactIndex] = response.data.contact
        }
        return response.data
      } catch (error) {
        this.error = '添加通话记录失败'
        console.error('Add call history error:', error)
        throw error
      }
    },

    async addEmailHistory(contactId) {
      try {
        const response = await contactsAPI.addEmailHistory(contactId)
        // 更新本地联系人数据
        const contactIndex = this.contacts.findIndex(c => c.id === contactId)
        if (contactIndex !== -1) {
          this.contacts[contactIndex] = response.data.contact
        }
        return response.data
      } catch (error) {
        this.error = '添加邮箱联系记录失败'
        console.error('Add email history error:', error)
        throw error
      }
    },

    async undoLastCall(contactId) {
      try {
        const response = await contactsAPI.undoLastCall(contactId)
        // 更新本地联系人数据
        const contactIndex = this.contacts.findIndex(c => c.id === contactId)
        if (contactIndex !== -1) {
          this.contacts[contactIndex] = response.data.contact
        }
        return response.data
      } catch (error) {
        this.error = '撤销通话记录失败'
        console.error('Undo call history error:', error)
        throw error
      }
    },

    async deleteHistoryRecord(contactId, historyIndex) {
      try {
        const response = await contactsAPI.deleteHistoryRecord(contactId, historyIndex)
        // 更新本地联系人数据
        const contactIndex = this.contacts.findIndex(c => c.id === contactId)
        if (contactIndex !== -1) {
          this.contacts[contactIndex] = response.data.contact
        }
        return response.data
      } catch (error) {
        this.error = '删除历史记录失败'
        console.error('Delete history record error:', error)
        throw error
      }
    }
  }
})
