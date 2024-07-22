<script setup>
import spells from '../assets/spells.json'
import translatedSpells from '../assets/translated_spells.json'
import { ref } from 'vue'

var selectedSpell = ref(null),
    spellObj = ref(null),
    diceNotationRegex = /\b\d+d\d+(?:\s*\+\s*\d+)?(?:\s+\w+\s+damage)?\b/g,
    savingThrowRegex = /\b(\w+)\s+saving throw\b/gi,
    diceNotations = ref([]),
    match = ref(null),
    savingThrows = ref([]),
    translate = ref(false);

function selectSpell(pt = false) {
  savingThrows.value = [];
  diceNotations.value = [];

  spellObj.value = spells.find(spell => spell.name === selectedSpell.value);

  if(pt) spellObj.value = translatedSpells.find(spell => spell.id == spellObj.value.id);

  while ((match.value = diceNotationRegex.exec(spellObj.value.description)) !== null) {
    diceNotations.value.push(match.value[0]);
  }
  while ((match.value = savingThrowRegex.exec(spellObj.value.description)) !== null) {
    savingThrows.value.push(`${match.value[1]} saving throw`);
  }
};

</script>

<template>
  <main>
    <form @submit.prevent>
      <label>Choose a spell from this list:
        <input list="spells" name="spells" v-model="selectedSpell" />
      </label>
      <datalist id="spells">
        <option v-for="spell in spells" :key="spell.name" :value="spell.name" />
      </datalist>
      <button @click="selectSpell()" type="submit">Submit</button>
    </form>

    <div v-if="spellObj">

      <p><strong>Name:</strong> {{ spellObj.name }}</p>
      <p><strong>Level:</strong> {{ spellObj.level }}</p>
      <p><strong>Range:</strong> {{ spellObj.range }}</p>
      <p><strong>Components:</strong> {{ spellObj.components }}</p>

      <p><strong>Duration:</strong> {{ spellObj.duration }}</p>
      <br>

      <p><strong>Description:</strong> {{ spellObj.description }}</p>
      <br>

      <p v-if="spellObj.cast_higher"><strong>If cast at a higher level:</strong> {{ spellObj.higher_levels }}</p>
      <br>

      <p v-if="diceNotations.length">
        <strong>Dice Notations:</strong>
        <span v-for="diceNotation in diceNotations" :key="diceNotation">{{ diceNotation }} </span><br>
      </p>

      <p v-if="savingThrows.length">
        <strong>Saving Throws:</strong>
        <span v-for="savingThrow in savingThrows" :key="savingThrow">{{ savingThrow }} </span><br>
      </p>

      <button @click="selectSpell(translate = !translate)">
        Translate
      </button>

    </div>
  </main>
</template>

<style scoped>
/* styles.css */

/* Styling for the main container */
main {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Form styling */
form {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

input[list="spells"] {
  margin-left: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin: 10px 0;
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
}

/* Adding some margin to the descriptions and additional information */
div p + p {
  margin-top: 15px;
}

/* Styling for dice notations and saving throws */
span {
  display: inline-block;
  margin-right: 10px;
  padding: 2px 5px;
  background-color: #e9ecef;
  border-radius: 4px;
}

/* Optional: Additional spacing for the last items */
span:last-child {
  margin-right: 0;
}
</style>