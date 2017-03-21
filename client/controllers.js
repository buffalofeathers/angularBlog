angular.module('p2.controllers', [])
.controller('BlogListController', ['$scope', 'PostFactory', function($scope, PostFactory) {
    $scope.blogList = PostFactory.query();
}])

.controller('ComposeController', ['$scope', '$routeParams', 'PostFactory', 'CategoryFactory', 'UserFactory', '$location', function($scope, $routeParams, PostFactory, CategoryFactory, UserFactory, $location) {    
    $scope.composeBlog = function() {
        var data = {
            title: $scope.title,
            content: $scope.blogContent,
            categoryid: $scope.categoryid,
            userid: $scope.userid
        }

        var blogToCreate = new PostFactory(data);
        blogToCreate.$save(function(success) {
            $location.path('/');
        });
    }

   $scope.categories = CategoryFactory.query();
   $scope.users = UserFactory.query();
   
}])

.controller('UpdateBlogController', ['$scope', '$routeParams', 'PostFactory', 'CategoryFactory', '$location', function($scope, $routeParams, PostFactory, CategoryFactory, $location) {    
   $scope.single = PostFactory.get({ id: $routeParams.id }, function() {
       $scope.single.categoryid = String($scope.single.categoryid);
   });
   $scope.update = function() {
        $scope.single.$update(function(success) {
            $location.path('/' + $routeParams.id);
        });
    }
    $scope.categories = CategoryFactory.query();
}])

.controller('SingleBlogController', ['$scope', '$routeParams', 'PostFactory', '$location', function($scope, $routeParams, PostFactory, $location) {    
   $scope.single = PostFactory.get({ id: $routeParams.id });
   $scope.update = function() {
        $location.path('/' + $routeParams.id + '/update');
    }

   $scope.promptDelete = function() {
        var confirmDelete = confirm('Would you like to delete this post?');
        if (confirmDelete) {
            $scope.single.$delete(function(success) {
                $location.path('/');
            });
        }
    }
}]);