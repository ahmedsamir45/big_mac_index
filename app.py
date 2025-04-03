from flask import Flask, render_template, request, jsonify, send_from_directory
import pandas as pd
import os

app = Flask(__name__)

# Serve static files from templates directory
@app.route('/')
def index():
    return render_template('index.html',css="index",js="index")

@app.route('/data')
def get_data():
    try:
        # Load the CSV data
        df = pd.read_csv('data/big_mac.csv')
        
        # Get unique dates for the date filter
        dates = sorted(df['date'].unique().tolist())
        
        # Filter data based on selected date
        selected_date = request.args.get('date', dates[-1])  # Default to latest date
        filtered_df = df[df['date'] == selected_date]
        
        # Debug output
        print(f"Selected date: {selected_date}")
        print(f"Number of countries: {len(filtered_df)}")
        
        # Prepare data for map
        map_data = []
        for _, row in filtered_df.iterrows():
            # Make sure we have valid iso_a3 and dollar_price values
            if pd.notna(row['iso_a3']) and pd.notna(row['dollar_price']):
                map_data.append({
                    'id': row['iso_a3'],
                    'name': row['name'],
                    'value': float(row['dollar_price']),
                    'currency': row['currency_code'],
                    'local_price': float(row['local_price'])
                })
        
        # Return both the map data and the available dates
        return jsonify({
            'map_data': map_data,
            'dates': dates
        })
    except Exception as e:
        print(f"Error getting data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/country/<country_code>')
def country_detail(country_code):
    try:
        # Load the CSV data
        df = pd.read_csv('data/big_mac.csv')
        
        # Debug information
        print(f"Requested country code: {country_code}")
        print(f"Available codes (sample): {df['iso_a3'].unique()[:10]}")
        
        # Filter data for the selected country
        country_df = df[df['iso_a3'] == country_code].sort_values('date')
        
        # More debug information
        print(f"Found {len(country_df)} records for country {country_code}")
        
        if len(country_df) == 0:
            print(f"No data found for country code: {country_code}")
            return jsonify([])
        
        # Convert to list of dictionaries for JSON
        country_data = []
        for _, row in country_df.iterrows():
            country_data.append({
                'name': row['name'],
                'date': row['date'],
                'iso_a3': row['iso_a3'],
                'currency_code': row['currency_code'],
                'local_price': float(row['local_price']),
                'dollar_price': float(row['dollar_price']),
                'dollar_ex': float(row['dollar_ex']) if pd.notna(row['dollar_ex']) else None
            })
        
        return jsonify(country_data)
    except Exception as e:
        print(f"Error getting country data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add routes for additional visualizations
@app.route('/charts')
def charts():
    return render_template('charts.html',js="charts",css="charts")

@app.route('/chart_data')
def chart_data():
    try:
        # Load the CSV data
        df = pd.read_csv('data/big_mac.csv')
        
        # Get the latest date for current comparison
        latest_date = df['date'].max()
        latest_df = df[df['date'] == latest_date]
        
        # Get top countries by GDP for the bar chart
        countries_data = latest_df.sort_values('dollar_price', ascending=False).head(15)
        
        # Prepare time series data - get a few representative countries
        countries_to_track = ['USA', 'GBR', 'CHN', 'JPN', 'DEU']  # US, UK, China, Japan, Germany
        time_series_df = df[df['iso_a3'].isin(countries_to_track)]
        
        # Group by date and country
        time_series_data = {}
        for country in countries_to_track:
            country_df = time_series_df[time_series_df['iso_a3'] == country]
            if not country_df.empty:
                country_name = country_df['name'].iloc[0]
                time_series_data[country] = {
                    'name': country_name,
                    'dates': country_df['date'].tolist(),
                    'prices': country_df['dollar_price'].tolist()
                }
        
        # Create data for scatter plot (GDP vs Price)
        scatter_data = []
        for _, row in latest_df.iterrows():
            if pd.notna(row['iso_a3']) and pd.notna(row['dollar_price']) and pd.notna(row['GDP_dollar']):
                scatter_data.append({
                    'country': row['name'],
                    'iso_a3': row['iso_a3'],
                    'gdp': float(row['GDP_dollar']),
                    'price': float(row['dollar_price'])
                })
        
        return jsonify({
            'bar_chart': {
                'countries': countries_data['name'].tolist(),
                'prices': countries_data['dollar_price'].tolist(),
                'currencies': countries_data['currency_code'].tolist()
            },
            'time_series': time_series_data,
            'scatter_data': scatter_data,
            'latest_date': latest_date
        })
    except Exception as e:
        print(f"Error getting chart data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Serve template folder for static files
@app.route('/templates/<path:path>')
def serve_templates(path):
    return send_from_directory('templates', path)

# Disable caching for development
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store'
    return response


@app.route("/documentation")
def documentaton():
    return render_template("documentation.html",css="documentation")




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)