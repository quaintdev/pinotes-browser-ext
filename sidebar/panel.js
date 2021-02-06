host = "http://yourhost.local:8008/"

window.addEventListener('load', (event) => {
    var easyMDE = new EasyMDE({
        spellChecker: false,
        toolbar: ["bold", "italic", "|", "code", "link", "image", "|", "preview",
            {
                name: "saveNote",
                action: saveNote,
                className: "fa fa-floppy-o", // Look for a suitable icon
                title: "Save note",
            },
            {
                name: "overwriteNote",
                action: overwriteNote,
                className: "fa fa-file-o", // Look for a suitable icon
                title: "Overwrite existing note",
            },
            {
                name: "loadNote",
                action: loadNote,
                className: "fa fa-download", // Look for a suitable icon
                title: "Load note",
            }
        ]
    });
    easyMDE.toggleFullScreen();
    window.mde = easyMDE;
    getPage();
});

browser.tabs.onActivated.addListener(getPage);
browser.tabs.onUpdated.addListener(getPage);


function getPage() {
    browser.tabs.query({ currentWindow: true, active: true })
        .then((tabs) => {
            let currentTab = tabs[0];
            if (currentTab.url.includes(".md")) {
                doPOST(currentTab.url, handleFileData)
            }
        })
}

function doPOST(path, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // The request is done; did it work?
            if (xhr.status == 200) {
                // ***Yes, use `xhr.responseText` here***
                callback("success");
            } else {
                // ***No, tell the callback the call failed***
                callback("failed");
            }
        }
    };
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

function handleFileData(fileData) {
    if (!fileData) {
        alert(fileData)
        return;
    }
    window.mde.value(fileData)

    // Use the file data
}

function saveNote() {
    txtNote = window.mde.value()
    data = txtNote.replace("\n", '&').split('&')
    console.log(data)
    data = {
        "title": data[0].trim(),
        "content": data[1].trim(),
        "overwrite": false
    }
    if (!confirmWrite(data)) {
        return
    }
    doPOST(host + "add", data, doPostTasks)
}

function overwriteNote() {
    txtNote = window.mde.value()
    data = txtNote.replace("\n", '&').split('&')
    console.log(data)
    data = {
        "title": data[0].trim(),
        "content": data[1].trim(),
        "overwrite": true
    }
    if (!confirmWrite(data)) {
        return
    }
    doPOST(host + "add", data, doPostTasks)
}

function loadNote() {
    txtNote = window.mde.value()
    data = txtNote.replace("\n", '&').split('&')
    console.log(data[0])
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", host + data[0], false); // false for synchronous request
    xmlHttp.send(null);
    window.mde.value(xmlHttp.responseText)
}

function confirmWrite(data) {
    var result = confirm("Write note with title " + data.title + "?");
    return result
}

function doPostTasks(text) {
    console.log("note saved")
    window.mde.value("");
}
