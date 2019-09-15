const request = require('request-promise');
const expect = require('chai').expect;


describe('Search Repositories General Functionality', function() {

  let url = 'https://api.github.com/search/repositories';
  let count;

  it('Should validate a query request returns data', async function() {
    const options = {
      method: 'GET',
      uri: `${url}?q=selenium`,
      headers: {
        'User-Agent': 'Test-User',
        'Accept': 'application/json'
      },
      json: true
    };


    let response = await request(options);
    count = response.total_count;
    expect(response.items[0].name).to.contain('selenium');
    expect(response.total_count).to.be.a('number');
  });

  it('Should allow more than one search query and return data', async function() {
    const options = {
      method: 'GET',
      uri: `${url}?q=selenium+docker`,
      headers: {
        'User-Agent': 'Test-User',
        'Accept': 'application/json'
      },
      json: true
    };


    let response = await request(options);
    expect(response.items[0].name).to.contain('selenium');
    expect(response.total_count).to.be.below(count);
  });

  it('Should validate a query request with a qualifier returns filtered data', async function() {
    const options = {
      method: 'GET',
      uri: `${url}?q=selenium+language:javascript`,
      headers: {
        'User-Agent': 'Test-User',
        'Accept': 'application/json'
      },
      json: true
    };


    let response = await request(options);
    for (let i = 0; i < response.items.length; i++) {
      expect(response.items[i].language).to.contain('JavaScript');
    }
  });

  it('Should validate a query request with multiple qualifiers returns filtered data', async function() {
    const options = {
      method: 'GET',
      uri: `${url}?q=selenium+language:javascript+size:>10000`,
      headers: {
        'User-Agent': 'Test-User',
        'Accept': 'application/json'
      },
      json: true
    };


    let response = await request(options);
    for (let i = 0; i < response.items.length; i++) {
      expect(response.items[i].language).to.contain('JavaScript');
    }
    for (let i = 0; i < response.items.length; i++) {
      expect(response.items[i].size).to.be.above(10000);
    }
  });

  it('Should validate the sort functionality', async function() {
    const options = {
      method: 'GET',
      uri: `${url}?q=selenium+language:javascript&sort=stars`,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true
    };

    let response = await request(options);
    let filter = [];
    for (let i = 0; i < response.items.length; i++) {
      filter.push(response.items[i].stargazers_count)
    }
    expect(filter).to.decrease

  });

  it('Should validate the order functionality', async function() {
    const options = {
      method: 'GET',
      uri: `${url}?q=selenium+language:javascript&sort=stars&order=asc`,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true
    };

    let response = await request(options);
    let filter = [];
    for (let i = 0; i < response.items.length; i++) {
      filter.push(response.items[i].stargazers_count)
    }
    expect(filter).to.increase
  });

});
