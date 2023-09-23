function setupPageSizeDropdown(options, defaultOption) {
    const dropdown = $('#pageSize');

    options.forEach(option => dropdown.append(new Option(option, option)));

    dropdown.val(defaultOption).on('change', handlePageSizeChange);
}

function handlePageSizeChange() {
    const selectedSize = parseInt($(this).val());

    updatePaginationButtons(selectedSize, 1);
    fetchAndDisplayPlayers(1, selectedSize);
}

function updatePaginationButtons(pageSize, activePage) {
    const totalPages = Math.ceil(RPG.totalAccounts / pageSize);
    const paginationDiv = $('#paginationButtons').empty();

    for (let i = 1; i <= totalPages; i++) {
        const button = $('<button>')
            .text(i)
            .toggleClass('pagination-button-active', i === activePage)
            .on('click', () => {
                handlePageButtonClick(pageSize, i);
            });

        paginationDiv.append(button);
    }
}

function handlePageButtonClick(pageSize, activePage) {
    $('#paginationButtons')
        .find('button')
        .removeClass('pagination-button-active')
        .eq(activePage - 1)
        .addClass('pagination-button-active');

    fetchAndDisplayPlayers(activePage, pageSize);
}
