def gen_trip_flights(item):
    if item is not None:
        yield from gen_trip_flights(item[0])
        yield item[1]


def parse_time(time):
    result = []
    i = 0
    for j in range(len(time)):
        if time[j] == ":":
            result.append(int(time[i:j]))
            i = j + 1

    result.append(int(time[i:]))
    return result


def get_hour(start, end):
    start = parse_time(start)
    end = parse_time(end)
    result = end[0] - start[0]
    if end[1] < start[1]:
        result -= 1
    if result < 0:
        result += 24

    return result


def get_minute(start, end):
    start = parse_time(start)
    end = parse_time(end)
    result = end[1] - start[1]
    if result < 0:
        result += 60

    return result


def gen_roundtrip(list1, list2):
    for item1 in list1:
        for item2 in list2:
            item = []
            for flight in item1 + item2:
                item.append(dict(flight))

            yield item


def convert_airline_tag(tags):
    table = {
        'airline1': 'American Airlines',
        'airline2': 'Alaska Airlines',
        'airline3': 'Frontier America',
        'airline4': 'JetBlue Airways',
        'airline5': 'Delta',
        'airline6': 'United',
        'airline7': 'Spirit Airlines'
    }

    return [table[tag] for tag in tags if tag is not None]


def airline_filter(trips, tags):
    airlines = convert_airline_tag(tags)

    result = []
    for trip in trips:
        okay = True
        for flight in trip:
            if flight['airlines'] not in airlines:
                okay = False
                break
        if okay:
            result.append(trip)

    for i, trip in enumerate(result):
        for flight in trip:
            flight['id'] = i

    return result


def convert_time_tag(tags):
    table = {
        'out_time0': ([12, 0], [16, 59]),
        'out_time1': ([5, 0], [11, 59]),
        'out_time2': ([12, 0], [17, 59]),
        'out_time3': ([18, 0], [23, 59])
    }
    return [table[tag] for tag in tags if tag is not None]


def time_filter(trips, tag):
    time_intervals = convert_time_tag(tag)

    result = []
    for trip in trips:
        time = parse_time(trip[0]['departureTime'])
        for start_time, end_time in time_intervals:
            if start_time <= time <= end_time:
                result.append(trip)
                break

    for i, trip in enumerate(result):
        for flight in trip:
            flight['id'] = i

    return result


def max_hour_filter(trips, tag):
    return trips


def high_price_filter(trips, v):
    result = []
    for trip in trips:
        price = 0.0
        for flight in trip:
            price += flight['price']
        if price <= v:
            result.append(trip)
    return trips


def low_price_filter(trips, v):
    result = []
    for trip in trips:
        price = 0.0
        for flight in trip:
            price += flight['price']
        if price >= v:
            result.append(trip)
    return trips
