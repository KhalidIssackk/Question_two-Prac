// js/storage.js
// Small wrapper around localStorage. Exports functions for saving/loading.

const STORAGE_KEY = 'notes-manager-v1';

/**
 * Load notes array from localStorage.
 * Returns [] if nothing saved or parse error.
 */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const notes = JSON.parse(raw);
    if (!Array.isArray(notes)) return [];
    return notes;
  } catch (err) {
    console.error('Failed to load notes', err);
    return [];
  }
}

/**
 * Persist notes array to localStorage.
 * @param {Array} notes
 */
export function saveNotes(notes = []) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes', err);
  }
}

/** Utility: generate a simple unique id */
export function makeId(prefix = 'n') {
  // timestamp + random, safe for our small app
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`;
}
