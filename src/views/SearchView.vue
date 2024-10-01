<script setup>
  import spells from '../assets/spells.json'
  import { ref, watch } from 'vue'
  import SpellModal from '../components/SpellModal.vue'

  const classes = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
  const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  var selectedSpell = ref(null),
      spellObj = ref(null),
      showModal = ref(false),
      selectedClasses = ref([]),
      selectedLevels = ref([]),
      searchTerm = ref(''), // Add this to track the search term
      filteredSpells = ref(spells.sort((a, b) => a.level - b.level));

  function selectSpell() {
    spellObj.value = spells.find(spell => spell.name === selectedSpell.value);
    showModal.value = true;
  }

  function filterSpells(){
    filteredSpells.value = spells.filter(spell => {
      const matchesClass = selectedClasses.value.length === 0 || selectedClasses.value.some(cls => spell.classes.includes(cls));
      const matchesLevel = selectedLevels.value.length === 0 || selectedLevels.value.includes(spell.level);
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.value.toLowerCase()); // Add search functionality
      return matchesClass && matchesLevel && matchesSearch;
    });

    filteredSpells.value = filteredSpells.value.sort((a, b) => a.level - b.level);
  }

  // Watch searchTerm and apply filtering as the user types
  watch(searchTerm, () => {
    filterSpells();
  });

  function selectFilteredSpell(spellName) {
    selectedSpell.value = spellName;
    selectSpell();
  }
</script>

<template>
  <div class="container">
    <form @submit.prevent>
      <SpellModal v-if="spellObj" :show="showModal" :spell="spellObj" @close="showModal = false" />

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

      <fieldset>
        <legend>Search for a spell:</legend>
        <input type="text" v-model="searchTerm" placeholder="Enter spell name" />
      </fieldset>

      <!-- List the filtered spells -->
      <div v-if="filteredSpells.length">
        <h3>Spells:</h3>
        <ul>
          <li v-for="spell in filteredSpells" :key="spell.name" @click="selectFilteredSpell(spell.name)">
            {{ spell.name }} <br> (Level: {{ spell.level }})
          </li>
        </ul>
      </div>
      <p v-else>No spells match the selected filters.</p>
    </form>
  </div>
</template>

<style>

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
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #7b1d0a; /* Deep red button */
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.2s ease;
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
</style>