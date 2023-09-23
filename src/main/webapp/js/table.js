function populateTable(players, pageNumber, pageSize) {
    let $accountsTable = $('#accounts');
    $accountsTable.find("tr:gt(0)").remove();

    players.forEach((player, index) => {
        const tableIndex = (pageNumber - 1) * pageSize + index + 1;
        let $row = generateRowHtml(player, tableIndex);

        setupEditPngListener($row, player, pageNumber, pageSize);
        setupDeletePngListener($row, player, pageNumber, pageSize);

        $accountsTable.append($row);
    });
}

function generateRowHtml(player, tableIndex) {
    const rowHtml = `
        <tr>
            <td data-field="index">${tableIndex}</td>
            <td data-field="name">${player.name}</td>
            <td data-field="title">${player.title}</td>
            <td data-field="race">${player.race}</td>
            <td data-field="profession">${player.profession}</td>
            <td data-field="level">${player.level}</td>
            <td data-field="birthday">${formatDate(player.birthday)}</td>
            <td data-field="banned">${player.banned}</td>
            <td data-field="edit"><img src="/rpg_war_exploded/img/edit.png" alt="edit"></td>
            <td data-field="delete"><img src="/rpg_war_exploded/img/delete.png" alt="delete"></td>
        </tr>
    `;

    return $(rowHtml);
}

function setupEditPngListener(row, player, pageNumber, pageSize) {
    row.find('img[src*="edit.png"]').click(function() {
        hideAllIcons();
        editPlayer(row, player, pageNumber, pageSize);
    });
}

function hideAllIcons() {
    $('#accounts').find('img').hide();
}

function setupDeletePngListener(row, player, pageNumber, pageSize) {
    row.find('img[src*="delete.png"]').click(function() {
        deletePlayer(player, pageNumber, pageSize);
    });
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}
