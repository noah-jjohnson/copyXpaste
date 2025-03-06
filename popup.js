// popup.js - FINAL FIX FOR PAGE & FOLDER STORAGE, NAVIGATION, & TEXT EDITOR

document.addEventListener("DOMContentLoaded", () => {
    const clipboardList = document.getElementById("clipboard-list");
    const clearButton = document.getElementById("clearClipboard");
    const folderNameInput = document.getElementById("folderName");
    const createFolderButton = document.getElementById("createFolder");
    const foldersContainer = document.getElementById("folders");
    const pageNameInput = document.getElementById("pageName");
    const createPageButton = document.getElementById("createPage");
    const pageEditor = document.getElementById("pageEditor");
    const pageTitle = document.getElementById("pageTitle");
    const pageContent = document.getElementById("pageContent");
    const recentClipboard = document.getElementById("recentClipboard");

    let folders = {};

    function loadFolders() {
        chrome.storage.local.get({ folders: {} }, (data) => {
            folders = data.folders || {};
            renderFolders();
        });
    }

    function saveFolders() {
        chrome.storage.local.set({ folders }, () => {
            console.log("Folders saved successfully:", folders);
        });
    }

    function renderFolders() {
        foldersContainer.innerHTML = "";
        Object.keys(folders).forEach(folderName => {
            let folderDiv = document.createElement("div");
            folderDiv.textContent = folderName;
            folderDiv.classList.add("folder-item");
            folderDiv.onclick = () => openFolder(folderName);
            foldersContainer.appendChild(folderDiv);
        });
    }

    function openFolder(folderName) {
        if (!folders[folderName]) return; // Prevent undefined errors
        let pages = folders[folderName] || {}; // Ensure 'pages' is always an object
        clipboardList.innerHTML = "";
        Object.keys(pages).forEach(pageName => {
            let li = document.createElement("li");
            li.textContent = pageName;
            li.classList.add("page-item");
            li.onclick = () => openPage(folderName, pageName);
            clipboardList.appendChild(li);
        });
    }

    function openPage(folderName, pageName) {
        if (!folders[folderName] || !folders[folderName][pageName]) return; // Prevent errors
        pageEditor.style.display = "block";
        pageTitle.textContent = pageName;
        pageContent.value = folders[folderName][pageName] || "";
        pageContent.oninput = () => {
            folders[folderName][pageName] = pageContent.value;
            saveFolders();
        };
    }

    createFolderButton.addEventListener("click", () => {
        let folderName = folderNameInput.value.trim();
        if (folderName && !folders[folderName]) {
            folders[folderName] = {};
            saveFolders();
            renderFolders();
            folderNameInput.value = "";
        }
    });

    createPageButton.addEventListener("click", () => {
        let pageName = pageNameInput.value.trim();
        let activeFolder = Object.keys(folders)[0]; // Assume first folder is active
        if (pageName && activeFolder) {
            if (!folders[activeFolder]) folders[activeFolder] = {};
            folders[activeFolder][pageName] = "";
            saveFolders();
            openFolder(activeFolder);
            pageNameInput.value = "";
        }
    });

    clearButton.addEventListener("click", () => {
        chrome.storage.local.set({ clipboard: [] }, () => {
            recentClipboard.innerHTML = "";
        });
    });

    loadFolders();
});
