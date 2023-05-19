export const formatDate = (date) => {
    if (date) {
        date = String(date.toDate());
        if (date.split(' ').length > 3)
            return date.split(' ').slice(0, 4).join(' ');
    }
    return date
}

export const sortNoteList = (noteList, sortOption, noteType) => {
    switch (sortOption) {
        case 1:
            noteList.sort((a, b) => b.created_at - a.created_at)
            break;
        case 2:
            noteList.sort((a, b) => a.created_at - b.created_at)
            break;
        case 3:
            if(noteType === 'garden')
                noteList.sort((a, b) => a.garden_name.localeCompare(b.garden_name))
            else
                noteList.sort((a, b) => a.plant_name.localeCompare(b.plant_name))
            break;
        default:
            break;
    }
    return noteList
}