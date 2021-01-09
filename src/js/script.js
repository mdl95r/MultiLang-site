document.addEventListener('DOMContentLoaded', () => {
    const LANG_SELECT = {
        SELECT: '.js-lang-select',
        SELECT_BTN: '.js-lang-select-btn',
        SELECT_LIST: '.js-languages-list',
        SELECT_LIST_ACTIVE: 'languages-list--active',
        SELECT_ITEM: '.languages-list__item',
        SELECT_LIST_ITEM_ACTIVE: 'languages-list__item--active',
    }

    const lang = document.querySelector('.lang-select span');
    const langItems = document.querySelectorAll('.js-languages-list .languages-list__item');
    const currencySelect = document.querySelector('.js-currency-select span');
    const topMenuItems = document.querySelectorAll('.nav-info__link');
    const mainMenuItems = document.querySelectorAll('.nav-menu__link');
    const inputSearch = document.querySelector('.form-main__input');
    const btnSearch = document.querySelector('.form-main__btn');
    const cart = document.querySelector('.purchase-count__cart');
    const menu = document.querySelector('.menu-mob span');
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');

    // функция для показа/скрытия списка языков
    document.querySelector(LANG_SELECT.SELECT).addEventListener('click', () => {
        const langList = document.querySelector(LANG_SELECT.SELECT_LIST);
        langList.classList.toggle(LANG_SELECT.SELECT_LIST_ACTIVE);
    })

    // собираем все элементы списка и пробегаем циклом, навешивая событие клика
    const selectItems = document.querySelectorAll(LANG_SELECT.SELECT_ITEM);
    selectItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const trg = e.target;

            // при клике по item'у берем у него дата атрибут
            const dataId = trg.dataset.lang;

            const selectedLang = trg.textContent;

            // пробегаемся по всем элементам и удаляем класс активности
            selectItems.forEach((item) => {
                item.classList.remove(LANG_SELECT.SELECT_LIST_ITEM_ACTIVE);
            })

            // а кликнутому элементу добавляем класс активности
            trg.classList.add(LANG_SELECT.SELECT_LIST_ITEM_ACTIVE);

            // передаем в функцию смены текущего названия языка
            changeCurrentTextLang(selectedLang);

            // функция по коду языка находит файл json и делаем к нему запрос, получая обьект для отображения
            changeLang(dataId);
        })
    })

    const changeCurrentTextLang = (lang) => {
        const currentLang = document.querySelector(LANG_SELECT.SELECT_BTN);
        currentLang.textContent = lang;
    }

    const getLangInBrowser = () => {
        // получаем язык из браузера
        let currentLanguage = window.navigator.language;

        // обрезаем язык до 2 символов
        currentLanguage = currentLanguage.slice(0, 2);
        return currentLanguage;
    }

    const getDefaultLang = () => {
        const defaultItem = document.querySelector('.languages-list__item[data-default-lang="true"');
        const dataset = defaultItem.dataset.lang
        return { defaultItem, dataset };
    };

    const changeLang = (id) => {
        document.querySelector('html').setAttribute('lang', id);
        fetch(`./langs/${id}.json`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log(`Запрос не прошел, статус: ${response.statusText}`)
                    return;
                }
            })
            .then((data) => {
                langShow(data);
            });
    }

    const langInLS = getLangInBrowser();

    const currentSelectedLang = document.querySelector(`.languages-list__item[data-lang='${langInLS}']`);

    // делаем проверку на присутствие языка в разметке в дата атрибуте, если нет, ставим язык по умолчанию
    if (currentSelectedLang === null) {
        const langObjDefault = getDefaultLang();
        const langInLS = langObjDefault.dataset
        const defaultItem = langObjDefault.defaultItem

        changeLang(langInLS);
        selectItems.forEach((item) => {
            item.classList.remove(LANG_SELECT.SELECT_LIST_ITEM_ACTIVE);
        })
        defaultItem.classList.add('languages-list__item--active');
    } else {
        changeLang(langInLS);

        selectItems.forEach((item) => {
            item.classList.remove(LANG_SELECT.SELECT_LIST_ITEM_ACTIVE);
        })
        currentSelectedLang.classList.add('languages-list__item--active');
    }

    // функция отображает слова на выбранном языке
    const langShow = (data) => {
        lang.textContent = data["lang-title"];

        for (let index = 0; index < data["lang-list"].length; index++) {
            const listItem = data["lang-list"][index];
            langItems[index].textContent = listItem;
        };

        const currentLang = document.querySelector(`.${LANG_SELECT.SELECT_LIST_ITEM_ACTIVE}`).textContent
        changeCurrentTextLang(currentLang);

        for (let index = 0; index < data.topMenu.length; index++) {
            const topMenuItem = data.topMenu[index];
            topMenuItems[index].textContent = topMenuItem;
        };

        for (let index = 0; index < data.mainMenu.length; index++) {
            const mainMenuItem = data.mainMenu[index];
            mainMenuItems[index].textContent = mainMenuItem;
        };

        setAttributes(btnSearch, {
            "title": data.searchPlaceHolder,
            "aria-label": data.searchPlaceHolder,
        })

        inputSearch.placeholder = data.searchPlaceHolder;
        currencySelect.textContent = data.currency;
        cart.textContent = data.cart;
        menu.textContent = data.menu;
        title.textContent = data.title
        description.content = data.description
    }

    // закрытие попапа со списком при клике вне его
    document.addEventListener('click', (e) => {
        const trg = e.target;
        console.log(trg);
        if (!trg.closest('.js-lang-select')) {
            document.querySelector(LANG_SELECT.SELECT_LIST).classList.remove(LANG_SELECT.SELECT_LIST_ACTIVE);
        }
    })

    // функция для добавления нескольких атрибутов
    function setAttributes(el, attrs) {
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
})
