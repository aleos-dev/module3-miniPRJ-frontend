const RPG = {
    paginationOptions: [5, 10, 20, 30],
    get defaultDropdownOption() {
        return this.paginationOptions[0];
    },
    totalAccounts: 0,
    races: ['HUMAN', 'DWARF', 'ELF', 'GIANT', 'ORC', 'TROLL', 'HOBBIT'],
    professions: ['WARRIOR', 'ROGUE', 'SORCERER', 'CLERIC', 'PALADIN', 'NAZGUL', 'WARLOCK', 'DRUID']
}

const init = () => {
    setupPageSizeDropdown(RPG.paginationOptions, RPG.defaultDropdownOption);
    updatePaginationButtons(RPG.defaultDropdownOption, 1)
    fetchAndDisplayPlayers(1, RPG.defaultDropdownOption);
}

const fetchAndDisplayPlayers = (pageNumber, pageSize) => {
    const endpoint = `/rpg_war_exploded/rest/players?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`;

    $.getJSON(endpoint, data => populateTable(data, pageNumber, pageSize))
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error(`Error fetching players: ${textStatus}, ${errorThrown}`);
        });
}

function updateTotalAccountsCount() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/rpg_war_exploded/rest/players/count",
            type: "GET",
            dataType: "json",
            success: function (count) {
                RPG.totalAccounts = count;
                resolve(count);
            },
            error: (_, textStatus, errorThrown) => reject(`${textStatus}, ${errorThrown}`)
        });
    });
}

// outer function
(function() {
    $(document).ready(() => {
        updateTotalAccountsCount().then(() => {
            init();
        }).catch(error => {
            console.error(`Error updating account count: ${error}`);
        });
    });
})();