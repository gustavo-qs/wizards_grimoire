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

        <!-- Spell Management Buttons -->
        <div class="spell-actions">
          <button @click="toggleFavorite" class="favorite-btn" :class="{ 'is-favorite': spellStore.isFavorite(selectedSpell.id) }">
            {{ spellStore.isFavorite(selectedSpell.id) ? '★' : '☆' }} Favorite
          </button>

          <div class="spellbook-dropdown">
            <button @click="toggleSpellbookMenu" class="spellbook-btn">
              📖 Add to Spellbook
            </button>
            <div v-if="showSpellbookMenu" class="spellbook-menu">
              <div v-if="spellStore.spellbooks.length === 0" class="empty-menu">
                No spellbooks yet. Create one in the Spellbooks tab!
              </div>
              <label
                v-for="spellbook in spellStore.spellbooks"
                :key="spellbook.id"
                class="spellbook-option"
              >
                <input
                  type="checkbox"
                  :checked="spellStore.isInSpellbook(spellbook.id, selectedSpell.id)"
                  @change="toggleSpellInSpellbook(spellbook.id)"
                />
                {{ spellbook.name }}
              </label>
            </div>
          </div>

          <button @click="translateSpell" class="translate-btn">
            {{ translate ? 'Show Original' : 'Translate' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import translatedSpells from '../assets/translated_spells.json';
import spells from '../assets/spells.json';
import { defineProps, watch, ref } from 'vue';
import { useSpellStore } from '../stores/spellStore';

const spellStore = useSpellStore();

const translate = ref(false);
const selectedSpell = ref({});
const diceNotations = ref(new Set());
const savingThrows = ref(new Set());
const diceNotationRegex = /\b\d+d\d+(?:\s*\+\s*\d+)?(?:\s+\w+\s+damage)?\b/g;
const savingThrowRegex = /\b(Intelligence|Dexterity|Strength|Charisma|Constitution|Wisdom)\s+saving throw\b/gi;
const showSpellbookMenu = ref(false);

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

function toggleFavorite() {
  if (selectedSpell.value.id) {
    spellStore.toggleFavorite(selectedSpell.value.id);
  }
}

function toggleSpellbookMenu() {
  showSpellbookMenu.value = !showSpellbookMenu.value;
}

function toggleSpellInSpellbook(spellbookId) {
  if (!selectedSpell.value.id) return;

  if (spellStore.isInSpellbook(spellbookId, selectedSpell.value.id)) {
    spellStore.removeSpellFromSpellbook(spellbookId, selectedSpell.value.id);
  } else {
    spellStore.addSpellToSpellbook(spellbookId, selectedSpell.value.id);
  }
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
  padding: 10px; /* Adiciona margem interna uniforme */
  box-sizing: border-box; /* Inclui padding no cálculo da largura */
}

.modal-content {
  background: #3b2f2f; /* Dark parchment-like background */
  padding: 20px;
  border-radius: 10px;
  width: calc(100% - 20px); /* Ajusta largura para respeitar o padding da overlay */
  max-width: 700px; /* Mantém o limite máximo */
  max-height: 90vh; /* Limita a altura para caber na tela */
  box-sizing: border-box; /* Inclui padding e borda no cálculo da largura */
  overflow-y: auto; /* Permite rolagem vertical */
  position: relative;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.3s ease;
  border: 2px solid #a67f58; /* Bronze border to match D&D styling */
}

/* Oculta o scroll */
.modal-content::-webkit-scrollbar {
  width: 0; /* Remove a barra de rolagem */
}

.modal-content {
  scrollbar-width: none; /* Remove a barra de rolagem no Firefox */
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

/* Spell Actions Section */
.spell-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.favorite-btn {
  background-color: #3e2e1c;
  color: #d8b84a;
  margin: 0;
  flex: 1;
  min-width: 120px;
}

.favorite-btn.is-favorite {
  background-color: #d8b84a;
  color: #1e1b18;
  font-weight: bold;
}

.favorite-btn:hover {
  background-color: #4e3e2c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.favorite-btn.is-favorite:hover {
  background-color: #f0d05c;
}

.spellbook-dropdown {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.spellbook-btn {
  width: 100%;
  background-color: #7b1d0a;
  margin: 0;
}

.spellbook-btn:hover {
  background-color: #5f1407;
}

.spellbook-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #2a2420;
  border: 2px solid #7b1d0a;
  border-radius: 6px;
  margin-bottom: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.4);
}

.spellbook-option {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
  gap: 10px;
}

.spellbook-option:hover {
  background-color: #3e2e1c;
}

.spellbook-option input[type="checkbox"] {
  accent-color: #d8b84a;
  cursor: pointer;
}

.empty-menu {
  padding: 15px;
  text-align: center;
  color: #d8b84a;
  font-size: 0.9rem;
  font-style: italic;
}

.translate-btn {
  flex: 1;
  min-width: 120px;
  margin: 0;
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

@media (max-width: 768px) {
  .modal-content {
    width: 95%; /* Ajusta a largura para telas menores */
    max-width: none; /* Remove o limite máximo para telas pequenas */
  }
}
</style>