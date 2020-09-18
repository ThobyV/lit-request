# lit-request

``lit-request`` is a byte-sized (currently ``(700) bytes minified /  gzipped``) micro-library which provides common parts of [Axios](https://github.com/axios/axios) which developers find very useful. 

Using the [browser native Fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) under the hood, with many popular browsers having support and as well libraries like React/Preact using pollyfill. Other amazing libraries supported as well.

``lit`` is Inspired by [Axios](https://github.com/axios/axios) / [Redaxios](https://github.com/developit/redaxios) with API and simplicity.




**Can I use Just Axios?** 

Yes, it's adviced if you prefer to, as axios is battle-tested and supports node js with more features than lit-request. Lit is advantaged being small because it uses ``fetch`` which does all the work and is mostly supported on ``browsers``. 

**_You can use this library if you like in cases where bundle size and lighweight performance matters, for quick demos or hackathons and other project that runs on any modern broswer._**


### API

Please refer to the  [Axios Documentation](https://github.com/axios/axios#axios-api) (lit-request has an almost exact api).

- [x] Config
- [x] Convienence Method Aliases
- [x] Request / Response Interceptors
- [x] Cancel / Abort Request
- [x] Defaults

### RoadMap

- [ ] XSRF Cookie Protection
- [ ] Transform Request/Response
- [ ] Params
- [ ] Auth

### Getting started

```sh
npm install lit-request
```


### Usage

```javascript
import lit from 'lit-request';
```