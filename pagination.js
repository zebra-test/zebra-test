const request = require('request-promise');
const expect = require('chai').expect;
const parse = require('parse-link-header');


describe('Pagination General Functionality', function() {

  let url = 'https://api.github.com/orgs/insurancezebra/repos';

  it('Should recieve all items from the endpoint', async function() {
    let options = {
      method: 'GET',
      uri: url,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    let items = response.body;
    expect(items.length).to.be.at.most(30);

    let parsed = parse(response.headers.link);
    while (parsed.next) {
      options = {
        method: 'GET',
        uri: parsed.next.url,
        headers: {
          'User-Agent': 'Test-User'
        },
        json: true,
        resolveWithFullResponse: true
      };
      response = await request(options);
      items = items.concat(response.body);
      expect(response.body.length).to.be.at.most(30);
      parsed = parse(response.headers.link);
    };

    expect(items.length).to.equal(47);
  });

  it('Should recieve all items from the endpoint limiting results to 10 per page', async function() {
    let options = {
      method: 'GET',
      uri: `${url}?per_page=10`,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    let items = response.body;
    expect(items.length).to.be.at.most(10);

    let parsed = parse(response.headers.link);
    while (parsed.next) {
      options = {
        method: 'GET',
        uri: parsed.next.url,
        headers: {
          'User-Agent': 'Test-User'
        },
        json: true,
        resolveWithFullResponse: true
      };
      response = await request(options);
      items = items.concat(response.body);
      expect(response.body.length).to.be.at.most(10);
      parsed = parse(response.headers.link);
    };

    expect(items.length).to.equal(47);
  });

  it('Should recieve all items from the endpoint limiting results to 10 per page, starting at page 3', async function() {
    let options = {
      method: 'GET',
      uri: `${url}?page=3&per_page=10`,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    let items = response.body;
    expect(items.length).to.be.at.most(10);

    let parsed = parse(response.headers.link);
    while (parsed.next) {
      options = {
        method: 'GET',
        uri: parsed.next.url,
        headers: {
          'User-Agent': 'Test-User'
        },
        json: true,
        resolveWithFullResponse: true
      };
      response = await request(options);
      items = items.concat(response.body);
      expect(response.body.length).to.be.at.most(10);
      parsed = parse(response.headers.link);
    };

    expect(items.length).to.equal(27);
  });

});
