// js/app.js
import { loadNotes, saveNotes, makeId } from './storage.js';
import { $, renderNotes } from './ui.js';

const noteForm = $('#noteForm');
const titleInput = $('#noteTitle');
const textInput = $('#noteText');
const addBtn = $('#addNoteBtn');
const clearAllBtn = $('#clearAllBtn');
const notesContainer = $('#notesContainer');
const emptyHint = $('#emptyHint');

let notes = [];

/** initialize app */
function init() {
  notes = loadNotes();
  refreshUI();

  // handle add
  noteForm.addEventListener('submit', onAddNote);

  // clear all
  clearAllBtn.addEventListener('click', onClearAll);

  // event delegation for edit/delete within notesContainer
  notesContainer.addEventListener('click', onNotesContainerClick);

  // support keyboard shortcut Ctrl+Enter to add
  textInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      noteForm.requestSubmit(); // trigger submit
    }
  });
}

function refreshUI() {
  renderNotes(notesContainer, notes);
  emptyHint.style.display = notes.length ? 'none' : 'block';
  saveNotes(notes);
}

/** handle adding a note */
function onAddNote(ev) {
  ev.preventDefault();
  const text = textInput.value.trim();
  const title = titleInput.value.trim();

  if (!text) {
    textInput.focus();
    return;
  }

  const n = {
    id: makeId(),
    title: title || '',
    text,
    createdAt: new Date().toISOString()
  };

  // add to front so newest appears first
  notes.unshift(n);

  // clear form
  titleInput.value = '';
  textInput.value = '';

  refreshUI();
  textInput.focus();
}

/** handle clear all (with confirm) */
function onClearAll() {
  if (!notes.length) return;
  const ok = confirm('Clear all notes? This cannot be undone.');
  if (!ok) return;
  notes = [];
  refreshUI();
}

/** event delegation handler for notes container */
function onNotesContainerClick(e) {
  const action = e.target.closest('[data-action]')?.getAttribute('data-action');
  if (!action) return;

  // climb to the note card
  const card = e.target.closest('.note');
  if (!card) return;
  const id = card.dataset.id;
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return;

  if (action === 'delete') {
    handleDelete(index);
  } else if (action === 'edit') {
    handleEdit(index, card);
  }
}

function handleDelete(index) {
  const ok = confirm('Delete this note?');
  if (!ok) return;
  notes.splice(index, 1);
  refreshUI();
}

/** lightweight in-place edit: replace text node with textarea */
function handleEdit(index, card) {
  const note = notes[index];

  // build edit UI
  const p = card.querySelector('p');
  const actions = card.querySelector('.actions');

  // if already editing, ignore
  if (card.dataset.editing === '1') return;
  card.dataset.editing = '1';

  const editTitle = document.createElement('input');
  editTitle.value = note.title;
  editTitle.style.width = '100%';
  editTitle.style.marginBottom = '6px';

  const editTextarea = document.createElement('textarea');
  editTextarea.value = note.text;
  editTextarea.style.width = '100%';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.type = 'button';
  saveBtn.className = 'btn-icon';
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn-icon';

  // replace content
  p.replaceWith(editTitle);
  actions.before(editTextarea);
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  // focus
  editTextarea.focus();

  saveBtn.addEventListener('click', () => {
    const newTitle = editTitle.value.trim();
    const newText = editTextarea.value.trim();
    if (!newText) {
      alert('Note text cannot be empty.');
      return;
    }
    // update model and re-render
    notes[index].title = newTitle;
    notes[index].text = newText;
    // update modified time
    notes[index].createdAt = new Date().toISOString();
    delete card.dataset.editing;
    refreshUI();
  });

  cancelBtn.addEventListener('click', () => {
    delete card.dataset.editing;
    refreshUI();
  });
}

/* start */
init();
