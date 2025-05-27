<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else>
    <h2>{{ voting.title }}</h2>
    <p>{{ voting.description }}</p>
    <h3>Кандидаты:</h3>
    <form @submit.prevent="submitVote">
      <ul>
        <li v-for="candidate in candidates" :key="candidate.id">
          <label>
            <input
              type="radio"
              :value="candidate.id"
              v-model="selectedCandidate"
            />
            {{ candidate.name }}
          </label>
        </li>
      </ul>
      <button type="submit" :disabled="!selectedCandidate">Отправить</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      voting: null,
      candidates: [],
      loading: true,
      error: null,
      selectedCandidate: null // Добавляем выбранного кандидата
    }
  },
  async created() {
    try {
      const response = await fetch(`/api/votings/${this.id}`);
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных голосования');
      }
      const data = await response.json();
      this.voting = data;
      this.candidates = data.candidates;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async submitVote() {
      if (!this.selectedCandidate) {
        return; // Ничего не делаем, если кандидат не выбран
      }

      try {
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            voting_id: this.voting.id,
            candidate_id: this.selectedCandidate,
            user_id: parseInt(localStorage.getItem('userId'), 10)
          })
        });

        if (!response.ok) {
          throw new Error('Ошибка отправки голоса');
        }

        // После успешной отправки голоса перенаправляем пользователя к списку голосований
        this.$router.push('/votings');
      } catch (err) {
        this.error = err.message;
      }
    }
  }
}
</script>