import { defineStore } from 'pinia'
import { contactsAPI } from '@/api/contacts'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    contacts: [],
    currentContact: null,
    loading: false,
    error: null
  }),

  getters: {
    getContactById: (state) => (id) => {
      return state.contacts.find(contact => contact.id === parseInt(id))
    },
    
    contactsCount: (state) => state.contacts.length
  },

  actions: {
    async fetchContacts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await contactsAPI.getAllContacts()
        this.contacts = response.data
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
        return response.data
      } catch (error) {
        this.error = '更新联系人失败'
        console.error('Update contact error:', error)
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
      } catch (error) {
        this.error = '删除联系人失败'
        console.error('Delete contact error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchContacts(query) {
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
    }
  }
})
