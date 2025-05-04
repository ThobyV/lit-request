/*
MIT License 2020
*/

export default (function create(options) {
  const payload = 'payload';

  const isObject = (val) => typeof val == 'object';

  const isString = (str) => typeof str === 'string';

  const deepMerge = (base, config) => {
    const newObj = Object.assign({}, base, isString(config) ? { url: config } : config);
    console.log({ newObj })
    if (isObject(base) && isObject(config)) {
      for (const i in config) {
        if (Array.isArray(config[i])) {
          newObj[i].concat(base[i]);
        }
        if (
          isObject(config[i]) &&
          !Array.isArray(config[i]) &&
          config[i]?.constructor === Object
        ) {
          if (!newObj[i]) {
            newObj[i] = {};
          }
          newObj[i] = deepMerge(base[i], config[i]);
        }
        if (config[i] == (null || undefined)) {
          newObj[i] = config[i];
        }
      }
    }
    return newObj;
  }

  const defaults = deepMerge({}, options);

  function icp() { }

  icp.request = {};
  icp.response = {};

  const icpType = (prop) => (callback, error) => {
    icp[prop].callback = callback;
    icp[prop].error = error;
  };

  icp.request.use = icpType('request');
  icp.response.use = icpType('response');

  const dataHelper = (data, headers) => {
    if (headers && headers['Content-Type']) {
      if (headers['Content-Type'] !== 'application/json') {
        return data;
      }
    }
    return data && JSON.stringify(data);
  }

  const body = (_opts) => ({
    method: _opts.method,
    headers: _opts.headers,
    body: dataHelper(_opts.data, _opts.headers),
    signal: _opts.cancelToken,
    credentials: _opts.withCredentials ? 'include' : 'same-origin',
  })


  const callFetch = (opts) => fetch(opts.url, body(opts)).then((res) => {
    res.config = opts;

    const reject = (err) => icp.response.error
      ? icp.response.error(err)
      : Promise.reject(err);


    const toCompletion = () => {
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
      const hasData = toCompletion();
      return hasData.then(
        (data) => {
          res.data = data;
          if (icp.response.callback) {
            icp.response.callback(res)
          }
          return Promise.resolve(res);
        },
        (error) => reject(error)
      );
    }

    return reject(res);
  });

  const request = (opts) => {
    const config = icp.request.callback
      ? icp.request.callback(deepMerge({}, opts))
      : opts;

    const temp = deepMerge(defaults, config);
    // TODO : serialize url here
    temp.url = defaults?.baseUrl ? defaults?.baseUrl + temp.url : temp.url;
    return callFetch(temp);
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

  function lit(config) {
    return request(config);
  }

  //handle no-body verbs
  const m = (method, payload) => payload ?
    (url, data, config) => request(deepMerge({ url, method, data }, (config || {})))
    :
    (url, config) => request(deepMerge({ url, method }, (config || {})));

  lit.request = request;
  lit.create = create;
  lit.interceptors = icp;
  lit.CancelToken = cancelToken;
  lit.defaults = defaults;
  lit.get = m('GET');
  lit.delete = m('DELETE');
  lit.head = m('HEAD');
  lit.options = m('OPTIONS');
  lit.post = m('POST', payload);
  lit.put = m('PUT', payload);
  lit.patch = m('PATCH', payload);

  return lit;
})();
