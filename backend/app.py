from collections import deque
from flask import Flask, request, jsonify
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '123456'
app.config['MYSQL_DATABASE_DB'] = 'databasePJ'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 3306
mysql.init_app(app)


# @app.route('/api/activities')
# def api_activities():
#     departure_airport_code = request.args.get('departureAirportCode')
#     arrival_airport_code = request.args.get('arrivalAirportCode')
#     cursor = mysql.connect().cursor()
#     cursor.execute("""
#         SELECT *
#         FROM flight
#         WHERE departureAirportCode = "{}" and arrivalAirportCode = "{}"
#         """.format(departure_airport_code, arrival_airport_code))
#     data = cursor.fetchall()
#     data = [
#         {
#             'airline': row[0],
#             'flightCode': row[1],
#             'departureDate': str(row[2]),
#             'departureTime': str(row[3]),
#             'arrivalDate': str(row[4]),
#             'arrivalTime': str(row[5]),
#             'departureAirportCode': row[6],
#             'arrivalAirportCode': row[7],
#             'price': row[8],
#         }
#         for row in data
#     ]
#     return jsonify(data)


@app.route('/api/flights')
def api_flights():
    cursor = mysql.connect().cursor()
    departure_airport_city = request.args.get('origin')
    arrival_airport_city = request.args.get('destination')
    departure_date = request.args.get('depart')

    cursor.execute("""
    SELECT airport_code
    FROM airport
    WHERE airport_city = {}
    """.format(departure_airport_city))
    departure_airport_codes = set(
        int(row[0]) for row in
        cursor.fetchall()
    )

    cursor.execute("""
    SELECT airport_code
    FROM airport
    WHERE airport_city = {}
    """.format(arrival_airport_city))
    arrival_airport_codes = set(
        int(row[0]) for row in
        cursor.fetchall()
    )

    flight_queue = deque()
    for code in departure_airport_codes:
        cursor.execute("""
        SELECT *
        FROM flight
        WHERE departure_airport_code = {} AND departure_date = "{}"
        """.format(code, departure_date))
        for row in cursor.fetchall():
            flight_queue.append((None, row))

    result = []
    for _ in range(3):
        size = len(flight_queue)
        for _ in range(size):
            cur = flight_queue.popleft()
            if cur[1][7] in arrival_airport_codes:




if __name__ == '__main__':
    app.run()
