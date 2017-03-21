angular.module('p2.factories', ['ngResource'])
.factory('UserFactory', ['$resource', function($resource) {
    var u = $resource('http://localhost:3000/api/users/:id', { id: '@id' })
    return u;
}])

.factory('CategoryFactory', ['$resource', function($resource) {
    var c = $resource('http://localhost:3000/api/categories/:id', { id: '@id' })
    return c;
}])

.factory('PostFactory', ['$resource', function($resource) {
    var p = $resource('http://localhost:3000/api/posts/:id', { id: '@id' }, {
    'update': { method: 'PUT' }
    });
    return p;
}]) 
