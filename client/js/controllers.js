angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $ionicLoading, Chats) {


    activate();

    function activate() {

        $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: false,
            delay: 3000,
            duration: 30000,
            hideOnStateChange: true,
            template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        return getThreads();
    }



    $scope.refreshThreads = function() {
        return getThreads().finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    function getThreads() {
        return Chats.getThreads()
            .then(function(data) {
                $scope.chats = data;
                $ionicLoading.hide();
            });
    }

})

.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicScrollDelegate, Chats) {

    $scope.posts = [];
    $scope.threadId = $stateParams.chatId;

    activate();

    function activate() {
        console.log('Post View')
        Chats.resetPosts();
        return loadAll($stateParams.chatId);
    }

    $scope.loadMore = function() {
        console.log('Loading More');
        return Chats.getPosts($scope.threadId).then(function(posts) {
            $scope.posts = posts;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.scrollUp = function() {
        $ionicScrollDelegate.scrollTop();
    }

    $scope.scrollDown = function() {
        $ionicScrollDelegate.scrollBottom();
    }

    function loadAll() {
        return Chats.getPosts($scope.threadId).then(function(posts) {
            console.log('Loaded All')
            $scope.posts = posts;
        });
    };

})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});