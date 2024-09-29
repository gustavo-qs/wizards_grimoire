<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <header>
        <h2>{{ selectedSpell.name }}</h2>
        <button class="close-button" @click="closeModal">X</button>
      </header>
      <div class="modal-body">
        <p><strong>Level:</strong> {{ selectedSpell.level }}</p>
        <p><strong>Range:</strong> {{ selectedSpell.range }}</p>
        <p><strong>Components:</strong>
          <span v-if="selectedSpell.V">V</span>
          <span v-if="selectedSpell.S">S</span>
          <span v-if="selectedSpell.M">M: {{ selectedSpell.M }}</span>
          <span v-if="selectedSpell.ritual">({{ selectedSpell.ritual && 'Ritual' }})</span>
        </p>
        <p><strong>Duration:</strong> {{ selectedSpell.concentration ? 'Concentration' : '' }} {{ selectedSpell.duration }}</p>
        <p><strong>Description:</strong> {{ selectedSpell.description }}</p>
        <p v-if="selectedSpell.higher_levels"><strong>At higher levels:</strong> {{ selectedSpell.higher_levels }}</p>

        <p v-if="diceNotations.size">
          <strong>Dice Notations:</strong>
          <span v-for="diceNotation in Array.from(diceNotations)" :key="diceNotation">{{ diceNotation }} </span>
        </p>

        <p v-if="savingThrows.size">
          <strong>Saving Throws:</strong>
          <span v-for="savingThrow in Array.from(savingThrows)" :key="savingThrow">{{ savingThrow }} </span>
        </p>

        <button @click="translateSpell">
          {{ translate ? 'Show Original' : 'Translate' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import translatedSpells from '../assets/translated_spells.json';
import spells from '../assets/spells.json';
import { defineProps, watch, ref } from 'vue';

const translate = ref(false);
const selectedSpell = ref({});
const diceNotations = ref(new Set());
const savingThrows = ref(new Set());
const diceNotationRegex = /\b\d+d\d+(?:\s*\+\s*\d+)?(?:\s+\w+\s+damage)?\b/g;
const savingThrowRegex = /\b(Intelligence|Dexterity|Strength|Charisma|Constitution|Wisdom)\s+saving throw\b/gi;

const props = defineProps({
  show: Boolean,
  spell: Object,
});
const emits = defineEmits(['close']);

watch(() => props.spell, (newSpell) => {
  selectedSpell.value = { ...newSpell };

  // Clear previous values
  diceNotations.value.clear();
  savingThrows.value.clear();

  // Extract dice notations from the description
  let match;

  while ((match = diceNotationRegex.exec(selectedSpell.value.description)) !== null) {
    diceNotations.value.add(match[0]);
  }

  // Extract saving throws from the description
  while ((match = savingThrowRegex.exec(selectedSpell.value.description)) !== null) {
    savingThrows.value.add(`${match[1]} saving throw`);
  }
}, { immediate: true });

function closeModal() {
  emits('close');
}

function translateSpell() {
  translate.value = !translate.value; // Toggle translation
  const spellList = translate.value ? translatedSpells : spells;
  selectedSpell.value = spellList.find(spell => spell.id === selectedSpell.value.id) || selectedSpell.value;
}
</script>

<style scoped>
/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Make sure it's on top */
  padding: 10px; /* Padding for the overlay */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%; /* Reduced width */
  max-width: 700px; /* Max width for larger screens */
  max-height: 80vh; /* Max height for viewport */
  overflow-y: auto; /* Enable vertical scrolling */
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease; 
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-button {
  position: absolute;
  top: 0px;
  right: 20px;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
  background-color: white;
}

.close-button:hover {
  color: #ff5c5c; 
}

.modal-content h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
}

.modal-content p {
  margin: 10px 0;
  line-height: 1.5; 
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.2s ease;
  margin-top: 15px;
}

button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

strong {
  font-weight: bold;
  color: #007bff;
  font-size: 1.1rem;
}

div p + p {
  margin-top: 15px;
}

span {
  display: inline-block;
  margin-right: 10px;
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #555;
  font-weight: bold;
}

span:last-child {
  margin-right: 0;
} 
</style>
