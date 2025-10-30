import { Ability } from '@casl/ability'
import { initialAbility } from './initialAbility'

// Safely read userData from localStorage
let userData = {}
try {
  const storedData = localStorage.getItem('userData')
  if (storedData && storedData !== "undefined") {
    userData = JSON.parse(storedData)
  }
} catch (error) {
  console.error("Error parsing userData from localStorage:", error)
}

const existingAbility = userData.ability || null

export default new Ability(existingAbility || initialAbility)
