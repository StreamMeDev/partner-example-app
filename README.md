# StreamMe Partner Example App

[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)

An example app for Stream.me Partners.  This repo is an electron app integrates with the StreamMe partner api to create users and setup/view streams.

## Usage

```
$ git clone git@github.com:StreamMeDev/partner-example-app.git
$ cd partner-example-app
```

To get started you will need StreamMe Partner credentials, these should have been provided to you from your contact at StreamMe.  Open up `config.js` and add the `clientSlug`, `clientId` and `clientSecret` to the approprite fields in `config.js`.  Now you can start the app:

```
$ npm install && npm start
```

This will open up an app that you can use to test out the integration.  Now that you see what it can look like, lets dig into the actual integrations.

## Partner API Integration

This application is structured as a React Flux app where the endpoint integrations can be found in the `src/actions` directory.  Lets take a look at the one to create a user, here is the important part:

```javascript
request({
  method: 'POST',
  url: 'https://partners.stream.me/api/v1/' + <CLIENT_SLUG> + '/users',
  json: {
    username: <UNIQUE_USERNAME>,
    email: <OPTIONAL_USER_EMAIL>
  },
  auth: {
    user: <CLIENT_ID>,
    pass: <CLIENT_SECRET>
  }
}, function (err, resp, body) {
  if (err) {
    // handle network errors
    return;
  }

  if (resp.statusCode >= 400) {
    // handle application errors
    // the response body data structure returned
    // when there is an error looks like this:
    // {
    //   "reasons": [{
    //     "message": "Some human readable error"
    //     "code": "some_machine_error_code"
    //   }]
    // }
    return;
  }

  // handle a successful user creation
  // the response body for this is super simple:
  // {
  //   "slug": "slugified-version-of-username-submitted",
  //   "username": "Username as submitted above"
  // }
});
```

In this example we use the request module from npm to make a basic auth'd request to the partner api.  This will create a new user that you can then use to access the other partner api's, like the stream key endpoint.  Lets take a look at the request to get a stream key and broadcast url just as another example:

```javascript
request({
  method: 'GET',
  url: 'https://partners.stream.me/api/v1/' + <CLIENT_SLUG> + '/users/' + <USER_SLUG> + '/broadcast',
  json: true,
  auth: {
    user: <CLIENT_ID>,
    pass: <CLIENT_SECRET>
  }
}, function (err, resp, body) {
  if (err) {
    // handle network errors
    return;
  }

  if (resp.statusCode >= 400) {
    // handle application errors
    // see the data structure from above
    return;
  }

  // handle a successful user creation
  // the response body for this is:
  // {
  //   "broadcastKey": "9b597331-d950-4629-8417-834d8cafcf27",
  //   "originServers": [
  //     {
  //       "region": "US, Central",
  //       "broadcastUrl": "rtmp://ls.stream.me/origin"
  //     },
  //     {
  //       "region": "US, East",
  //       "broadcastUrl": "rtmp://ls.stream.me/origin"
  //     },
  //     {
  //       "region": "US, West",
  //       "broadcastUrl": "rtmp://ls.stream.me/origin"
  //     },
  //     {
  //       "region": "Europe, West",
  //       "broadcastUrl": "rtmp://ls.stream.me/origin"
  //     },
  //     {
  //       "region": "Asia, East",
  //       "broadcastUrl": "rtmp://ls.stream.me/origin"
  //     }
  //   ]
  // }
});
```

*NOTE: This is just an example application.  In a real application you would never want to expose your client secret to your users.  The reccomended way to do a production integration is to create a server which talks to the StreamMe API's on your behalf.*
