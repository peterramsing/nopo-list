var db = firebase.firestore();


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
    ];

    nopoList.addItem = function() {
      db.collection('items').add({
        label: nopoList.newItemLabel,
        done: false,
      });
    }
  })
