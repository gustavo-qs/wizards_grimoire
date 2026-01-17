import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSpellStore = defineStore('spell', () => {
  // ============================================
  // FAVORITOS E SPELLBOOKS
  // ============================================

  const spellbooks = ref([])
  const activeSpellbookId = ref(null)
  const favorites = ref([]) // IDs das spells favoritas globais

  // Load from localStorage
  const loadFromStorage = () => {
    const savedSpellbooks = localStorage.getItem('wizardGrimoire_spellbooks')
    const savedFavorites = localStorage.getItem('wizardGrimoire_favorites')
    const savedActiveSpellbook = localStorage.getItem('wizardGrimoire_activeSpellbook')

    if (savedSpellbooks) {
      spellbooks.value = JSON.parse(savedSpellbooks)
    }
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites)
    }
    if (savedActiveSpellbook) {
      activeSpellbookId.value = JSON.parse(savedActiveSpellbook)
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('wizardGrimoire_spellbooks', JSON.stringify(spellbooks.value))
    localStorage.setItem('wizardGrimoire_favorites', JSON.stringify(favorites.value))
    localStorage.setItem('wizardGrimoire_activeSpellbook', JSON.stringify(activeSpellbookId.value))
  }

  // Spellbook management
  const createSpellbook = (name, description = '') => {
    const newSpellbook = {
      id: Date.now(),
      name,
      description,
      spellIds: [],
      createdAt: new Date().toISOString()
    }
    spellbooks.value.push(newSpellbook)
    saveToStorage()
    return newSpellbook
  }

  const deleteSpellbook = (spellbookId) => {
    spellbooks.value = spellbooks.value.filter(sb => sb.id !== spellbookId)
    if (activeSpellbookId.value === spellbookId) {
      activeSpellbookId.value = null
    }
    saveToStorage()
  }

  const updateSpellbook = (spellbookId, updates) => {
    const spellbook = spellbooks.value.find(sb => sb.id === spellbookId)
    if (spellbook) {
      Object.assign(spellbook, updates)
      saveToStorage()
    }
  }

  const addSpellToSpellbook = (spellbookId, spellId) => {
    const spellbook = spellbooks.value.find(sb => sb.id === spellbookId)
    if (spellbook && !spellbook.spellIds.includes(spellId)) {
      spellbook.spellIds.push(spellId)
      saveToStorage()
    }
  }

  const removeSpellFromSpellbook = (spellbookId, spellId) => {
    const spellbook = spellbooks.value.find(sb => sb.id === spellbookId)
    if (spellbook) {
      spellbook.spellIds = spellbook.spellIds.filter(id => id !== spellId)
      saveToStorage()
    }
  }

  // Favorites management
  const toggleFavorite = (spellId) => {
    const index = favorites.value.indexOf(spellId)
    if (index === -1) {
      favorites.value.push(spellId)
    } else {
      favorites.value.splice(index, 1)
    }
    saveToStorage()
  }

  const isFavorite = (spellId) => {
    return favorites.value.includes(spellId)
  }

  const isInSpellbook = (spellbookId, spellId) => {
    const spellbook = spellbooks.value.find(sb => sb.id === spellbookId)
    return spellbook ? spellbook.spellIds.includes(spellId) : false
  }

  const activeSpellbook = computed(() => {
    return spellbooks.value.find(sb => sb.id === activeSpellbookId.value) || null
  })

  // ============================================
  // FILTROS AVANÇADOS
  // ============================================

  const advancedFilters = ref({
    schools: [], // ['Evocation', 'Abjuration', ...]
    components: {
      verbal: null, // null = any, true = required, false = not required
      somatic: null,
      material: null,
      noMaterialCost: false // Only spells without material components
    },
    castingTimes: [], // ['1 action', '1 bonus action', '1 reaction', ...]
    ranges: [], // ['Self', 'Touch', '30 feet', ...]
    rangeMin: null, // Minimum range in feet (for numeric filters)
    rangeMax: null, // Maximum range in feet
    durations: [], // ['Instantaneous', 'Concentration', ...]
    damageTypes: [], // ['Fire', 'Cold', 'Psychic', ...]
    savingThrows: [], // ['Dexterity', 'Wisdom', ...]
    ritualOnly: false,
    concentrationOnly: false,
    showOnlyFavorites: false,
    showOnlyActiveSpellbook: false
  })

  const resetAdvancedFilters = () => {
    advancedFilters.value = {
      schools: [],
      components: {
        verbal: null,
        somatic: null,
        material: null,
        noMaterialCost: false
      },
      castingTimes: [],
      ranges: [],
      rangeMin: null,
      rangeMax: null,
      durations: [],
      damageTypes: [],
      savingThrows: [],
      ritualOnly: false,
      concentrationOnly: false,
      showOnlyFavorites: false,
      showOnlyActiveSpellbook: false
    }
  }

  // Available filter options
  const availableSchools = [
    'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
    'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
  ]

  const availableCastingTimes = [
    '1 action', '1 bonus action', '1 reaction', '1 minute',
    '10 minutes', '1 hour', '8 hours', '12 hours', '24 hours'
  ]

  const availableDamageTypes = [
    'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning',
    'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant',
    'Slashing', 'Thunder'
  ]

  const availableSavingThrows = [
    'Strength', 'Dexterity', 'Constitution',
    'Intelligence', 'Wisdom', 'Charisma'
  ]

  // ============================================
  // MULTICLASSE
  // ============================================

  const multiclassMode = ref(false)
  const multiclassLogic = ref('OR') // 'OR' = any class, 'AND' = all classes

  const toggleMulticlassMode = () => {
    multiclassMode.value = !multiclassMode.value
  }

  // ============================================
  // SPELL SLOT TRACKER
  // ============================================

  const spellSlots = ref({
    character: {
      name: '',
      classes: [], // [{ class: 'Wizard', level: 5 }, { class: 'Cleric', level: 3 }]
      totalLevel: 0
    },
    slots: {
      1: { total: 0, used: 0 },
      2: { total: 0, used: 0 },
      3: { total: 0, used: 0 },
      4: { total: 0, used: 0 },
      5: { total: 0, used: 0 },
      6: { total: 0, used: 0 },
      7: { total: 0, used: 0 },
      8: { total: 0, used: 0 },
      9: { total: 0, used: 0 }
    },
    pactMagic: {
      enabled: false,
      level: 1,
      total: 0,
      used: 0
    }
  })

  // Load spell slots from storage
  const loadSpellSlots = () => {
    const saved = localStorage.getItem('wizardGrimoire_spellSlots')
    if (saved) {
      spellSlots.value = JSON.parse(saved)
    }
  }

  // Save spell slots to storage
  const saveSpellSlots = () => {
    localStorage.setItem('wizardGrimoire_spellSlots', JSON.stringify(spellSlots.value))
  }

  // Spell slot calculation based on multiclass rules
  const calculateSpellSlots = (classes) => {
    // Standard spell slots table
    const spellSlotsTable = {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
      6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
      7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
      8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
      9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
      10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
      18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
      19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
      20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
    }

    // Calculate caster level for multiclass
    let casterLevel = 0
    let hasWarlock = false
    let warlockLevel = 0

    classes.forEach(({ class: className, level }) => {
      const lowerClass = className.toLowerCase()

      // Warlock uses Pact Magic (separate system)
      if (lowerClass === 'warlock') {
        hasWarlock = true
        warlockLevel = level
        return
      }

      // Full casters (Bard, Cleric, Druid, Sorcerer, Wizard)
      if (['bard', 'cleric', 'druid', 'sorcerer', 'wizard'].includes(lowerClass)) {
        casterLevel += level
      }
      // Half casters (Paladin, Ranger)
      else if (['paladin', 'ranger'].includes(lowerClass)) {
        casterLevel += Math.floor(level / 2)
      }
      // Third casters (Artificer, Eldritch Knight, Arcane Trickster)
      else if (['artificer'].includes(lowerClass)) {
        casterLevel += Math.ceil(level / 2)
      }
    })

    // Get slots from table
    casterLevel = Math.min(20, Math.max(0, casterLevel))
    const slots = casterLevel > 0 ? spellSlotsTable[casterLevel] : [0, 0, 0, 0, 0, 0, 0, 0, 0]

    // Set regular spell slots
    for (let i = 1; i <= 9; i++) {
      spellSlots.value.slots[i].total = slots[i - 1]
    }

    // Set Pact Magic if Warlock
    if (hasWarlock) {
      spellSlots.value.pactMagic.enabled = true

      // Warlock pact magic slots
      const pactSlots = {
        1: { slots: 1, level: 1 },
        2: { slots: 2, level: 1 },
        3: { slots: 2, level: 2 },
        4: { slots: 2, level: 2 },
        5: { slots: 2, level: 3 },
        6: { slots: 2, level: 3 },
        7: { slots: 2, level: 4 },
        8: { slots: 2, level: 4 },
        9: { slots: 2, level: 5 },
        10: { slots: 2, level: 5 },
        11: { slots: 3, level: 5 },
        12: { slots: 3, level: 5 },
        13: { slots: 3, level: 5 },
        14: { slots: 3, level: 5 },
        15: { slots: 3, level: 5 },
        16: { slots: 3, level: 5 },
        17: { slots: 4, level: 5 },
        18: { slots: 4, level: 5 },
        19: { slots: 4, level: 5 },
        20: { slots: 4, level: 5 }
      }

      const pactData = pactSlots[warlockLevel] || { slots: 0, level: 1 }
      spellSlots.value.pactMagic.total = pactData.slots
      spellSlots.value.pactMagic.level = pactData.level
    } else {
      spellSlots.value.pactMagic.enabled = false
      spellSlots.value.pactMagic.total = 0
      spellSlots.value.pactMagic.used = 0
    }

    saveSpellSlots()
  }

  const updateCharacter = (name, classes) => {
    spellSlots.value.character.name = name
    spellSlots.value.character.classes = classes
    spellSlots.value.character.totalLevel = classes.reduce((sum, c) => sum + c.level, 0)
    calculateSpellSlots(classes)
  }

  const useSpellSlot = (level) => {
    if (spellSlots.value.slots[level].used < spellSlots.value.slots[level].total) {
      spellSlots.value.slots[level].used++
      saveSpellSlots()
    }
  }

  const restoreSpellSlot = (level) => {
    if (spellSlots.value.slots[level].used > 0) {
      spellSlots.value.slots[level].used--
      saveSpellSlots()
    }
  }

  const usePactSlot = () => {
    if (spellSlots.value.pactMagic.used < spellSlots.value.pactMagic.total) {
      spellSlots.value.pactMagic.used++
      saveSpellSlots()
    }
  }

  const restorePactSlot = () => {
    if (spellSlots.value.pactMagic.used > 0) {
      spellSlots.value.pactMagic.used--
      saveSpellSlots()
    }
  }

  const longRest = () => {
    // Reset all slots
    for (let i = 1; i <= 9; i++) {
      spellSlots.value.slots[i].used = 0
    }
    spellSlots.value.pactMagic.used = 0
    saveSpellSlots()
  }

  const shortRest = () => {
    // Only reset Pact Magic slots
    spellSlots.value.pactMagic.used = 0
    saveSpellSlots()
  }

  // Initialize from storage
  loadFromStorage()
  loadSpellSlots()

  return {
    // Spellbooks
    spellbooks,
    activeSpellbookId,
    activeSpellbook,
    favorites,
    createSpellbook,
    deleteSpellbook,
    updateSpellbook,
    addSpellToSpellbook,
    removeSpellFromSpellbook,
    toggleFavorite,
    isFavorite,
    isInSpellbook,

    // Advanced Filters
    advancedFilters,
    resetAdvancedFilters,
    availableSchools,
    availableCastingTimes,
    availableDamageTypes,
    availableSavingThrows,

    // Multiclass
    multiclassMode,
    multiclassLogic,
    toggleMulticlassMode,

    // Spell Slots
    spellSlots,
    updateCharacter,
    useSpellSlot,
    restoreSpellSlot,
    usePactSlot,
    restorePactSlot,
    longRest,
    shortRest,
    calculateSpellSlots
  }
})
