from collections import deque
from flask import Flask, request, jsonify
from flaskext.mysql import MySQL
import utility
from flask_cors import CORS
from flask import make_response
import json

app = Flask(__name__)
CORS(app)

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '123456'
app.config['MYSQL_DATABASE_DB'] = 'databasePJ'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 3306
mysql.init_app(app)

user_name_saved = None


def search(
        departure_airport_city,
        arrival_airport_city,
        departure_date,
        stop_count,
        time_tags,
        airline_tags,
        max_hours,
        low_price,
        high_price
):
    cursor = mysql.connect().cursor()

    cursor.execute("""
        SELECT airportCode
        FROM airport
        WHERE airportCity = "{}"
        """.format(departure_airport_city))
    departure_airport_codes = set(
        row[0] for row in
        cursor.fetchall()
    )

    cursor.execute("""
        SELECT airportCode
        FROM airport
        WHERE airportCity = "{}"
        """.format(arrival_airport_city))
    arrival_airport_codes = set(
        row[0] for row in
        cursor.fetchall()
    )

    flight_queue = deque()
    for code in departure_airport_codes:
        cursor.execute("""
            SELECT *
            FROM flight
            WHERE departureAirportCode = "{}" AND departureDate = "{}"
            """.format(code, departure_date))
        for row in cursor.fetchall():
            flight_queue.append((None, row))

    result = []
    for _ in range(stop_count):
        size = len(flight_queue)
        for _ in range(size):
            cur = flight_queue.popleft()
            if cur[1][7] in arrival_airport_codes:
                result.append(list(utility.gen_trip_flights(cur)))
            else:
                cursor.execute("""
                    SELECT *
                    FROM flight
                    WHERE departureAirportCode = "{}" AND
                     (departureDate > "{}" AND DATEDIFF(departureDate, "{}") <= 1 OR departureDate = "{}" AND departureTime > "{}")
                     """.format(cur[1][7], str(cur[1][4]), str(cur[1][4]), str(cur[1][4]), str(cur[1][5])))
                for row in cursor.fetchall():
                    flight_queue.append((cur, row))

    while flight_queue:
        cur = flight_queue.popleft()
        if cur[1][7] in arrival_airport_codes:
            result.append(list(utility.gen_trip_flights(cur)))

    result = [
        [
            {
                'id': i,
                'airlines': flight[0],
                'number': flight[1],
                'depart_time': str(flight[3]),
                'arrival_time': str(flight[5]),
                'hour': utility.get_hour(str(flight[3]), str(flight[5])),
                'minute': utility.get_minute(str(flight[3]), str(flight[5])),
                'stops': " (" + str(len(trip) - 1) + "stops) ",
                'departure': flight[6],
                'arrival': flight[7],
                'price': flight[8],
                'r_type': 1,
                'departure_date': str(flight[2]),
                'arrival_date': str(flight[4])
            }
            for flight in trip
        ]
        for i, trip in enumerate(result)
    ]

    for trip in result:
        for flight in trip:
            cursor.execute("""
            SELECT airlineLogoUrl
            FROM airline
            WHERE airline = "{}"
            """.format(flight['airlines']))
            logo = cursor.fetchone()[0]
            flight['logo'] = logo

    if airline_tags:
        result = utility.airline_filter(result, airline_tags)

    if time_tags:
        result = utility.time_filter(result, time_tags)

    if max_hours is not None:
        result = utility.max_hour_filter(result, max_hours)

    if low_price is not None:
        result = utility.low_price_filter(result, low_price)

    if high_price is not None:
        result = utility.high_price_filter(result, high_price)

    return result


def roundtrip_search(
        departure_airport_city,
        arrival_airport_city,
        departure_date,
        return_date,
        stop_count,
        airline_tag,
        departure_time_tag,
        return_time_tag,
        max_hours,
        low_pirce,
        high_price
):
    print("IN ROUND TRIP")
    result1 = search(
        departure_airport_city,
        arrival_airport_city,
        departure_date,
        stop_count,
        departure_time_tag,
        airline_tag,
        max_hours,
        low_pirce,
        high_price
    )
    result2 = search(
        arrival_airport_city,
        departure_airport_city,
        return_date,
        stop_count,
        return_time_tag,
        airline_tag,
        max_hours,
        low_pirce,
        high_price
    )
    result = list(utility.gen_roundtrip(result1, result2))
    for i, item in enumerate(result):
        for flight in item:
            flight['id'] = i
            flight['r_trip'] = 2

    return result


def do_search(
        roundtrip,
        departure_airport_city,
        arrival_airport_city,
        departure_date,
        return_date,
        stop_count,
        airline_tag,
        out_time_tag,
        in_time_tag,
        max_hours,
        low_price,
        high_price
):
    if roundtrip == 2:
        result = roundtrip_search(
            departure_airport_city,
            arrival_airport_city,
            departure_date,
            return_date,
            stop_count,
            airline_tag,
            out_time_tag,
            in_time_tag,
            max_hours,
            low_price,
            high_price
        )
    else:
        result = search(
            departure_airport_city,
            arrival_airport_city,
            departure_date,
            stop_count,
            out_time_tag,
            airline_tag,
            max_hours,
            low_price,
            high_price
        )

    if len(result) > 50:
        result = result[:50]
    return result


@app.route('/api/flights')
def api_flights():
    departure_airport_city = request.args.get('origin')
    arrival_airport_city = request.args.get('destination')
    departure_date = request.args.get('depart')
    if departure_date is not None:
        departure_date = departure_date[:10]
    return_date = request.args.get('return')
    if return_date is not None:
        return_date = return_date[:10]
    roundtrip = request.args.get('roundtrip')
    if roundtrip is not None:
        roundtrip = int(roundtrip)
    stop_count = request.args.get('stops')
    if stop_count is not None:
        stop_count = int(stop_count)
    else:
        stop_count = 0
    airline1_tag = request.args.get('airlines[0]')
    airline2_tag = request.args.get('airlines[1]')
    airline3_tag = request.args.get('airlines[2]')
    airline4_tag = request.args.get('airlines[3]')
    airline5_tag = request.args.get('airlines[4]')
    airline6_tag = request.args.get('airlines[5]')
    airline7_tag = request.args.get('airlines[6]')

    airline_tags = [
        airline1_tag,
        airline2_tag,
        airline3_tag,
        airline4_tag,
        airline5_tag,
        airline6_tag,
        airline7_tag
    ]

    airline_tags = [tag for tag in airline_tags if tag is not None]

    out_time_tag0 = request.args.get('out_time[0]')
    out_time_tag1 = request.args.get('out_time[1]')
    out_time_tag2 = request.args.get('out_time[2]')
    out_time_tag3 = request.args.get('out_time[3]')
    out_time_tags = [
        out_time_tag0,
        out_time_tag1,
        out_time_tag2,
        out_time_tag3
    ]
    out_time_tags = [tag for tag in out_time_tags if tag is not None]

    in_time_tag0 = request.args.get('in_time[0]')
    in_time_tag1 = request.args.get('in_time[1]')
    in_time_tag2 = request.args.get('in_time[2]')
    in_time_tag3 = request.args.get('in_time[3]')
    in_time_tags = [
        in_time_tag0,
        in_time_tag1,
        in_time_tag2,
        in_time_tag3
    ]

    in_time_tags = [tag for tag in in_time_tags if tag is not None]

    max_hours = request.args.get('max_hours')
    if max_hours is not None:
        max_hours = int(max_hours)
    low_price = request.args.get('low_price')
    if low_price is not None:
        low_price = int(low_price)
    high_price = request.args.get('high_price')
    if high_price is not None:
        high_price = int(high_price)

    print(request.args)

    result = do_search(
        roundtrip,
        departure_airport_city,
        arrival_airport_city,
        departure_date,
        return_date,
        stop_count,
        airline_tags,
        out_time_tags,
        in_time_tags,
        max_hours,
        low_price,
        high_price
    )

    print(result)
    resp = make_response(jsonify(result))
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    return resp


def add_trip_to_wish(username, trip):
    cursor = mysql.connect().cursor()

    cursor.execute("""
    INSERT INTO userwish
    VALUES ("{}")
    """.format(username))

    wishid = cursor.lastrowid

    for flight in trip:
        cursor.execute("""
        INSERT INTO wish
        VALUES ({}, "{}", {}, "{}", "{}")
        """.format(wishid, flight['airlines'], flight['number'], flight['departure_date'], flight['depart_time']))


def get_wish_flight(row):
    cursor = mysql.connect().cursor()

    cursor.execute("""
    SELECT *
    FROM flight
    WHERE airline = "{}" AND flightCode = {} AND departureDate = "{}" AND departureTime = "{}"
    """.format(row['airline'], row['flightCode'], row['departureDate'], row['departureTime']))

    row = cursor.fetchone()

    return {
        'id': 0,
        'airlines': row[0],
        'number': row[1],
        'depart_time': str(row[3]),
        'arrival_time': str(row[5]),
        'hour': utility.get_hour(str(row[3]), str(row[5])),
        'minute': utility.get_minute(str(row[3]), str(row[5])),
        'stops': " (Nonstop) ",
        'departure': row[6],
        'arrival': row[7],
        'price': row[8],
        'r_trip': 1,
        'departure_date': str(row[2])
    }


def get_wish_item(wishid):
    cursor = mysql.connect().cursor()

    cursor.execute("""
    SELECT *
    FROM wish
    WHERE wishid = {}
    """.format(wishid))

    rows = [
        {
            'wishid': row[0],
            'airline': row[1],
            'flightCode': row[2],
            'departureDate': str(row[3]),
            'departureTime': str(row[4]),
        }
        for row in cursor.fetchall()
    ]

    result = []
    for row in rows:
        result.append(get_wish_flight(row))

    for flight in result:
        flight['id'] = wishid
        flight['stops'] = " (" + str(len(rows) - 1) + " stops) "

    return result


@app.route('/api/add')
def api_add():
    departure_airport_city = request.args.get('origin')
    arrival_airport_city = request.args.get('destination')
    departure_date = request.args.get('depart')
    return_date = request.args.get('return')
    roundtrip = request.args.get('roundtrip')
    stop_count = request.args.get('stops')
    airline_tag = request.args.get('airlines')
    out_time_tag = request.args.get('out_time')
    in_time_tag = request.args.get('in_time')

    i = request.args.get('id')
    user_name = request.args.get('user_name')

    search_result = do_search(
        roundtrip,
        departure_airport_city,
        arrival_airport_city,
        departure_date,
        return_date,
        stop_count,
        airline_tag,
        out_time_tag,
        in_time_tag
    )

    trip = search_result[i]

    add_trip_to_wish(user_name, trip)


@app.route('/api/wish')
def api_wish():
    user_name = user_name_saved

    cursor = mysql.connect().cursor()
    cursor.execute("""
    SELECT wishid
    FROM userwish
    WHERE username = "{}"
    """.format(user_name))

    wishids = [row[0] for row in cursor.fetchall()]

    result = []
    for wishid in wishids:
        result.append(get_wish_item(wishid))

    resp = make_response(jsonify(result))
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    return resp


@app.route('/api/register', methods=['GET', 'POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        resp = make_response(jsonify({'status': 'ok'}), 200)
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp
    postBody = json.loads(request.data)
    connection = mysql.connect()
    cursor = connection.cursor()
    cursor.execute("select * from user where username = %(username)s", {'username': postBody['mail']})
    row = cursor.fetchone()
    if row is not None:
        resp = make_response(jsonify({'status': 'error'}), 200)
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp
    cursor.execute("insert into user values (%(username)s, %(password)s)",
                   {'username': postBody['mail'], 'password': postBody['password']})
    connection.commit()
    resp = make_response(jsonify({'status': 'ok'}), 200)
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    return resp


@app.route('/api/login', methods=['GET', 'POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        resp = make_response(jsonify({'status': 'ok'}), 200)
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp
    postBody = json.loads(request.data)
    print(postBody)
    connection = mysql.connect()
    cursor = connection.cursor()
    cursor.execute("select * from user where username = %(username)s", {'username': postBody['userName']})
    row = cursor.fetchone()
    if row is None:
        resp = make_response(jsonify({'status': 'error', 'type': 'account', 'currentAuthority': 'user'}), 200)
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp
    if row[1] != postBody['password']:
        resp = make_response(jsonify({'status': 'error', 'type': 'account', 'currentAuthority': 'user'}), 200)
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp
    resp = make_response(jsonify({'status': 'ok', 'type': 'account', 'currentAuthority': 'user'}), 200)
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    print(resp)
    return resp


if __name__ == '__main__':
    app.run()
