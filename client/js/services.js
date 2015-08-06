(function() {
    angular
        .module('starter.services', [])
        .factory('Chats', Chats);

    function Chats($http) {

        var threads = [];
        var posts = [];

        var services = {
            getThreads: getThreads,
            getPosts: getPosts,
            resetPosts: resetPosts,
        };

        return services;

        function resetPosts() {
            posts = [];
        }

        function getThreads() {
            return $http({
                method: 'GET',
                url: '/api/bands/1/threads'
            }).
            then(function(data, status, headers, config) {
                threads = data.data.aaData;
                return threads;
            }).
            catch(function(message) {
                console.log(message);
            });
        }

        function paginate(chatId, skip) {
            console.log('Make Request: ' + skip);
            return $http({
                method: 'GET',
                url: '/api/bands/1/threads/' + chatId + '/posts/?skip=' + skip
            }).
            then(function(data, status, headers, config) {
                return data.data;
            }).
            catch(function(message) {
                console.log(message);
            });
        }

        function getPosts(chatId) {
            return paginate(chatId, posts.length).then(function(response) {

                console.log('Got Response: ' + posts.length);
                posts = posts.concat(response.data);
                console.log(posts.length + ' | ' + response.recordCount)
                if (posts.length != response.recordCount) {
                    return getPosts(chatId);
                }

                console.log('Got all Posts')
                return posts;

            });
        }
    }
})();