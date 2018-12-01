import time


def gen_trip_flights(item):
    if item is not None:
        yield from gen_trip_flights(item[0])
        yield item[1]


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
        'out_time0': ([0, 0], [4, 59]),
        'out_time1': ([5, 0], [11, 59]),
        'out_time2': ([12, 0], [17, 59]),
        'out_time3': ([18, 0], [23, 59])
    }
    return [table[tag] for tag in tags if tag is not None]


def parse_time(tstr):
    result = []
    i = 0
    for j in range(len(tstr)):
        if tstr[j] == ':':
            result.append(int(tstr[i:j]))
            i = j + 1

result.append(int(tstr[i:]))
return result


def time_filter(trips, tag):
    time_intervals = convert_time_tag(tag)
    
    result = []
    for trip in trips:
        t = parse_time(trip[0]['depart_time'])
        for start_time, end_time in time_intervals:
            if start_time <= t <= end_time:
                result.append(trip)
                break

for i, trip in enumerate(result):
    for flight in trip:
        flight['id'] = i
    
    return result


def max_hour_filter(trips, v):
    result = []
    
    for trip in trips:
        duration = get_time_diff(trip[-1]['arrival_date'], trip[-1]['arrival_time'], trip[0]['departure_date'],
                                 trip[0]['depart_time']) // 3600
                                 if duration // 3600 <= v:
                                     result.append(trip)

return result


def high_price_filter(trips, v):
    result = []
    for trip in trips:
        price = 0.0
        for flight in trip:
            price += flight['price']
        if price <= v:
            result.append(trip)
    return result


def low_price_filter(trips, v):
    result = []
    for trip in trips:
        price = 0.0
        for flight in trip:
            price += flight['price']
        if price >= v:
            result.append(trip)
    return result


def convert_to_sec(date, clock):
    return int(time.mktime(time.strptime(date + '-' + clock, '%Y-%m-%d-%H:%M:%S')))


def get_time_diff(date1, clock1, date2, clock2):
    return convert_to_sec(date1, clock1) - convert_to_sec(date2, clock2)


def add_duration_and_time(trips):
    for trip in trips:
        duration = get_time_diff(trip[-1]['arrival_date'], trip[-1]['arrival_time'], trip[0]['departure_date'],
                                 trip[0]['depart_time']) // 3600
                                 d_time = convert_to_sec(trip[0]['arrival_date'], trip[0]['arrival_time'])
                                 a_time = convert_to_sec(trip[-1]['arrival_date'], trip[-1]['arrival_time'])
                                 for flight in trip:
                                     flight['duration'] = duration
                                     flight['d_time'] = d_time
                                     flight['a_time'] = a_time
