<template>
  <div class="advanced-filters">
    <div class="filters-header">
      <h3>Advanced Filters</h3>
      <div class="header-actions">
        <button @click="spellStore.resetAdvancedFilters()" class="reset-btn">
          Clear All
        </button>
        <button @click="expanded = !expanded" class="toggle-btn">
          {{ expanded ? 'Hide' : 'Show' }}
        </button>
      </div>
    </div>

    <div v-show="expanded" class="filters-content">
      <!-- Quick Toggles -->
      <div class="quick-filters">
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="spellStore.advancedFilters.showOnlyFavorites"
          />
          ⭐ Favorites Only
        </label>
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="spellStore.advancedFilters.showOnlyActiveSpellbook"
            :disabled="!spellStore.activeSpellbook"
          />
          📖 Active Spellbook Only
        </label>
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="spellStore.advancedFilters.ritualOnly"
          />
          🕯️ Ritual Only
        </label>
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="spellStore.advancedFilters.concentrationOnly"
          />
          🧠 Concentration Only
        </label>
      </div>

      <!-- School of Magic -->
      <div class="filter-section">
        <button @click="toggleSection('schools')" class="section-header">
          <span>School of Magic</span>
          <span class="toggle-icon">{{ openSections.schools ? '▼' : '▶' }}</span>
        </button>
        <div v-show="openSections.schools" class="section-content">
          <div class="checkbox-grid">
            <label
              v-for="school in spellStore.availableSchools"
              :key="school"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :value="school"
                v-model="spellStore.advancedFilters.schools"
              />
              {{ school }}
            </label>
          </div>
        </div>
      </div>

      <!-- Components -->
      <div class="filter-section">
        <button @click="toggleSection('components')" class="section-header">
          <span>Components</span>
          <span class="toggle-icon">{{ openSections.components ? '▼' : '▶' }}</span>
        </button>
        <div v-show="openSections.components" class="section-content">
          <div class="component-filters">
            <div class="component-row">
              <span class="component-label">Verbal (V):</span>
              <select v-model="spellStore.advancedFilters.components.verbal">
                <option :value="null">Any</option>
                <option :value="true">Required</option>
                <option :value="false">Not Required</option>
              </select>
            </div>
            <div class="component-row">
              <span class="component-label">Somatic (S):</span>
              <select v-model="spellStore.advancedFilters.components.somatic">
                <option :value="null">Any</option>
                <option :value="true">Required</option>
                <option :value="false">Not Required</option>
              </select>
            </div>
            <div class="component-row">
              <span class="component-label">Material (M):</span>
              <select v-model="spellStore.advancedFilters.components.material">
                <option :value="null">Any</option>
                <option :value="true">Required</option>
                <option :value="false">Not Required</option>
              </select>
            </div>
            <label class="toggle-label">
              <input
                type="checkbox"
                v-model="spellStore.advancedFilters.components.noMaterialCost"
              />
              No Material Components
            </label>
          </div>
        </div>
      </div>

      <!-- Casting Time -->
      <div class="filter-section">
        <button @click="toggleSection('castingTime')" class="section-header">
          <span>Casting Time</span>
          <span class="toggle-icon">{{ openSections.castingTime ? '▼' : '▶' }}</span>
        </button>
        <div v-show="openSections.castingTime" class="section-content">
          <div class="checkbox-grid">
            <label
              v-for="time in spellStore.availableCastingTimes"
              :key="time"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :value="time"
                v-model="spellStore.advancedFilters.castingTimes"
              />
              {{ time }}
            </label>
          </div>
        </div>
      </div>

      <!-- Damage Type -->
      <div class="filter-section">
        <button @click="toggleSection('damageType')" class="section-header">
          <span>Damage Type</span>
          <span class="toggle-icon">{{ openSections.damageType ? '▼' : '▶' }}</span>
        </button>
        <div v-show="openSections.damageType" class="section-content">
          <div class="checkbox-grid">
            <label
              v-for="damageType in spellStore.availableDamageTypes"
              :key="damageType"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :value="damageType"
                v-model="spellStore.advancedFilters.damageTypes"
              />
              {{ damageType }}
            </label>
          </div>
        </div>
      </div>

      <!-- Saving Throw -->
      <div class="filter-section">
        <button @click="toggleSection('savingThrow')" class="section-header">
          <span>Saving Throw</span>
          <span class="toggle-icon">{{ openSections.savingThrow ? '▼' : '▶' }}</span>
        </button>
        <div v-show="openSections.savingThrow" class="section-content">
          <div class="checkbox-grid">
            <label
              v-for="save in spellStore.availableSavingThrows"
              :key="save"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :value="save"
                v-model="spellStore.advancedFilters.savingThrows"
              />
              {{ save }}
            </label>
          </div>
        </div>
      </div>

      <!-- Active Filters Summary -->
      <div v-if="activeFiltersCount > 0" class="active-filters-summary">
        <strong>{{ activeFiltersCount }}</strong> active filter{{ activeFiltersCount !== 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSpellStore } from '../stores/spellStore'

const spellStore = useSpellStore()

const expanded = ref(false)
const openSections = ref({
  schools: false,
  components: false,
  castingTime: false,
  damageType: false,
  savingThrow: false
})

const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section]
}

const activeFiltersCount = computed(() => {
  let count = 0
  const filters = spellStore.advancedFilters

  if (filters.schools.length > 0) count++
  if (filters.components.verbal !== null) count++
  if (filters.components.somatic !== null) count++
  if (filters.components.material !== null) count++
  if (filters.components.noMaterialCost) count++
  if (filters.castingTimes.length > 0) count++
  if (filters.damageTypes.length > 0) count++
  if (filters.savingThrows.length > 0) count++
  if (filters.ritualOnly) count++
  if (filters.concentrationOnly) count++
  if (filters.showOnlyFavorites) count++
  if (filters.showOnlyActiveSpellbook) count++

  return count
})
</script>

<style scoped>
.advanced-filters {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background-color: #1e1b18;
  border-radius: 10px;
  padding: 20px;
  color: #f8f5f2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.filters-header h3 {
  color: #d8b84a;
  margin: 0;
  font-size: 1.3rem;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.reset-btn, .toggle-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.reset-btn {
  background-color: #7b1d0a;
  color: #fff;
}

.reset-btn:hover {
  background-color: #5f1407;
}

.toggle-btn {
  background-color: #3e2e1c;
  color: #d8b84a;
}

.toggle-btn:hover {
  background-color: #4e3e2c;
}

.filters-content {
  margin-top: 15px;
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #2a2420;
  border-radius: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f8f5f2;
  font-size: 0.95rem;
  cursor: pointer;
  user-select: none;
}

.toggle-label input[type="checkbox"] {
  accent-color: #d8b84a;
  cursor: pointer;
}

.toggle-label input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-section {
  margin-bottom: 15px;
  background-color: #2a2420;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  width: 100%;
  padding: 12px 15px;
  background-color: #3e2e1c;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #d8b84a;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.section-header:hover {
  background-color: #4e3e2c;
}

.toggle-icon {
  color: #d8b84a;
  font-size: 0.8rem;
}

.section-content {
  padding: 15px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f8f5f2;
  font-size: 0.95rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #d8b84a;
  cursor: pointer;
}

.component-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.component-label {
  color: #d8b84a;
  font-weight: bold;
  font-size: 0.95rem;
}

.component-row select {
  flex: 1;
  max-width: 150px;
  padding: 6px 10px;
  background-color: #3e2e1c;
  border: 1px solid #7b1d0a;
  border-radius: 6px;
  color: #f8f5f2;
  font-size: 0.95rem;
  cursor: pointer;
}

.active-filters-summary {
  margin-top: 15px;
  padding: 12px;
  background-color: #2d5016;
  border-radius: 6px;
  text-align: center;
  color: #fff;
  font-size: 1rem;
}

.active-filters-summary strong {
  color: #d8b84a;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .quick-filters {
    flex-direction: column;
    gap: 10px;
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    gap: 5px;
  }

  .reset-btn, .toggle-btn {
    width: 100%;
  }
}
</style>
