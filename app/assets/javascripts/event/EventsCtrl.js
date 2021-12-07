var app = angular.module('angularExample', ['ngResource']);

app.controller('EventsCtrl', ['$scope', 'Event', function($scope, Event) {
    $scope.events = Event.query();
    // $scope.events = [
    //   { name: 'Event 1', event_date: '01/10/2016', description: 'Description #1', place: 'Place #1'},
    //   { name: 'Event 2', event_date: '02/10/2016', description: 'Description #2', place: 'Place #2'},
    //   { name: 'Event 3', event_date: '03/10/2016', description: 'Description #3', place: 'Place #3'},
    //   { name: 'Event 4', event_date: '04/10/2016', description: 'Description #4', place: 'Place #4'},
    //   { name: 'Event 5', event_date: '05/10/2016', description: 'Description #5', place: 'Place #5'}
    // ];

    $scope.editing = {};
    $scope.sorting = {
      sort_by: 'name',
      order: 'asc'
    };

    $scope.toggleForm = function(event) {
        if (event.id === $scope.editing.id) {
          return 'form';
        }
        else {
          return 'row';
        }
    };

    $scope.editEvent = function(event) {
        $scope.editing = angular.copy(event);
    };

    $scope.updateEvent = function(index) {
        Event.update($scope.editing,
            function(response, _headers) {
                $scope.events[index] = angular.copy($scope.editing);
                $scope.hideForm();
            },
            function(response) {
                alert('Errors: ' + reponse.data.errors.join('. '));
            }
        );
    };
    
    $scope.hideForm = function() {
        $scope.editing = {};
    };
    

    $scope.addEvent = function() {
        if (!valid()) {
          return false;
        }
    
        // $scope.events.push({
        //   name: $scope.event.name,
        //   event_date: $scope.event.event_date,
        //   description: $scope.event.description,
        //   place: $scope.event.place
        // });
    
        // $scope.event.name = '';
        // $scope.event.description = '';
        // $scope.event.event_date = '';
        // $scope.event.place = '';

        Event.save($scope.event,
            function(response, _headers) {
              $scope.events.push(response);
            },
            function(response) {
              alert('Errors: ' + response.data.errors.join('. '));
            }
          );
      
        $scope.event = {};
      };
    
      valid = function() {
        return !!$scope.event &&
          !!$scope.event.name && !!$scope.event.event_date &&
          !!$scope.event.description && !!$scope.event.place;
      }

      $scope.filterEvents = function() {
        Event.search({query: $scope.search},
          function(response, _headers) {
            $scope.events = response;
          }
        );
      };

      $scope.destroyEvent = function(event, index) {
        Event.delete(event,
          function(response, _headers) {
            $scope.events.splice(index, 1);
          }
        );
      };

      $scope.sortEvents = function(sort_by, order) {
        if ($scope.sorting.sort_by == sort_by) {
          order = (order == 'asc' ? 'desc' : 'asc');
        } else if ($scope.sorting.sort_by != sort_by) {
          order = 'asc';
        }
        Event.sort({ sort_by: sort_by, order: order },
          function(response, _headers) {
            $scope.events = response;
            $scope.sorting = {
              sort_by: sort_by,
              order: order
            }
          }
        );
      };
    
      $scope.updateArrowOrder = function() {
        $scope.order = $scope.sorting.order == 'asc' ? 'up' : 'down';
      };
    
      $scope.updateArrowOrder();
    
      $scope.$watch('sorting.order', function(oldVal, newVal) {
        $scope.updateArrowOrder();
      });

  }]);