<script setup>
import spells from '../assets/spells.json'
import { ref, watch, onMounted } from 'vue'
import { createDraggable } from 'animejs'
import SpellModal from '../components/SpellModal.vue'

const classes = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const selectedSpell = ref(null)
const spellObj = ref(null)
const showModal = ref(false)
const selectedClasses = ref([])
const selectedLevels = ref([])
const searchTerm = ref('')
const filteredSpells = ref([])
const filteredGrimoireSpells = ref([])
const selectedSpells = ref(new Map())
const grimoireCheck = ref(false)

function selectSpell() {
  spellObj.value = spells.find(spell => spell.name === selectedSpell.value)
  showModal.value = true
}

function filterSpells() {
  if (grimoireCheck.value) {
    // Filtra apenas as spells do grimório
    filteredGrimoireSpells.value = Array.from(selectedSpells.value.values()).filter(spell => {
      const matchesClass = selectedClasses.value.length === 0 || selectedClasses.value.some(cls => spell.classes.includes(cls));
      const matchesLevel = selectedLevels.value.length === 0 || selectedLevels.value.includes(spell.level);
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      return matchesClass && matchesLevel && matchesSearch;
    }).sort((a, b) => a.level - b.level);
  } else {
    // Filtra todas as spells
    filteredSpells.value = spells.filter(spell => {
      const matchesClass = selectedClasses.value.length === 0 || selectedClasses.value.some(cls => spell.classes.includes(cls));
      const matchesLevel = selectedLevels.value.length === 0 || selectedLevels.value.includes(spell.level);
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      return matchesClass && matchesLevel && matchesSearch;
    }).sort((a, b) => a.level - b.level);
  }
  // Sempre reinicializa o draggable após filtrar
  initDraggable();
}

function selectFilteredSpell(spellName) {
  selectedSpell.value = spellName
  selectSpell()
}

function selectGrimoire() {
  grimoireCheck.value = !grimoireCheck.value
  filterSpells()
}

function handleSpellDrop(spellName) {
  const spellData = spells.find(s => s.name === spellName)
  if (!spellData) return

  if (!grimoireCheck.value) {
    // Adiciona ao grimório se não estiver lá
    if (!selectedSpells.value.has(spellName)) {
      selectedSpells.value.set(spellName, spellData)
    }
  } else {
    // Remove do grimório se estiver lá
    if (selectedSpells.value.has(spellName)) {
      selectedSpells.value.delete(spellName)
    }
  }
  filterSpells()
}

function initDraggable() {
  setTimeout(() => {
    document.querySelectorAll('.spell').forEach(spell => {
      const draggable = createDraggable(spell, {
        onRelease: () => {
          const rect = spell.getBoundingClientRect();
          const book = document.querySelector('.book');
          const bookRect = book.getBoundingClientRect();

          if (
            rect.left < bookRect.right &&
            rect.right > bookRect.left &&
            rect.top < bookRect.bottom &&
            rect.bottom > bookRect.top
          ) {
            const spellName = spell.textContent.split('  (')[0].trim();
            handleSpellDrop(spellName)
          }
          draggable.reset();
        }
      });
    });
  }, 0);
}

// Filtros reativos
watch([searchTerm, selectedClasses, selectedLevels], filterSpells, { deep: true });
watch(selectedSpells, () => {
  if (grimoireCheck.value) filterSpells()
}, { deep: true });

onMounted(() => {
  filterSpells()
});
</script>

<template>
  <div class="page">
    <img src="/logo.png" alt="Logo" class="logo-outside"/>

    <div class="container">
      <form @submit.prevent>
        <SpellModal v-if="spellObj" :show="showModal" :spell="spellObj" @close="showModal = false" />

        <fieldset>
          <legend>Classes:</legend>
          <div v-for="cls in classes" :key="cls">
            <label>
              <input type="checkbox" :value="cls" v-model="selectedClasses" />
              {{ cls }}
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Levels:</legend>
          <div v-for="level in levels" :key="level">
            <label>
              <input type="checkbox" :value="level" v-model="selectedLevels" />
              {{ level === 0 ? 'Cantrip' : 'Level ' + level }}
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Search for a spell:</legend>
          <input type="text" v-model="searchTerm" placeholder="Enter spell name" />
        </fieldset>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>Spells:</h3>
          <label>
            <button type="button" @click="selectGrimoire()">
              {{ grimoireCheck ? 'All Spells' : 'Grimoire Spells' }}
            </button>
          </label>
        </div>
        <div v-if="grimoireCheck ? filteredGrimoireSpells.length : filteredSpells.length">
          <ul>
            <li
              class="spell"
              v-for="spell in grimoireCheck ? filteredGrimoireSpells : filteredSpells"
              :key="spell.name"
              @click="selectFilteredSpell(spell.name)"
              style="cursor: pointer; user-select: none;"
            >
              {{ spell.name }} <br> (Level: {{ spell.level }})
            </li>
          </ul>
        </div>
        <p v-else>No spells match the selected filters.</p>
      </form>
    </div>

    <div @click="selectGrimoire()" class="book">
      <div class="book-cover cover1">
        <div class="effect"></div>
        <div class="light"></div>
      </div>
      <div class="book-inside"></div>
    </div>
  </div>
</template>

<style>

.spell{
  z-index: 3;
}

.book {
  width: 225px;
  height: 350px;
  position: fixed; 
  text-align: center;
  top: 40px; 
  margin:2.5%;
  margin-right: 10%;
  right: 0;
  z-index: 1;
  box-shadow:
    0 16px 40px 0 #000000a0,
    0 2px 8px 0 #d8b84a80,
    0 0 0 8px #fff0 inset;
  transform: perspective(1200px) rotateY(-12deg) rotateX(8deg) scale(1.05);
  transition: 
    box-shadow 0.4s cubic-bezier(.4,2,.6,1),
    transform 0.4s cubic-bezier(.4,2,.6,1);
  animation: book-float 2.5s ease-in-out infinite alternate;
}

@keyframes book-float {
  0% { transform: perspective(1200px) rotateY(-12deg) rotateX(8deg) scale(1.05) translateY(0); }
  100% { transform: perspective(1200px) rotateY(-12deg) rotateX(8deg) scale(1.08) translateY(-12px); }
}

.book:hover {
  box-shadow:
    0 32px 80px 0 #000000cc,
    0 4px 16px 0 #d8b84a,
    0 0 0 12px #fff2 inset;
  transform: perspective(1200px) rotateY(-18deg) rotateX(12deg) scale(1.12) translateY(-8px);
}

.book-cover {
  position: absolute;
  z-index:1;
  width: 100%;
  height: 100%;
  transform-origin: 0 50%;
  -webkit-transform-origin: 0 50%;
  background: #111;
  background-size:cover;
  border-radius: 3px;
  box-shadow: 
    inset 4px 1px 3px #ffffff60,
    inset 0 -1px 2px #00000080;
  transition: all .5s ease-in-out;
  -webkit-transition: all .5s ease-in-out;
}
.book .book-cover {
  background-size: 100% 100%;
}

.effect {
  width: 20px;
  height: 100%;
  margin-left: 10px;
  border-left: 2px solid #00000030;
  background-image: linear-gradient(90deg, rgba(80,70,50,0.25) 0%, rgba(40,30,20,0.05) 100%);
  filter: blur(1px) grayscale(0.4) brightness(0.7);
  transition: all .5s ease;
}

.light {
  width: 90%;
  height: 100%;
  position: absolute;
  border-radius: 3px; 
  background-image: linear-gradient(90deg, rgba(60,50,30,0) 0%, rgba(120,110,80,0.10) 100%);
  top: 0;
  right:0;
  opacity: .06;
  filter: blur(1.5px) grayscale(0.5) brightness(0.7);
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
}

.book:hover { cursor:pointer; }

.book:hover .book-cover {
  transform: perspective(2000px) rotateY(-30deg);
  -webkit-transform: perspective(2000px) rotateY(-30deg);
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  box-shadow: 
    inset 4px 1px 3px #ffffff60,
    inset 0 -1px 2px #00000080,
    10px 0px 10px -5px #00000030
}

.book:hover .effect {
  width: 40px;
}

.book:hover .light {
  opacity: 1;
  width: 70%;
}

.book-inside{
  width: calc(100% - 2px);
  height:96%;
  position:relative;
  top: 2%;
  border: 1px solid grey;
  border-radius:3px;
  background: white;
  box-shadow: 
  10px 40px 40px -10px #6b4f1d60, /* mais amarelado e envelhecido */
  inset -2px 0 0 #a0833a,
  inset -3px 0 0 #b58c1a,
  inset -4px 0 0 #f5e7c6,
  inset -5px 0 0 #e6d8b2,
  inset -6px 0 0 #f5e7c6,
  inset -7px 0 0 #e6d8b2,
  inset -8px 0 0 #f5e7c6,
  inset -9px 0 0 #e6d8b2;
}

.cover1 {
  background: url('/book.png');
}

body {
  background-color: #2b2a27;
}

input[type="text"] {
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #7b1d0a; /* Dark red border */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #2b1b0e; /* Dark brown background */
  color: #f8f5f2; /* Light text color */
  transition: all 0.3s ease;
}

/* Focused state for the input */
input[type="text"]:focus {
  outline: none;
  border-color: #d8b84a; /* Gold border on focus */
  background-color: #3e2e1c; /* Slightly lighter brown background */
  box-shadow: 0 0 6px rgba(216, 184, 74, 0.5); /* Gold glowing effect */
}

/* Input placeholder styling */
input[type="text"]::placeholder {
  color: #af8567; /* Muted brownish-gold placeholder */
  font-style: italic;
}

/* Styling for the container */
.container {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; /* Medieval-style font */
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1e1b18; /* Dark charcoal background */
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: #f8f5f2; /* Light text color */
  flex: 1 1 0;
}

/* Logo styles */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  max-width: 200px;
  height: auto;
}

/* Form styling */
form {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #d8b84a; /* Gold color for labels */
  font-size: 1rem;
}

input[list="spells"] {
  margin-left: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #7b1d0a; /* Dark red border */
  font-size: 1rem;
  background-color: #3e2e1c; /* Dark brown background */
  color: #f8f5f2; /* Light text */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Button styling */
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
  background-color: #5f1407; /* Darker red on hover */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

p {
  margin: 10px 0;
  font-size: 1rem;
  color: #f8f5f2;
}

/* Styling for the translate button */
button:nth-child(2) {
  background-color: #d8b84a; /* Gold button */
}

button:nth-child(2):hover {
  background-color: #b09538; /* Darker gold on hover */
}

/* Bold titles for spell details */
strong {
  font-weight: bold;
  color: #d8b84a; /* Gold */
  font-size: 1.1rem;
}

/* Additional margin for descriptions */
div p + p {
  margin-top: 20px;
}

span {
  display: inline-block;
  margin-right: 10px;
  padding: 4px 8px;
  background-color: #7b1d0a; /* Deep red background for tags */
  border-radius: 6px;
  font-size: 0.95rem;
  color: #f8f5f2; /* Light text */
  font-weight: bold;
}

span:last-child {
  margin-right: 0;
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
  color: #d8b84a; /* Gold */
  margin-bottom: 10px;
}

label {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
  accent-color: #d8b84a; /* Gold accent color for checkboxes */
}

/* Styling for filtered spell list */
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

li {
  background-color: #3e2e1c; /* Dark brown background */
  padding: 10px 15px;
  width: 150px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  color: #f8f5f2;
  font-size: 1rem;
  text-align: center;
}

/* Responsive layout */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  input[list="spells"], button {
    font-size: 0.9rem;
    width: 100%;
  }

  span, label, legend {
    font-size: 0.9rem;
  }

  li {
    width: calc(50% - 10px);
    font-size: 0.9rem;
  }

  fieldset {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  li {
    width: 100%;
  }

  button {
    font-size: 0.85rem;
  }

  p, strong {
    font-size: 0.9rem;
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

/* Wrapper for the page */
.page {
  display: block;
  position: relative;
  min-height: 400px;
}

.logo-outside {
  position: absolute;
  top: 20px;
  left: 20px; 
  /* max-width: 250px;
  min-width: none; */
  height: auto;
  z-index: 1;
}

.grid-cell {
  background-color: #3e2e1c; /* Dark brown background */
  padding: 10px 15px;
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  color: #f8f5f2;
  font-size: 1rem;
}

</style>