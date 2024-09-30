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
      </fieldset><br>

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

<style scoped>

input[type="text"] {
  width: 100%; /* Full width input */
  padding: 10px 15px; /* Padding around the input */
  font-size: 1rem; /* Font size for better readability */
  border-radius: 6px; /* Rounded corners */
  border: 1px solid #ccc; /* Light border */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle inner shadow */
  background-color: #f9f9f9; /* Light background color */
  transition: all 0.3s ease; /* Smooth transition on focus */
}

/* Focused state for the input */
input[type="text"]:focus {
  outline: none; /* Remove default outline */
  border-color: #007bff; /* Blue border on focus */
  background-color: #fff; /* White background on focus */
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.4); /* Glowing effect */
}

/* Input placeholder styling */
input[type="text"]::placeholder {
  color: #aaa; /* Lighter color for the placeholder */
  font-style: italic; /* Optional: Make placeholder text italic */
}

/* Styling for the container */
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Form styling */
form {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
}

input[list="spells"] {
  margin-left: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Button styling */
button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.2s ease;
}

button:hover {
  background-color: #0056b3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

p {
  margin: 10px 0;
  font-size: 1rem;
  color: #333;
}

/* Styling for the translate button */
button:nth-child(2) {
  background-color: #28a745;
}

button:nth-child(2):hover {
  background-color: #218838;
}

/* Bold titles for spell details */
strong {
  font-weight: bold;
  color: #007bff;
  font-size: 1.1rem;
}

/* Adding some margin to the descriptions and additional information */
div p + p {
  margin-top: 20px;
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

/* Optional: Additional spacing for the last items */
span:last-child {
  margin-right: 0;
}

/* Fieldset for class and level checkboxes */
fieldset {
  border: none;
  padding: 10px;
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  gap: 10px; /* Add space between checkboxes */
}

legend {
  font-weight: bold;
  font-size: 1.1rem;
  color: #007bff;
  margin-bottom: 10px;
}

/* Checkbox label styling */
label {
  display: flex; /* Change to flex for side-by-side layout */
  align-items: center; /* Center the checkbox with label */
}

input[type="checkbox"] {
  margin-right: 10px;
  accent-color: #007bff;
}

/* Styling for filtered spell list */
h3 {
  color: #007bff;
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
  background-color: #e9f5ff;
  padding: 10px 15px;
  width: 150px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #333;
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
    width: 100%; /* Make buttons and inputs full width */
  }

  span, label, legend {
    font-size: 0.9rem;
  }

  li {
    width: calc(50% - 10px); /* Two items per row */
    font-size: 0.9rem;
  }

  fieldset {
    flex-direction: column; /* Stack checkboxes vertically */
    align-items: flex-start; /* Align items to start */
  }
}

@media (max-width: 480px) {
  li {
    width: 100%; /* Full width for smallest screens */
  }

  button {
    font-size: 0.85rem; /* Smaller button font size */
  }

  p, strong {
    font-size: 0.9rem; /* Smaller text for better readability */
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

.modal-body {
  margin-top: 15px;
}
</style>