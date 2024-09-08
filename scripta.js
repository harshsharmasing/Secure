document.addEventListener("DOMContentLoaded", function () {
    const noteInput = document.getElementById("noteInput");
    const saveNoteBtn = document.getElementById("saveNote");
    const pasteNoteBtn = document.getElementById("pasteNote");
    const notesContainer = document.getElementById("notesContainer");

    // Load saved notes from local storage when the page loads
    loadNotes();

    // Save note on click
    saveNoteBtn.addEventListener("click", function () {
        const noteText = noteInput.value.trim();
        if (noteText !== "") {
            saveNoteToLocalStorage(noteText);
            noteInput.value = "";
            loadNotes(); // Refresh notes list after saving
        }
    });

    // Paste from clipboard to note input
    pasteNoteBtn.addEventListener("click", async function () {
        try {
            const text = await navigator.clipboard.readText();
            noteInput.value = text;
        } catch (err) {
            alert("Failed to read from clipboard: " + err);
        }
    });

    // Save note to localStorage
    function saveNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    // Load and display notes from localStorage
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notesContainer.innerHTML = "";

        notes.forEach((note, index) => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");

            const noteText = document.createElement("p");
            noteText.textContent = note;

            const buttonsWrapper = document.createElement("div");
            buttonsWrapper.classList.add("note-buttons");

            const copyBtn = document.createElement("button");
            copyBtn.textContent = "Copy";
            copyBtn.classList.add("copy-btn");
            copyBtn.addEventListener("click", () => copyText(note));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => deleteNote(index));

            buttonsWrapper.appendChild(copyBtn);
            buttonsWrapper.appendChild(deleteBtn);
            noteElement.appendChild(noteText);
            noteElement.appendChild(buttonsWrapper);

            notesContainer.appendChild(noteElement);
        });
    }

    // Copy text to clipboard
    function copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        });
    }

    // Delete a note with confirmation
    function deleteNote(index) {
        if (confirm("Are you sure you want to delete this note?")) {
            let notes = JSON.parse(localStorage.getItem("notes"));
            notes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            loadNotes(); // Refresh notes list after deletion
        }
    }
});
