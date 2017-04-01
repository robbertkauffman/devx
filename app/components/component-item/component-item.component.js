'use strict';

angular
    .module('componentItem')
    .component('componentItem', {
        templateUrl: 'components/component-item/component-item.template.html',
        bindings: {
            node: '<'
        },
        controllerAs: 'component',
        controller: ComponentItemCtrl
    });

ComponentItemCtrl.$inject = ['$scope', 'ComponentEditorService'];

function ComponentItemCtrl ($scope, ComponentEditorService) {
    var vm = this;

    // toggle display of component using jQuery
    $scope.toggleComponent = function (node, e) {
        node.collapsed = !node.collapsed;
        var elm = angular.element(e.target)
        elm.parentsUntil(".component-item").parent().find(".component-children").toggle();
    };

    // a service is used to track state of selected component,
    // and toggle the component editor when clicking on edit component
    vm.selectedComponent = ComponentEditorService.getSelectedComponent;
    $scope.editComponent = function (node) {
        ComponentEditorService.editComponent(node);
    };
}