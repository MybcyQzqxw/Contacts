<template>
  <div class="max-w-2xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? '编辑联系人' : '添加联系人' }}
      </h1>
      <p class="text-gray-600 mt-1">
        {{ isEdit ? '修改联系人信息' : '填写新联系人的详细信息' }}
      </p>
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

    <!-- 表单 -->
    <div class="card p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 姓名 -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            :class="{ 'border-red-300': errors.name }"
            placeholder="请输入姓名"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <!-- 电话 -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            电话 <span class="text-red-500">*</span>
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            required
            class="input-field"
            :class="{ 'border-red-300': errors.phone }"
            placeholder="请输入电话号码"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
            {{ errors.phone }}
          </p>
        </div>

        <!-- 邮箱 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            邮箱
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="input-field"
            :class="{ 'border-red-300': errors.email }"
            placeholder="请输入邮箱地址（可选）"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- 地址 -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            地址
          </label>
          <textarea
            id="address"
            v-model="form.address"
            rows="3"
            class="input-field resize-none"
            :class="{ 'border-red-300': errors.address }"
            placeholder="请输入地址（可选）"
          ></textarea>
          <p v-if="errors.address" class="mt-1 text-sm text-red-600">
            {{ errors.address }}
          </p>
        </div>

        <!-- 收藏状态 -->
        <div>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="form.is_favorite"
              type="checkbox"
              class="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500 focus:ring-offset-0"
            />
            <span class="text-sm font-medium text-gray-700 flex items-center">
              <svg class="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
              收藏此联系人
            </span>
          </label>
          <p class="mt-1 text-sm text-gray-500">收藏的联系人将显示在收藏列表中</p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex space-x-4 pt-4">
          <button
            type="submit"
            :disabled="contactsStore.loading"
            class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="contactsStore.loading">
              {{ isEdit ? '更新中...' : '添加中...' }}
            </span>
            <span v-else>
              {{ isEdit ? '更新联系人' : '添加联系人' }}
            </span>
          </button>
          
          <button
            type="button"
            @click="handleCancel"
            class="btn-secondary flex-1"
            :disabled="contactsStore.loading"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'

export default {
  name: 'ContactForm',
  props: {
    id: String
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const contactsStore = useContactsStore()

    const isEdit = computed(() => !!props.id)
    
    const form = reactive({
      name: '',
      phone: '',
      email: '',
      address: '',
      is_favorite: false
    })

    const errors = reactive({
      name: '',
      phone: '',
      email: '',
      address: ''
    })

    // 加载联系人数据（编辑模式）
    onMounted(async () => {
      if (isEdit.value) {
        try {
          const contact = await contactsStore.fetchContact(props.id)
          if (contact) {
            form.name = contact.name || ''
            form.phone = contact.phone || ''
            form.email = contact.email || ''
            form.address = contact.address || ''
            form.is_favorite = contact.is_favorite || false
          }
        } catch (error) {
          console.error('Failed to load contact:', error)
          router.push('/')
        }
      }
    })

    // 表单验证
    const validateForm = () => {
      let isValid = true
      
      // 重置错误
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      // 验证姓名
      if (!form.name.trim()) {
        errors.name = '姓名不能为空'
        isValid = false
      } else if (form.name.trim().length > 100) {
        errors.name = '姓名长度不能超过100个字符'
        isValid = false
      }

      // 验证电话
      if (!form.phone.trim()) {
        errors.phone = '电话号码不能为空'
        isValid = false
      } else if (!/^[0-9+\-\s()]+$/.test(form.phone.trim())) {
        errors.phone = '请输入有效的电话号码'
        isValid = false
      }

      // 验证邮箱（可选）
      if (form.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email.trim())) {
          errors.email = '请输入有效的邮箱地址'
          isValid = false
        }
      }

      return isValid
    }

    // 处理表单提交
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      try {
        const formData = {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          address: form.address.trim() || null
        }

        if (isEdit.value) {
          await contactsStore.updateContact(props.id, formData)
        } else {
          await contactsStore.createContact(formData)
        }

        router.push('/')
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }

    // 取消操作
    const handleCancel = () => {
      router.push('/')
    }

    return {
      isEdit,
      form,
      errors,
      contactsStore,
      handleSubmit,
      handleCancel
    }
  }
}
</script>
