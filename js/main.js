$(document).ready(function() {
    $('.input-group.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });
});

var app = angular.module('budgetingApp', []);