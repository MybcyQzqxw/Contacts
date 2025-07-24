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

    <!-- 布局控制 -->
    <div class="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <span class="text-sm font-medium text-gray-700">一行显示的联系人个数：</span>
      <input
        v-model.number="contactsPerRow"
        type="number"
        min="1"
        max="6"
        class="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        @click="refreshLayout"
        class="btn-secondary text-sm"
        title="刷新布局"
      >
        刷新
      </button>
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
    <div v-else-if="displayedContacts.length > 0" :class="gridCols">
      <div
        v-for="contact in displayedContacts"
        :key="contact.id"
        class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col h-full"
      >
        <!-- 头像和操作按钮 -->
        <div class="flex items-center justify-between mb-3">
          <div 
            @click="showContactDetail(contact)"
            class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-105 transition-transform"
            title="点击查看详情"
          >
            {{ contact.name.charAt(0).toUpperCase() }}
          </div>
          
          <!-- 右侧按钮组 -->
          <div class="flex items-center space-x-2">
            <!-- 通话按钮 -->
            <button
              @click="addCallHistory(contact.id)"
              class="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
              title="通话"
            >
              📞
            </button>
            
            <!-- 邮箱按钮 -->
            <button
              @click="addEmailHistory(contact.id)"
              class="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
              title="邮箱"
              :disabled="!contact.email"
              :class="{ 'opacity-50 cursor-not-allowed': !contact.email }"
            >
              📧
            </button>
            
            <!-- 撤销按钮 -->
            <button
              @click="confirmUndo(contact.id)"
              class="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors"
              title="撤销"
              :disabled="!contact.contact_history || contact.contact_history.length === 0"
              :class="{ 'opacity-50 cursor-not-allowed': !contact.contact_history || contact.contact_history.length === 0 }"
            >
              ↶
            </button>
            
            <!-- 收藏图标 -->
            <button
              @click="toggleFavorite(contact.id)"
              class="transition-colors hover:scale-110 transform"
              :class="contact.is_favorite ? 'text-pink-500' : 'text-gray-300 hover:text-pink-400'"
              :title="contact.is_favorite ? '取消收藏' : '收藏'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 联系人信息 - 使用 flex-grow 占据剩余空间 -->
        <div class="flex-grow mb-3">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ contact.name }}</h3>
          <div class="space-y-1">
            <p class="text-gray-600 text-sm">📞 {{ contact.phone }}</p>
            <p v-if="contact.email" class="text-gray-600 text-sm">📧 {{ contact.email }}</p>
            <p v-if="contact.address" class="text-gray-600 text-sm">📍 {{ contact.address }}</p>
          </div>
        </div>

        <!-- 操作按钮 - 始终在底部 -->
        <div class="flex items-center space-x-2 pt-3 border-t border-gray-100 mt-auto">
          <button
            @click="showContactDetail(contact)"
            class="flex-1 btn-primary text-sm py-2 px-3"
            title="查看联系人详细信息"
          >
            详情
          </button>
          <router-link
            :to="`/edit/${contact.id}`"
            class="flex-1 btn-secondary text-sm text-center py-2"
            title="编辑联系人信息"
          >
            编辑
          </router-link>
          <button
            @click="confirmDelete(contact)"
            class="flex-1 btn-danger text-sm py-2"
            title="删除此联系人"
          >
            删除
          </button>
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

    <!-- 详情弹窗 -->
    <ContactDetailModal
      v-if="selectedContact"
      :contact="selectedContact"
      :is-visible="showDetailModal"
      @close="closeDetailModal"
    />

    <!-- 撤销确认对话框 -->
    <div v-if="contactToUndo" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">确认撤销</h3>
        <p class="text-gray-600 mb-6">
          确定要撤销最后一次联系记录吗？此操作无法恢复。
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="contactToUndo = null"
            class="btn-secondary"
          >
            取消
          </button>
          <button
            @click="undoLastCall(contactToUndo)"
            class="btn-danger"
          >
            确认撤销
          </button>
        </div>
      </div>
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
import ContactDetailModal from '@/components/ContactDetailModal.vue'

export default {
  name: 'ContactList',
  components: {
    ContactStats,
    ContactDetailModal
  },
  setup() {
    const contactsStore = useContactsStore()
    const searchQuery = ref('')
    const contactToDelete = ref(null)
    const contactToUndo = ref(null)
    const contactsPerRow = ref(3) // 默认一行显示3个联系人
    const selectedContact = ref(null)
    const showDetailModal = ref(false)
    const showFavoritesOnly = computed(() => contactsStore.showFavoritesOnly)

    const gridCols = computed(() => {
      const colsMap = {
        1: 'grid gap-4 grid-cols-1',
        2: 'grid gap-4 grid-cols-2',
        3: 'grid gap-4 grid-cols-3',
        4: 'grid gap-4 grid-cols-4',
        5: 'grid gap-4 grid-cols-5',
        6: 'grid gap-4 grid-cols-6'
      }
      return colsMap[contactsPerRow.value] || 'grid gap-4 grid-cols-3'
    })

    // 获取排序后的联系人列表
    const displayedContacts = computed(() => {
      return showFavoritesOnly.value 
        ? contactsStore.sortedFavoriteContacts 
        : contactsStore.sortedContacts
    })

    const toggleFilter = async (favoritesOnly) => {
      await contactsStore.fetchContacts(favoritesOnly)
    }

    const toggleFavorite = async (contactId) => {
      try {
        await contactsStore.toggleFavorite(contactId)
        // 如果在收藏界面取消收藏，重新获取收藏列表以移除该联系人
        if (showFavoritesOnly.value) {
          await contactsStore.fetchContacts(true)
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }

    const refreshLayout = () => {
      // 强制重新渲染，确保布局更新
      contactsStore.fetchContacts(showFavoritesOnly.value)
    }

    const showContactDetail = (contact) => {
      selectedContact.value = contact
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedContact.value = null
    }

    const addCallHistory = async (contactId) => {
      try {
        await contactsStore.addCallHistory(contactId)
        // 刷新统计数据
        await contactsStore.fetchStats()
      } catch (error) {
        console.error('Failed to add call history:', error)
      }
    }

    const addEmailHistory = async (contactId) => {
      try {
        await contactsStore.addEmailHistory(contactId)
        // 刷新统计数据
        await contactsStore.fetchStats()
      } catch (error) {
        console.error('Failed to add email history:', error)
        // 可以在这里显示错误提示，比如联系人没有邮箱
      }
    }

    const undoLastCall = async (contactId) => {
      try {
        await contactsStore.undoLastCall(contactId)
        // 刷新统计数据
        await contactsStore.fetchStats()
        contactToUndo.value = null
      } catch (error) {
        console.error('Failed to undo last call:', error)
      }
    }

    const confirmUndo = (contactId) => {
      contactToUndo.value = contactId
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
      contactToUndo,
      contactsPerRow,
      selectedContact,
      showDetailModal,
      showFavoritesOnly,
      gridCols,
      displayedContacts,
      toggleFilter,
      toggleFavorite,
      refreshLayout,
      showContactDetail,
      closeDetailModal,
      addCallHistory,
      addEmailHistory,
      undoLastCall,
      confirmUndo,
      handleSearch,
      confirmDelete,
      deleteContact
    }
  }
}
</script>
