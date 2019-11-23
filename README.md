## Solution for User Event Tracking

This is a prototype solution for user event tracking system. 

It's built using Node, Express, and TypeScript. 

The solution uses core domain, service, and repository abstractions as its design pattern.

```
express
    app
    router
core
    event
    user
    userEvent
service
    log
    validators
        event
        user
        userEvent
infrastructure
    repos
        event
        user
        userEvent
```

### Setup

Clone the latest sources from [GitHub](https://github.com/).

``` bash
git clone https://github.com/pacjman/api-node-userevents.git
```

Install solution dependencies.
``` bash
npm install
```
### Build 

To build solution locally type the following into your shell:

``` bash
npm run build
```
### Start

To run solution locally type the following in your shell:

``` bash
npm run start
```

### Test Coverage

[Postman](https://www.getpostman.com/) collection & env are included which cover the expected api functionality: [here](https://github.com/pacjman/api-node-userevents/tree/master/tests/postman).

These could be improved to cover more scenarios and different outcomes.

The collection covers a few areas.

* "sanity checks" to exercise the request validators are sane. 
* "create checks" to exercise the repository logic works.
* "v1" to reflect supported operations in RESTful api with sample uses.

### RESTful API Design

```
/v1
    /event
        GET - report known events
            200/OK w/ payload
        POST - save an event
            200/OK when event created successfully
            204/NO CONTENT when event already exists
                + server warning logged
            400/BAD REQUEST when invalid request criteria given
                - invalid request model
                - invalid or missing event type
        /user
            GET - report known user events
                (optional query string filters. zero, one, or both can be employed per request)
                email query parameter to optionally filter by email address
                created date parameter to optionally filter by arbitrary date
                    which covers yesterday requirement
                200/OK w/ user event payload
                400/BAD REQUEST when invalid request criteria given
                    - invalid request model
                    - invalid email
                    - invalid created date
            POST - save user event
                200/OK when user event created successfully
                400/BAD REQUEST when invalid request criteria given
                    - invalid request model
                    - invalid user
                    - invalid event
    /user
        GET - report known users
            2OO/OK w/ payload
            401/UNAUTHORIZED response when client not authorized by expected api key (shared)
        POST - save a user
            200/OK response when user created successfully
            204/NO CONTENT reponse when user already exists
                + server warning logged
    /ping
        GET - simple uptime check
            200/OK response w/ "PONG" payload
            
```

### Sample Requests

`POST v1/event`
```
{
  "type": "LOGIN"
}
```

`POST v1/user`
```
{
  "email": "test@gmail.com",
  "password": "passwordIsPizza",
  "phone": "503-525-9555"
}
```

`POST v1/event/user`
```
{
    "type": "LOGIN",
    "email": "test@gmail.com"
}
```

### Known Issues

* Api is not secured, should it be? One of the api endpoints employs simple api key, & could be adapted across endpoints.
* Email and event type are case-sensitive matches. Should one or both be case insensitive?
* Should password be required to persist a user event? Currently not required.
* Password reported from `GET /v1/user` endpoint, not the best security. Should the password be hashed and/or omitted? For reporting? For storage?

### Future Considerations

* Load/Concurrency testing. Not considered in prototype.
* Design emphasizes an extensible single responsibility pattern. For example, one or more repositories could be backed by a different database technology like sqlite or mysql.
* Prototype is a bit clumsy/verbose and could be streamlined using middleware abstraction to improve code readability.
* The solution includes Dockerized container option and simple deployment ferry using ssh.

### Other Notes

* Inspect the `.env` file for `x-api-key`. This value is required as client header value. (See postman tests for sample use on route `GET /v1/user`)

``` bash
cat .env
```
### References

* [Developing a Restful Api w/ Node & TypeScript](https://mherman.org/blog/2016/11/05/developing-a-restful-api-with-node-and-typescript/)
* [Express routing](https://expressjs.com/en/guide/routing.html)
* [Get Postman for API development](https://www.getpostman.com/apps)
* [Get Docker Desktop](https://www.docker.com/products/docker-desktop)
