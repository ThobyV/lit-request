// Method alias
// cancelRequest
// config
// responstype
// validateStatus
// default
// req/res interceptors
// final state of every request is always defaulted by null,something or overwritten

let lit = (function create(opts) {
    //deepmerge to deep clone object and merge otf changes
    let defaults = deepMerge({}, opts);

    function lit(config) {
        return request(config)
    }

    function method(reqType) {
        return function () {
            let args = arguments;
            let config = args[args.length - 1];
            let url = args[0];
            let data = args.length > 2 && args[1]
            let method = reqType;
            return request(deepMerge({ url, data, method }, config))
        }
    }

    function icp() { }

    icp.request = {};
    icp.response = {};

    icp.request.use = icpType('request');
    icp.response.use = icpType('response');

    function icpType(prop) {
        return function (callback, error) {
            icp[prop].callback = callback;
            icp[prop].error = error;
        }
    }

    function request(opts) {
        if (typeof opts === 'string') opts = { method: 'get', url: opts }
        let url = defaults.baseUrl;
        let config = icp.request.callback ?
            icp.request.callback(deepMerge({}, opts)) : opts;
        let temp = deepMerge(defaults, config);
        temp.url = url ? url + opts.url : opts.url;
        return body(temp);
        //return callFetch(temp)
    }

    function callFetch(opts) {
        //checck fpr request interceptor - maybe check ur config or stuff before req send
        return fetch(opts.url, body(opts))
            .then((res) => {
                let ok = opts.validateStatus ?
                    opts.validateStatus(res.status) : res.ok
                if (ok) {
                    function toJson() {
                        opts.responseType = 'json';
                        return res.json();
                    }

                    let hasData = opts.responseType == 'stream' ?
                        res.body : opts.responseType ?
                            res[opts.responseType]() : toJson()

                    return hasData.then((data) => {
                        res.data = responseType == 'json' ? JSON.parse(data) : data;
                        res.config = opts;
                        return icp.response.callback ?
                            Promise.resolve(icp.response.callback(res))
                            :
                            Promise.resolve(res)
                    }, (err) => Promise.reject(err))
                }
                return icp.response.error ?
                    icp.response.error(res) : Promise.reject(res)
            })
    }

    function dataHelper(data, headers) {
        if (headers && headers['Content-Type']) {
            if (headers['Content-Type'] !== 'application/json') {
                return data;
            }
        }
        return data && JSON.stringify(data);
    }

    function deepMerge(base, config) {
        var newObj = Object.assign({}, base, config);
        for (let key in config) {
            if (Array.isArray(config[key])) {
                newObj[key] = newObj[key].concat(base[key])
            }
            if (typeof config[key] === 'object'
                && !Array.isArray(config[key])) {
                if (!newObj[key]) { newObj[key] = {} }
                newObj[key] = deepMerge(base[key], config[key]);
            }
        }
        return newObj;
    }


    function body(opts) {
        return {
            method: opts.method,
            headers: opts.headers,
            body: dataHelper(opts.data, opts.headers),
            signal: opts.cancelToken,
            credentials: opts.withCredentials ? 'same-origin' : 'omit',
        }
    }

    function cancelToken() {
        return new AbortController();
    }

    cancelToken.source = function () {
        let is = {};
        let has = cancelToken();
        is.token = has.signal;
        is.cancel = function () { has.abort(); }
        return is;
    }

    lit.request = request;
    lit.create = create;
    lit.interceptors = icp;
    lit.CancelToken = cancelToken;
    lit.defaults = defaults;
    lit.get = method('GET')
    lit.delete = method('DELETE')
    lit.post = method('POST')
    lit.put = method('PUT')
    lit.patch = method('PATCH')

    return lit
}());