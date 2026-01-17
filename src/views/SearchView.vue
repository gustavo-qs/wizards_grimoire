<script setup>
import spells from '../assets/spells.json'
import { ref } from 'vue'
import SpellModal from '../components/SpellModal.vue'

// Define available D&D classes and levels
const classes = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

var selectedSpell = ref(null),
    spellObj = ref(null),
    showModal = ref(false),
    selectedClasses = ref([]),
    selectedLevels = ref([]),
    filteredSpells = ref(spells.sort((a, b) => a.level - b.level));

function selectSpell(pt = false) {

  spellObj.value = spells.find(spell => spell.name === selectedSpell.value);

  showModal.value = true;
}

// Filter spells based on selected classes and levels
function filterSpells() {
  filteredSpells.value = spells.filter(spell => {
    const matchesClass = selectedClasses.value.length === 0 || selectedClasses.value.some(cls => spell.classes.includes(cls));
    const matchesLevel = selectedLevels.value.length === 0 || selectedLevels.value.includes(spell.level);
    return matchesClass && matchesLevel;
  });

  filteredSpells.value = filteredSpells.value.sort((a, b) => a.level - b.level);
}

// Select a spell from the filtered list
function selectFilteredSpell(spellName) {
  selectedSpell.value = spellName;
  selectSpell();  // Call the selectSpell function to show the spell details
}
</script>

<template>
  <div class="container">
    <form @submit.prevent>
      <label>Find a spell:
        <input list="spells" name="spells" v-model="selectedSpell" />
      </label>
      <datalist id="spells">
        <option v-for="spell in filteredSpells" :key="spell.name" :value="spell.name" />
      </datalist><br>
      <button @click="selectSpell()" type="submit">Submit</button>
    </form>

    <SpellModal v-if="spellObj" :show="showModal" :spell="spellObj" @close="showModal = false" />

    <br>

  </div>

  <br>

  <div class="container">
    <form @submit.prevent>
      <h1>List spells</h1>

      <!-- Class checkboxes -->
      <fieldset>
        <legend>Classes:</legend>
        <div v-for="cls in classes" :key="cls">
          <label>
            <input type="checkbox" :value="cls" v-model="selectedClasses" @change="filterSpells" />
            {{ cls }}
          </label>
        </div>
      </fieldset>

      <!-- Level checkboxes -->
      <fieldset>
        <legend>Levels:</legend>
        <div v-for="level in levels" :key="level">
          <label>
            <input type="checkbox" :value="level" v-model="selectedLevels" @change="filterSpells" />
            {{ level === 0 ? 'Cantrip' : 'Level ' + level }}
          </label>
        </div>
      </fieldset>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>Spells:</h3>
          <label>
            <button type="button" @click="selectGrimoire()">
              {{ grimoireCheck ? 'All Spells' : 'Grimoire Spells' }}
            </button>
          </label>
        </div>
        <div style="margin-bottom: 12px; display: flex; justify-content: flex-end;">
          <label style="font-size: 1rem; color: #d8b84a;">
            <input type="checkbox" v-model="grimoireBookView" style="margin-right: 8px;" />
            Visualizar grimório como livro
          </label>
        </div>
        <!-- Lista de spells só aparece se não estiver no modo livro -->
        <div v-if="grimoireCheck ? (!grimoireBookView && filteredGrimoireSpells.length) : filteredSpells.length">
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
        <p v-else-if="!grimoireBookView && grimoireCheck && !filteredGrimoireSpells.length">No spells match the selected filters.</p>
        <p v-else-if="!grimoireCheck && !filteredSpells.length">No spells match the selected filters.</p>
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

<style scoped>
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