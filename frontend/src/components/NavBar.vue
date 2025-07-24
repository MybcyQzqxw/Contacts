<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-xl font-bold text-pink-600">
            📞 通讯录
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-pink-600 transition-colors"
            :class="{ 'text-pink-600 font-medium': $route.name === 'ContactList' }"
          >
            联系人列表
          </router-link>
          <router-link 
            to="/add" 
            class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            :class="{ 'bg-pink-700': $route.name === 'AddContact' }"
          >
            + 添加联系人
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>
