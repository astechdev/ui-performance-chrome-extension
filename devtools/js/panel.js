angular.module('uiperf', ['ngRoute'])

.run(function($rootScope) {

    $rootScope.settings = {};
    $rootScope.files = [];

})

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ListCtrl',
            templateUrl: 'list.html'
        })
        .when('/edit/:index', {
            controller: 'EditCtrl',
            templateUrl: 'detail.html'
        })
        // .when('/new', {
        //     controller: 'CreateCtrl',
        //     templateUrl: 'detail.html'
        // })
        .otherwise({
            redirectTo: '/'
        });
})

.controller('ListCtrl', function($scope, $rootScope, $location) {

    $scope.addFiles = function(fileArray) {
        $rootScope.files.push(fileArray);
        console.log($rootScope.files);
    };

    var importSettings = function(e) {

        var file = e.target.files[0];

        var reader = new FileReader();

        reader.onload = function(e) {

            var archive = JSON.parse(e.target.result);

            console.log(archive);

            $rootScope.settings = archive.settings;

            archive.files.forEach(function(a) {
                $scope.addFiles(a);
            })

            //$scope.addFiles(JSON.parse(e.target.result));
            $scope.$apply();
        }

        reader.readAsText(file);

    }

    document.getElementById('fileInput').addEventListener('change', importSettings, false);

    $scope.edit = function(that) {
        console.log(that.$index);
        $location.path('/edit/' + that.$index);
    }

    $scope.run = function() {
        console.log($rootScope.settings);
    }

})

// .controller('CreateCtrl', function($scope, $location, $timeout, Projects) {
//     $scope.save = function() {
//         Projects.add($scope.project, function() {
//             $timeout(function() {
//                 $location.path('/');
//             });
//         });
//     };
// })

.controller('EditCtrl', function($scope, $rootScope, $location, $routeParams) {

    $scope.file = $rootScope.files[$routeParams.index];

})

;







