'use strict';

angular
    .module('componentEditorService')
    .service('ComponentEditorService', ComponentEditorService);

ComponentEditorService.$inject = ['$http', 'constants', '$mdDialog', '$rootScope'];

function ComponentEditorService ($http, constants, $mdDialog, $rootScope) {
    var _componentForm, _selectedComponent, _templates;
    var service = {};

    service.getSelectedComponent = function () {
        return _selectedComponent;
    };

    service.editComponent = function (node) {
        // if selected component has been changed, show confirmation dialog
        if (_componentForm != undefined && _componentForm.$dirty) {
            var confirm = $mdDialog.confirm()
                    .title('Edit component')
                    .ariaLabel('Edit component')
                    .textContent('Changes have not been saved. Discard changes?')
                    .ok('Discard')
                    .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                // open or hide editor, depending on whether a different component has been selected
                toggleEditor(node.path);
            }, function () {});
        } else {
            // open or hide editor, depending on whether a different component has been selected
            toggleEditor(node.path);
        }
    };

    function toggleEditor(nodePath) {
        // hide editor, if selected component is selected
        if(_selectedComponent == nodePath) {
            _selectedComponent = undefined;
            _componentForm = undefined;
        // show editor
        } else {
            _selectedComponent = nodePath;
        }
    }

    service.reloadIframe = function() {
        var iframe = $(constants.IFRAME_ID);
        if (iframe.length > 0) {
            iframe.attr('src', $rootScope.siteUrl);
        } else {
            console.log("Could not find iframe with ID " + constants.IFRAME_ID);
        }
    }

    service.getComponentForm = function () {
        return _componentForm;
    };

    service.setComponentForm = function (component) {
        _componentForm = component;
    };

    // retrieve all templates, for populating the template selector dropdown
    var _apiUrl = $rootScope.apiUrl + constants.API_QUERY_URL;
    $http.post(_apiUrl, constants.API_TEMPLATE_QUERY).then(function (response) {
        _templates = response.data.nodes;
    });

    service.getTemplates = function () {
        return _templates;
    };

    return service;
}