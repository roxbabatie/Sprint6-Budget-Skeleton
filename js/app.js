(function() {
    var app = angular.module('budgetingApp', ['ngRoute']);

    var pages = [
        {name: 'Balance', url: ''},
        {name: 'Income', url: 'income'},
        {name: 'Expense', url: 'expense'}
    ];

    //configure angular app
    app.config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        angular.forEach(pages, function(page) {
            console.log('/' + page.url + '.html');
            $routeProvider.when('/' + page.url, {
                templateUrl: 'pages/' + (!page.url ? 'balance' : page.url) + '.html',
            })
        });

        $routeProvider.otherwise({
            templateUrl: 'pages/balance.html',
        });
    });


})();