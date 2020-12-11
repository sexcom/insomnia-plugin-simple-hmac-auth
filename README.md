# Insomnia HMAC Plugin

Add a customizable HMAC template tag to insomnia.

Uses [simple-hmac-auth](https://github.com/jessety/simple-hmac-auth) HMAC implementation

Based on [insomnia-plugin-cairn-hmac-auth](https://github.com/farfromrefug/insomnia-plugin-cairn-hmac-auth)


### Install Plugin
##### Manual Installation (Ubuntu 20)
```
$ cd ~/snap/insomnia/current/.config/Insomnia/plugins
$ npm i sexcom/insomnia-plugin-simple-hmac-auth
```

### Enable Plugin

- navigate to `Insomnia Core > Application > Preferences > Plugins`
- click `Reload Plugins`
- the new plugin should show up as `insomnia-plugin-simple-hmac-auth`
- make sure the `Enable?` button for `insomnia-plugin-simple-hmac-auth` is on

### Usage
Add a new request to Insomnia with following headers:
- authorization: api-key [yourApiClientId]
- signature: [HMAC-template-tag] (type `HMAC` and press CTRL+SHIFT for suggestions)
- date: [Date-template-tag-with-Custom-Format] (Format: `ddd, DD MMM YYYY HH:mm:ss ZZ`)
