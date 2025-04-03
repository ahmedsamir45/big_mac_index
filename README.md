﻿# Big Mac Index Visualization

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
