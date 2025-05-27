<template>
  <div>
    <h2>Доступные голосования</h2>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="voting in votings" :key="voting.id">
        <router-link :to="'/voting/' + voting.id">
          {{ voting.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      votings: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const userId = localStorage.getItem('userId'); // Получаем userId из localStorage
console.log('Request URL:', `/api/votings/available/${userId}`);
      const response = await fetch(`/api/votings/available/${userId}`)
      if (!response.ok) throw new Error('Ошибка загрузки')
      this.votings = await response.json()
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.error { color: red; }
ul { list-style: none; padding: 0; }
li { margin: 10px 0; }
</style>