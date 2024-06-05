document.addEventListener("DOMContentLoaded", function() {
    fetch('http://127.0.0.1:8000/get-statistics')
        .then(response => response.json())
        .then(data => {
            const years = data.map(item => item.year);
            const totalAccidents = data.map(item => item.total_accidents);

            // График количества ДТП по годам
            const ctxAccidents = document.getElementById('accidentsChart').getContext('2d');
            new Chart(ctxAccidents, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Количество ДТП',
                        data: totalAccidents,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Заполнение селектора года
            const yearSelect = document.getElementById('yearSelect');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });

            // Функция для отображения диаграммы признаков
            function updateFeaturesChart(year) {
                const selectedData = data.find(item => item.year == year);
                const featuresData = {
                    labels: ['Темное время', 'Светлое время', 'Сумерки', 'Снегопад', 'Туман', 'Облачно', 'Ясно', 'Ураганный ветер', 'Дождь', 'Метель', 'Выходной', 'Утро', 'День', 'Вечер', 'Ночь'],
                    datasets: [{
                        label: `Признаки за ${year} год`,
                        data: [
                            selectedData.dark_time_percentage,
                            selectedData.light_time_percentage,
                            selectedData.twilight_percentage,
                            selectedData.snowfall_percentage,
                            selectedData.fog_percentage,
                            selectedData.cloudy_percentage,
                            selectedData.clear_percentage,
                            selectedData.hurricane_wind_percentage,
                            selectedData.rain_percentage,
                            selectedData.blizzard_percentage,
                            selectedData.isDayOff_percentage,
                            selectedData.morning_percentage,
                            selectedData.afternoon_percentage,
                            selectedData.evening_percentage,
                            selectedData.night_percentage
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                };

                const ctxFeatures = document.getElementById('featuresChart').getContext('2d');
                if (window.featuresChart instanceof Chart) {
                    window.featuresChart.destroy();
                }
                window.featuresChart = new Chart(ctxFeatures, {
                    type: 'bar',
                    data: featuresData,
                    options: {
                        scales: {
                            x: {
                                beginAtZero: true
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // Обновление диаграммы признаков при изменении года
            yearSelect.addEventListener('change', (e) => {
                updateFeaturesChart(e.target.value);
            });

            // Установка начального значения диаграммы признаков
            updateFeaturesChart(years[0]);
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
});
