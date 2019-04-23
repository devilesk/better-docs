const $searchContainer = $('#search-container');
const $searchInput = $searchContainer.find('input');
const $searchedList = $searchContainer.find('ul');
const $anchorList = $('nav ul li a');
const $selected = $();

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ENTER = 13;

$(window).on('click', function(event) {
    if (!$searchContainer[0].contains(event.target)) {
        clear();
    }
});

$searchedList.on('click', 'li', function(event) {
    const currentTarget = event.currentTarget;
    const url = $(currentTarget).find('a').attr('href');

    moveToPage(url);
});

$searchInput.on({
    keyup: onKeyupSearchInput,
    keydown: onKeydownInput
});

function onKeyupSearchInput(event) {
    const inputText = removeWhiteSpace($searchInput.val()).toLowerCase();

    if (event.keyCode === KEY_CODE_UP || event.keyCode === KEY_CODE_DOWN) {
        return;
    }

    if (!inputText) {
        $searchedList.html('');
        return;
    }

    if (event.keyCode === KEY_CODE_ENTER) {
        onKeyupEnter();
        return;
    }

    setList(inputText);
}

function onKeydownInput(event) {
    $selected.removeClass('highlight');

    switch(event.keyCode) {
        case KEY_CODE_UP:
            $selected = $selected.prev();
            if (!$selected.length) {
                $selected = $searchedList.find('li').last();
            }
            break;
        case KEY_CODE_DOWN:
            $selected = $selected.next();
            if (!$selected.length) {
                $selected = $searchedList.find('li').first();
            }
            break;
        default: break;
    }

    $selected.addClass('highlight');
}

function onKeyupEnter() {
    if (!$selected.length) {
        $selected = $searchedList.find('li').first();
    }
    moveToPage($selected.find('a').attr('href'));
}

function moveToPage(url) {
    if (url) {
        window.location = url;
    }
    clear();
}

function clear() {
    $searchedList.html('');
    $searchInput.val('');
    $selected = $();
}

function setList(inputText) {
    let html = '';

    $anchorList.filter(function(idx, item) {
        return isMatched(item.text, inputText);
    }).each(function(idx, item) {
        html += makeListItemHtml(item, inputText);
    });
    $searchedList.html(html);
}

function isMatched(itemText, inputText) {
    return removeWhiteSpace(itemText).toLowerCase().indexOf(inputText) > - 1;
}

function makeListItemHtml(item, inputText) {
    let itemText = item.text;
    const itemHref = item.href;
    const $parent = $(item).closest('div');
    let memberof = '';

    if ($parent.length && $parent.attr('id')) {
        memberof = $parent.attr('id').replace('_sub', '');
    } else {
        if ($(item).closest('ul').closest('.category').find('h2').length) {
            memberof = $(item).closest('ul').closest('.category').find('h2').text() + '|';
        }
        memberof += $(item).closest('ul').prev().text();
    }

    if (memberof) {
        memberof = '<span class="group">' + memberof + '</span>';
    }

    itemText = itemText.replace(new RegExp(inputText, 'ig'), function(matched) {
        return '<strong>' + matched + '</strong>';
    });

    return '<li><a href="' + itemHref + '">' + itemText + '</a>' + memberof + '</li>';
}

function removeWhiteSpace(value) {
    return value.replace(/\s/g, '');
}