
// Color palette for charts
const colors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(153, 102, 255, 0.8)'
];

// Load chart data
fetch('/chart_data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Chart data loaded:", data);
        createBarChart(data.bar_chart);
        createLineChart(data.time_series, data.latest_date);
        createScatterChart(data.scatter_data);
    })
    .catch(error => {
        console.error("Error loading chart data:", error);
        alert("Failed to load chart data. Please refresh the page.");
    });
    
// Create horizontal bar chart
function createBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    // Sort data by price
    const indices = Array.from(Array(data.countries.length).keys())
        .sort((a, b) => data.prices[a] - data.prices[b]);
        
    const sortedCountries = indices.map(i => data.countries[i]);
    const sortedPrices = indices.map(i => data.prices[i]);
    const sortedCurrencies = indices.map(i => data.currencies[i]);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedCountries,
            datasets: [{
                label: 'Big Mac Price (USD)',
                data: sortedPrices,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `$${context.raw.toFixed(2)} USD (${sortedCurrencies[index]})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Price in USD',
                        font: { size: 14 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Country',
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}

// Create line chart for time series
function createLineChart(timeSeriesData, latestDate) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    
    // Prepare datasets
    const datasets = [];
    let i = 0;
    
    for (const [code, data] of Object.entries(timeSeriesData)) {
        datasets.push({
            label: data.name,
            data: data.prices,
            backgroundColor: colors[i % colors.length],
            borderColor: colors[i % colors.length],
            fill: false,
            tension: 0.1,
            pointRadius: 3,
            pointHoverRadius: 5
        });
        i++;
    }
    
    // Get all unique dates
    const allDates = new Set();
    for (const [code, data] of Object.entries(timeSeriesData)) {
        data.dates.forEach(date => allDates.add(date));
    }
    const sortedDates = Array.from(allDates).sort();
    
    // Format dates for display
    const formattedDates = sortedDates.map(date => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short'
        });
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedDates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Big Mac Price Trends Over Time',
                    font: { size: 16 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: { size: 14 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price in USD',
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}

// Create scatter chart
function createScatterChart(scatterData) {
    const ctx = document.getElementById('scatterChart').getContext('2d');
    
    // Prepare data
    const data = scatterData.map(item => ({
        x: item.gdp,
        y: item.price,
        country: item.country
    }));
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Countries',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return `${point.country}: GDP $${point.x.toFixed(2)}, Big Mac $${point.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'GDP per Capita (USD)',
                        font: { size: 14 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Big Mac Price (USD)',
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}

console.log("charts")