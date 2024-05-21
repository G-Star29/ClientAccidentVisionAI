ymaps.ready(init);

function init() {
    var map = new ymaps.Map("map", {
        center: [55.0415, 82.9346], // Центр карты
        zoom: 10
    });

    // Функция для получения данных с сервера
    async function getCoordinates() {
        try {
            const response = await fetch('http://127.0.0.1:8000/current-situation');
            const data = await response.json();
            displayPointsOnMap(data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    // Функция для отображения точек на карте
    function displayPointsOnMap(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                const coords = key.split(',').map(Number);
                const probability = data[key];

                let color;
                if (probability > 0.8) {
                    color = 'red';
                } else if (probability > 0.6) {
                    color = 'orange';
                } else if (probability > 0.5) {
                    color = 'yellow';
                } else {
                    color = 'gray';
                }

                var placemark = new ymaps.Placemark(coords, {
                    hintContent: `Вероятность: ${probability}`,
                    balloonContent: `Координаты: ${coords.join(', ')}<br>Вероятность: ${probability}`
                }, {
                    preset: 'islands#circleIcon',
                    iconColor: color
                });

                map.geoObjects.add(placemark);
            }
        }
    }

    // Вызов функции для получения и отображения данных
    getCoordinates();
}
