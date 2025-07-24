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
    }
  }
})
