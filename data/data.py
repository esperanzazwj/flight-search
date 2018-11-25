import json
from requests_html import HTMLSession
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Date, Time, Float, Integer
import traceback

Base = declarative_base()
class Flight(Base):
    __tablename__ = 'flight'
    airline = Column(String(60), primary_key=True)
    flightCode = Column(Integer, primary_key=True)
    departureDate = Column(Date,primary_key = True)
    departureTime = Column(Time,primary_key = True)
    arrivalDate = Column(Date)
    arrivalTime = Column(Time)
    departureAirportCode = Column(String(3))
    arrivalAirportCode = Column(String(3))
    price = Column(Float)

class Airport(Base):
    __tablename__ = 'airport'
    airportCode = Column(String(3), primary_key=True)
    airportName = Column(String(60))
    airportCity = Column(String(60))
    airportState = Column(String(30))

class User(Base):
    __tablename__ = 'user'
    username = Column(String(20), primary_key = True)
    password = Column(String(20))

class Airline(Base):
    __tablename__ = 'airline'
    airline = Column(String(60), primary_key = True)
    airlineLogoUrl = Column(String(200))

class UserWish(Base):
    __tablename__ = 'userwish'
    wishId =  Column(Integer, primary_key = True)
    username = Column(String(20))

class Wish(Base):
    __tablename__ = 'wish'
    wishId = Column(Integer, primary_key=True)
    airline = Column(String(60), primary_key=True)
    flightCode = Column(Integer, primary_key=True)
    departureDate = Column(Date, primary_key=True)
    departureTime = Column(Time, primary_key=True)

engine = sqlalchemy.create_engine("mysql+pymysql://root:password@localhost:3306/databasePJ?charset=utf8")
Base.metadata.create_all(engine)


def scrape_flight_data():
    """file = open('stateAirport.txt', 'r')
    airportCode = []
    for line in file.readlines():
        airportCode.append(line.split(',')[1][:-1])
    print (airportCode)"""
    airportCode = ['nyc','qla','chi','phl','hou','phx','san','sea','dal','was']
    nAirport = len(airportCode)
    resultFile = open('flightTable.out', 'w')
    for date in range(30):
        for indexi in range(nAirport):
            for indexj in range(nAirport):
                if indexi!=indexj:
                    sourceCity = airportCode[indexi]
                    destinationCity = airportCode[indexj]
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

def insert_flight_data():
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    flightTableFile = open('flightTable.out','r')
    for line in flightTableFile.readlines():
        #print (line)
        flightData = line.split(',')
        newFlight = Flight(airline = flightData[0], flightCode = flightData[1], departureDate = flightData[2], departureTime = flightData[3], arrivalDate = flightData[4], arrivalTime = flightData[5], departureAirportCode = flightData[6], arrivalAirportCode = flightData[7], price = float(flightData[8][:-1]))
        try :
            session.add(newFlight)
            session.commit()
        except Exception:
            #print (str(Exception))
            #traceback.print_exc()
            session.rollback()
            continue
    session.close()
    return


def insert_airport_data():
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    airportTableFile = open('airportTable.out', 'r')
    for line in airportTableFile.readlines():
        newAirport = Airport(airportCode = line.split(',')[0], airportName = line.split(',')[1], airportCity = line.split(',')[2], airportState = line.split(',')[3][:-1])
        session.add(newAirport)
        session.commit()
    session.close()

def insert_airline_data():
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    airlines = ['Alaska Airlines', 'American Airlines','Delta','Frontier Airlines','JetBlue Airways','Spirit Airlines','United']
    logos = ['https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/AS_sq.svg',
             'https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/AA_sq.svg',
             'https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/DL_sq.svg',
             'https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/F9_sq.svg',
             'https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/b6_sq.svg',
             'https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/NK_sq.svg',
             'https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/UA_sq.svg']
    for i in range(len(airlines)):
        airline = airlines[i]
        logo  = logos[i]
        newAirline = Airline(airline = airline, airlineLogoUrl = logo)
        session.add(newAirline)
        session.commit()
    session.close()

#scrape_flight_data()
#generate_airport_data()
#insert_airport_data()
#insert_flight_data()
insert_airline_data()