const $ = document.querySelector.bind(document)

window.addEventListener('load', event => {
    const entries = getMoodEntries()

    if (!entries) {
        setMoodEntries([])
    } else {
        entries.forEach(addMoodEntryToList)
    }
})

function rerenderMoodEntriesList() {
    const list = $('#mood-entry-list')
    while (list.firstChild) {
        list.firstChild.remove();
    }
    
    getMoodEntries().forEach(addMoodEntryToList)

    document.querySelectorAll('.delete-entry').forEach(button => button.addEventListener('click', handleDelete))
}

$('#add-entry').addEventListener('click', event => {
    const entry = {description: $('#description').value.trim(), rating: parseInt($('#rating').value), date: new Date()}
    if (!entry.description || !entry.rating) {
        presentInvalidEntryAlert()
        return
    }

    setMoodEntries(getMoodEntries().concat(entry))
    addMoodEntryToList(entry)
    clearEntryFields()
})

function handleDelete(event) {
    console.log(event)
    const id = event.target.getAttribute('data-id')
    console.log('id', id)

    setMoodEntries(getMoodEntries().filter(x => new Date(x.date).getTime() != id))
    rerenderMoodEntriesList()
}

function addMoodEntryToList(entry) {
    $('#mood-entry-list').appendChild(createMoodEntryItem(entry))
}

function createMoodEntryItem({rating, description, date}) {
    const item = document.createElement('ion-item')
    item.innerHTML = `<span style="font-family: monospace; font-size: 90%">${rating}<span style="color: grey">&nbsp;/ 10</span></span>
    <span style="margin-left: 1.75rem">${description}</span>`

    const deleteButton = document.createElement('ion-button')
    deleteButton.setAttribute('slot', 'end')
    deleteButton.setAttribute('fill', 'clear')
    deleteButton.setAttribute('data-id', typeof date === 'string' ? new Date(date).getTime() : date.getTime())
    // deleteButton.classList.add('ion-margin')
    deleteButton.classList.add('delete-entry')
    deleteButton.addEventListener('click', handleDelete)

    const deleteButtonIcon = document.createElement('ion-icon')
    deleteButtonIcon.setAttribute('name', 'trash-outline')

    deleteButton.appendChild(deleteButtonIcon)
    item.appendChild(deleteButton)

    return item
}

function presentInvalidEntryAlert() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'Incomplete entry';
    // alert.subHeader = 'Your mood entry was invalid';
    alert.message = 'Please enter both a mood description and rating.';
    alert.buttons = ['Got it!'];
  
    document.body.appendChild(alert);
    return alert.present();
}

function clearEntryFields() {
    $('#description').value = ''
    $('#rating').value = ''
}

function getMoodEntries() {
    return JSON.parse(localStorage.getItem('mood-entries') || '[]')
}

function setMoodEntries(entries) {
    localStorage.setItem('mood-entries', JSON.stringify(entries))
}
