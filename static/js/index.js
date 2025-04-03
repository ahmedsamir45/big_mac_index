
// Initialize the map
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Global variables
let geoJsonLayer;
let countriesData = [];

// Simplified GeoJSON for countries - we'll fetch this separately
const geoJsonUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

// Load country GeoJSON data
fetch(geoJsonUrl)
    .then(response => response.json())
    .then(geojson => {
        console.log("GeoJSON loaded successfully");
        // Store the GeoJSON data
        window.countryGeoJson = geojson;
        // Load the Big Mac data
        loadDatesList();
    })
    .catch(error => {
        console.error("Error loading GeoJSON:", error);
        showError("Failed to load map data. Please refresh the page.");
    });

// Load dates list first
function loadDatesList() {
    fetch('/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.dates && data.dates.length > 0) {
                // Populate date dropdown
                const dateSelect = document.getElementById('date-select');
                dateSelect.innerHTML = '';
                
                data.dates.forEach(date => {
                    const option = document.createElement('option');
                    option.value = date;
                    option.textContent = formatDate(date);
                    dateSelect.appendChild(option);
                });
                
                // Select the latest date
                dateSelect.value = data.dates[data.dates.length - 1];
                
                // Load data for this date
                loadBigMacData(dateSelect.value);
            }
        })
        .catch(error => {
            console.error("Error loading dates:", error);
            showError("Failed to load date information. Please refresh the page.");
        });
}

// Load Big Mac data for a specific date
function loadBigMacData(date) {
    fetch(`/data?date=${date}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Store the data
            countriesData = data.map_data;
            console.log(`Loaded ${countriesData.length} countries for date ${date}`);
            
            // Update country dropdown
            updateCountryDropdown();
            
            // Draw the map
            drawMap();
        })
        .catch(error => {
            console.error("Error loading Big Mac data:", error);
            showError("Failed to load Big Mac data. Please try again.");
        });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Update country dropdown
function updateCountryDropdown() {
    const countrySelect = document.getElementById('country-select');
    
    // Clear previous options
    countrySelect.innerHTML = '<option value="">-- Select a country --</option>';
    
    // Sort countries by name
    const sortedCountries = [...countriesData].sort((a, b) => a.name.localeCompare(b.name));
    
    // Add countries to dropdown
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.id;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
}

// Draw the map with Big Mac data
function drawMap() {
    // Clear previous layer
    if (geoJsonLayer) {
        map.removeLayer(geoJsonLayer);
    }
    
    if (!window.countryGeoJson) {
        console.error("GeoJSON data not loaded yet");
        return;
    }
    
    // Create new layer
    geoJsonLayer = L.geoJSON(window.countryGeoJson, {
        style: function(feature) {
            // Find country data
            const countryData = countriesData.find(c => c.id === feature.properties.ISO_A3);
            
            return {
                fillColor: countryData ? getColor(countryData.value) : '#F5F5F5',
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: countryData ? 0.7 : 0.3
            };
        },
        onEachFeature: function(feature, layer) {
            // Find country data
            const countryData = countriesData.find(c => c.id === feature.properties.ISO_A3);
            
            // Add popup
            if (countryData) {
                layer.bindPopup(`
                    <strong>${countryData.name}</strong><br>
                    Big Mac Price (USD): $${countryData.value.toFixed(2)}<br>
                    Local Price: ${countryData.currency} ${countryData.local_price.toFixed(2)}
                `);
                
                // Add click event
                layer.on('click', function() {
                    document.getElementById('country-select').value = countryData.id;
                    showCountryDetail(countryData.id);
                });
            }
        }
    }).addTo(map);
    
    // Add legend
    addLegend();
}

// Get color based on price value
function getColor(price) {
    const p = parseFloat(price);
    if (isNaN(p)) return '#F5F5F5';
    
    return p > 6 ? '#084594' :
            p > 5 ? '#2171b5' :
            p > 4 ? '#4292c6' :
            p > 3 ? '#6baed6' :
            p > 2 ? '#9ecae1' :
            p > 1 ? '#c6dbef' :
                    '#eff3ff';
}

// Add legend to map
function addLegend() {
    // Remove existing legend if present
    document.querySelectorAll('.legend').forEach(el => el.remove());
    
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'legend');
        const grades = [0, 1, 2, 3, 4, 5, 6];
        
        div.innerHTML = '<h6>Big Mac Price (USD)</h6>';
        
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
                '$' + grades[i] + (grades[i + 1] ? '&ndash;$' + grades[i + 1] + '<br>' : '+');
        }
        
        return div;
    };
    
    legend.addTo(map);
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Show country detail
function showCountryDetail(countryCode) {
    if (!countryCode) {
        document.getElementById('country-detail').style.display = 'none';
        return;
    }
    
    console.log(`Fetching details for country: ${countryCode}`);
    
    fetch(`/country/${countryCode}`)
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Received data:", data);
            
            if (!data || data.length === 0) {
                console.log("No data received for country");
                document.getElementById('country-detail').style.display = 'none';
                showError(`No historical data available for this country.`);
                return;
            }
            
            const latestData = data[data.length - 1];
            document.getElementById('country-name').textContent = latestData.name;
            
            let infoHtml = `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Latest Big Mac Price (${formatDate(latestData.date)}):</strong> $${parseFloat(latestData.dollar_price).toFixed(2)}</p>
                        <p><strong>Local Currency Price:</strong> ${latestData.currency_code} ${parseFloat(latestData.local_price).toFixed(2)}</p>
                        <p><strong>Exchange Rate:</strong> ${latestData.dollar_ex ? parseFloat(latestData.dollar_ex).toFixed(2) : 'N/A'} ${latestData.currency_code} to $1 USD</p>
                    </div>
                </div>
            `;
            
            if (data.length > 1) {
                infoHtml += `
                    <h3 class="mt-4">Historical Data</h3>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>USD Price</th>
                                    <th>Local Price (${latestData.currency_code})</th>
                                    <th>Exchange Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                data.forEach(item => {
                    infoHtml += `
                        <tr>
                            <td>${formatDate(item.date)}</td>
                            <td>$${parseFloat(item.dollar_price).toFixed(2)}</td>
                            <td>${parseFloat(item.local_price).toFixed(2)}</td>
                            <td>${item.dollar_ex ? parseFloat(item.dollar_ex).toFixed(2) : 'N/A'}</td>
                        </tr>
                    `;
                });
                
                infoHtml += `
                            </tbody>
                        </table>
                    </div>
                `;
            }
            
            document.getElementById('country-info').innerHTML = infoHtml;
            document.getElementById('country-detail').style.display = 'block';
        })
        .catch(error => {
            console.error("Error loading country details:", error);
            showError("Failed to load country details. Please try again.");
        });
}

// Event listeners
document.getElementById('date-select').addEventListener('change', function() {
    loadBigMacData(this.value);
});

document.getElementById('country-select').addEventListener('change', function() {
    const countryCode = this.value;
    showCountryDetail(countryCode);
    
    if (countryCode && geoJsonLayer) {
        // Find and focus on selected country
        geoJsonLayer.eachLayer(function(layer) {
            if (layer.feature && layer.feature.properties && 
                layer.feature.properties.ISO_A3 === countryCode) {
                map.fitBounds(layer.getBounds());
                layer.openPopup();
            }
        });
    }
});
console.log("index")