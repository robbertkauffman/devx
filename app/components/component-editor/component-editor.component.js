'use strict';

angular
    .module('componentEditor')
    .component('componentEditor', {
        templateUrl: 'components/component-editor/component-editor.template.html',
        bindings: {
            node: '<'
        },
        controllerAs: 'componentEditor',
        controller: ComponentEditorCtrl
    });

ComponentEditorCtrl.$inject = ['$scope', '$http', '$mdPanel', '$mdToast', 'constants', 'removeColonFilter',
    'removePathFilter', 'ComponentEditorService', '$rootScope'];

function ComponentEditorCtrl ($scope, $http, $mdPanel, $mdToast, constants, removeColonFilter, removePathFilter,
                              ComponentEditorService, $rootScope) {
    var vm = this;

    // initialize component editor by retrieving component properties
    getComponent(this.node);

    // get component properties
    function getComponent(node) {
        var apiUrl = $rootScope.apiUrl + constants.API_NODES_URL + node.path;

        $http.get(apiUrl).then(function (response) {
            // retrieve all templates, for populating the template selector dropdown
            vm.templates = ComponentEditorService.getTemplates();
            // store the reference for undo / revert
            vm.selectedComponentReference = response.data;
            // clone a copy of selected component for editing
            vm.selectedComponent = jQuery.extend(true, {}, response.data);
            // set the form to unchanged
            $scope.componentProperties.$setPristine();
            // set componentProperties form on service, so main controller can access the object
            ComponentEditorService.setComponentForm($scope.componentProperties);
        }, function(err) {
            console.log("Error retrieving component: " + apiUrl);
            // show error if
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error retrieving component details, see log')
                    // TODO: positioning of toast
                    .position('top right')
                    .hideDelay(3000)
            );
        });
    }

    $scope.revertComponent = function () {
        // clone the original component object, because otherwise it also contains Angular bindings
        vm.selectedComponent = jQuery.extend(true, {}, vm.selectedComponentReference);
        // set the form to unchanged
        $scope.componentProperties.$setPristine();
    };

    $scope.saveComponent = function () {
        // loop over all properties of component
        // only save changed properties
        for (var key in vm.selectedComponent.properties) {
            // get property name
            var propName = vm.selectedComponent.properties[key].name;
            // filter colon from property name as it's not allowed in the form names
            // which are used by the nested forms for multi-valued properties
            var filteredPropName = removeColonFilter(propName);

            // check if property of component has a corresponding input element in the form (should be the case)
            if (propName in $scope.componentProperties) {
                // skip if value has not been changed
                if ($scope.componentProperties[propName].$pristine) continue;
                // multi-valued properties are stored in a nested form that has the colon removed
                // so check with the filtered property name
            } else if (filteredPropName in $scope.componentProperties) {
                if ($scope.componentProperties[filteredPropName].$pristine) continue;
            }

            // build the API URL to update the property
            var apiUrl = $rootScope.apiUrl + constants.API_PROPERTY_URL + vm.selectedComponent.path + '/' + propName;

            // update the property
            $http.put(apiUrl, vm.selectedComponent.properties[key]).then(function (response) {
                if (response.status != 200 && response.status != 204) {
                    // TODO: show error message in front-end on error
                    console.log('error while updating property');
                    console.log(response);
                    console.log(response.config.data);
                } else {
                    console.log('updated property \'' + response.config.data.name + '\' with value \'' +
                            response.config.data.values + '\' succesfully with URL: ' +
                            response.config.url);
                    // console.log(response);

                    // set the form to unchanged
                    $scope.componentProperties.$setPristine();
                }
            });
        }
    };

    // getter setter function to retrieve and set template value on/from selected component
    vm.selectedTemplate = {"template": ""};
    vm.selectedTemplate = {
        changeTemplate: function (value) {
            if (vm.selectedComponent != undefined) {
                // get hst:template property object from selected component
                var templateProp = vm.selectedComponent.properties.filter(function (prop) {
                    return prop.name === constants.TEMPLATE_PROPERTY;
                });
                // if property is not found, create one with default values
                if (templateProp.length == 0) {
                    vm.selectedComponent.properties.push(constants.TEMPLATE_OBJECT);
                } else if (angular.isDefined(value)) {
                    // setter function
                    // if a template is selected, it should be an object
                    // and the template value is contained in one of its properties
                    if (typeof(value) == "object") {
                        // remove the path of the template value, as only the name is stored as reference
                        var templateVal = removePathFilter(value.fields['jcr:path']);
                        // set the new template value on the selected component
                        templateProp[0].values = [templateVal];
                        // when model gets initialized and a value is set the form is changed to dirty
                        // explicitly change to pristine to fix this
                        if (vm.selectedTemplate.template == undefined) {
                            // the complete template object is stored on the model of the template select
                            // so subproperties like the renderpath can be used later on
                            vm.selectedTemplate.template = value;
                            $scope.componentProperties.$setPristine();
                        // don't do after initialization, otherwise the form will always stay pristine
                        } else {
                            vm.selectedTemplate.template = value;
                        }
                    }
                } else {
                    // getter function
                    // TODO: default selected value works only when undefined, not when just empty
                    if (templateProp[0].values[0] == "") {
                        return undefined;
                    }
                    // return "/hst:hst/hst:configurations/myhippoproject/hst:templates/base-footer";
                    // console.log(templateProp[0].values[0]);
                    return templateProp[0].values[0];
                    // return vm.selectedTemplate.template;
                }
            }
        }
    };

    // custom function for equal comparison for the template select element
    $scope.trackTemplate = function (val) {
        if (val != undefined) {
            // the options of the template select element are objects
            // get the template value from the properties and filter the value
            // so it matches with the structure of the template value stored in the selected component
            if (typeof(val) == "object") {
                if (val.hasOwnProperty("fields") && val.fields.hasOwnProperty("jcr:path")) {
                    var filteredValue = removePathFilter(val.fields['jcr:path']);
                    return filteredValue;
                }
            } else if (typeof(val) == "string") {
                // the model of the template select element is the selected component's template, as a string
                // so in that case just return the value
                return val;
            }
        }
        return false;
    };

    vm.template = {};
    $scope.editTemplate = function () {
        var templateRenderPath = vm.selectedTemplate.template.fields['hst:renderpath'];
        var webfileDataPath = constants.WEBFILES_PATH_PREFIX
                + templateRenderPath.replace(constants.WEBFILES_RENDERPATH_PREFIX, "")
                + constants.WEBFILES_PATH_SUFFIX;
        var apiUrl = $rootScope.apiUrl + constants.API_PROPERTY_URL + webfileDataPath;
        $http.get(apiUrl).then(function (response) {
            vm.template.url = apiUrl;
            vm.template.name = removePathFilter(vm.selectedTemplate.template.fields['jcr:path']);
            vm.template.data = response.data;

            var position = $mdPanel.newPanelPosition()
                    .absolute()
                    .center();

            var config = {
                locals: vm.template,
                controller: 'TemplateEditorCtrl',
                controllerAs: 'templateEditor',
                disableParentScroll: true,
                templateUrl: 'components/template-editor/template-editor.template.html',
                panelClass: "template-editor",
                hasBackdrop: true,
                position: position,
                trapFocus: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                attachTo: angular.element('body')
            };
            $mdPanel.open(config);
        });
    };

    /*$scope.createTemplate = function (ev) {
     var prompt = $mdDialog.prompt()
     .title('Create new template')
     .placeholder('Template name')
     .ariaLabel('Template name')
     .initialValue($scope.selectedComponent.name + '.template')
     .targetEvent(ev)
     .ok('Create')
     .cancel('Cancel');
     $mdDialog.show(prompt).then(function (result) {

     }, function () {
     });
     };*/
}