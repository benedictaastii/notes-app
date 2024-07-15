const initialNotes = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome To Notes App, Asti👋!",
    body: "Welcome to Notes! This is my first note. I can archive it, delete it, or create new ones.",
    createdAt: "2024-07-25T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Live Session #2 bersama Dicoding - Front-End for public & student pada selasa, 16 Juli 2024.",
    createdAt: "2024-07-15T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2024-07-15T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language on Duolingo, learn the fundamentals of front-end development at Dicoding.",
    createdAt: "2024-07-15T18:12:55.789Z",
    archived: false,
  },

  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2024-07-15T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'Pulang & Pergi' by Tere Liye\n2. 'Lonely Heart' by Rudiyant\n3. 'Andalusia' by Fissilmi Hamida",
    createdAt: "2024-07-15T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2024-07-15T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2024-07-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2024-07-15T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on September 28st.",
    createdAt: "2024-07-15T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2024-07-15T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2024-07-15T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2024-107-15T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice English vocabulary for 30 minutes every day.",
    createdAt: "2024-07-15T08:00:20.120Z",
    archived: false,
  },
];

let notes = [...initialNotes];

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

class NoteItem extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const note = notes.find((n) => n.id === this.getAttribute("id"));
    const formattedDate = formatDate(note.createdAt);

    this.innerHTML = `
      <div class="note-item">
        <h3>${note.title}</h3>
        <p>${note.body}</p>
        <p>Dibuat: ${formattedDate}</p>
        <button class="delete-button" data-id="${note.id}">Hapus</button>
        <button class="archive-button" data-id="${note.id}">${
      note.archived ? "Pindahkan" : "Arsipkan"
    }</button>
      </div>
    `;

    this.querySelector(".delete-button").addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: { id: note.id },
            bubbles: true,
          })
        );
      }
    });

    this.querySelector(".archive-button").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("archive-note", {
          detail: { id: note.id },
          bubbles: true,
        })
      );
    });
  }
}

class NoteList extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const isArchived = this.id === "archivedNotes";
    const filteredNotes = notes.filter((note) => note.archived === isArchived);

    this.innerHTML = `
      <div class="note-list">
        ${filteredNotes
          .map((note) => `<note-item id="${note.id}"></note-item>`)
          .join("")}
      </div>
    `;
  }
}

class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    this.maxChar = 50;
  }

  static get observedAttributes() {
    return ["max-char"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "max-char") {
      this.maxChar = parseInt(newValue, 10);
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.innerHTML = `
      <form id="addNoteForm">
        <input type="text" id="titleInput" placeholder="Judul" required>
        <span id="charCount">0/${this.maxChar}</span>
        <div id="titleError" class="error"></div>
        <textarea id="bodyInput" placeholder="Isi catatan" required></textarea>
        <div id="bodyError" class="error"></div>
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
  }

  addEventListeners() {
    const form = this.querySelector("form");
    const titleInput = this.querySelector("#titleInput");
    const bodyInput = this.querySelector("#bodyInput");
    const charCount = this.querySelector("#charCount");
    const titleError = this.querySelector("#titleError");
    const bodyError = this.querySelector("#bodyError");

    titleInput.addEventListener("input", () => {
      const remaining = this.maxChar - titleInput.value.length;
      charCount.textContent = `${titleInput.value.length}/${this.maxChar}`;

      if (remaining < 0) {
        titleError.textContent = `Judul melebihi batas maksimum ${this.maxChar} karakter`;
      } else {
        titleError.textContent = "";
      }
    });

    bodyInput.addEventListener("input", () => {
      if (bodyInput.value.trim() === "") {
        bodyError.textContent = "Isi catatan tidak boleh kosong";
      } else {
        bodyError.textContent = "";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.dispatchEvent(
          new CustomEvent("add-note", {
            detail: { title: titleInput.value, body: bodyInput.value },
            bubbles: true,
          })
        );
        form.reset();
        charCount.textContent = `0/${this.maxChar}`;
      }
    });
  }

  validateForm() {
    const titleInput = this.querySelector("#titleInput");
    const bodyInput = this.querySelector("#bodyInput");
    const titleError = this.querySelector("#titleError");
    const bodyError = this.querySelector("#bodyError");

    let isValid = true;

    if (titleInput.value.length > this.maxChar) {
      titleError.textContent = `Judul melebihi batas maksimum ${this.maxChar} karakter`;
      isValid = false;
    } else {
      titleError.textContent = "";
    }

    if (bodyInput.value.trim() === "") {
      bodyError.textContent = "Isi catatan tidak boleh kosong";
      isValid = false;
    } else {
      bodyError.textContent = "";
    }

    return isValid;
  }
}

class SearchBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Cari catatan...">
      </div>
    `;
  }

  addEventListeners() {
    const searchInput = this.querySelector("#searchInput");
    searchInput.addEventListener("input", () => {
      this.dispatchEvent(
        new CustomEvent("search-notes", {
          detail: { searchTerm: searchInput.value },
          bubbles: true,
        })
      );
    });
  }
}

customElements.define("note-item", NoteItem);
customElements.define("note-list", NoteList);
customElements.define("add-note-form", AddNoteForm);
customElements.define("search-bar", SearchBar);

function renderNotes(filteredNotes = null) {
  const activeNoteList = document.querySelector("#activeNotes");
  const archivedNoteList = document.querySelector("#archivedNotes");

  const notesToRender = filteredNotes || notes;

  if (activeNoteList) {
    activeNoteList.innerHTML = `
      <div class="note-list">
        ${notesToRender
          .filter((note) => !note.archived)
          .map((note) => `<note-item id="${note.id}"></note-item>`)
          .join("")}
      </div>
    `;
  }
  if (archivedNoteList) {
    archivedNoteList.innerHTML = `
      <div class="note-list">
        ${notesToRender
          .filter((note) => note.archived)
          .map((note) => `<note-item id="${note.id}"></note-item>`)
          .join("")}
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNotes();

  document.addEventListener("add-note", (e) => {
    const { title, body } = e.detail;
    const newNote = {
      id: "notes-" + Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    notes.unshift(newNote);
    renderNotes();
  });

  document.addEventListener("delete-note", (e) => {
    notes = notes.filter((note) => note.id !== e.detail.id);
    renderNotes();
  });

  document.addEventListener("archive-note", (e) => {
    const note = notes.find((note) => note.id === e.detail.id);
    if (note) {
      note.archived = !note.archived;
      renderNotes();
    }
  });

  document.addEventListener("search-notes", (e) => {
    const searchTerm = e.detail.searchTerm.toLowerCase();
    if (searchTerm) {
      const filteredNotes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.body.toLowerCase().includes(searchTerm)
      );
      renderNotes(filteredNotes);
    } else {
      renderNotes();
    }
  });

  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});
