const ctx = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
    .then(parseData)
    .then(getData)
    .then(({years, globalTemps, northTemps, southTemps}) => drawChart(years, globalTemps, northTemps, southTemps));

function fetchData() {
    return fetch('./ZonAnn.Ts+dSST.csv').then(response => response.text());
}

function parseData(data) {
    return Papa.parse(data, {header: true}).data;
}
function getData(parsedData) {
    return parsedData.reduce((acc, entry) => {
        acc.years.push(entry.Year);
        acc.globalTemps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
        acc.northTemps.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
        acc.southTemps.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);
        return acc;
    }, {years: [], globalTemps: [], northTemps: [], southTemps: []})
}

function drawChart(labels, gData, nData, sData) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '# Global Annual Temps ',
                data: gData,
                // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }, {
                label: '# Northern Hemisphere Annual Temps ',
                data: nData,
                // backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false
            }, {
                label: '# Southern Hemisphere Annual Temps ',
                data: sData,
                // backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }],
        }, 

        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback(value) {
                            return value + "°";
                        }
                    }
                }]
            }
        }
    });
}
