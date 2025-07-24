<template>
  <div class="card p-6 hover:shadow-lg transition-shadow duration-200">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ contact.name }}
        </h3>
        
        <div class="space-y-1 text-sm text-gray-600">
          <div class="flex items-center">
            <span class="w-16 font-medium">电话:</span>
            <span>{{ contact.phone }}</span>
          </div>
          
          <div v-if="contact.email" class="flex items-center">
            <span class="w-16 font-medium">邮箱:</span>
            <span>{{ contact.email }}</span>
          </div>
          
          <div v-if="contact.address" class="flex items-center">
            <span class="w-16 font-medium">地址:</span>
            <span>{{ contact.address }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-2 ml-4">
        <button 
          @click="$emit('edit', contact.id)"
          class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="编辑"
        >
          ✏️
        </button>
        
        <button 
          @click="$emit('delete', contact.id)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="删除"
        >
          🗑️
        </button>
      </div>
    </div>
    
    <div v-if="contact.created_at" class="mt-4 pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-400">
        创建时间: {{ formatDate(contact.created_at) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactCard',
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>
