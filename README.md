# flight-search
Searching for best and cheapest flights

## Page Rendering:
#### Flight Search Page: /src/pages/List/TableList.js
#### Wish List Page: /src/pages/List/BasicList.js
#### Login Page: /src/pages/User/Login.js
#### Register Page: /src/pages/User/Register.js

## Query dispatch functions:
#### Flight search: /src/pages/List/models/flights.js
#### Add to wish list: /src/pages/List/models/flights.js
#### Query wish list: /src/models/list.js
#### Remove from wish list: /src/models/list.js
#### Login: /src/models/login.js
#### Register: /src/pages/User/models/register.js

## API:
#### /src/services/api.js

## Mock data:
#### /mock/flights.js

## How to run
1. Install Node
2. Install yarn
3. cd flight-search
4. Run yarn
5. Run yarn start


### The data directory consists of 2 python files and 4 data files:
> getdata.py: <br>
>>
    This python file is used to scrape flights data from Expedia and save the results in flightTable.out.
    For now, running this python file will scrape all the non-stop flights in December among 10 major cities in United States of America.
    But you can also scrape other flights data by modifying the date and airport parameters in this file.
>database.py:<br>
>>
    This python file is used to create the six tables(flight, airport, user, airline, userwish and wish) in database and insert data into 3 tables(flight, airport and airline). 
    To execute this file in your computer, you only need to modify 'engine = sqlalchemy.create_engine("mysql+pymysql://root:123456@localhost:3306/databasePJ?charset=utf8")', change 'root' to your own username of database, change '123456' to your own password of database and change 'databasePJ' to the database's name in which you want to create these 6 tables and insert data into.
> flightTable.out is used to store flights data scraped from Expedia and will be inserted into database once you execute database.py.

> airportTable.out is used to store airports data and will be inserted into database once you execute database.py.

> airport_data.in and state_data.in are no longer used.

### ER.png is the ER diagram of our database. 

### The backend directory contains the implementation of the backend part of the project

There are mainly two files for the backend part, app.py and utility.py. app.py contains the implementation of the server and utility.py contains some help functions for app.py.

To run the server:
1. install python3
2. pip3 install flask
3. pip3 install flask-mysql
4. pip3 install flask-cors
5. cd ./backend
6. FLASK_APP=app.py flask run

