angular.module('p2',['ngResource','ngRoute', 'p2.controllers', 'p2.factories'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: 'views/blog.html',
        controller: 'BlogListController'
    })
    .when('/compose', {
        templateUrl: 'views/compose.html',
        controller: 'ComposeController'
       
    })
    .when('/:id/update', {
        templateUrl: 'views/update.html',
        controller: 'UpdateBlogController'
       
    })
    .when('/:id', {
        templateUrl: 'views/single_blog.html',
        controller: 'SingleBlogController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);