document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://127.0.0.1:8000/get-predictions-models');
    const data = await response.json();

    const aucRocChartCtx = document.getElementById('aucRocChart').getContext('2d');
    const logLossChartCtx = document.getElementById('logLossChart').getContext('2d');
    const meanCvScoreChartCtx = document.getElementById('meanCvScoreChart').getContext('2d');
    const stdCvScoreChartCtx = document.getElementById('stdCvScoreChart').getContext('2d');
    const modelSelect = document.getElementById('modelSelect');
    const calibrationCurveImg = document.getElementById('calibrationCurve');

    const modelNames = data.map(model => model.classifier_name);
    const aucRocScores = data.map(model => model.auc_roc_score);
    const logLosses = data.map(model => model.log_loss);
    const meanCvScores = data.map(model => model.mean_cv_score);
    const stdCvScores = data.map(model => model.std_cv_score);

    new Chart(aucRocChartCtx, {
        type: 'bar',
        data: {
            labels: modelNames,
            datasets: [{
                label: 'AUC ROC Score',
                data: aucRocScores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(logLossChartCtx, {
        type: 'bar',
        data: {
            labels: modelNames,
            datasets: [{
                label: 'Log Loss',
                data: logLosses,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(meanCvScoreChartCtx, {
        type: 'bar',
        data: {
            labels: modelNames,
            datasets: [{
                label: 'Mean CV Score',
                data: meanCvScores,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(stdCvScoreChartCtx, {
        type: 'bar',
        data: {
            labels: modelNames,
            datasets: [{
                label: 'Std CV Score',
                data: stdCvScores,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    modelNames.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = name;
        modelSelect.appendChild(option);
    });

    modelSelect.addEventListener('change', (event) => {
        const selectedIndex = event.target.value;
        const selectedModel = data[selectedIndex];
        calibrationCurveImg.src = `data:image/png;base64,${selectedModel.calibration_curve}`;
    });

    // Инициализация изображения для первой модели по умолчанию
    calibrationCurveImg.src = `data:image/png;base64,${data[0].calibration_curve}`;
});