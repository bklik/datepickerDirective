/***********************************************************************
 * Datepicker Directive
 * Author: Brenton Klik
 * 
 * Prerequisites:
 *  - AngularJS
 *  - styleSheetFactory (https://github.com/bklik/styleSheetFactory)
 *  - popupDirective (optional)
 * 
 * Description:
 * Creates a datepicker control.
/**********************************************************************/
angular.module('datepickerDirective', ['styleSheetFactory'])

.directive('datepickerDirective', ['$timeout', 'styleSheetFactory', function($timeout, styleSheetFactory) {
    return {
        scope: {
            'closeCallback': '=',
            'inputModel': '=',
        },
        restrict: 'E',
        template: '' +
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
            '</table>',
        link: function($scope, $element, $attrs) {
            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Add this directive's styles to the document's stylesheet.
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive',
                'display: block;' +
                'height: 256px;' +
                'overflow: hidden;' +
                'position: relative;' +
                '-'+prefix+'-user-select: none;' +
                'user-select: none;' +
                'width: 224px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .hide',
                'opacity: 0;' +
                'pointer-events: none;' +
                'visibility: hidden;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .selected',
                'background-color: #666 !important;' +
                'color: white !important;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table',
                'border-collapse: collapse;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .lite',
                'background-color: #eee;' +
                'color: #ccc;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .head1 th',
                'background-color: black;' +
                'color: white;' +
                'font-weight: normal;' +
                'position: relative;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .head1 .back',
                'line-height: 32px;' +
                'position: absolute;' +
                'height: 32px;' +
                'width: 32px;' +
                'top: 0;' +
                'left: 0;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .head1 .forward',
                'line-height: 32px;' +
                'position: absolute;' +
                'height: 32px;' +
                'width: 32px;' +
                'top: 0;' +
                'right: 0;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .head1 .back:before',
                'content: \'<\';'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .head1 .forward:before',
                'content: \'>\';'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive table .head2 th',
                'background-color: grey;' +
                'color: white;' +
                'cursor: auto;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .calendar, datepicker-directive .months, datepicker-directive .years',
                'display: inline-block;' +
                'position: absolute;' +
                'width: 224px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 
                'datepicker-directive .calendar th,' +
                'datepicker-directive .calendar td,' +
                'datepicker-directive .months td,' +
                'datepicker-directive .months th,' +
                'datepicker-directive .years td,' +
                'datepicker-directive .years th',
                    'background-color: white;' +
                    'box-sizing: border-box;' +
                    'color: black;' +
                    'cursor: pointer;' +
                    'height: 32px;' +
                    'text-align: center;' +
                    'width: 32px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .months .head1 th',
                'width: 224px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .months td',
                'height: 48px;' +
                'line-height: 48px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .months .spacing td',
                'cursor: auto;' + 
                'height: 32px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .years .head1 th',
                'cursor: auto;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .years .spacing td',
                'cursor: auto;' + 
                'height: 32px;'
            , 1);
            styleSheetFactory.addCSSRule(styleSheet, 'datepicker-directive .years td',
                'height: 64px;' +
                'line-height: 64px;'
            , 1);

            $scope.calendar = 'calendar';
            $scope.monthNames = [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December'
            ];
            if(typeof $scope.inputModel !== 'undefined') {
                $scope.inputModel = new Date($scope.inputModel);
            } else {
                $scope.inputModel = new Date();
                $scope.inputModel = new Date(
                    $scope.inputModel.getFullYear(),
                    $scope.inputModel.getMonth(),
                    $scope.inputModel.getDate(),
                    23,
                    59,
                    59,
                    999
                );
            }
            $scope.displayDate = new Date();
            $scope.monthArray = new Array();
            $scope.yearArray = new Array();
            $scope.decadeArray = new Array();

            var buildCalendars = function() {
                // Create the Julian Calendar
                $scope.monthArray = new Array();
                var currentMonth = $scope.displayDate.getMonth();
                var currentDate = new Date($scope.displayDate.getFullYear(), $scope.displayDate.getMonth(), 1);
                currentDate.setDate(currentDate.getDate()-currentDate.getDay());

                for(var i=0; i<6; i++) {
                    var weekArray = new Array();

                    for(var j=0; j<7; j++) {
                        weekArray.push({
                            'label': currentDate.getDate(),
                            'value': new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                currentDate.getDate(),
                                23,
                                59,
                                59,
                                999
                            ),
                            'lite': !(currentDate.getMonth() == currentMonth),
                            'selected': (
                                currentDate.getMonth() == $scope.inputModel.getMonth() &&
                                currentDate.getDate() == $scope.inputModel.getDate() &&
                                currentDate.getFullYear() == $scope.inputModel.getFullYear()
                            )
                        });
                        currentDate.setDate(currentDate.getDate()+1);
                    }

                    $scope.monthArray.push(weekArray);
                }

                // Create the Months Calendar
                $scope.yearArray = new Array();
                var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var monthNum = 0;
                for(var i=0; i<4; i++) {
                    var monthRow = new Array();

                    for(var j=0; j<3; j++) {
                        monthRow.push({
                            'num': monthNum++,
                            'value': monthNamesShort.shift(),
                            'selected': (
                                monthNum-1 == $scope.inputModel.getMonth() &&
                                $scope.displayDate.getFullYear() == $scope.inputModel.getFullYear()
                            )
                        });
                    }

                    $scope.yearArray.push(monthRow);
                }

                // Creat the Years Calendar
                $scope.decadeArray = new Array();
                var years = new Array();
                for(var y=0; y<12; y++) {
                    var year = $scope.displayDate.getFullYear();
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
                            'selected': (y == $scope.inputModel.getFullYear())
                        });
                    }

                    $scope.decadeArray.push(yearRow);
                }
            };

            // Calendar Back/Forward Buttons
            $scope.backMonth = function(event) {
                event.stopPropagation();
                $scope.displayDate.setMonth($scope.displayDate.getMonth() - 1);
                buildCalendars();
            };
            $scope.forwardMonth = function(event) {
                event.stopPropagation();
                $scope.displayDate.setMonth($scope.displayDate.getMonth() + 1);
                buildCalendars();
            };

            // Month Calendar Back/Forward Buttons
            $scope.backYear = function(event) {
                event.stopPropagation();
                $scope.displayDate.setFullYear($scope.displayDate.getFullYear() - 1);
                buildCalendars();
            };
            $scope.forwardYear = function(event) {
                event.stopPropagation();
                $scope.displayDate.setFullYear($scope.displayDate.getFullYear() + 1);
                buildCalendars();
            };

            // Decade Calendar Back/Forward Buttons
            $scope.backDecade = function(event) {
                event.stopPropagation();
                $scope.displayDate.setFullYear($scope.displayDate.getFullYear() - 10);
                buildCalendars();
            };
            $scope.forwardDecade = function(event) {
                event.stopPropagation();
                $scope.displayDate.setFullYear($scope.displayDate.getFullYear() + 10);
                buildCalendars();
            };

            $scope.setDate = function(d) {
                $scope.inputModel = d;

                $scope.displayDate = new Date($scope.inputModel);

                if(typeof $scope.closeCallback !== 'undefined') {
                    $scope.closeCallback();
                }

                buildCalendars();
            };

            $scope.setYear = function(y) {
                $scope.displayDate.setFullYear(y);
                $scope.calendar = 'months';
                buildCalendars();
            };

            $scope.setMonth = function(m) {
                $scope.displayDate.setMonth(m);
                $scope.calendar = 'calendar';
                buildCalendars();
            };

            $scope.$watch('inputModel', function() {
                $scope.displayDate = new Date($scope.inputModel);
                buildCalendars();
            }, false);
        }
    }
}]);
