const request = require('request-promise');
const expect = require('chai').expect;


describe('Other General Functionality', function() {

  let url = 'https://api.github.com/orgs/insurancezebra/repos';

  it('Should use hypermedia to get a returned item', async function() {
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
    expect(response.body[0].html_url).to.exist;

    options = {
      method: 'GET',
      uri: response.body[0].html_url,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true,
      resolveWithFullResponse: true
    };

    response = await request(options);
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.exist;
  });

  it('Should recieve just the headers when passing HEAD http verb', async function() {
    let options = {
      method: 'HEAD',
      uri: `${url}`,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    expect(response.statusCode).to.equal(200);
    expect(response.headers).to.exist;
    expect(response.body).to.not.exist;
  });

  it('Should recieve an error when passing an invalid field', async function() {
    let options = {
      method: 'GET',
      uri: `https://api.github.com/search/repositories?r=zebra`,
      headers: {
        'User-Agent': 'Test-User'
      },
      json: true,
      resolveWithFullResponse: true
    };

    let response;
    await request(options).then(process, function handleError(error) {
      response = error;
    });

    expect(response.statusCode).to.equal(422);
    expect(response.name).to.equal('StatusCodeError')
  });

});
