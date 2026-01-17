<template>
  <div class="page">
    <!-- Navigation Tabs -->
    <div class="tabs-container">
      <button
        @click="activeTab = 'search'"
        class="tab"
        :class="{ active: activeTab === 'search' }"
      >
        🔍 Search
      </button>
      <button
        @click="activeTab = 'filters'"
        class="tab"
        :class="{ active: activeTab === 'filters' }"
      >
        ⚙️ Filters
      </button>
      <button
        @click="activeTab = 'spellbooks'"
        class="tab"
        :class="{ active: activeTab === 'spellbooks' }"
      >
        📚 Spellbooks
      </button>
      <button
        @click="activeTab = 'slots'"
        class="tab"
        :class="{ active: activeTab === 'slots' }"
      >
        ✨ Spell Slots
      </button>
    </div>

    <!-- Search Tab -->
    <div v-if="activeTab === 'search'" class="container">
      <!-- Quick Search -->
      <form @submit.prevent="selectSpell(searchQuery)">
        <label>Find a spell:
          <input
            v-model="searchQuery"
            type="text"
            list="spells"
            name="spells"
            placeholder="Type spell name or keywords..."
          />
        </label>
        <datalist id="spells">
          <option v-for="spell in filteredSpells" :key="spell.name" :value="spell.name" />
        </datalist><br>
        <button @click="selectSpell(searchQuery)" type="submit">Search</button>
      </form>

      <SpellModal v-if="spellObj" :show="showModal" :spell="spellObj" @close="showModal = false" />

      <br>

      <!-- Class and Level Filters -->
      <h1>Filter Spells</h1>

      <!-- Multiclass Toggle -->
      <div class="multiclass-section">
        <label class="multiclass-toggle">
          <input type="checkbox" v-model="spellStore.multiclassMode" />
          Enable Multiclass Mode
        </label>
        <div v-if="spellStore.multiclassMode" class="multiclass-logic">
          <label>
            <input type="radio" value="OR" v-model="spellStore.multiclassLogic" />
            Show spells from ANY selected class
          </label>
          <label>
            <input type="radio" value="AND" v-model="spellStore.multiclassLogic" />
            Show spells available to ALL selected classes
          </label>
        </div>
      </div>

      <!-- Class checkboxes -->
      <fieldset>
        <legend>Classes:</legend>
        <div v-for="cls in classes" :key="cls">
          <label>
            <input type="checkbox" :value="cls" v-model="selectedClasses" />
            {{ cls }}
          </label>
        </div>
      </fieldset>

      <!-- Level checkboxes -->
      <fieldset>
        <legend>Levels:</legend>
        <div v-for="level in levels" :key="level">
          <label>
            <input type="checkbox" :value="level" v-model="selectedLevels" />
            {{ level === 0 ? 'Cantrip' : 'Level ' + level }}
          </label>
        </div>
      </fieldset>

      <!-- Spell Count -->
      <div class="spell-count-badge">
        {{ filteredSpells.length }} spell{{ filteredSpells.length !== 1 ? 's' : '' }} found
      </div>

      <!-- Spells List -->
      <div v-if="filteredSpells.length">
        <h3>Spells:</h3>
        <ul>
          <li
            class="spell"
            v-for="spell in filteredSpells"
            :key="spell.name"
            @click="selectFilteredSpell(spell.name)"
          >
            <div class="spell-card-content">
              <span class="spell-name">{{ spell.name }}</span>
              <span class="spell-level-badge">{{ spell.level === 0 ? 'Cantrip' : 'Lvl ' + spell.level }}</span>
              <span
                v-if="spellStore.isFavorite(spell.id)"
                class="favorite-indicator"
                title="Favorite"
              >
                ★
              </span>
            </div>
            <div class="spell-meta">
              <span class="school">{{ spell.school }}</span>
            </div>
          </li>
        </ul>
      </div>
      <p v-else class="no-results">No spells match the selected filters.</p>
    </div>

    <!-- Filters Tab -->
    <div v-if="activeTab === 'filters'" class="container">
      <AdvancedFilters />
    </div>

    <!-- Spellbooks Tab -->
    <div v-if="activeTab === 'spellbooks'" class="container">
      <SpellbookManager />
    </div>

    <!-- Spell Slots Tab -->
    <div v-if="activeTab === 'slots'" class="container">
      <SpellSlotTracker />
    </div>
  </div>
</template>

<script setup>
import spells from '../assets/spells.json'
import { ref, computed, watch } from 'vue'
import { useSpellStore } from '../stores/spellStore'
import SpellModal from '../components/SpellModal.vue'
import AdvancedFilters from '../components/AdvancedFilters.vue'
import SpellbookManager from '../components/SpellbookManager.vue'
import SpellSlotTracker from '../components/SpellSlotTracker.vue'

const spellStore = useSpellStore()

// Define available D&D classes and levels
const classes = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// State
const selectedSpell = ref(null)
const spellObj = ref(null)
const showModal = ref(false)
const selectedClasses = ref([])
const selectedLevels = ref([])
const activeTab = ref('search') // 'search', 'spellbooks', 'slots', 'filters'
const searchQuery = ref('')

// Filter spells based on all criteria
const filteredSpells = computed(() => {
  let result = spells

  // Basic class filter
  if (selectedClasses.value.length > 0) {
    if (spellStore.multiclassMode && spellStore.multiclassLogic === 'AND') {
      // ALL selected classes must have access
      result = result.filter(spell =>
        selectedClasses.value.every(cls => spell.classes.includes(cls))
      )
    } else {
      // ANY selected class has access
      result = result.filter(spell =>
        selectedClasses.value.some(cls => spell.classes.includes(cls))
      )
    }
  }

  // Basic level filter
  if (selectedLevels.value.length > 0) {
    result = result.filter(spell => selectedLevels.value.includes(spell.level))
  }

  // Search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(spell =>
      spell.name.toLowerCase().includes(query) ||
      spell.description.toLowerCase().includes(query)
    )
  }

  // Advanced Filters
  const filters = spellStore.advancedFilters

  // School filter
  if (filters.schools.length > 0) {
    result = result.filter(spell => filters.schools.includes(spell.school))
  }

  // Components filter
  if (filters.components.verbal !== null) {
    result = result.filter(spell => spell.V === filters.components.verbal)
  }
  if (filters.components.somatic !== null) {
    result = result.filter(spell => spell.S === filters.components.somatic)
  }
  if (filters.components.material !== null) {
    result = result.filter(spell => (!!spell.M) === filters.components.material)
  }
  if (filters.components.noMaterialCost) {
    result = result.filter(spell => !spell.M)
  }

  // Casting time filter
  if (filters.castingTimes.length > 0) {
    result = result.filter(spell =>
      filters.castingTimes.some(time => spell.casting_time.includes(time))
    )
  }

  // Damage type filter
  if (filters.damageTypes.length > 0) {
    result = result.filter(spell =>
      filters.damageTypes.some(damageType =>
        spell.description.toLowerCase().includes(damageType.toLowerCase())
      )
    )
  }

  // Saving throw filter
  if (filters.savingThrows.length > 0) {
    result = result.filter(spell =>
      filters.savingThrows.some(save =>
        spell.description.includes(`${save} saving throw`)
      )
    )
  }

  // Ritual filter
  if (filters.ritualOnly) {
    result = result.filter(spell => spell.ritual === true)
  }

  // Concentration filter
  if (filters.concentrationOnly) {
    result = result.filter(spell => spell.concentration === true)
  }

  // Favorites filter
  if (filters.showOnlyFavorites) {
    result = result.filter(spell => spellStore.isFavorite(spell.id))
  }

  // Active spellbook filter
  if (filters.showOnlyActiveSpellbook && spellStore.activeSpellbook) {
    result = result.filter(spell =>
      spellStore.activeSpellbook.spellIds.includes(spell.id)
    )
  }

  return result.sort((a, b) => a.level - b.level)
})

function selectSpell(spellName) {
  spellObj.value = spells.find(spell => spell.name === spellName)
  showModal.value = true
}

function selectFilteredSpell(spellName) {
  selectSpell(spellName)
}

// Watch for search query changes
watch(searchQuery, () => {
  if (searchQuery.value.trim()) {
    selectedSpell.value = searchQuery.value
  }
})
</script>

<style scoped>
/* Page wrapper */
.page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(to bottom, #0d0b0a 0%, #1e1b18 100%);
}

/* Tabs Navigation */
.tabs-container {
  display: flex;
  gap: 10px;
  max-width: 900px;
  margin: 0 auto 30px auto;
  flex-wrap: wrap;
  justify-content: center;
}

.tab {
  flex: 1;
  min-width: 140px;
  padding: 12px 20px;
  background-color: #2a2420;
  color: #d8b84a;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab:hover {
  background-color: #3e2e1c;
}

.tab.active {
  background-color: #1e1b18;
  border-bottom-color: #d8b84a;
  color: #f8f5f2;
  transform: translateY(3px);
}

/* Container */
.container {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1e1b18;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: #f8f5f2;
}

/* Multiclass Section */
.multiclass-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #2a2420;
  border-radius: 8px;
  border: 2px solid #7b1d0a;
}

.multiclass-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d8b84a;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.multiclass-toggle input[type="checkbox"] {
  accent-color: #d8b84a;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.multiclass-logic {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #3e2e1c;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.multiclass-logic label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f8f5f2;
  font-size: 0.95rem;
  cursor: pointer;
  user-select: none;
}

.multiclass-logic input[type="radio"] {
  accent-color: #d8b84a;
  cursor: pointer;
}

/* Form styling */
form {
  margin-bottom: 20px;
}

h1 {
  color: #d8b84a;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #d8b84a;
  font-size: 1rem;
}

input[list="spells"] {
  margin-left: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #7b1d0a;
  font-size: 1rem;
  background-color: #3e2e1c;
  color: #f8f5f2;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  width: calc(100% - 120px);
  transition: border-color 0.3s;
}

input[list="spells"]:focus {
  border-color: #d8b84a;
  outline: none;
}

/* Button styling */
button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #b85c38;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.2s ease;
  margin-top: 15px;
  font-family: 'Cinzel', serif;
}

button:hover {
  background-color: #5f1407;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Spell Count Badge */
.spell-count-badge {
  background-color: #2d5016;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.spell-count-badge strong {
  color: #d8b84a;
}

/* Fieldset for class and level checkboxes */
fieldset {
  border: none;
  padding: 10px;
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

legend {
  font-weight: bold;
  font-size: 1.1rem;
  color: #d8b84a;
  margin-bottom: 10px;
}

label {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
  accent-color: #d8b84a;
}

/* Spell list styling */
h3 {
  color: #d8b84a;
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

li.spell {
  background: linear-gradient(135deg, #3e2e1c 0%, #2a2420 100%);
  padding: 12px 16px;
  width: calc(50% - 5px);
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  color: #f8f5f2;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

li.spell:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(216, 184, 74, 0.3);
  border-color: #d8b84a;
  background: linear-gradient(135deg, #4e3e2c 0%, #3a3020 100%);
}

.spell-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.spell-name {
  font-weight: bold;
  color: #d8b84a;
  font-size: 1rem;
  flex: 1;
}

.spell-level-badge {
  background-color: #7b1d0a;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
}

.favorite-indicator {
  color: #ffd700;
  font-size: 1.1rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

.spell-meta {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
}

.school {
  color: #c0b0a0;
  font-style: italic;
}

.no-results {
  text-align: center;
  color: #d8b84a;
  font-size: 1.1rem;
  padding: 40px 20px;
  background-color: #2a2420;
  border-radius: 8px;
  margin-top: 20px;
}

/* Responsive layout */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .tabs-container {
    flex-direction: column;
  }

  .tab {
    min-width: 100%;
  }

  input[list="spells"] {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }

  button {
    width: 100%;
    font-size: 0.9rem;
  }

  li.spell {
    width: 100%;
  }

  fieldset {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  button {
    font-size: 0.85rem;
  }

  p, strong {
    font-size: 0.9rem;
  }
}
</style>
