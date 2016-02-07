(function() {
    var app = angular.module('budgetingApp', ['ngRoute']);

    var pages = [
        {name: 'Balance', url: ''},
        {name: 'Income', url: 'income'},
        {name: 'Expense', url: 'expense'}
    ];

    var resetTransaction = {
        date: "",
        description: "",
        amount: ""
    }
    var totalBalance = function(items) {
        var balance = 0;
        angular.forEach(items, function(item){
            balance += item.amount;
        });
        return balance;
    }
    //configure angular app
    app.config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        angular.forEach(pages, function(page) {
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
            $scope.balance = totalBalance(items);
        });
        $scope.deleteTransaction = function (id) {
            TransactionStore.delete(id).then(function (items) {
                TransactionStore.getTransactionsInMonth(moment().format('YYYY-MM')).then(function(items) {
                    $scope.transactions = items;
                    $scope.balance = totalBalance(items);
                });
            });
        };
    });
    app.controller('IncomeCtrl', function($scope, TransactionStore) {
        $scope.addTransaction = resetTransaction;
        $scope.add = function() {
            TransactionStore.add($scope.addTransaction).then(function () {
                $scope.addTransaction.date = "";
                $scope.addTransaction.amount = "";
                $scope.addTransaction.description = "";
            });
        }
    });

    app.controller('ExpenseCtrl', function($scope, TransactionStore) {
        $scope.addTransaction = resetTransaction;
        $scope.add = function() {
            $scope.addTransaction.amount =  -$scope.addTransaction.amount;
            TransactionStore.add($scope.addTransaction).then(function () {
                $scope.addTransaction.date = "";
                $scope.addTransaction.amount = "";
                $scope.addTransaction.description = "";
            });
        }

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