# lit-request  🌊

lit-request is a byte-sized (currently ``(915) bytes minified /  gzipped umd bundle``) micro-library which provides the awesome parts of [Axios](https://github.com/axios/axios) which many developers find very useful.  


It's an abstraction layer based on the browser native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) which does all the work under the hood with many popular browsers having support and as popular libraries like React/Preact using pollyfills when needed, Other amazing libraries supported as well.  


Inspired by [Axios](https://github.com/axios/axios) / [Redaxios](https://github.com/developit/redaxios) with API and simplicity.  



**Can't I Just use Axios? 😄**  


Yes, it's adviced if you prefer to, Axios is amazing, battle-tested and supports node js with more features than ``lit-request``.  

You may find lit useful for projects where **bundle size** and **lighweight performance** matters as well as for **quick demos**, **codepens**, **sandboxes**, **hackathons** and even full **side-projects** that runs on any modern browser.


### API

Please refer to the  [Axios Documentation](https://github.com/axios/axios#axios-api) (lit-request has an almost exact api).

- [x] Config
- [x] Convienence Method Aliases
- [x] Request / Response Interceptors
- [x] Cancel / Abort Request
- [x] Instances
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