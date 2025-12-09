// js/ui.js
// Exports rendering helpers and DOM queries.
// Keep DOM manipulation here so app.js stays small.

export function $(selector) {
  return document.querySelector(selector);
}

export function renderNotes(container, notes) {
  container.innerHTML = ''; // clear
  if (!notes || notes.length === 0) {
    return;
  }

  // create document fragment for performance
  const frag = document.createDocumentFragment();
  notes.forEach(note => {
    const card = buildNoteCard(note);
    frag.appendChild(card);
  });
  container.appendChild(frag);
}

function buildNoteCard(note) {
  const card = document.createElement('article');
  card.className = 'note';
  card.dataset.id = note.id;

  const meta = document.createElement('div');
  meta.className = 'meta';

  const title = document.createElement('h3');
  title.textContent = note.title?.trim() || 'Untitled';

  const time = document.createElement('div');
  time.className = 'small';
  const d = new Date(note.createdAt);
  time.textContent = d.toLocaleString();

  meta.appendChild(title);
  meta.appendChild(time);

  const text = document.createElement('p');
  text.textContent = note.text;

  const actions = document.createElement('div');
  actions.className = 'actions';

  // delete button (we will use event delegation on container)
  const delBtn = document.createElement('button');
  delBtn.className = 'btn-icon';
  delBtn.title = 'Delete note';
  delBtn.setAttribute('data-action', 'delete');
  delBtn.innerHTML = '🗑️';

  // optional: lightweight edit button (in-place)
  const editBtn = document.createElement('button');
  editBtn.className = 'btn-icon';
  editBtn.title = 'Edit note';
  editBtn.setAttribute('data-action', 'edit');
  editBtn.innerHTML = '✏️';

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  card.appendChild(meta);
  card.appendChild(text);
  card.appendChild(actions);

  return card;
}
