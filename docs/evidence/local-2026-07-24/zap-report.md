# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Informational | 9 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Low | Exceeded High | http://host.docker.internal:3000 | Percentage of responses with status code 4xx | 98 % |
| Info | Informational | http://host.docker.internal:3000 | Percentage of responses with status code 2xx | 1 % |
| Info | Informational | http://host.docker.internal:3000 | Percentage of endpoints with content type application/json | 97 % |
| Info | Informational | http://host.docker.internal:3000 | Percentage of endpoints with method DELETE | 5 % |
| Info | Informational | http://host.docker.internal:3000 | Percentage of endpoints with method GET | 52 % |
| Info | Informational | http://host.docker.internal:3000 | Percentage of endpoints with method PATCH | 5 % |
| Info | Informational | http://host.docker.internal:3000 | Percentage of endpoints with method POST | 36 % |
| Info | Informational | http://host.docker.internal:3000 | Count of total endpoints | 36    |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| A Client Error response code was returned by the server | Informational | 40 |
| Authentication Request Identified | Informational | 1 |
| Base64 Disclosure | Informational | 1 |
| Non-Storable Content | Informational | Systemic |
| Sec-Fetch-Dest Header is Missing | Informational | 3 |
| Sec-Fetch-Mode Header is Missing | Informational | 3 |
| Sec-Fetch-Site Header is Missing | Informational | 3 |
| Sec-Fetch-User Header is Missing | Informational | 3 |
| Session Management Response Identified | Informational | 1 |




## Alert Detail



### [ A Client Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Informational (High)

### Description

A response code of 404 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828/
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828/`
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000
  * Node Name: `http://host.docker.internal:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000
  * Node Name: `http://host.docker.internal:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/
  * Node Name: `http://host.docker.internal:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/5044824496579684266
  * Node Name: `http://host.docker.internal:3000/5044824496579684266`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api
  * Node Name: `http://host.docker.internal:3000/api`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api
  * Node Name: `http://host.docker.internal:3000/api`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/
  * Node Name: `http://host.docker.internal:3000/api/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/410212544685118999
  * Node Name: `http://host.docker.internal:3000/api/410212544685118999`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth
  * Node Name: `http://host.docker.internal:3000/api/auth`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth
  * Node Name: `http://host.docker.internal:3000/api/auth`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/
  * Node Name: `http://host.docker.internal:3000/api/auth/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/6921173519025841656
  * Node Name: `http://host.docker.internal:3000/api/auth/6921173519025841656`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/actuator/health
  * Node Name: `http://host.docker.internal:3000/api/auth/actuator/health`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks
  * Node Name: `http://host.docker.internal:3000/api/tasks`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks%3Flimit=http%253A%252F%252Fwww.google.com%252F&offset=0
  * Node Name: `http://host.docker.internal:3000/api/tasks (limit,offset)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks%3Flimit=20&offset=www.google.com%253A80%252Fsearch%253Fq%253DZAP
  * Node Name: `http://host.docker.internal:3000/api/tasks (limit,offset)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/
  * Node Name: `http://host.docker.internal:3000/api/tasks/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/5213693703876894148
  * Node Name: `http://host.docker.internal:3000/api/tasks/5213693703876894148`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828/
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/livez/
  * Node Name: `http://host.docker.internal:3000/livez/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/readyz/
  * Node Name: `http://host.docker.internal:3000/readyz/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828/
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828/ ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/login
  * Node Name: `http://host.docker.internal:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/login
  * Node Name: `http://host.docker.internal:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/login/
  * Node Name: `http://host.docker.internal:3000/api/auth/login/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register/
  * Node Name: `http://host.docker.internal:3000/api/auth/register/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks
  * Node Name: `http://host.docker.internal:3000/api/tasks ()({title,description})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/
  * Node Name: `http://host.docker.internal:3000/api/tasks/ ()({title,description})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/computeMetadata/v1/
  * Node Name: `http://host.docker.internal:3000/computeMetadata/v1/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/latest/meta-data/
  * Node Name: `http://host.docker.internal:3000/latest/meta-data/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/metadata/instance
  * Node Name: `http://host.docker.internal:3000/metadata/instance ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/metadata/v1
  * Node Name: `http://host.docker.internal:3000/metadata/v1 ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/opc/v1/instance/
  * Node Name: `http://host.docker.internal:3000/opc/v1/instance/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/opc/v2/instance/
  * Node Name: `http://host.docker.internal:3000/opc/v2/instance/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``
* URL: http://host.docker.internal:3000/openstack/latest/meta_data.json
  * Node Name: `http://host.docker.internal:3000/openstack/latest/meta_data.json ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `429`
  * Other Info: ``


Instances: 40

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Authentication Request Identified ](https://www.zaproxy.org/docs/alerts/10111/)



##### Informational (High)

### Description

The given request has been identified as an authentication request. The 'Other Info' field contains a set of key=value lines which identify any relevant fields. If the request is in a context which has an Authentication Method set to "Auto-Detect" then this rule will change the authentication to match the request identified.

* URL: http://host.docker.internal:3000/api/auth/login
  * Node Name: `http://host.docker.internal:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: `email`
  * Attack: ``
  * Evidence: `password`
  * Other Info: `userParam=email
userValue=zap-register@example.com
passwordParam=password`


Instances: 1

### Solution

This is an informational alert rather than a vulnerability and so there is nothing to fix.

### Reference


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/)



#### Source ID: 3

### [ Base64 Disclosure ](https://www.zaproxy.org/docs/alerts/10094/)



##### Informational (Medium)

### Description

Base64 encoded data was disclosed by the application/web server. Note: in the interests of performance not all base64 strings in the response were analyzed individually, the entire response should be looked at by the analyst/security team/developer(s).

* URL: http://host.docker.internal:3000/api/auth/login
  * Node Name: `http://host.docker.internal:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
  * Other Info: `{"alg":"HS256","typ":"JWT"}`


Instances: 1

### Solution

Manually confirm that the Base64 data does not leak sensitive information, and that the data cannot be aggregated/used to exploit other vulnerabilities.

### Reference


* [ https://projects.webappsec.org/w/page/13246936/Information%20Leakage ](https://projects.webappsec.org/w/page/13246936/Information%20Leakage)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 13

#### Source ID: 3

### [ Non-Storable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are not storable by caching components such as proxy servers. If the response does not contain sensitive, personal or user-specific information, it may benefit from being stored and cached, to improve performance.

* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: http://host.docker.internal:3000/livez
  * Node Name: `http://host.docker.internal:3000/livez`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `PATCH `
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks
  * Node Name: `http://host.docker.internal:3000/api/tasks ()({title,description})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``

Instances: Systemic


### Solution

The content may be marked as storable by ensuring that the following conditions are satisfied:
The request method must be understood by the cache and defined as being cacheable ("GET", "HEAD", and "POST" are currently defined as cacheable)
The response status code must be understood by the cache (one of the 1XX, 2XX, 3XX, 4XX, or 5XX response classes are generally understood)
The "no-store" cache directive must not appear in the request or response header fields
For caching by "shared" caches such as "proxy" caches, the "private" response directive must not appear in the response
For caching by "shared" caches such as "proxy" caches, the "Authorization" header field must not appear in the request, unless the response explicitly allows it (using one of the "must-revalidate", "public", or "s-maxage" Cache-Control response directives)
In addition to the conditions above, at least one of the following conditions must also be satisfied by the response:
It must contain an "Expires" header field
It must contain a "max-age" response directive
For "shared" caches such as "proxy" caches, it must contain a "s-maxage" response directive
It must contain a "Cache Control Extension" that allows it to be cached
It must have a status code that is defined as cacheable by default (200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501).

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ Sec-Fetch-Dest Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies how and where the data would be used. For instance, if the value is audio, then the requested resource must be audio data and not any other type of resource.

* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-Dest header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Dest ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Dest)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Mode Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Allows to differentiate between requests for navigating between HTML pages and requests for loading resources like images, audio etc.

* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-Mode header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Site Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies the relationship between request initiator's origin and target's origin.

* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-Site header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-User Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies if a navigation request was initiated by a user.

* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828
  * Node Name: `http://host.docker.internal:3000/api/tasks/7f4a9f56-a886-4947-888c-c5906a5be828 ()({title,description,status})`
  * Method: `PATCH`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://host.docker.internal:3000/api/auth/register
  * Node Name: `http://host.docker.internal:3000/api/auth/register ()({email,password})`
  * Method: `POST`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-User header is included in user initiated requests.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Session Management Response Identified ](https://www.zaproxy.org/docs/alerts/10112/)



##### Informational (Medium)

### Description

The given response has been identified as containing a session management token. The 'Other Info' field contains a set of header tokens that can be used in the Header Based Session Management Method. If the request is in a context which has a Session Management Method set to "Auto-Detect" then this rule will change the session management to use the tokens identified.

* URL: http://host.docker.internal:3000/api/auth/login
  * Node Name: `http://host.docker.internal:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: `data.token`
  * Attack: ``
  * Evidence: `data.token`
  * Other Info: `json:data.token`


Instances: 1

### Solution

This is an informational alert rather than a vulnerability and so there is nothing to fix.

### Reference


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/)



#### Source ID: 3


