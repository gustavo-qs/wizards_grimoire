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
        <p><strong>Casting Time:</strong> {{ selectedSpell.casting_time }}</p>
        <p><strong>School:</strong> {{ selectedSpell.school }}</p>
        <p><strong>Classes:</strong> {{ selectedSpell.classes }}</p>
        <p><strong>Book:</strong> {{ selectedSpell.book }}</p>
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
  background: rgba(0, 0, 0, 0.85); /* Dark overlay with more opacity */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
  font-family: 'Cinzel', serif; /* Fantasy-like font for D&D aesthetic */
}

.modal-content {
  background: #3b2f2f; /* Dark parchment-like background */
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.3s ease;
  border: 2px solid #a67f58; /* Bronze border to match D&D styling */
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
  top: 10px;
  right: 20px;
  font-size: 1.5rem;
  color: #ddd; /* Lighter color to match the theme */
  cursor: pointer;
  transition: color 0.2s ease;
  background: none;
}

.close-button:hover {
  color: #e63946; /* Red highlight for hover */
}

.modal-content h2 {
  font-size: 1.8rem; /* Slightly larger title */
  margin: 0;
  color: #f1e9d2; /* Light parchment color for text */
  text-align: center; /* Centered title for a more dramatic effect */
}

.modal-content p {
  margin: 10px 0;
  line-height: 1.6; 
  color: #d4c4a1; /* Lighter parchment color for paragraph text */
  font-size: 1.1rem;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #b85c38; /* Red/brownish button for thematic look */
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.2s ease;
  margin-top: 15px;
  font-family: 'Cinzel', serif;
}

button:hover {
  background-color: #9d3e26;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

strong {
  font-weight: bold;
  color: #f1e9d2;
  font-size: 1.2rem; /* Slightly larger to emphasize importance */
}

div p + p {
  margin-top: 15px;
}

span {
  display: inline-block;
  margin-right: 10px;
  padding: 4px 8px;
  background-color: #4b3832; /* Darker background for span */
  border-radius: 6px;
  font-size: 0.95rem;
  color: #e9d8a6; /* Parchment color for text */
  font-weight: bold;
}

span:last-child {
  margin-right: 0;
}

@media (max-width: 770px) and (max-height: 945px) {
  .close-button {
    display: none;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #1e1b18;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  min-width: 300px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  color: #f8f5f2;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #f8f5f2;
  position: absolute;
  top: 10px;
  right: 10px;
}

.modal-body {
  margin-top: 15px;
}

/* Esconde o botão de fechar em telas menores que 770x945 */
@media (max-width: 770px) and (max-height: 945px) {
  .close-button {
    display: none;
  }
}
</style>