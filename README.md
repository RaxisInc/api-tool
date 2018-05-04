# Raxis API Tool
The Raxis API tool is a simple Node.js class built for assessing API endpoints. The class is designed to be fully 
extensible and modifiable to support many different types of JSON-based REST APIs. It automatically handles 
token-based authentication, proxies requests, and exposes several functions designed to make it easier and faster to 
write a wrapper around an API and associated test code for the purposes of a penetration test.

This tool is not designed to work on its own, but to serve as a building block and quickstart for code-based API 
penetration testing.

## Getting Started
These instructions will help you get set up to start building off the tool to assess an API.

### Prerequisites
You'll need a few things in order to start building off of the Raxis API Tool:

- A working knowledge of ES6 JavaScript.
- A REST API and associated documentation.
- Node.js 8.x.x installed on your machine (https://nodejs.org/en/).

### Installing
For most use cases, you can simply download or clone this repository and enter into the /test directory, and create a 
new test file to start coding.

```bash
git clone https://github.com/RaxisInc/api-tool.git
cd api-tool/tests
touch my-api.js
```

## Configuration Files
You can specify your API configuration in a .json file and require it in your test code, or you can use a JavaScript
object. Configuration files can be stored in the api-tool/config directory for cleanliness. Here's an example
configuration file:

```json
{
  "host": "https://api.yourapp.com:3000",
  "username": "admin",
  "password": "password",

  "proxy": null,
  "endpoints": {
    "token": "/this/endpoint/is/required",
    "anotherEndpoint": "/specify/other/endpoints/here/",
    ...
  }
}
```

Configuration files can be included in your test JavaScript file like this:

```javascript
const myApiConfig = require('../config/my-api.json');
```

To use a configuration file, simply pass it as the first parameter in the constructor of your extended APITool class:

```javascript
const myAPI = new MyAPI(myApiConfig);
```

## Writing Tests
To write tests, require and extend the base APITool class. Use ES6 syntax, supported by Node 8.x.x, to do this. Once 
the class is extended, add methods to correspond to each of the API methods you wish to test. You can access the 
endpoints defined in the configuration file as shown below, which is great in the event that they should change.

```javascript
const APITool = require('../lib/api-tool');
const myAPIConfig = require('../config/my-api.json');

class MyAPI extends APITool {
    deleteUser(id) {
        // Note: this will return a promise. Use the async/await functions to have the easiest time with these.
        return this.doDelete(`${this.endpoints.user}/${id}`, APITool.Auth.Token);
    }
}

const api = new MyAPI(myAPIConfig);
api.deleteUser('10057286').then(console.log).catch(console.error);
```

#### Example Code
See [test/example.js](test/example.js) for an example of how to extend the APITool class and write tests.

## Support
Raxis does not provide assistance with APITool. It's yours to use and do with as you please, but we can't help you if 
something goes wrong. Raxis does not condone unauthorized or illegal testing by releasing this code, and is not 
liable for any parties that chose to do so.

## Author
This API tool was written by and is currently maintained by Adam Fernandez, Lead Application Developer and Senior 
Penetration Tester at [raxis.com](https://raxis.com).