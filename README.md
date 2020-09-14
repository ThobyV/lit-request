# lit-request

Lit request is a small, byte-sized micro-library which provides the most important parts of Axios which alot of developers love using the [browser native Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)  under the hood. Most browsers support Fetch and popular JavaScript tools like Preact, React come with polyfills although lit-request can be used on many other tools like Vue etc.

Lit is for developers who prefer all things small and ligh-weight. Heavily inspired by Axios/Redaxios.





**Can I use Just Axios?** Yes, it's adviced if you prefer to because axios is battle-tested and supports node js and also has more features than lit-request as well. Lit is mostly advantaged being small and simple in cases where bundle size matters, it could be used for quick projects and other kinds of projects as well.


### API

Please refer to the  [Axios Documentation](https://github.com/axios/axios#axios-api) (lit-request has an almost exact api).

- Config
- Axios Method Aliases
- Request / Response Interceptors
- Cancel Request
- Defaults

### RoadMap

- [ ] XSRF Cookie Protection
- [ ] Transform Request/Response
- [ ] Params

### Getting started

```sh
npm install lit-request
```


### Usage

```javascript
import lit from 'lit-request';
```