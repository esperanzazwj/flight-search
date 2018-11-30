import json
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
    airportCity = Column(String(60))

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
        newAirport = Airport(airportCode = line.split(':')[0],  airportCity = line.split(':')[1][:-1])
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

insert_airport_data()
#insert_flight_data()
#insert_airline_data()