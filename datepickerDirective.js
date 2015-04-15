/***********************************************************************
 * Datepicker Directive
 * Author: Brenton Klik
 * 
 * Prerequisites:
 *  - AngularJS
 *  - popupDirective
 *  - styleSheetFactory (https://github.com/bklik/styleSheetFactory)
 * 
 * Description:
 * Creates the expanding/fading material design circle effect, that
 * radiates from a click/touch's origin. Any element where this
 * directive is used, should have the following CSS properties:
 *  - position: relative;
 *  - overflow: hidden; (recommended)
/**********************************************************************/
angular.module('datepickerDirective', ['styleSheetFactory'])

.directive('datepicker', ['$compile', 'styleSheetFactory', function($compile, styleSheetFactory) {
    return {
        restrict: 'E',
        template: '<div class="date-picker-content" ripple></div>',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs, ctrl, transclude) {
            // Variable to track the value.
            var val = '';

            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Add this directive's styles to the document's stylesheet.
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content',
                'display: block;' +
                'height: 256px;' +
                'margin: -8px;' +
                'overflow: hidden;' +
                'position: relative;' +
                '-'+prefix+'-user-select: none;' +
                'user-select: none;' +
                'width: 224px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .hide',
                'opacity: 0;' +
                'pointer-events: none;' +
                'visibility: hidden;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .selected',
                'background-color: #666 !important;' +
                'color: white !important;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table',
                'border-collapse: collapse;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .lite',
                'background-color: #eee;' +
                'color: #ccc;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .head1 th',
                'background-color: black;' +
                'color: white;' +
                'font-weight: normal;' +
                'position: relative;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .head1 .back',
                'line-height: 32px;' +
                'position: absolute;' +
                'height: 32px;' +
                'width: 32px;' +
                'top: 0;' +
                'left: 0;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .head1 .forward',
                'line-height: 32px;' +
                'position: absolute;' +
                'height: 32px;' +
                'width: 32px;' +
                'top: 0;' +
                'right: 0;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .head1 .back:before',
                'content: \'<\';'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .head1 .forward:before',
                'content: \'>\';'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content table .head2 th',
                'background-color: grey;' +
                'color: white;' +
                'cursor: auto;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .calendar, .date-picker-content .months, .date-picker-content .years',
                'display: inline-block;' +
                'position: absolute;' +
                'width: 224px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 
                '.date-picker-content .calendar th,' +
                '.date-picker-content .calendar td,' +
                '.date-picker-content .months td,' +
                '.date-picker-content .months th,' +
                '.date-picker-content .years td,' +
                '.date-picker-content .years th',
                    'background-color: white;' +
                    'box-sizing: border-box;' +
                    'color: black;' +
                    'cursor: pointer;' +
                    'height: 32px;' +
                    'text-align: center;' +
                    'width: 32px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .months .head1 th',
                'width: 224px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .months td',
                'height: 48px;' +
                'line-height: 48px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .months .spacing td',
                'cursor: auto;' + 
                'height: 32px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .years .head1 th',
                'cursor: auto;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .years .spacing td',
                'cursor: auto;' + 
                'height: 32px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, '.date-picker-content .years td',
                'height: 64px;' +
                'line-height: 64px;'
            , 1);

            scope.calendar = 'calendar';
            scope.monthNames = [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December'
            ];
            scope.selectedDate = new Date();
            scope.displayDate = new Date();
            scope.monthArray = new Array();
            scope.yearArray = new Array();
            scope.decadeArray = new Array();

            transclude(scope, function(clone, scope) {
                var calendar = '' +
                    '<table class="calendar" ng-class="{hide: (calendar != \'calendar\')}">' +
                        '<thead>' +
                            '<tr class="head1">' +
                                '<th colspan="7" ng-click="calendar = \'months\';"><div class="back" ng-click="backMonth($event);"></div>{{monthNames[displayDate.getMonth()] + " " + displayDate.getFullYear()}}<div class="forward" ng-click="forwardMonth($event);"></div></th>' +
                            '</tr>' +
                            '<tr class="head2">' +
                                '<th>Su</th>' +
                                '<th>Mo</th>' +
                                '<th>Tu</th>' +
                                '<th>We</th>' +
                                '<th>Th</th>' +
                                '<th>Fr</th>' +
                                '<th>Sa</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<tr ng-repeat="week in monthArray">' +
                                '<td ng-repeat="day in week" ng-class="{lite: day.lite, selected: day.selected}" ng-click="setDate(day.value);">{{day.label}}</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    '<table class="months" ng-class="{hide: (calendar != \'months\')}">' +
                        '<thead>' +
                            '<tr class="head1">' +
                                '<th colspan="6" ng-click="calendar = \'years\';"><div class="back icon-chevron-left" ng-click="backYear($event);"></div>{{displayDate.getFullYear()}}<div class="forward icon-chevron-right" ng-click="forwardYear($event);"></div></th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<tr ng-repeat="row in yearArray">' +
                                '<td ng-repeat="month in row" ng-class="{selected: month.selected}" ng-click="setMonth(month.num)" colspan="2">{{month.value}}</td>' +
                            '</tr>' +
                            '<tr class="spacing">' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    '<table class="years" ng-class="{hide: (calendar != \'years\')}">' +
                        '<thead>' +
                            '<tr class="head1">' +
                                '<th colspan="8"><div class="back icon-chevron-left" ng-click="backDecade($event);"></div>{{(displayDate.getFullYear() - (displayDate.getFullYear() % 10)) + " - " + (displayDate.getFullYear() - (displayDate.getFullYear() % 10) + 9)}}<div class="forward icon-chevron-right" ng-click="forwardDecade($event);"></div></th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<tr ng-repeat="years in decadeArray">' +
                                '<td ng-repeat="year in years" ng-class="{lite: year.lite, selected: year.selected}" colspan="2" ng-click="setYear(year.value)">{{year.value}}</td>' +
                            '</tr>' +
                            '<tr class="spacing">' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td></td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>';
                var cCalendar = $compile(calendar)(scope);
                element.append(cCalendar);
            });

            var buildCalendars = function() {

                // Create the Julian Calendar
                scope.monthArray = new Array();
                var currentMonth = scope.displayDate.getMonth();
                var currentDate = new Date(scope.displayDate.getFullYear(), scope.displayDate.getMonth(), 1);
                currentDate.setDate(currentDate.getDate()-currentDate.getDay());

                for(var i=0; i<6; i++) {
                    var weekArray = new Array();

                    for(var j=0; j<7; j++) {
                        weekArray.push({
                            'label': currentDate.getDate(),
                            'value': new Date(currentDate),
                            'lite': !(currentDate.getMonth() == currentMonth),
                            'selected': (
                                currentDate.getMonth() == scope.selectedDate.getMonth() &&
                                currentDate.getDate() == scope.selectedDate.getDate() &&
                                currentDate.getFullYear() == scope.selectedDate.getFullYear()
                                )
                        });
                        currentDate.setDate(currentDate.getDate()+1);
                    }

                    scope.monthArray.push(weekArray);
                }

                // Create the Months Calendar
                scope.yearArray = new Array();
                var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var monthNum = 0;
                for(var i=0; i<4; i++) {
                    var monthRow = new Array();

                    for(var j=0; j<3; j++) {
                        monthRow.push({
                            'num': monthNum++,
                            'value': monthNamesShort.shift(),
                            'selected': (
                                monthNum-1 == scope.selectedDate.getMonth() &&
                                scope.displayDate.getFullYear() == scope.selectedDate.getFullYear()
                                )
                        });
                    }

                    scope.yearArray.push(monthRow);
                }

                // Creat the Years Calendar
                scope.decadeArray = new Array();
                var years = new Array();
                for(var y=0; y<12; y++) {
                    var year = scope.displayDate.getFullYear();
                    year = year - (year % 10) + (y -1);
                    years.push(year);
                }

                for(var i=0; i<3; i++) {
                    var yearRow = new Array();

                    for(var j=0; j<4; j++) {
                        var y = years.shift();
                        yearRow.push({
                            'value': y,
                            'lite': ((i == 0 && j == 0) || (i == 2 && j == 3)),
                            'selected': (y == scope.selectedDate.getFullYear())
                        });
                    }

                    scope.decadeArray.push(yearRow);
                }
            };

            // Calendar Back/Forward Buttons
            scope.backMonth = function(event) {
                event.stopPropagation();
                scope.displayDate.setMonth(scope.displayDate.getMonth() - 1);
            };
            scope.forwardMonth = function(event) {
                event.stopPropagation();
                scope.displayDate.setMonth(scope.displayDate.getMonth() + 1);
            };

            // Month Calendar Back/Forward Buttons
            scope.backYear = function(event) {
                event.stopPropagation();
                scope.displayDate.setFullYear(scope.displayDate.getFullYear() - 1);
            };
            scope.forwardYear = function(event) {
                event.stopPropagation();
                scope.displayDate.setFullYear(scope.displayDate.getFullYear() + 1);
            };

            // Decade Calendar Back/Forward Buttons
            scope.backDecade = function(event) {
                event.stopPropagation();
                scope.displayDate.setFullYear(scope.displayDate.getFullYear() - 10);
            };
            scope.forwardDecade = function(event) {
                event.stopPropagation();
                scope.displayDate.setFullYear(scope.displayDate.getFullYear() + 10);
            };

            scope.setDate = function(d) {
                scope.selectedDate = d;

                scope.displayDate = new Date(scope.selectedDate);

                var d = scope.selectedDate.getDate();
                d = (d<10) ? "0"+d : d;
                var m = scope.selectedDate.getMonth()+1;
                m = (m<10) ? "0"+m : m;
                val = scope.selectedDate.getFullYear() + "-" + m + "-" + d;

                updateValue(null);
                scope.closeContent(null);
            };

            scope.setYear = function(y) {
                scope.displayDate.setFullYear(y);
                scope.calendar = 'months';
            };

            scope.setMonth = function(m) {
                scope.displayDate.setMonth(m);
                scope.calendar = 'calendar';
            };

            scope.$watch('displayDate', function() {
                buildCalendars();
            }, true);

            // POPUP_VALUE is broadcast when the popup is first opened.
            // Listen for it, and store it's value.
            scope.$on("POPUP_VALUE", function(event, message) {
                val = message;

                scope.selectedDate = new Date();
                scope.displayDate = new Date();

                var tmpVal = val.split('-');

                if(tmpVal.length == 3) {
                    var y = parseInt(tmpVal[0]);
                    var m = parseInt(tmpVal[1]);
                    var d = parseInt(tmpVal[2]);

                    if(y+'' != 'NaN' && m+'' != 'NaN' && d+'' != 'NaN') {
                        scope.selectedDate = new Date();
                        scope.selectedDate.setFullYear(y);
                        scope.selectedDate.setMonth(m-1);
                        scope.selectedDate.setDate(d);

                        scope.displayDate = new Date(scope.selectedDate);
                    }
                }

                scope.$apply();
            });

            // Submit the current value back to the popup
            var updateValue = function(event) {
                scope.$emit("UPDATE_POPUP", val);
            };

            // Request the popup be closed
            scope.closeContent = function(event) {
                scope.$emit("CLOSE_POPUP");
            };
        }
    }
}]);
