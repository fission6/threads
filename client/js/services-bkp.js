angular.module('starter.services', [])

.factory('Chats', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  var threads, posts;

  return {
    threads: function() {
      return $http({method: 'GET', url: '/api/bands/1/threads'}).
                then(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(data.data.aaData);
                    threads = data.data.aaData;
                    return threads;
                }).
                catch(function(message) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(message);
                });
    },
    all: function() {
      return chats;
    },
    remove: function(thread) {
      threads.splice(threads.indexOf(thread), 1);
    },
    get: function(chatId) {


      return $http({method: 'GET', url: '/api/bands/1/threads/' + chatId + '/posts/'}).
                then(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    posts = data.data.data;
                    return posts;
                }).
                catch(function(message) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(message);
                });
    },
    skip: function(chatId, skip) {


      return $http({method: 'GET', url: '/api/bands/1/threads/' + chatId + '/posts/?skip=' + skip}).
                then(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    posts = data.data.data;
                    return posts;
                }).
                catch(function(message) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(message);
                });
    },
    loadAll: function(chatId) {


      return skip(chatId, 0);
    }
  };
});
