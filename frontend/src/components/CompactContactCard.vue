<template>
  <div class="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow hover:shadow-lg transition-all duration-200 p-4 border border-gray-100">
    <div class="flex items-center justify-between">
      <!-- 左侧：头像（点击查看详情） -->
      <div 
        @click="$emit('show-detail', contact)"
        class="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-base cursor-pointer hover:scale-110 transition-transform shadow-md flex-shrink-0"
        title="点击查看详情"
      >
        {{ contact.name.charAt(0).toUpperCase() }}
      </div>

      <!-- 中间：联系人信息 -->
      <div class="flex-1 mx-4 min-w-0">
        <h4 class="text-base font-semibold text-gray-900 truncate" :title="contact.name">
          {{ contact.name }}
        </h4>
        <p class="text-gray-600 text-sm truncate flex items-center" :title="contact.phone">
          <span class="mr-1">📞</span> {{ contact.phone }}
        </p>
        <!-- 联系次数显示 -->
        <p v-if="hasContactHistory(contact)" class="text-gray-500 text-xs mt-1 flex items-center">
          <span class="mr-1">📊</span> {{ getContactCount(contact) }} 次联系
        </p>
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="flex items-center space-x-2 flex-shrink-0">
        <!-- 电话按钮 -->
        <button
          @click="$emit('add-call', contact.id)"
          class="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
          title="记录通话"
        >
          📞
        </button>
        
        <!-- 邮箱按钮 -->
        <button
          @click="$emit('add-email', contact.id)"
          :disabled="!contact.email"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            contact.email 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
          :title="contact.email ? '记录邮件' : '无邮箱地址'"
        >
          📧
        </button>
        
        <!-- 撤回按钮 -->
        <button
          @click="$emit('undo-call', contact.id)"
          :disabled="!hasContactHistory(contact)"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            hasContactHistory(contact)
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
          :title="hasContactHistory(contact) ? '撤回最后一次联系' : '无联系记录'"
        >
          ↶
        </button>
        
        <!-- 收藏按钮 -->
        <button
          @click="$emit('toggle-favorite', contact.id)"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110',
            contact.is_favorite 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-300 hover:text-red-500'
          ]"
          :title="contact.is_favorite ? '取消收藏' : '收藏'"
        >
          {{ contact.is_favorite ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompactContactCard',
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  emits: [
    'show-detail',
    'toggle-favorite', 
    'add-call',
    'add-email',
    'undo-call'
  ],
  methods: {
    hasContactHistory(contact) {
      return contact.contact_history && Array.isArray(contact.contact_history) && contact.contact_history.length > 0
    },
    getContactCount(contact) {
      return contact.contact_history ? contact.contact_history.length : 0
    }
  }
}
</script>
