<template>
  <div>
    <!-- 统计信息 -->
    <ContactStats />

    <!-- 页面标题和操作 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">联系人列表</h1>
      <div class="flex items-center space-x-4">
        <!-- 过滤按钮 -->
        <div class="flex space-x-2">
          <button
            @click="toggleFilter(false)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              !showFavoritesOnly 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            全部
          </button>
          <button
            @click="toggleFilter(true)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              showFavoritesOnly 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            ⭐ 收藏
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="搜索联系人..."
            class="input-field pl-10 w-64"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-400">🔍</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="contactsStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="contactsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ contactsStore.error }}</p>
      <button
        @click="contactsStore.clearError"
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        关闭
      </button>
    </div>

    <!-- 联系人列表 -->
    <div v-else-if="contactsStore.contacts.length > 0" class="space-y-4">
      <div
        v-for="contact in contactsStore.contacts"
        :key="contact.id"
        class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- 头像 -->
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {{ contact.name.charAt(0).toUpperCase() }}
            </div>
            
            <!-- 联系人信息 -->
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ contact.name }}</h3>
                <!-- 收藏图标 -->
                <button
                  @click="toggleFavorite(contact.id)"
                  class="transition-colors hover:scale-110 transform"
                  :class="contact.is_favorite ? 'text-pink-500' : 'text-gray-300 hover:text-pink-400'"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                </button>
              </div>
              <p class="text-gray-600 mt-1">📞 {{ contact.phone }}</p>
              <p v-if="contact.email" class="text-gray-600">📧 {{ contact.email }}</p>
              <p v-if="contact.address" class="text-gray-600">📍 {{ contact.address }}</p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center space-x-2">
            <router-link
              :to="`/edit/${contact.id}`"
              class="btn-secondary text-sm"
            >
              编辑
            </router-link>
            <button
              @click="confirmDelete(contact)"
              class="btn-danger text-sm"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">👥</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ showFavoritesOnly ? '暂无收藏的联系人' : '暂无联系人' }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{ showFavoritesOnly ? '你还没有收藏任何联系人' : '开始添加你的第一个联系人吧' }}
      </p>
      <router-link
        v-if="!showFavoritesOnly"
        to="/add"
        class="btn-primary"
      >
        添加联系人
      </router-link>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="contactToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
        <p class="text-gray-600 mb-6">
          确定要删除联系人 "{{ contactToDelete.name }}" 吗？此操作无法撤销。
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="contactToDelete = null"
            class="btn-secondary"
          >
            取消
          </button>
          <button
            @click="deleteContact"
            class="btn-danger"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ContactStats from '@/components/ContactStats.vue'

export default {
  name: 'ContactList',
  components: {
    ContactStats
  },
  setup() {
    const contactsStore = useContactsStore()
    const searchQuery = ref('')
    const contactToDelete = ref(null)
    const showFavoritesOnly = computed(() => contactsStore.showFavoritesOnly)

    const toggleFilter = async (favoritesOnly) => {
      await contactsStore.fetchContacts(favoritesOnly)
    }

    const toggleFavorite = async (contactId) => {
      try {
        await contactsStore.toggleFavorite(contactId)
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }

    const handleSearch = async () => {
      if (searchQuery.value.trim()) {
        await contactsStore.searchContacts(searchQuery.value)
      } else {
        await contactsStore.fetchContacts(showFavoritesOnly.value)
      }
    }

    const confirmDelete = (contact) => {
      contactToDelete.value = contact
    }

    const deleteContact = async () => {
      if (contactToDelete.value) {
        try {
          await contactsStore.deleteContact(contactToDelete.value.id)
          contactToDelete.value = null
        } catch (error) {
          console.error('Failed to delete contact:', error)
        }
      }
    }

    onMounted(() => {
      contactsStore.fetchContacts()
    })

    return {
      contactsStore,
      searchQuery,
      contactToDelete,
      showFavoritesOnly,
      toggleFilter,
      toggleFavorite,
      handleSearch,
      confirmDelete,
      deleteContact
    }
  }
}
</script>
