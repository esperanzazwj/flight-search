import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push([{
    "id": "01",
    "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiAAFECTYlBCY4zelWCRVhKnaQq479JZBHM3OdzdYxfGEgLdDQAQ",
    "airlines": "American Airlines"+i,
    "number": "1025",
    "depart_time": "09:12am",
    "arrival_time": "12:12pm",
    "hour": 10,
    "minute": 32,
    "stops": "(Nonstop)",
    "departure": "JFK",
    "arrival": "SFO",
    "price": 632 + 1000*i,
    "duration": 1000- i,
    "d_time": 1000- i,
    "a_time": 1000- i,
    "total_price": 1000,
    "r_type": "roundtrip"
  },{
    "id": "02",
    "airlines": "Delta"+i,
    "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Jz3R3E0T6EGVbyjjpCoNNqeE-aDN_g7xkSEhiRZq3uGgjlwLyw",
    "number": "335",
    "depart_time": "09:12am",
    "arrival_time": "10:12pm",
    "hour": 5,
    "minute": 32,
    "stops": "(Nonstop)",
    "departure": "JFK",
    "arrival": "SFO",
    "price": 532 + 1000*i,
    "duration": 1000 - i,
    "d_time": 1000- i,
    "a_time": 1000- i,
    "total_price": 1000,
    "r_type": "roundtrip"
  }]
  );
}

function getFlights(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = dataSource;

  return res.json(result);
}

export default {
  'GET /api/flights': getFlights,
  'GET /api/wish': getFlights,
};
