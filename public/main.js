angular.module('nopoApp', [])
  .controller('NoPoListController', function() {
    var nopoList = this;
    nopoList.items = [
      {
        label: 'test',
        done: false,
      },
      {
        label: 'test2',
        done: true,
      }
    ]
  })
