# Big Mac Index Visualization

A web-based visualization tool for The Economist's Big Mac Index, showing global price comparisons and purchasing power parity.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Data Sources](#data-sources)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## About

The Big Mac Index is an economic indicator that compares purchasing power between countries using the price of McDonald's Big Mac as a benchmark. This Flask application provides interactive visualizations of the index data with multiple views:

- Interactive world map showing Big Mac prices
- Historical trends visualization
- Country comparison charts
- Detailed country-specific information

## Features

🌍 **Interactive World Map**
- Color-coded countries by Big Mac price
- Tooltips with detailed information
- Date selector for historical comparisons

📈 **Data Visualizations**
- Time series charts for price evolution
- Bar charts for country comparisons
- Scatter plots showing GDP vs Price relationships

🔍 **Country Details**
- Historical price data for each country
- Currency and local price information
- Dollar exchange rate comparisons

⚡ **Technical Features**
- Responsive design for all devices
- RESTful API endpoints
- Efficient data loading with pandas
- Modern web interface

## Installation

### Prerequisites
- Python 3.7+
- pip package manager

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/ahmedsamir45/big_mac_index.git
   cd big_mac_index
Here is the full Markdown text for your request:



### Install dependencies:
```bash
pip install -r requirements.txt


### Add your data file:
- Download the Big Mac Index data as CSV
- Place it in the `data/` directory as `big_mac.csv`

## Usage

### Development
```bash
python app.py
```
Access the application at: `http://localhost:8000`

### Production
For production deployment using gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## Data Sources
The application uses data from:
- The Economist's official Big Mac Index
- [Our World in Data](https://ourworldindata.org/)
- [World Bank Open Data](https://data.worldbank.org/)
- [IMF Economic Data](https://www.imf.org/en/Data)

## API Endpoints

| Endpoint                | Method | Description                 | Parameters                 |
|-------------------------|--------|-----------------------------|----------------------------|
| `/data`                 | GET    | Get map visualization data  | `date` (optional)          |
| `/country/<country_code>`| GET    | Get country historical data | ISO Alpha-3 country code  |
| `/chart_data`           | GET    | Get data for comparison charts| None                      |
| `/documentation`        | GET    | API documentation page      | None                      |

Example API response from `/data`:
```json
{
  "map_data": [
    {
      "id": "USA",
      "name": "United States",
      "value": 5.66,
      "currency": "USD",
      "local_price": 5.66
    }
  ],
  "dates": ["2022-01-01", "2022-07-01"]
}
```

## Project Structure

```
big_mac_index/
├── app.py                # Main Flask application
├── requirements.txt      # Python dependencies
├── data/
│   └── big_mac.csv       # Dataset
├── templates/
│   ├── index.html        # Main map view
│   ├── charts.html       # Data visualizations
│   └── documentation.html # API docs
├── static/
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript files
└── README.md             # This file
```


## Contributing

We welcome contributions! Here's how to help:

1. **Report bugs** by opening issues
2. **Suggest features** in the discussions
3. **Submit pull requests**:
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/your-feature`)
   - Commit your changes (`git commit -am 'Add some feature'`)
   - Push to the branch (`git push origin feature/your-feature`)
   - Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Disclaimer**: This project is not affiliated with The Economist or McDonald's Corporation. The Big Mac Index is a trademark of The Economist.
```

You can copy and paste this Markdown into your file.

