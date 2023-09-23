function populateDropdowns() {
    const raceDropdown = $('#raceSelect');
    const professionDropdown = $('#professionSelect');

    RPG.races.forEach(race => {
        raceDropdown.append($('<option>', {value: race, text: race}));
    });

    RPG.professions.forEach(profession => {
        professionDropdown.append($('<option>', {value: profession, text: profession}));
    });


}

function createAccount() {

    const data = {
        name: $('#nameInput').val(),
        title: $('#titleInput').val(),
        race: $('#raceSelect').val(),
        profession: $('#professionSelect').val(),
        level: parseInt($('#levelInput').val(), 10),
        birthday: new Date($('#birthdayInput').val()).getTime(),
        banned: $('#bannedCheckbox').prop('checked')
    };

    if (!data.name ||!data.title ||!data.race ||!data.profession ||!data.level ||!data.birthday) {
        alert('Please fill all required fields');
        return;
    }


    const endpoint = `/rpg_war_exploded/rest/players/`;
    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            updateTotalAccountsCount().then(() => {
                let pageSizeValue = $("#pageSize").val();
                let lastPage = Math.ceil(RPG.totalAccounts / pageSizeValue);

                updatePaginationButtons(pageSizeValue, lastPage);
                fetchAndDisplayPlayers(lastPage, pageSizeValue);
            });
            clearFormFields();
            console.log('Successfully created player:', response);
        },
        error: function (error) {
            console.log('Error creating player:', error);
        }
    });
}

function clearFormFields() {
    $('#nameInput').val('');
    $('#titleInput').val('');
    $('#raceSelect').val(RPG.races[0]); // set default value
    $('#professionSelect').val(RPG.professions[0]); // set default value
    $('#levelInput').val('');
    $('#birthdayInput').val('');
    $('#bannedCheckbox').prop('checked', false);
}

(function () {
    populateDropdowns();

    $("#createAccountButton").click(function () {
        createAccount();
    });
})();
