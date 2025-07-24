<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900">联系人详情</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <!-- 联系人基本信息 -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-4 mb-4">
          <!-- 头像 -->
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {{ contact.name.charAt(0).toUpperCase() }}
          </div>
          
          <!-- 基本信息 -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h4 class="text-xl font-semibold text-gray-900">{{ contact.name }}</h4>
              <!-- 收藏状态 -->
              <span v-if="contact.is_favorite" class="text-pink-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-gray-700"><span class="font-medium">电话：</span>{{ contact.phone }}</p>
              <p v-if="contact.email" class="text-gray-700"><span class="font-medium">邮箱：</span>{{ contact.email }}</p>
              <p v-if="contact.address" class="text-gray-700"><span class="font-medium">地址：</span>{{ contact.address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系历史 -->
      <div class="mb-6">
        <h5 class="text-lg font-semibold text-gray-900 mb-4">联系历史</h5>
        
        <div v-if="contact.contact_history && contact.contact_history.length > 0" class="space-y-3">
          <div
            v-for="(history, index) in sortedHistory"
            :key="index"
            :class="[
              'border rounded-lg p-3 flex items-center justify-between',
              history.action === '通话' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
                  history.action === '通话' ? 'bg-green-500' : 'bg-blue-500'
                ]"
              >
                {{ history.action === '通话' ? '📞' : '📧' }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ history.action }}</p>
                <p class="text-xs text-gray-600">{{ formatDateTime(history.timestamp) }}</p>
              </div>
            </div>
            <span 
              :class="[
                'text-xs px-2 py-1 rounded',
                history.action === '通话' 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-blue-600 bg-blue-100'
              ]"
            >
              {{ getTimeAgo(history.timestamp) }}
            </span>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📱</div>
          <p>暂无联系历史</p>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-end">
        <button
          @click="closeModal"
          class="btn-secondary"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ContactDetailModal',
  props: {
    contact: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    const sortedHistory = computed(() => {
      if (!props.contact.contact_history) return []
      return [...props.contact.contact_history].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    })

    const formatDateTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getTimeAgo = (timestamp) => {
      const now = new Date()
      const date = new Date(timestamp)
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      
      if (diffInMinutes < 1) return '刚刚'
      if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}小时前`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 30) return `${diffInDays}天前`
      
      const diffInMonths = Math.floor(diffInDays / 30)
      return `${diffInMonths}个月前`
    }

    return {
      closeModal,
      sortedHistory,
      formatDateTime,
      getTimeAgo
    }
  }
}
</script>
