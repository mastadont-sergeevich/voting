<template>
  <div class="login-container">
    <h1>ВХОД В СИСТЕМУ</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      >
      <input
        type="password"
        v-model="password"
        placeholder="Пароль"
        required
      >
      <button type="submit">Войти</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (response.status < 200 || response.status >= 300) { // Проверяем статус ответа
          this.error = await response.text();
          return;
        }

        const userData = await response.json(); // Получаем данные пользователя

        // Сохраняем данные пользователя в localStorage только если это user
        if (userData.role !== 'admin') {
          localStorage.setItem('userId', userData.id);
          localStorage.setItem('userEmail', userData.email);
        }

        // Перенаправляем в зависимости от роли
        if (userData.role === 'admin') {
          this.$router.push('/admin');
        } else {
          this.$router.push('/votings');
        }

      } catch (err) {
        this.error = 'Ошибка соединения с сервером';
        console.error(err);
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
button {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>