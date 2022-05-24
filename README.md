# DeepLinker

Universal links and deep linking are the talk of the industry, brought up as a complex and ongoing challenge that both app users and developers face.

- - -

As a front-end engineer you might face some situations where the project requirements specify a box that you can not fit into, or more spcifically the [smart banners](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners) are too loose of a fit for you. For some reason your app has no good implementation of deep/universal links, you can try out DeepLinker, which tries to use clever tricks by leveraging events and user navigation to determine if you have an app installed or not.

## Usage

```javascript
const linker = new DeepLinker({
    onIgnored: function () {
        console.log('browser failed to respond to the deep link');
        // use this to handle the case where your app is not installed for ex: 
        // const appStoreUrl = 'linkToAppStore';
        // window.location.href = appStoreUrl;
    },
    onFallback: function () {
        console.log('dialog hidden or user returned to tab');
    },
    onReturn: function () {
        console.log('user returned to the page from the native app');
    },
});

const url = 'yourapp//';
linker.openURL(url);
```
