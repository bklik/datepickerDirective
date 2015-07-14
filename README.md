# Datepicker Directive
A directive that adds date functionality to the popupDirective.

**Requirements**

* [AngularJS](http://angularjs.org/)
* [bklik/styleSheetFactory](https://github.com/bklik/styleSheetFactory)
* [bklik/popupDirective (optional)](https://github.com/bklik/popup/)

### Installation

Link to popup's CSS and Javascript files.
```html
<script src="datepickerDirective/datepickerDirective.js"></script>
```

In your app's directives.js file, add the popup.directives module.
```javascript
angular.module('myApp', ['datepickerDirective']);
```

Last, simply add a `<popup-directive>` element you reference from an event on an element.
```html
<input type="text" ng-focus="popup01.show($event)" ng-model="mydate">
<datepicker-directive close-callback="popup01.hide" input-model="mydate"></datepicker-directive>
```

With popupDirective:
```html
<input type="text" ng-focus="popup01.show($event)" ng-model="mydate">
<popup-directive api="popup01">
    <datepicker-directive close-callback="popup01.hide" input-model="mydate"></datepicker-directive>
</popup-directive>
```