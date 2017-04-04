'use strict';

angular
    .module('templateEditor')
    .controller('TemplateEditorCtrl', TemplateEditorCtrl);

TemplateEditorCtrl.$inject = ['$scope', '$http', '$mdDialog', 'data', 'url', 'name', 'mdPanelRef', 'ComponentEditorService'];

function TemplateEditorCtrl ($scope, $http, $mdDialog, data, url, name, mdPanelRef, ComponentEditorService) {
    var vm = this;
    // set local binded variables
    vm.template = data;
    vm.url = url;
    vm.name = name;
    // used for revert function
    vm.originalTemplate = data.values[0];

    $scope.saveTemplate = function () {
        // templates are converted to string so they're editable in the editor
        // no need to encode back to base64 if we can just save the property as string
        vm.template.type = "String";
        $http.put(url, vm.template).then(function (response) {
            if (response.status != 200 && response.status != 204) {
                // TODO: show error message in front-end on error
                console.log('error while updating template');
                console.log(response);
                console.log(response.config.data);
            } else {
                // reload iframe to show changes
                ComponentEditorService.reloadIframe();
                // used for revert function
                vm.originalTemplate = data;
                // set the template editor to unchanged
                $scope.editor.$setPristine();
            }
        });
    };

    $scope.revertTemplate = function () {
        if (vm.originalTemplate != undefined) {
            // restore original value;
            vm.template.values[0] = vm.originalTemplate;
            // set the template editor to unchanged
            $scope.editor.$setPristine();
        }
    };

    $scope.closeEditor = function () {
        // if template has been changed, show confirmation dialog
        if($scope.editor != undefined && $scope.editor.$dirty) {
            var confirm = $mdDialog.confirm()
                    .title('Edit template')
                    .ariaLabel('Edit template')
                    .textContent('Changes have not been saved. Discard changes?')
                    .ok('Discard')
                    .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                closeEditor();
            }, function () {});
        } else {
            closeEditor();
        }
    };

    function closeEditor() {
        // close the template editor dialog
        mdPanelRef && mdPanelRef.close().then(function () {
            mdPanelRef.destroy();
        });
    }
}