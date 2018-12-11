# flight-search
Searching for best and cheapest flights


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
