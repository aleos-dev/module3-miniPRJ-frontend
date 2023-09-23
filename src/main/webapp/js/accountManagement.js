

function editPlayer(row, player, pageNumber, pageSize) {
    transformButton(row, "edit", "save", () => savePlayer(row, player, pageNumber, pageSize));
    makeFieldsEditable(row)
}


function transformButton(row, fromImg, toImg, onClickFunction) {
    let button = row.find(`img[src*="${fromImg}.png"]`);
    button.attr("src", `/rpg_war_exploded/img/${toImg}.png`);
    button.show()
    button.off('click');
    button.click(onClickFunction);
}


function makeFieldsEditable(row) {
    makeTextFieldEditable(row, "name");
    makeTextFieldEditable(row, "title");
    makeDropdownFieldEditable(row, "race", RPG.races);
    makeDropdownFieldEditable(row, "profession", RPG.professions);
    makeBooleanDropdownFieldEditable(row, "banned");
}


function savePlayer(row, player, pageNumber, pageSize) {

    let updatedPlayer = {
        name: row.find('td[data-field="name"] input').val(),
        title: row.find('td[data-field="title"] input').val(),
        race: row.find('td[data-field="race"] select').val(),
        profession: row.find('td[data-field="profession"] select').val(),
        banned: row.find('td[data-field="banned"] select').val(),
    };
    if (!validateInput(updatedPlayer.name, 12, 'Name')) return;
    if (!validateInput(updatedPlayer.title, 30, 'Title')) return;

    sendUpdateRequest(player.id, updatedPlayer, row, pageNumber, pageSize);

}

function makeTextFieldEditable(row, field) {
    let cell = row.find(`td[data-field="${field}"]`);
    let originalValue = cell.text();
    cell.html(`<input type="text" value="${originalValue}">`);
}

function makeDropdownFieldEditable(row, field, options) {
    let cell = row.find(`td[data-field="${field}"]`);
    let currentValue = cell.text();
    let dropdownHtml = '<select>';
    options.forEach(option => {
        dropdownHtml += `<option value="${option}" ${currentValue === option ? 'selected' : ''}>${option}</option>`;
    });
    dropdownHtml += '</select>';
    cell.html(dropdownHtml);
}

function makeBooleanDropdownFieldEditable(row, field) {
    let cell = row.find(`td[data-field="${field}"]`);
    let isTrue = cell.text().toLowerCase() === 'true';
    cell.html(`
        <select>
            <option value="true" ${isTrue ? 'selected' : ''}>true</option>
            <option value="false" ${!isTrue ? 'selected' : ''}>false</option>
        </select>
    `);
}

function validateInput(value, maxLength, fieldName) {
    if (!value || value.length > maxLength) {
        alert(`${fieldName} cannot be empty and must be less than or equal to ${maxLength} characters!`);
        return false;
    }
    return true;
}

function sendUpdateRequest(playerId, updatedPlayer, row, pageNumber, pageSize) {
    const endpoint = `/rpg_war_exploded/rest/players/${playerId}`;
    $.ajax({
        url: endpoint,
        type: 'POST',
        data: JSON.stringify(updatedPlayer),
        contentType: 'application/json',
        success: function(response) {
            fetchAndDisplayPlayers(pageNumber, pageSize);
            transformButton(row, "save", "edit", () => editPlayer(row, updatedPlayer, pageNumber, pageSize));
            showDeleteImage(row);
            console.log('Player edited successfully:', response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error updating player:', textStatus, errorThrown);
            alert('Failed to update player. Please try again later.');
        }
    });
}

function showDeleteImage(row) {
    row.find('img[src*="delete.png"]').show();
}

function deletePlayer(player, pageNumber, pageSize) {
    const endpoint = `/rpg_war_exploded/rest/players/${player.id}`;
    $.ajax({
        url: endpoint,
        type: 'DELETE',
        success: function(response) {
            updateTotalAccountsCount().then(() => {
                updatePaginationButtons(pageSize, pageNumber);
                fetchAndDisplayPlayers(pageNumber, pageSize);
            });
            console.log('Player deleted successfully:', response);

        }
    })
}