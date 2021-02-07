host = "http://ank.local:8008/"

window.addEventListener('load', (event) => {
    var easyMDE = new EasyMDE({
        spellChecker: false,
        toolbar: [
            {
                name: "saveNote",
                action: saveNote,
                className: "fa fa-floppy-o",
                title: "Save Note",
            },
            {
                name: "loadNote",
                action: loadNote,
                className: "fa fa-folder-open-o",
                title: "Open Note",
            }, "|", "bold", "italic", "|", "code", "link", "image", "|", "preview"
        ]
    });
    easyMDE.toggleFullScreen();
    window.mde = easyMDE;
    getPage();
    window.mde.value("First line must be file name without extension");
});

function doPOST(path, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback("note saved successfully");
            } else {
                callback("failed to save note");
            }
        }
    };
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

function saveNote() {
    txtNote = window.mde.value()
    data = txtNote.replace("\n", '&').split('&')
    console.log(data)
    data = {
        "title": data[0].trim(),
        "content": data[1].trim(),
        "overwrite": true
    }
    doPOST(host + "add", data, doPostTasks)
}

function loadNote() {
    txtNote = window.mde.value()
    data = txtNote.replace("\n", '&').split('&')
    console.log(data[0])
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", host + data[0] + ".md", false); // false for synchronous request
    xmlHttp.send(null);
    window.mde.value(xmlHttp.responseText)
}

function confirmWrite(data) {
    var result = confirm("Write note with title " + data.title + "?");
    return result
}

function doPostTasks(text) {
    console.log(text)
    window.mde.value("");
}
