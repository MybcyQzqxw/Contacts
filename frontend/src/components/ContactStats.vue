<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <!-- 总联系人数 -->
    <div class="bg-white rounded-lg p-4 shadow-lg border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm">总联系人</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total_contacts }}</p>
        </div>
        <div class="bg-blue-100 rounded-lg p-2">
          <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 收藏联系人数 -->
    <div class="bg-white rounded-lg p-4 shadow-lg border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm">收藏联系人</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.favorite_contacts }}</p>
        </div>
        <div class="bg-pink-100 rounded-lg p-2">
          <svg class="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 有邮箱人数 -->
    <div class="bg-white rounded-lg p-4 shadow-lg border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm">有邮箱</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.contacts_with_email }}</p>
        </div>
        <div class="bg-green-100 rounded-lg p-2">
          <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 有地址人数 -->
    <div class="bg-white rounded-lg p-4 shadow-lg border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm">有地址</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.contacts_with_address }}</p>
        </div>
        <div class="bg-purple-100 rounded-lg p-2">
          <svg class="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
            <path d="M8 10h4v4H8v-4z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useContactsStore } from '@/stores/contacts'

export default {
  name: 'ContactStats',
  setup() {
    const contactsStore = useContactsStore()

    const stats = computed(() => contactsStore.stats)

    return {
      stats
    }
  }
}
</script>
