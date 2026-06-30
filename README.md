<h2 align="center">
    listenin!
</h2>
<h3 align="center">
    a social scrobbler
</h3>

# What?
**listenin** is a music [scrobbler](https://www.last.fm/api/scrobbling) and a minimalistic way to see you and your friends are listning to.

# How do I scrobble?
**Currently**, there are two ways to scrobble: 1) the app itself, and 2) `/?/scrobble`.

Requests to `/?/scrobble` should include:

    * `artist`

    * `album`

    * `song`

As well as a cookie, `${auth token name}: ${auth token value}`. This utilizes an auth token obtained from `/?/login`.

An example request is below:

```python
import requests, sys

email = sys.argv[1]
password = sys.argv[2]

resp = requests.post(
    "listenin.rocks/?/login=",
    data={ 'e-mail': email, 'password': password },
    timeout=5000
)
auth_token = resp.cookies.get("auth-token")

resp = requests.post(
    "listenin.rocks/?/srobble=",
    cookies={"auth-token": auth_token},
    data={
        'artist': 'Kamasi Washington',
        'album': 'The Epic',
        'song': 'Seven Prayers'
    },
    timeout=5000
)

if resp.ok:
    print("Scrobbled!")
else:
    print("Failed to scrobble!")
```