# Insomnia HMAC plugin

Add a customizable HMAC template tag to insomnia.

Uses [simple-hmac-auth](https://github.com/jessety/simple-hmac-auth) HMAC implementation

Based on [insomnia-plugin-cairn-hmac-auth](https://github.com/farfromrefug/insomnia-plugin-cairn-hmac-auth)


### Install
##### Manual installation
```
$ cd ~/snap/insomnia/current/.config/Insomnia/plugins
$ git clone git@github.com:sexcom/insomnia-plugin-simple-hmac-auth.git
```

### Usage
Add a new request to Insomnia with following headers:
- authorization: api-key [yourApiClientId]
- signature: [HMAC-template-tag] (type `HMAC` and press CTRL+SHIFT for suggestions)
- date: [Date-template-tag-with-Custom-Format] (Format: `ddd, DD MMM YYYY HH:mm:ss ZZ`)
