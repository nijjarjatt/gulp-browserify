/// <reference path="../../../typings/index.d.ts" />

import * as controllers from "./controllers";

let app = angular.module('sampleApp', []);

app

.controller('appCtrl', controllers.AppCtrl);

