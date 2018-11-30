import json
from requests_html import HTMLSession

airportCity = {}

def scrape_flight_data():
    """file = open('stateAirport.txt', 'r')
    airportCode = []
    for line in file.readlines():
        airportCode.append(line.split(',')[1][:-1])
    print (airportCode)"""
    airportCode = ['nyc','qla','chi','phl','hou','phx','san','sea','dal','was']
    City = ['New York', 'Los Angeles', 'Chicago','Philadelphia','Houston','Phoenix','San Diego','Seattle','Dallas','Washington, DC' ]
    nAirport = len(airportCode)
    resultFile = open('flightTable.out', 'w')
    for date in range(3):
        for indexi in range(nAirport):
            for indexj in range(nAirport):
                if indexi!=indexj:
                    sourceCity = airportCode[indexi]
                    departureCityFullName  = City[indexi]
                    destinationCity = airportCode[indexj]
                    arrivalCityFullName = City[indexj]
                    departureDate = '12/' + str(date + 1)+'/2018'
                    url = "https://www.expedia.com/Flights-Search?flight-type=on&starDate=" + departureDate +"&mode=search&trip=oneway&leg1=from:"+ sourceCity+",to:"+ destinationCity+ ",departure:"+ departureDate+"TANYT&passengers=adults:1"
                    print(url)
                    session = HTMLSession()
                    response = session.get(url)
                    try:
                        data = json.loads(json.loads(response.html.find("#cachedResultsJson", first=True).text)["content"])
                        data = data['legs']
                    except:
                        continue
                    for i in data:
                        thisFlight = data[i]
                        #only scrape nonstop flight
                        if (thisFlight['stops'] != 0):
                            #print ('exit')
                            continue
                        price = thisFlight['price']['offerPrice']
                        airline = thisFlight['carrierSummary']['airlineName']
                        departureCity = thisFlight['departureLocation']['airportCity']
                        departureAirportCode = thisFlight['departureLocation']['airportCode']
                        arrivingCity = thisFlight['arrivalLocation']['airportCity']
                        arrivingAirportCode = thisFlight['arrivalLocation']['airportCode']
                        airportCity[departureAirportCode] = departureCityFullName
                        airportCity[arrivingAirportCode] = arrivalCityFullName
                        if len(thisFlight['timeline'])!=1:
                            continue
                        flightNumber = thisFlight['timeline'][0]['carrier']['flightNumber']
                        #flightNumber = airline + " " + str(flightNumber)
                        departureDate = thisFlight['departureTime']['date']
                        temp = departureDate.split('/')
                        departureDate = temp[2] + '-' + temp[0] + '-' + temp[1]
                        departureTime = thisFlight["departureTime"]["time"]
                        hour = int(departureTime.split(':')[0])
                        minute = departureTime.split(':')[1][0:2]
                        if (departureTime.find('p') != -1 and hour < 12):
                            hour = hour + 12
                        departureTime = str(hour) + ':' + minute
                        arrivalDate = thisFlight['arrivalTime']['date']
                        temp = arrivalDate.split('/')
                        arrivalDate = temp[2] + '-' + temp[0] + '-' + temp[1]
                        arrivalTime = thisFlight["arrivalTime"]["time"]
                        hour = int(arrivalTime.split(':')[0])
                        minute = arrivalTime.split(':')[1][0:2]
                        if (arrivalTime.find('p')!= -1 and hour < 12):
                            hour = hour + 12
                        arrivalTime = str(hour) + ':' + minute
                        if (price == None or airline == None or departureCity == None or departureAirportCode ==None or arrivingCity == None or arrivingAirportCode== None or departureTime ==None or arrivalTime ==None):
                            continue
                        print(airline + ","  + str(flightNumber) + "," + departureDate +','+ departureTime + "," +arrivalDate+','+ arrivalTime + ','+  departureAirportCode + "," + arrivingAirportCode + "," + str(price) + '\n')
                        resultFile.write(airline + ","  + str(flightNumber) + "," + departureDate +','+ departureTime + "," +arrivalDate+','+ arrivalTime + ','+  departureAirportCode + "," + arrivingAirportCode + "," + str(price) + '\n')

"""if (type == 'roundtrip'):
    sourceCity = sys.argv[2]
    destinationCity = sys.argv[3]
    departureDate = sys.argv[4]
    returnDate = sys.argv[5]
    url = "https://www.expedia.com/Flights-Search?flight-type=on&starDate=" + departureDate + "&endDate="+returnDate+"&mode=search&trip=roundtrip&leg1=from:" + sourceCity + ",to:" + destinationCity + ",departure:" + departureDate + "TANYT&leg2=from:"+ destinationCity+ ",to:" + sourceCity+",departure:" + returnDate+"TANYT&passengers=adults:1"
    print (url)
    session = HTMLSession()
    response = session.get(url)
    data = json.loads(json.loads(response.html.find("#cachedResultsJson", first=True).text)["content"])['legs']
    #print (data)
    for i in data:
        thisFlight = data[i]
        price = thisFlight['price']['offerPrice']
        #print(price)
        airline = thisFlight['carrierSummary']['airlineName']
        #print (airline)
        departureCity = thisFlight['departureLocation']['airportCity']
        departureAirportCode = thisFlight['departureLocation']['airportCode']
        #print (departureCity)
        #print (departureAirportCode)
        arrivingCity = thisFlight['arrivalLocation']['airportCity']
        arrivingAirportCode = thisFlight['arrivalLocation']['airportCode']
        #print (arrivingCity)
        #print (arrivingAirportCode)
        numberOfStops = thisFlight['stops']
        #print (numberOfStops)
        departureTime = thisFlight['departureTime']['date'] + " " +thisFlight["departureTime"]["time"]
        #print(departureTime)
        arrivalTime = thisFlight['arrivalTime']['date']+ " " +thisFlight["arrivalTime"]["time"]
        #print (arrivalTime)
        print (str(price) + "," + airline + "," + departureCity + "," + departureAirportCode + "," + arrivingCity + "," + arrivingAirportCode + "," + str(numberOfStops) + "," + departureTime + "," + arrivalTime)
        returnUrl = url + "#leg/" + str(i)
        print (returnUrl)
        returnResponse = session.get(returnUrl)
        returnData = json.loads(json.loads(returnResponse.html.find("#cachedResultsJson", first=True).text)["content"])['legs']
        print (returnData)
        for j in returnData:
            returnFlight = returnData[j]
            wholePrice = returnFlight['price']['offerPrice']
            returnAirline = returnFlight['carrierSummary']['airlineName']
            returnDepartureCity = returnFlight['departureLocation']['airportCity']
            returnDepartureAirportCode = returnFlight['departureLocation']['airportCode']
            returnArrivingCity = returnFlight['arrivalLocation']['airportCity']
            returnArrivingAirportCode = returnFlight['arrivalLocation']['airportCode']
            returnNumberOfStops = returnFlight['stops']
            returnDepartureTime = returnFlight['departureTime']['date'] + " " + returnFlight["departureTime"]["time"]
            returnArrivalTime = returnFlight['arrivalTime']['date'] + " " + returnFlight["arrivalTime"]["time"]
            print(str(wholePrice) + "," + returnAirline + "," + returnDepartureCity + "," + returnDepartureAirportCode + "," + returnArrivingCity + "," + returnArrivingAirportCode + "," + str(returnNumberOfStops) + "," + returnDepartureTime + "," + returnArrivalTime)"""

def generate_airport_data():
    stateFile = open('state_data.in','r')
    abbreviationMap = {}
    for line in stateFile.readlines():
        stateName = line.split('\t')[0]
        abbreviation = line.split('\t')[1][:-1]
        abbreviationMap[abbreviation] = stateName
    print (abbreviationMap)
    airportFile = open('airport_data.in', 'r')
    airportTableFile = open('airportTable.out','w')
    for line in airportFile.readlines():
        abbreviation = line.split('\t')[0]
        stateName = abbreviationMap[abbreviation]
        airportName = line.split('\t')[1]
        airportCode = line.split('\t')[2]
        airportCity = line.split('\t')[3][ :-1]
        print (airportCode + ',' + airportName + ',' + airportCity + ',' + stateName)
        airportTableFile.write(airportCode + ',' + airportName + ',' + airportCity + ',' + stateName + '\n')
    return

def generate_consistent_airport_data():
    airportTableFile = open('airportTable.out', 'w')
    for code in airportCity:
        city = airportCity[code]
        print (code + "," + city)
        airportTableFile.write(code + ":" + city + '\n')
    #print (airportCity)

scrape_flight_data()
#generate_airport_data()
generate_consistent_airport_data()