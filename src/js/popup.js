import render from './../templates/popup.hbs';

function openPopup(obj, myMap, position, clusterer, hintContent) {
    var popup = document.querySelector('.popup');

    popup.style.display = 'block';
    popup.innerHTML = render();
    // popup.style.position = 'absolute';
    popup.style.top = position[1] + 'px';
    popup.style.left = position[0] + 'px';

    addFeedback(obj, myMap, position, clusterer, popup, hintContent);

    closePopup(popup);
}

function addFeedback(obj, myMap, position, clusterer, popup, hintContent) {
    var inputName = document.querySelector('.form__name');
    var inputPlace = document.querySelector('.form__place');
    var inputText = document.querySelector('.form__text');
    var addButton = document.querySelectorAll('.footer__add')[document.querySelectorAll('.footer__add').length - 1];

    var headerAddress = document.querySelector('.header__address-text');

    headerAddress.innerHTML = obj.address;

    var feedbacks = document.querySelector('.feedbacks');
    var feedback = document.createElement('li');

    feedback.classList.add('feedback');
    feedback.innerHTML = hintContent;
    feedbacks.appendChild(feedback);

    addButton.addEventListener('click', () => {
        if (inputName.value && inputPlace.value && inputText.value) {
            var feedback = document.createElement('li');

            var name = document.createElement('div');
            var place = document.createElement('div');
            var text = document.createElement('div');
            var day = document.createElement('div');
            var firstLine = document.createElement('div');

            name.innerHTML = inputName.value;
            place.innerHTML = inputPlace.value;
            text.innerHTML = inputText.value;

            const parsedText = {
                place: inputPlace.value,
                feedback: inputText.value
            };

            var date = new Date();

            day.innerHTML = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();

            feedback.classList.add('feedback');
            name.classList.add('feedback__name');
            place.classList.add('feedback__place');
            text.classList.add('feedback__text');
            firstLine.classList.add('feedback__firstLine');

            firstLine.appendChild(name);
            firstLine.appendChild(place);
            firstLine.appendChild(day);

            feedback.appendChild(firstLine);
            feedback.appendChild(text);
            feedbacks.appendChild(feedback);

            inputPlace.value = '';
            inputName.value = '';
            inputText.value = '';

            placemarks(obj, myMap, position, clusterer, popup, parsedText);
        } else {
            alert('Заполните все поля!')
        }
    })
}

function placemarks(obj, myMap, position, clusterer, popup, text) {
    var placemark = new ymaps.Placemark(obj.coords, {
        hintContent: popup.children[1].lastChild.innerHTML,
        balloonContentHeader: text.place,
        balloonContentBody: obj.address,
        balloonContentFooter: text.feedback
    }, {
        preset: 'islands#violetDotIcon',
        openHintOnHover: false
    });

    myMap.geoObjects.add(placemark);
    clusterer.add(placemark);

    placemark.events.add('click', () => {
        openPopup(obj, myMap, position, clusterer, placemark.properties._data.hintContent);
    });

}

function closePopup(popup) {
    var closeButton = document.querySelector('.header__close');

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
        popup.innerHTML = '';
    })
}

export {
    openPopup
}
