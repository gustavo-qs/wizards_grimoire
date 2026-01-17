<template>
  <div class="spell-slot-tracker">
    <div class="tracker-header">
      <h3>Spell Slot Tracker</h3>
      <button @click="showConfig = !showConfig" class="config-btn">
        {{ showConfig ? 'Hide Config' : 'Configure' }}
      </button>
    </div>

    <!-- Configuration Panel -->
    <div v-if="showConfig" class="config-panel">
      <div class="config-section">
        <label>Character Name:</label>
        <input
          v-model="characterName"
          type="text"
          placeholder="Character name"
          @blur="saveCharacter"
        />
      </div>

      <div class="config-section">
        <label>Classes & Levels:</label>
        <div v-for="(classInfo, index) in characterClasses" :key="index" class="class-row">
          <select v-model="classInfo.class" @change="saveCharacter">
            <option value="">Select Class</option>
            <option v-for="cls in availableClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <input
            v-model.number="classInfo.level"
            type="number"
            min="1"
            max="20"
            placeholder="Level"
            @blur="saveCharacter"
          />
          <button @click="removeClass(index)" class="remove-btn">X</button>
        </div>
        <button @click="addClass" class="add-btn">+ Add Class</button>
      </div>

      <div class="total-level">
        Total Level: {{ totalLevel }}
      </div>
    </div>

    <!-- Spell Slots Display -->
    <div v-if="!showConfig && hasCharacter" class="slots-container">
      <div class="character-info">
        <strong>{{ spellStore.spellSlots.character.name || 'Unnamed Character' }}</strong>
        <span class="level-badge">Level {{ totalLevel }}</span>
      </div>

      <!-- Regular Spell Slots -->
      <div class="spell-slots">
        <div
          v-for="level in 9"
          :key="level"
          class="slot-level"
          v-show="spellStore.spellSlots.slots[level].total > 0"
        >
          <div class="slot-level-header">
            <span class="slot-label">Level {{ level }}</span>
            <span class="slot-count">
              {{ spellStore.spellSlots.slots[level].total - spellStore.spellSlots.slots[level].used }} /
              {{ spellStore.spellSlots.slots[level].total }}
            </span>
          </div>
          <div class="slot-circles">
            <div
              v-for="slotIndex in spellStore.spellSlots.slots[level].total"
              :key="slotIndex"
              class="slot-circle"
              :class="{
                'used': slotIndex <= spellStore.spellSlots.slots[level].used,
                'available': slotIndex > spellStore.spellSlots.slots[level].used
              }"
              @click="toggleSlot(level, slotIndex)"
            >
              <span v-if="slotIndex <= spellStore.spellSlots.slots[level].used">✕</span>
              <span v-else>{{ level }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pact Magic Slots (Warlock) -->
      <div v-if="spellStore.spellSlots.pactMagic.enabled" class="pact-magic">
        <div class="pact-header">
          <span class="pact-label">Pact Magic (Level {{ spellStore.spellSlots.pactMagic.level }})</span>
          <span class="slot-count">
            {{ spellStore.spellSlots.pactMagic.total - spellStore.spellSlots.pactMagic.used }} /
            {{ spellStore.spellSlots.pactMagic.total }}
          </span>
        </div>
        <div class="slot-circles">
          <div
            v-for="slotIndex in spellStore.spellSlots.pactMagic.total"
            :key="slotIndex"
            class="slot-circle pact"
            :class="{
              'used': slotIndex <= spellStore.spellSlots.pactMagic.used,
              'available': slotIndex > spellStore.spellSlots.pactMagic.used
            }"
            @click="togglePactSlot(slotIndex)"
          >
            <span v-if="slotIndex <= spellStore.spellSlots.pactMagic.used">✕</span>
            <span v-else>P{{ spellStore.spellSlots.pactMagic.level }}</span>
          </div>
        </div>
      </div>

      <!-- Rest Buttons -->
      <div class="rest-buttons">
        <button @click="spellStore.shortRest()" class="rest-btn short">
          Short Rest
          <span class="rest-info">(Pact Magic only)</span>
        </button>
        <button @click="spellStore.longRest()" class="rest-btn long">
          Long Rest
          <span class="rest-info">(All slots)</span>
        </button>
      </div>
    </div>

    <div v-if="!showConfig && !hasCharacter" class="empty-state">
      <p>Configure your character to track spell slots</p>
      <button @click="showConfig = true" class="config-btn">Configure Character</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSpellStore } from '../stores/spellStore'

const spellStore = useSpellStore()

const showConfig = ref(false)
const characterName = ref(spellStore.spellSlots.character.name || '')
const characterClasses = ref(
  spellStore.spellSlots.character.classes.length > 0
    ? [...spellStore.spellSlots.character.classes]
    : [{ class: '', level: 1 }]
)

const availableClasses = [
  'Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin',
  'Ranger', 'Sorcerer', 'Warlock', 'Wizard'
]

const totalLevel = computed(() => {
  return characterClasses.value.reduce((sum, c) => sum + (c.level || 0), 0)
})

const hasCharacter = computed(() => {
  return characterClasses.value.some(c => c.class && c.level > 0)
})

const addClass = () => {
  characterClasses.value.push({ class: '', level: 1 })
}

const removeClass = (index) => {
  if (characterClasses.value.length > 1) {
    characterClasses.value.splice(index, 1)
    saveCharacter()
  }
}

const saveCharacter = () => {
  const validClasses = characterClasses.value.filter(c => c.class && c.level > 0)
  spellStore.updateCharacter(characterName.value, validClasses)

  // Update local refs
  characterName.value = spellStore.spellSlots.character.name
  characterClasses.value = spellStore.spellSlots.character.classes.length > 0
    ? [...spellStore.spellSlots.character.classes]
    : [{ class: '', level: 1 }]
}

const toggleSlot = (level, slotIndex) => {
  if (slotIndex <= spellStore.spellSlots.slots[level].used) {
    // Restore this slot and all after it
    spellStore.restoreSpellSlot(level)
  } else {
    // Use this slot (fill up to this one)
    while (spellStore.spellSlots.slots[level].used < slotIndex) {
      spellStore.useSpellSlot(level)
    }
  }
}

const togglePactSlot = (slotIndex) => {
  if (slotIndex <= spellStore.spellSlots.pactMagic.used) {
    spellStore.restorePactSlot()
  } else {
    while (spellStore.spellSlots.pactMagic.used < slotIndex) {
      spellStore.usePactSlot()
    }
  }
}

// Watch for external changes
watch(() => spellStore.spellSlots.character.name, (newName) => {
  characterName.value = newName
})
</script>

<style scoped>
.spell-slot-tracker {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background-color: #1e1b18;
  border-radius: 10px;
  padding: 20px;
  color: #f8f5f2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.tracker-header h3 {
  color: #d8b84a;
  margin: 0;
  font-size: 1.3rem;
}

.config-btn {
  padding: 8px 16px;
  background-color: #7b1d0a;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.config-btn:hover {
  background-color: #5f1407;
}

.config-panel {
  background-color: #2a2420;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.config-section {
  margin-bottom: 15px;
}

.config-section label {
  display: block;
  color: #d8b84a;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1rem;
}

.config-section input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  background-color: #3e2e1c;
  border: 1px solid #7b1d0a;
  border-radius: 6px;
  color: #f8f5f2;
  font-size: 1rem;
}

.class-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.class-row select {
  flex: 2;
  padding: 8px 12px;
  background-color: #3e2e1c;
  border: 1px solid #7b1d0a;
  border-radius: 6px;
  color: #f8f5f2;
  font-size: 1rem;
}

.class-row input[type="number"] {
  flex: 1;
  padding: 8px 12px;
  background-color: #3e2e1c;
  border: 1px solid #7b1d0a;
  border-radius: 6px;
  color: #f8f5f2;
  font-size: 1rem;
}

.remove-btn {
  padding: 8px 12px;
  background-color: #8b0000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background-color: #660000;
}

.add-btn {
  padding: 8px 16px;
  background-color: #2d5016;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 5px;
}

.add-btn:hover {
  background-color: #1f3a0f;
}

.total-level {
  color: #d8b84a;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  margin-top: 10px;
}

.slots-container {
  margin-top: 15px;
}

.character-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #2a2420;
  border-radius: 6px;
  margin-bottom: 15px;
}

.character-info strong {
  color: #d8b84a;
  font-size: 1.1rem;
}

.level-badge {
  background-color: #7b1d0a;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
}

.spell-slots {
  margin-bottom: 15px;
}

.slot-level {
  margin-bottom: 15px;
}

.slot-level-header, .pact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.slot-label, .pact-label {
  color: #d8b84a;
  font-weight: bold;
  font-size: 1rem;
}

.slot-count {
  color: #f8f5f2;
  font-size: 0.95rem;
}

.slot-circles {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.slot-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  user-select: none;
}

.slot-circle.available {
  background-color: #d8b84a;
  color: #1e1b18;
  box-shadow: 0 2px 5px rgba(216, 184, 74, 0.3);
}

.slot-circle.available:hover {
  background-color: #f0d05c;
  transform: scale(1.1);
}

.slot-circle.used {
  background-color: #3e2e1c;
  color: #7b1d0a;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
}

.slot-circle.used:hover {
  background-color: #4e3e2c;
  transform: scale(1.1);
}

.slot-circle.pact.available {
  background-color: #9d3e9d;
  color: #fff;
  box-shadow: 0 2px 5px rgba(157, 62, 157, 0.3);
}

.slot-circle.pact.available:hover {
  background-color: #b44eb4;
}

.slot-circle.pact.used {
  background-color: #3e2e1c;
  color: #6d2e6d;
}

.pact-magic {
  background-color: #2a2028;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #9d3e9d;
  margin-bottom: 15px;
}

.rest-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.rest-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rest-btn.short {
  background-color: #2d5016;
  color: #fff;
}

.rest-btn.short:hover {
  background-color: #3a6b1c;
}

.rest-btn.long {
  background-color: #1d3a6b;
  color: #fff;
}

.rest-btn.long:hover {
  background-color: #2a4d8f;
}

.rest-info {
  font-size: 0.75rem;
  font-weight: normal;
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state p {
  color: #d8b84a;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .slot-circle {
    width: 35px;
    height: 35px;
    font-size: 0.85rem;
  }

  .rest-buttons {
    flex-direction: column;
  }
}
</style>
