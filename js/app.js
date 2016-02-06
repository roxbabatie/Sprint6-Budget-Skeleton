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
    //controllers

    app.controller('BalanceCtrl', function($scope, TransactionStore) {
        $scope.transactions = [];

        TransactionStore.getTransactionsInMonth(moment().format('YYYY-MM')).then(function(items) {
            $scope.transactions = items;
        });
    });

    //create services
    app.factory('TransactionStore', function($http, $q) {
        return (function() {
            var URL = 'http://server.godev.ro:8080/api/roxanab/transactions';

            var getTransactionsInMonth = function(month) {
                return $q(function(resolve, reject) {
                    $http({url: URL + '?month=' + month})
                        .then(
                            function(xhr) {
                                if (xhr.status == 200) {
                                    resolve(xhr.data);
                                } else {
                                    reject();
                                }
                            },
                            reject
                        );
                });
            };

            var add = function(data) {
                return $q(function(resolve, reject) {
                    $http({
                        url: URL,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data)
                    })
                        .then(
                            function(xhr) {
                                if (xhr.status == 201) {
                                    resolve(xhr.data);
                                } else {
                                    reject();
                                }
                            },
                            reject
                        );
                });
            };

            var del = function(id) {
                return $q(function(resolve, reject) {
                    $http({
                        url: URL + '/' + id,
                        method: 'DELETE'
                    })
                        .then(
                            function(xhr) {
                                if (xhr.status == 204) {
                                    resolve();
                                } else {
                                    reject();
                                }
                            },
                            reject
                        );
                });
            };

            return {
                getTransactionsInMonth: getTransactionsInMonth,
                add: add,
                delete: del
            };
        })();
    });


})();