const $searchContainer = $('#search-container');
const $searchInput = $searchContainer.find('input');
const $searchedList = $searchContainer.find('ul');
const $anchorList = $('nav ul li a');
let $selected = $();

const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ENTER = 13;

const removeWhiteSpace = (value) => value.replace(/\s/g, '');

const onKeydownInput = event => {
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
};

const clear = () => {
    $searchedList.html('');
    $searchInput.val('');
    $selected = $();
};

const moveToPage = url => {
    if (url) {
        window.location = url;
    }
    clear();
};

const onKeyupEnter = () => {
    if (!$selected.length) {
        $selected = $searchedList.find('li').first();
    }
    moveToPage($selected.find('a').attr('href'));
};

const isMatched = (itemText, inputText) => removeWhiteSpace(itemText).toLowerCase().indexOf(inputText) > - 1;

const makeListItemHtml = (item, inputText) => {
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
};

const setList = inputText => {
    let html = '';

    $anchorList.filter(function(idx, item) {
        return isMatched(item.text, inputText);
    }).each(function(idx, item) {
        html += makeListItemHtml(item, inputText);
    });
    $searchedList.html(html);
};

const onKeyupSearchInput = event => {
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
};

$(window).on('click', event => {
    if (!$searchContainer[0].contains(event.target)) {
        clear();
    }
});

$searchedList.on('click', 'li', event => {
    const currentTarget = event.currentTarget;
    const url = $(currentTarget).find('a').attr('href');

    moveToPage(url);
});

$searchInput.on({
    keyup: onKeyupSearchInput,
    keydown: onKeydownInput
});
