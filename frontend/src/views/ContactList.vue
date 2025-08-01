<template>
  <div>
    <!-- 统计信息 -->
    <ContactStats />

    <!-- 仪表板控制面板 -->
    <div class="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <span class="text-sm font-medium text-gray-700">最近联系、最常联系统计人数：</span>
      <input
        v-model.number="dashboardCountInput"
        type="number"
        min="1"
        max="10"
        class="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        @click="updateDashboardCount"
        class="btn-secondary text-sm"
        title="手动刷新数量"
      >
        刷新
      </button>
    </div>

    <!-- 最近联系和最常联系板块 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- 最近联系板块 -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span class="text-blue-500 mr-2">🕐</span>
          最近联系
        </h2>
        <div v-if="contactsStore.recentlyContactedContacts.length > 0" class="space-y-3">
          <CompactContactCard
            v-for="contact in contactsStore.recentlyContactedContacts"
            :key="`recent-${contact.id}`"
            :contact="contact"
            @show-detail="showContactDetail"
            @toggle-favorite="toggleFavorite"
            @add-call="addCallHistory"
            @add-email="addEmailHistory"
            @undo-call="confirmUndo"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📱</div>
          <p class="text-sm">暂无联系记录</p>
        </div>
      </div>

      <!-- 最常联系板块 -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span class="text-green-500 mr-2">📊</span>
          最常联系
        </h2>
        <div v-if="contactsStore.mostContactedContacts.length > 0" class="space-y-3">
          <CompactContactCard
            v-for="contact in contactsStore.mostContactedContacts"
            :key="`frequent-${contact.id}`"
            :contact="contact"
            @show-detail="showContactDetail"
            @toggle-favorite="toggleFavorite"
            @add-call="addCallHistory"
            @add-email="addEmailHistory"
            @undo-call="confirmUndo"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📈</div>
          <p class="text-sm">暂无联系记录</p>
        </div>
      </div>
    </div>

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
              !contactsStore.showFavoritesOnly 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            全部
          </button>
          <button
            @click="toggleFilter(true)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              contactsStore.showFavoritesOnly 
                ? 'bg-pink-600 text-white' 
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
            class="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-105 transition-transform"
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
            class="flex-1 bg-pink-300 hover:bg-pink-400 text-white font-medium text-sm py-2 px-3 rounded-lg transition-colors duration-200"
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
        {{ contactsStore.showFavoritesOnly ? '暂无收藏的联系人' : '暂无联系人' }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{ contactsStore.showFavoritesOnly ? '你还没有收藏任何联系人' : '开始添加你的第一个联系人吧' }}
      </p>
      <router-link
        v-if="!contactsStore.showFavoritesOnly"
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
      @refresh-contact="refreshContactData"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ContactStats from '@/components/ContactStats.vue'
import ContactDetailModal from '@/components/ContactDetailModal.vue'
import CompactContactCard from '@/components/CompactContactCard.vue'

export default {
  name: 'ContactList',
  components: {
    ContactStats,
    ContactDetailModal,
    CompactContactCard
  },
  setup() {
    const contactsStore = useContactsStore()
    const searchQuery = ref('')
    const contactToDelete = ref(null)
    const contactToUndo = ref(null)
    const contactsPerRow = ref(4) // 默认一行显示4个联系人
    const selectedContact = ref(null)
    const showDetailModal = ref(false)
    const dashboardCountInput = ref(3) // 仪表板联系人数量输入框
    const gridCols = computed(() => {
      const colsMap = {
        1: 'grid gap-4 grid-cols-1',
        2: 'grid gap-4 grid-cols-2',
        3: 'grid gap-4 grid-cols-3',
        4: 'grid gap-4 grid-cols-4',
        5: 'grid gap-4 grid-cols-5',
        6: 'grid gap-4 grid-cols-6'
      }
      return colsMap[contactsPerRow.value] || 'grid gap-4 grid-cols-4'
    })

    // 获取排序后的联系人列表
    const displayedContacts = computed(() => {
      // 如果正在显示收藏联系人，直接使用sortedContacts（因为此时contacts已经是收藏联系人了）
      // 如果显示全部联系人，也使用sortedContacts
      // 只有当showFavoritesOnly为true但contacts包含所有联系人时，才需要过滤
      if (contactsStore.showFavoritesOnly) {
        // 检查当前contacts是否已经是过滤后的收藏联系人
        const allAreFavorites = contactsStore.contacts.every(contact => contact.is_favorite)
        if (allAreFavorites) {
          // 如果所有联系人都是收藏的，说明API已经返回了过滤后的数据
          return contactsStore.sortedContacts
        } else {
          // 否则需要前端过滤
          return contactsStore.sortedFavoriteContacts
        }
      } else {
        return contactsStore.sortedContacts
      }
    })

    const toggleFilter = async (favoritesOnly) => {
      await contactsStore.fetchContacts(favoritesOnly)
    }

    const toggleFavorite = async (contactId) => {
      try {
        await contactsStore.toggleFavorite(contactId)
        // 如果在收藏界面取消收藏，刷新显示
        if (contactsStore.showFavoritesOnly) {
          await contactsStore.fetchContacts(true)
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }

    const refreshLayout = () => {
      // 强制重新渲染，确保布局更新  
      if (contactsStore.contacts.length === 0) {
        contactsStore.fetchContacts()
      }
    }

    const showContactDetail = (contact) => {
      selectedContact.value = contact
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedContact.value = null
    }

    const refreshContactData = async (contactId) => {
      try {
        console.log('刷新联系人数据:', contactId)
        
        // 重新获取联系人列表
        await contactsStore.fetchContacts(contactsStore.showFavoritesOnly)
        
        // 更新当前显示的联系人详情
        const updatedContact = contactsStore.getContactById(contactId)
        if (updatedContact && selectedContact.value) {
          selectedContact.value = updatedContact
        }
        
        // 刷新统计数据
        await contactsStore.fetchStats()
        
        console.log('联系人数据刷新完成')
      } catch (error) {
        console.error('刷新联系人数据失败:', error)
      }
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
        await contactsStore.fetchContacts(contactsStore.showFavoritesOnly)
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

    // 更新仪表板联系人数量
    const updateDashboardCount = () => {
      const count = dashboardCountInput.value || 3
      const validCount = Math.max(1, Math.min(10, count))
      dashboardCountInput.value = validCount
      contactsStore.setDashboardContactsCount(validCount)
    }

    // 监听输入框变化，自动刷新
    watch(dashboardCountInput, (newValue) => {
      if (newValue && newValue >= 1 && newValue <= 10) {
        contactsStore.setDashboardContactsCount(newValue)
      }
    })

    onMounted(() => {
      // 恢复仪表板设置
      contactsStore.loadDashboardContactsCount()
      dashboardCountInput.value = contactsStore.dashboardContactsCount
      
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
      dashboardCountInput,
      gridCols,
      displayedContacts,
      toggleFilter,
      toggleFavorite,
      refreshLayout,
      showContactDetail,
      closeDetailModal,
      refreshContactData,
      addCallHistory,
      addEmailHistory,
      undoLastCall,
      confirmUndo,
      handleSearch,
      confirmDelete,
      deleteContact,
      updateDashboardCount
    }
  }
}
</script>
