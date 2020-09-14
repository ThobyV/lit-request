// Method alias
// cancelRequest
// config
// responstype
// validateStatus
// default
// req/res interceptors
// final state of every request is always defaulted by null,something or overwritten

(function create(options) {
  function deepMerge(base, config) {
    const newObj = Object.assign({}, base, config);
    for (const i in config) {
      if (Array.isArray(config[i])) {
        newObj[i] = newObj[i].concat(base[i]);
      }
      if (typeof config[i] === 'object' && !Array.isArray(config[i])) {
        if (!newObj[i]) {
          newObj[i] = {};
        }
        newObj[i] = deepMerge(base[i], config[i]);
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
    if (typeof opts === 'string') opts = { method: 'get', url: opts };
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

  function m(method) {
    return function (url, data, config) {
      if (!config) {
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
      function toJson() {
        opts.responseType = 'json';
        return res.json();
      }

      const ok = opts.validateStatus ? opts.validateStatus(res.status) : res.ok;
      if (ok) {
        const hasData =
          opts.responseType == 'stream'
            ? res.body
            : opts.responseType
            ? res[opts.responseType]()
            : toJson();

        return hasData.then(
          (data) => {
            res.data = opts.responseType == 'json' ? JSON.parse(data) : data;
            res.config = opts;
            return icp.response.callback
              ? Promise.resolve(icp.response.callback(res))
              : Promise.resolve(res);
          },
          (err) => Promise.reject(err)
        );
      }
      return icp.response.error ? icp.response.error(res) : Promise.reject(res);
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
  lit.post = m('POST');
  lit.put = m('PUT');
  lit.patch = m('PATCH');

  return lit;
})();
