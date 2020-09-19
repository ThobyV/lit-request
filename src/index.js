/*
MIT License 2020
*/
//  TODO: make sure other custom objects like formData and blob work
//  TODO: use indexOf to find content-type match instead of exact string
//  TODO: add simple auth
(function create(options) {
  function isObject(val) {
    return typeof val == 'object';
  }
  function deepMerge(base, config) {
    const newObj = Object.assign({}, base, config);
    if (isObject(base) && isObject(config)) {
      for (const i in config) {
        if (config[i] == (null || undefined)) {
          newObj[i] = config[i];
        }
        if (Array.isArray(config[i])) {
          newObj[i].concat(base[i]);
        }
        if (isObject(config[i]) && !Array.isArray(config[i])) {
          if (!base[i]) {
            newObj[i] = Object.assign({}, { [i]: config[i] });
          } else {
            newObj[i] = deepMerge(base[i], config[i]);
          }
        }
      }
    }
    return newObj;
  }

  const defaults = deepMerge({}, options);

  function icp() {}

  icp.request = {};
  icp.response = {};

  function icpType(prop) {
    return function (callback, error) {
      icp[prop].callback = callback;
      icp[prop].error = error;
    };
  }

  icp.request.use = icpType('request');
  icp.response.use = icpType('response');

  function request(opts) {
    const url = defaults.baseUrl;
    const config = icp.request.callback
      ? icp.request.callback(deepMerge({}, opts))
      : opts;
    const temp = deepMerge(defaults, config);
    temp.url = url ? url + opts.url : opts.url;
    // return body(temp);
    // return callFetch(temp)
  }

  function lit(config) {
    return request(config);
  }

  // Id for post, put, patch requests with data as possible payload
  const s = 'set';

  function m(method, type) {
    return function (url, data, config) {
      if (!config && type !== s) {
        config = data;
        data = null;
      }
      return request(deepMerge({ url, data, method }, config));
    };
  }

  function dataHelper(data, headers) {
    if (headers && headers['Content-Type']) {
      if (headers['Content-Type'] !== 'application/json') {
        return data;
      }
    }
    return data && JSON.stringify(data);
  }

  function body(_opts) {
    return {
      method: _opts.method,
      headers: _opts.headers,
      body: dataHelper(_opts.data, _opts.headers),
      signal: _opts.cancelToken,
      credentials: _opts.withCredentials ? 'same-origin' : 'omit',
    };
  }

  function callFetch(opts) {
    return fetch(opts.url, body(opts)).then((res) => {
      res.config = opts;

      function reject(err) {
        return icp.response.error
          ? icp.response.error(err)
          : Promise.reject(err);
      }

      function fullData() {
        // most requests respond with a body, but head requests don't, handle both cases
        if (res.body) {
          return opts.responseType == 'stream'
            ? Promise.resolve(res.body)
            : opts.responseType
            ? res[opts.responseType]()
            : res.json();
        }
        return Promise.resolve();
      }

      /* decide whether to resolve or reject based on custom validate status boolean
       or response status codes
      */
      const ok = opts.validateStatus ? opts.validateStatus(res.status) : res.ok;
      if (ok) {
        // most http requests have to send response data of some sort, handle it
        const hasData = fullData();

        return hasData.then(
          (data) => {
            res.data = data;
            return icp.response.callback
              ? Promise.resolve(icp.response.callback(res))
              : Promise.resolve(res);
          },
          (err) => reject(err)
        );
      }
      return reject(res);
    });
  }

  function cancelToken() {
    return new AbortController();
  }

  cancelToken.source = function () {
    const is = {};
    const has = cancelToken();
    is.token = has.signal;
    is.cancel = function () {
      has.abort();
    };
    return is;
  };

  lit.request = request;
  lit.create = create;
  lit.interceptors = icp;
  lit.CancelToken = cancelToken;
  lit.defaults = defaults;
  lit.get = m('GET');
  lit.delete = m('DELETE');
  lit.head = m('HEAD');
  lit.options = m('OPTIONS');
  lit.post = m('POST', s);
  lit.put = m('PUT', s);
  lit.patch = m('PATCH', s);

  return lit;
})();
