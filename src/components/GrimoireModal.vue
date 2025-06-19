<template>
  <div>
    <transition name="fade">
      <div v-if="showModal" class="overlay" @click.self="closeModal">
        <div class="book-modal">
          <div class="inner-cover left-cover"></div>
          <div class="page left-page">
            <div class="page-content">
              <div class="columns">
                <ul>
                  <li
                    v-for="(spell, name) in leftCol1"
                    :key="'left1-' + name"
                    class="spellOption"
                    @click="openSpellModal(spell)"
                    style="cursor:pointer; user-select:none;"
                  >
                    {{ spell.name }} <br> (Level: {{ spell.level }})
                  </li>
                </ul>
                <ul>
                  <li
                    v-for="(spell, name) in leftCol2"
                    :key="'left2-' + name"
                    class="spellOption"
                    @click="openSpellModal(spell)"
                    style="cursor:pointer; user-select:none;"
                  >
                    {{ spell.name }} <br> (Level: {{ spell.level }})
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Dorso do livro -->
          <div class="book-spine"></div>
          <!-- Página Direita -->
          <div class="page right-page">
            <div class="page-content">
              <div class="columns">
                <ul>
                  <li
                    v-for="(spell, name) in rightCol1"
                    :key="'right1-' + name"
                    class="spellOption"
                    @click="openSpellModal(spell)"
                    style="cursor:pointer; user-select:none;"
                  >
                    {{ spell.name }} <br> (Level: {{ spell.level }})
                  </li>
                </ul>
                <ul>
                  <li
                    v-for="(spell, name) in rightCol2"
                    :key="'right2-' + name"
                    class="spellOption"
                    @click="openSpellModal(spell)"
                    style="cursor:pointer; user-select:none;"
                  >
                    {{ spell.name }} <br> (Level: {{ spell.level }})
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Capa interna direita -->
          <div class="inner-cover right-cover"></div>
          <SpellModal
            v-if="showSpellModal && selectedSpell"
            :show="showSpellModal"
            :spell="selectedSpell"
            @close="showSpellModal = false"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch } from 'vue';
import SpellModal from './SpellModal.vue';

const props = defineProps({
  spells: {
    type: Map,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
});

const showModal = ref(props.show);

watch(() => props.show, (val) => {
  showModal.value = val;
});

function closeModal() {
  showModal.value = false;
  showSpellModal.value = false;
  emit('update:show', false);
}

const showSpellModal = ref(false);
const selectedSpell = ref(null);

function openSpellModal(spell) {
  selectedSpell.value = spell;
  showSpellModal.value = true;
}

// Divide as spells em duas páginas
const spellsArray = computed(() => Array.from(props.spells.values()).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)));
const half = computed(() => Math.ceil(spellsArray.value.length / 2));
const leftPageSpells = computed(() => spellsArray.value.slice(0, half.value));
const rightPageSpells = computed(() => spellsArray.value.slice(half.value));

// Divide cada página em duas colunas
function splitColumns(arr) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}
const [leftCol1, leftCol2] = (() => {
  const [col1, col2] = splitColumns(leftPageSpells.value);
  return [ref(col1), ref(col2)];
})();
const [rightCol1, rightCol2] = (() => {
  const [col1, col2] = splitColumns(rightPageSpells.value);
  return [ref(col1), ref(col2)];
})();

// Atualiza as colunas quando as spells mudam
watch(leftPageSpells, (val) => {
  const [col1, col2] = splitColumns(val);
  leftCol1.value = col1;
  leftCol2.value = col2;
});
watch(rightPageSpells, (val) => {
  const [col1, col2] = splitColumns(val);
  rightCol1.value = col1;
  rightCol2.value = col2;
});

const emit = defineEmits(['update:show']);
</script>

<style scoped>
/* Fundo semitransparente */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Fade in/out */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.book-modal {
  position: relative;
  width: 80vw;
  max-width: 800px;
  height: 60vh;
  max-height: 600px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  perspective: 1000px;
  /* Adiciona espaço para as capas */
  padding: 0 2vw;
}

/* Capas internas */
.inner-cover {
  width: 3vw;
  min-width: 24px;
  max-width: 40px;
  height: 100%;
  background: 
    url('/public/leather-texture.jpg') repeat;
  background-size: cover;
  border-radius: 18px 8px 18px 8px / 18px 8px 18px 8px;
  box-shadow:
    0 0 24px 6px rgba(60, 40, 20, 0.25) inset,
    0 0 0 4px #3b2410 inset;
  filter: sepia(0.3) contrast(1.1) brightness(0.85);
  z-index: 3;
  position: relative;
}
.left-cover {
  margin-right: -12px;
  border-right: 4px solid #2d1808;
}
.right-cover {
  margin-left: -12px;
  border-left: 4px solid #2d1808;
}

/* Dorso do livro */
.book-spine {
  width: 2vw;
  min-width: 16px;
  max-width: 28px;
  height: 94%;
  margin-top: 3%;
  margin-bottom: 3%;
  background: 
    url('/public/leather-texture.jpg') repeat;
  background-size: cover;
  border-radius: 12px;
  box-shadow:
    0 0 16px 4px rgba(60, 40, 20, 0.18) inset,
    0 0 0 2px #3b2410 inset;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 4;
  transform: skewY(-7deg);
}

/* Efeito de costura */
.book-spine::before {
  content: "";
  display: block;
  width: 60%;
  height: 90%;
  margin: 0 auto;
  border-left: 2px dashed #e2cfa3;
  border-right: 2px dashed #e2cfa3;
  opacity: 0.5;
  border-radius: 8px;
}

/* Ajuste das páginas para encostar no dorso */
.left-page {
  transform: rotateY(15deg);
  transform-origin: left center;
  margin-right: -8px;
  z-index: 5;
}
.right-page {
  transform: rotateY(-15deg);
  transform-origin: right center;
  margin-left: -8px;
  z-index: 5;
}

.page {
  width: 50%;
  height: 100%;
  background:
    linear-gradient(135deg, #f6ecd6 0%, #f3e3b7 100%),
    url('/public/cardboard.jpg') repeat;
  background-size: cover;
  background-blend-mode: multiply;
  box-shadow:
    0 0 40px 10px rgba(120, 90, 40, 0.15) inset,
    0 2px 16px 2px rgba(80, 60, 20, 0.18),
    0 0 0 8px #e2cfa3 inset;
  overflow: hidden;
  position: relative;
  border: 2px solid #bfa76a;
  border-radius: 16px 12px 18px 14px / 18px 14px 16px 12px;
  filter: sepia(0.18) contrast(1.08) brightness(0.97);
}

.page-content {
  padding: 24px;
  line-height: 1.6;
  color: #333;
}

ul {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

li.spellOption {
  background: none;
  border: none;
  color: #4b2e13;
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  font-size: 1.05rem;
  padding: 4px 0;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

li.spellOption:hover {
  background: #e2cfa3a0;
  color: #7b1d0a;
}

.open-button {
  padding: 8px 16px;
  background: #6b4f2a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #6b4f2a;
  color: #fff;
  border: none;
  font-size: 24px;
  width: 32px;
  height: 32px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
}

/* Bordas rasgadas e manchas */
.page::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 16px 12px 18px 14px / 18px 14px 16px 12px;
  box-shadow:
    0 0 0 6px rgba(180, 150, 80, 0.12) inset,
    0 0 24px 8px rgba(120, 90, 40, 0.09) inset;
  background: 
    radial-gradient(circle at 80% 20%, rgba(180,150,80,0.08) 0, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(120,90,40,0.07) 0, transparent 70%);
  z-index: 1;
}

/* Manchas extras */
.page::after {
  content: "";
  position: absolute;
  left: 20%;
  top: 60%;
  width: 60px;
  height: 30px;
  background: radial-gradient(ellipse at center, rgba(180,150,80,0.13) 0%, transparent 80%);
  opacity: 0.7;
  pointer-events: none;
  z-index: 2;
  transform: rotate(-8deg);
}

.columns {
  display: flex;
  flex-direction: row;
  gap: 18px;
  justify-content: space-between;
}

.columns ul {
  flex: 1 1 0;
  padding-left: 0;
  margin: 0 2px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 900px) {
  .columns {
    flex-direction: column;
    gap: 0;
  }
  .columns ul {
    margin: 0;
  }
}
</style>
