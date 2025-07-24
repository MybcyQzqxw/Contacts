<template>
  <div>
    <!-- 页面标题和搜索 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">联系人列表</h1>
      <div class="flex items-center space-x-4">
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

    <!-- 统计信息 -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-gray-600">
          共有 <span class="font-semibold text-primary-600">{{ contactsStore.contactsCount }}</span> 个联系人
        </p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="contactsStore.error" class="mb-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <span class="text-red-400 mr-2">⚠️</span>
          <div>
            <p class="text-red-800">{{ contactsStore.error }}</p>
            <button 
              @click="contactsStore.clearError" 
              class="text-red-600 hover:text-red-800 text-sm mt-1"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <LoadingSpinner v-if="contactsStore.loading" message="正在加载联系人..." />

    <!-- 联系人列表 -->
    <div v-else-if="contactsStore.contacts.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ContactCard
        v-for="contact in contactsStore.contacts"
        :key="contact.id"
        :contact="contact"
        @edit="editContact"
        @delete="deleteContact"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📭</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">暂无联系人</h3>
      <p class="text-gray-600 mb-4">开始添加您的第一个联系人吧</p>
      <router-link to="/add" class="btn-primary">
        + 添加联系人
      </router-link>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
        <p class="text-gray-600 mb-6">您确定要删除这个联系人吗？此操作无法撤销。</p>
        <div class="flex space-x-3">
          <button @click="confirmDelete" class="btn-danger flex-1">
            删除
          </button>
          <button @click="cancelDelete" class="btn-secondary flex-1">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import ContactCard from '@/components/ContactCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'ContactList',
  components: {
    ContactCard,
    LoadingSpinner
  },
  setup() {
    const router = useRouter()
    const contactsStore = useContactsStore()
    const searchQuery = ref('')
    const showDeleteDialog = ref(false)
    const contactToDelete = ref(null)

    let searchTimeout = null

    onMounted(() => {
      contactsStore.fetchContacts()
    })

    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        if (searchQuery.value.trim()) {
          contactsStore.searchContacts(searchQuery.value.trim())
        } else {
          contactsStore.fetchContacts()
        }
      }, 300)
    }

    const editContact = (id) => {
      router.push(`/edit/${id}`)
    }

    const deleteContact = (id) => {
      contactToDelete.value = id
      showDeleteDialog.value = true
    }

    const confirmDelete = async () => {
      try {
        await contactsStore.deleteContact(contactToDelete.value)
        showDeleteDialog.value = false
        contactToDelete.value = null
      } catch (error) {
        console.error('Delete error:', error)
      }
    }

    const cancelDelete = () => {
      showDeleteDialog.value = false
      contactToDelete.value = null
    }

    return {
      contactsStore,
      searchQuery,
      showDeleteDialog,
      handleSearch,
      editContact,
      deleteContact,
      confirmDelete,
      cancelDelete
    }
  }
}
</script>
