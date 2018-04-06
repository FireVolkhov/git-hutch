const _ = require('lodash');
const request = require('request');

function get(url, externalOptions) {
    const options = {
        method: 'GET',
        url: url
    };

    const requestOptions = _.extend(options, externalOptions);

    return new Promise((resolve, reject) => {
        request(requestOptions,
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            }
        );
    });
}

function post (url, options = {}) {
  if (!options.method) {
	  options.method = 'POST';
  }

  return get(url, options);
}

async function json (url, options) {
  const response = await get(url, options);
  return JSON.parse(response);
}

module.exports = {
  get: get,
  post: post,
  json: json
};
