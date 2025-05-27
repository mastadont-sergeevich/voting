<template>
  <div class="admin-container">
    <h1>Административная панель</h1>

    <h2>Список голосований</h2>
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Текущий лидер</th>
          <th>Активно</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="voting in votings" :key="voting.id">
          <td>{{ voting.title }}</td>
          <td>
            <div v-if="leaders[voting.id] && leaders[voting.id].length > 0">
              <div v-for="(leader, index) in leaders[voting.id]" :key="leader.id">
                {{ leader.name }}<span v-if="index < leaders[voting.id].length - 1">, </span>
              </div>
            </div>
            <div v-else-if="leaders[voting.id] === undefined">
              Загрузка...
            </div>
            <div v-else>
              Нет данных
            </div>
          </td>
          <td>
            <input
              type="checkbox"
              :checked="voting.isactive"
              @change="toggleVotingStatus(voting.id, !voting.isactive)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <button class="add-voting-btn" @click="openAddModal">+ Добавить голосование</button>

    <!-- Модальное окно добавления -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h3>Добавить новое голосование</h3>
        <form @submit.prevent="handleAddVoting">
          <div class="form-group">
            <label for="title">Название голосования:</label>
            <input 
              id="title" 
              v-model="newVoting.title" 
              type="text" 
              required
              placeholder="Введите название"
            >
          </div>
          
          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="isactive"
              v-model="newVoting.isactive"
            >
            <label for="isactive">Активно</label>
          </div>
          
          <div class="form-group">
            <label>Кандидаты:</label>
            <div class="candidates-list">
              <div 
                v-for="(candidate, index) in newVoting.candidates" 
                :key="index" 
                class="candidate-item"
              >
                <input
                  v-model="candidate.name"
                  type="text"
                  required
                  placeholder="Имя кандидата"
                  class="candidate-input"
                >
                <button 
                  type="button" 
                  @click="removeCandidate(index)"
                  class="remove-candidate-btn"
                  :disabled="newVoting.candidates.length <= 1"
                >
                  ×
                </button>
              </div>
            </div>
            <button 
              type="button" 
              @click="addCandidate"
              class="add-candidate-btn"
            >
              + Добавить кандидата
            </button>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeAddModal">Отмена</button>
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">Создание...</span>
              <span v-else>Создать голосование</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Admin',
  setup() {
    const votings = ref([]);
    const leaders = ref({});
    const showAddModal = ref(false);
    const isSubmitting = ref(false);
    const newVoting = ref({
      title: '',
      isactive: true,
      candidates: [{ name: '' }]
    });

    const fetchVotings = async () => {
      try {
        const response = await fetch('/api/votings');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        votings.value = await response.json();
        
        votings.value.forEach(voting => {
          fetchLeaders(voting.id);
        });
      } catch (error) {
        console.error('Ошибка при загрузке голосований:', error);
      }
    };

    const fetchLeaders = async (votingId) => {
      try {
        const response = await fetch(`/api/votings/${votingId}/leaders`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        leaders.value = { ...leaders.value, [votingId]: await response.json() };
      } catch (error) {
        console.error(`Ошибка при загрузке лидеров для ${votingId}:`, error);
        leaders.value = { ...leaders.value, [votingId]: [] };
      }
    };

    const toggleVotingStatus = async (votingId, isActive) => {
      try {
        const response = await fetch(`/api/votings/${votingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isactive: isActive }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const updatedVoting = await response.json();
        const index = votings.value.findIndex(v => v.id === votingId);
        if (index !== -1) {
          votings.value = [
            ...votings.value.slice(0, index),
            updatedVoting,
            ...votings.value.slice(index + 1)
          ];
        }
      } catch (error) {
        console.error('Ошибка при изменении статуса:', error);
      }
    };

    const openAddModal = () => {
      showAddModal.value = true;
    };

    const closeAddModal = () => {
      showAddModal.value = false;
      resetNewVoting();
    };

    const addCandidate = () => {
      newVoting.value.candidates.push({ name: '' });
    };

    const removeCandidate = (index) => {
      if (newVoting.value.candidates.length > 1) {
        newVoting.value.candidates.splice(index, 1);
      }
    };

    const resetNewVoting = () => {
      newVoting.value = {
        title: '',
        isactive: true,
        candidates: [{ name: '' }]
      };
      isSubmitting.value = false;
    };

    const handleAddVoting = async () => {
      if (isSubmitting.value) return;
      
      isSubmitting.value = true;
      
      try {
        // 1. Создаем голосование
        const votingResponse = await fetch('/api/votings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newVoting.value.title,
            isactive: newVoting.value.isactive
          }),
        });

        if (!votingResponse.ok) throw new Error(`Ошибка при создании голосования: ${votingResponse.status}`);
        const addedVoting = await votingResponse.json();
        
        // 2. Создаем кандидатов
        const candidatesToCreate = newVoting.value.candidates
          .filter(c => c.name.trim() !== '')
          .map(candidate => ({
            name: candidate.name.trim(),
            voting_id: addedVoting.id
          }));

        if (candidatesToCreate.length === 0) {
          throw new Error('Добавьте хотя бы одного кандидата');
        }

        const candidatesPromises = candidatesToCreate.map(candidate => 
          fetch('/api/candidates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidate),
          })
        );

        const candidatesResponses = await Promise.all(candidatesPromises);
        for (const response of candidatesResponses) {
          if (!response.ok) throw new Error('Ошибка при создании кандидата');
        }

        // 3. Обновляем UI
        votings.value = [...votings.value, addedVoting];
        await fetchLeaders(addedVoting.id);
        closeAddModal();
        
      } catch (error) {
        console.error('Ошибка при добавлении голосования:', error);
        alert(error.message || 'Не удалось создать голосование. Пожалуйста, попробуйте снова.');
      } finally {
        isSubmitting.value = false;
      }
    };

    const openEditModal = (voting) => {
      console.log('Редактирование голосования:', voting);
      // Реализуем позже
    };

    onMounted(() => {
      fetchVotings();
    });

    return {
      votings,
      leaders,
      showAddModal,
      newVoting,
      isSubmitting,
      toggleVotingStatus,
      openAddModal,
      closeAddModal,
      addCandidate,
      removeCandidate,
      handleAddVoting,
      openEditModal,
    };
  },
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

input[type="checkbox"] {
  transform: scale(1.2);
  cursor: pointer;
}

.edit-btn {
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #45a049;
}

.add-voting-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.add-voting-btn:hover {
  background-color: #0b7dda;
  transform: translateY(-2px);
}

/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
}

.close:hover {
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  margin-right: 10px;
}

/* Стили для кандидатов */
.candidates-list {
  margin-bottom: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.candidate-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.candidate-input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}

.remove-candidate-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-candidate-btn:hover:not(:disabled) {
  background-color: #cc0000;
}

.remove-candidate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.add-candidate-btn {
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: all 0.2s;
}

.add-candidate-btn:hover {
  background-color: #e0e0e0;
  border-color: #999;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.modal-actions button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>