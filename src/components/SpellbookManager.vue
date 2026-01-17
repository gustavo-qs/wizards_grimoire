<template>
  <div class="spellbook-manager">
    <div class="manager-header">
      <h3>My Spellbooks</h3>
      <button @click="showCreateForm = !showCreateForm" class="create-btn">
        {{ showCreateForm ? 'Cancel' : '+ New Spellbook' }}
      </button>
    </div>

    <!-- Create Spellbook Form -->
    <div v-if="showCreateForm" class="create-form">
      <input
        v-model="newSpellbook.name"
        type="text"
        placeholder="Spellbook name (e.g., My Wizard Level 5)"
        class="input-field"
      />
      <textarea
        v-model="newSpellbook.description"
        placeholder="Description (optional)"
        class="textarea-field"
        rows="2"
      ></textarea>
      <button @click="createNewSpellbook" class="submit-btn" :disabled="!newSpellbook.name.trim()">
        Create Spellbook
      </button>
    </div>

    <!-- Spellbooks List -->
    <div class="spellbooks-list">
      <div
        v-for="spellbook in spellStore.spellbooks"
        :key="spellbook.id"
        class="spellbook-card"
        :class="{ 'active': spellStore.activeSpellbookId === spellbook.id }"
      >
        <div class="spellbook-header">
          <div class="spellbook-info">
            <h4>{{ spellbook.name }}</h4>
            <p v-if="spellbook.description" class="description">{{ spellbook.description }}</p>
            <span class="spell-count">{{ spellbook.spellIds.length }} spells</span>
          </div>
          <div class="spellbook-actions">
            <button
              @click="toggleActiveSpellbook(spellbook.id)"
              class="action-btn"
              :class="{ 'active': spellStore.activeSpellbookId === spellbook.id }"
              :title="spellStore.activeSpellbookId === spellbook.id ? 'Deactivate' : 'Activate'"
            >
              {{ spellStore.activeSpellbookId === spellbook.id ? '★' : '☆' }}
            </button>
            <button
              @click="confirmDelete(spellbook)"
              class="action-btn delete"
              title="Delete spellbook"
            >
              ✕
            </button>
          </div>
        </div>

        <div v-if="editingSpellbook === spellbook.id" class="edit-form">
          <input
            v-model="editForm.name"
            type="text"
            placeholder="Spellbook name"
            class="input-field"
          />
          <textarea
            v-model="editForm.description"
            placeholder="Description"
            class="textarea-field"
            rows="2"
          ></textarea>
          <div class="edit-actions">
            <button @click="saveEdit(spellbook.id)" class="save-btn">Save</button>
            <button @click="cancelEdit" class="cancel-btn">Cancel</button>
          </div>
        </div>
        <div v-else class="spellbook-footer">
          <button @click="startEdit(spellbook)" class="edit-btn">Edit</button>
          <button @click="exportSpellbook(spellbook)" class="export-btn">Export JSON</button>
        </div>
      </div>

      <div v-if="spellStore.spellbooks.length === 0" class="empty-state">
        <p>No spellbooks yet. Create one to organize your spells!</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>Delete Spellbook?</h3>
        <p>Are you sure you want to delete "{{ spellbookToDelete?.name }}"?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="deleteSpellbook" class="confirm-delete-btn">Delete</button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Import Section -->
    <div class="import-section">
      <h4>Import Spellbook</h4>
      <input
        type="file"
        accept=".json"
        @change="importSpellbook"
        ref="fileInput"
        style="display: none"
      />
      <button @click="$refs.fileInput.click()" class="import-btn">
        Import from JSON
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSpellStore } from '../stores/spellStore'

const spellStore = useSpellStore()

const showCreateForm = ref(false)
const newSpellbook = ref({
  name: '',
  description: ''
})

const editingSpellbook = ref(null)
const editForm = ref({
  name: '',
  description: ''
})

const showDeleteConfirm = ref(false)
const spellbookToDelete = ref(null)

const createNewSpellbook = () => {
  if (newSpellbook.value.name.trim()) {
    spellStore.createSpellbook(newSpellbook.value.name, newSpellbook.value.description)
    newSpellbook.value = { name: '', description: '' }
    showCreateForm.value = false
  }
}

const toggleActiveSpellbook = (spellbookId) => {
  if (spellStore.activeSpellbookId === spellbookId) {
    spellStore.activeSpellbookId = null
  } else {
    spellStore.activeSpellbookId = spellbookId
  }
  localStorage.setItem('wizardGrimoire_activeSpellbook', JSON.stringify(spellStore.activeSpellbookId))
}

const startEdit = (spellbook) => {
  editingSpellbook.value = spellbook.id
  editForm.value = {
    name: spellbook.name,
    description: spellbook.description || ''
  }
}

const saveEdit = (spellbookId) => {
  spellStore.updateSpellbook(spellbookId, editForm.value)
  cancelEdit()
}

const cancelEdit = () => {
  editingSpellbook.value = null
  editForm.value = { name: '', description: '' }
}

const confirmDelete = (spellbook) => {
  spellbookToDelete.value = spellbook
  showDeleteConfirm.value = true
}

const deleteSpellbook = () => {
  if (spellbookToDelete.value) {
    spellStore.deleteSpellbook(spellbookToDelete.value.id)
    cancelDelete()
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  spellbookToDelete.value = null
}

const exportSpellbook = (spellbook) => {
  const data = JSON.stringify(spellbook, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${spellbook.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importSpellbook = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result)
      // Validate structure
      if (imported.name && Array.isArray(imported.spellIds)) {
        spellStore.createSpellbook(
          imported.name + ' (Imported)',
          imported.description || ''
        )
        const newSpellbook = spellStore.spellbooks[spellStore.spellbooks.length - 1]
        newSpellbook.spellIds = imported.spellIds
        localStorage.setItem('wizardGrimoire_spellbooks', JSON.stringify(spellStore.spellbooks))
        alert('Spellbook imported successfully!')
      } else {
        alert('Invalid spellbook format')
      }
    } catch (error) {
      alert('Error importing spellbook: ' + error.message)
    }
  }
  reader.readAsText(file)
  event.target.value = '' // Reset file input
}
</script>

<style scoped>
.spellbook-manager {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background-color: #1e1b18;
  border-radius: 10px;
  padding: 20px;
  color: #f8f5f2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.manager-header h3 {
  color: #d8b84a;
  margin: 0;
  font-size: 1.3rem;
}

.create-btn {
  padding: 10px 20px;
  background-color: #2d5016;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s;
  font-weight: bold;
}

.create-btn:hover {
  background-color: #3a6b1c;
}

.create-form {
  background-color: #2a2420;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.input-field, .textarea-field {
  width: 100%;
  padding: 10px 12px;
  background-color: #3e2e1c;
  border: 1px solid #7b1d0a;
  border-radius: 6px;
  color: #f8f5f2;
  font-size: 1rem;
  margin-bottom: 10px;
  font-family: inherit;
}

.textarea-field {
  resize: vertical;
}

.submit-btn {
  width: 100%;
  padding: 10px 20px;
  background-color: #d8b84a;
  color: #1e1b18;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #f0d05c;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spellbooks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.spellbook-card {
  background-color: #2a2420;
  border-radius: 8px;
  padding: 15px;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.spellbook-card.active {
  border-color: #d8b84a;
  box-shadow: 0 0 15px rgba(216, 184, 74, 0.3);
}

.spellbook-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.spellbook-info {
  flex: 1;
}

.spellbook-info h4 {
  color: #d8b84a;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.description {
  color: #c0b0a0;
  font-size: 0.9rem;
  margin: 5px 0;
  font-style: italic;
}

.spell-count {
  display: inline-block;
  background-color: #7b1d0a;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-top: 5px;
}

.spellbook-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.active {
  background-color: #d8b84a;
  color: #1e1b18;
}

.action-btn:not(.active):not(.delete) {
  background-color: #3e2e1c;
  color: #d8b84a;
}

.action-btn:not(.active):not(.delete):hover {
  background-color: #4e3e2c;
}

.action-btn.delete {
  background-color: #8b0000;
  color: #fff;
}

.action-btn.delete:hover {
  background-color: #660000;
}

.edit-form {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #3e2e1c;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.save-btn, .cancel-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.save-btn {
  background-color: #2d5016;
  color: #fff;
}

.save-btn:hover {
  background-color: #3a6b1c;
}

.cancel-btn {
  background-color: #3e2e1c;
  color: #f8f5f2;
}

.cancel-btn:hover {
  background-color: #4e3e2c;
}

.spellbook-footer {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #3e2e1c;
}

.edit-btn, .export-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #7b1d0a;
  color: #fff;
}

.edit-btn:hover {
  background-color: #5f1407;
}

.export-btn {
  background-color: #3e2e1c;
  color: #d8b84a;
  font-weight: bold;
}

.export-btn:hover {
  background-color: #4e3e2c;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #d8b84a;
  font-size: 1.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #2a2420;
  padding: 25px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
  border: 2px solid #7b1d0a;
}

.modal-content h3 {
  color: #d8b84a;
  margin: 0 0 15px 0;
  font-size: 1.3rem;
}

.modal-content p {
  color: #f8f5f2;
  margin: 10px 0;
  font-size: 1rem;
}

.warning {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 0.95rem !important;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.confirm-delete-btn {
  flex: 1;
  padding: 10px 20px;
  background-color: #8b0000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.confirm-delete-btn:hover {
  background-color: #660000;
}

.import-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 2px solid #3e2e1c;
}

.import-section h4 {
  color: #d8b84a;
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

.import-btn {
  width: 100%;
  padding: 10px 20px;
  background-color: #3e2e1c;
  color: #d8b84a;
  border: 2px dashed #7b1d0a;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: bold;
  transition: all 0.3s;
}

.import-btn:hover {
  background-color: #4e3e2c;
  border-color: #d8b84a;
}

@media (max-width: 768px) {
  .spellbook-header {
    flex-direction: column;
    gap: 10px;
  }

  .spellbook-actions {
    align-self: flex-end;
  }
}
</style>
