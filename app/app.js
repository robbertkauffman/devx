'use strict';

// Declare app level module which depends on views, and components
angular.module('devPanel', [
    'ngMaterial',
    'ui.ace',
    'componentItem',
    'componentEditor',
    'componentEditorService',
    'templateEditor'
])
.constant("constants", {
    "API_BASE_URL": "http://localhost:8080/essentials/rest",
    "API_QUERY_URL": "/_query",
    "API_TEMPLATE_QUERY": {
        "statement": "/jcr:root/hst:hst//element(*,hst:template)",
        "language": "xpath",
        "limit": 100
    },
    "API_TEMPLATE_PROPERTY": {
        "name": "",
        "type": "String",
        "values": [],
        "multiple": false
    },
    "API_HST_PREVIEW_CONFIG_QUERY": {
        "statement": "/jcr:root/hst:hst/*/*[jcr:contains(., 'preview') and ( jcr:primaryType='hst:channel' or jcr:primaryType='hst:configuration')]",
        "language": "xpath",
        "limit": 100
    },
    "API_NODES_URL": "/nodes",
    "API_PROPERTY_URL": "/properties",
    "HST_CONFIGURATIONS_PATH": "/hst:hst/hst:configurations?depth=1",
    "WEBFILES_PATH_PREFIX": "/webfiles/site/",
    "WEBFILES_PATH_SUFFIX": "/jcr:content/jcr:data",
    "WEBFILES_RENDERPATH_PREFIX": "webfile:/",
    "TEMPLATE_OBJECT": {
        "name": "hst:template",
        "type": "String",
        "multiple": false,
        "values": [""]
    },
    "TEMPLATE_PROPERTY": "hst:template",
    "DEFAULT_API_URL": "http://localhost:8080/essentials/rest",
    "DEFAULT_SITE_URL": "http://localhost:8080/site/",
    "DEV_MODE_PARAM": "?dev=true",
    "PREVIEW_CONFIGURATION_SUFFIX": "-preview",
    "IFRAME_ID": "#siteIframe"
})
.filter('removePath', function() {
    return function(input) {
        if (input != null) {
            var idx = input.lastIndexOf('/') + 1;
            return input.substring(idx, input.length);
        } else {
            return false;
        }
    };
})
.filter('removeColon', function() {
    return function(input) {
        if (input != null) {
            return input.replace(":", "");
        } else {
            return false;
        }
    };
})
.controller('DevPanelCtrl', DevPanelCtrl);

DevPanelCtrl.$inject = ['$http', 'constants', '$mdDialog', '$rootScope'];

function DevPanelCtrl ($http, constants, $mdDialog, $rootScope) {
    var vm = this;

    // retrieve the component config for URL when site URL form is submitted
    // declare this function before it is called later when variables/URLs are initialized
    vm.changeSiteUrl = function () {
        // change URL of iframe
        angular.element(constants.IFRAME_ID).attr("src", $rootScope.siteUrl);
        loadComponents($rootScope.siteUrl);
    };

    // initialize the site URL and API url on the root scope, as they're globals
    $rootScope.apiUrl = constants.DEFAULT_API_URL;
    $rootScope.siteUrl = constants.DEFAULT_SITE_URL;
    // check for preview HST configuration
    // since application doesn't work with it present, if found, show dialog to ask if configuration can be deleted
    checkPreviewConfiguration();

    // retrieve component configuration for URL
    function loadComponents(url) {
        // add devmode request parameter (otherwise it will return regular HTML)
        url = url + constants.DEV_MODE_PARAM;
        $http.get(url).then(function (response) {
            vm.components = response.data.components;
            vm.pageConfig = response.data;
        });
    }

    // check if there is preview HST configuration
    function checkPreviewConfiguration() {
        var configUrl = $rootScope.apiUrl + constants.API_QUERY_URL;
        $http.post(configUrl, constants.API_HST_PREVIEW_CONFIG_QUERY).then(function (response) {
            // if there are nodes returned, show a dialog asking to delete the preview configuration
            if (response.data.nodes != null && response.data.nodes.length > 0) {
                showDeletePreviewDialog(response.data.nodes);
            // otherwise load the component editor
            } else {
                vm.changeSiteUrl($rootScope.siteUrl);
            }
        });
    }

    // dialog for deleting preview configuration
    function showDeletePreviewDialog(previewNodes) {
        var config = {
            templateUrl: "../../templates/delete-preview-configuration-dialog.template.html",
            // disable closing the dialog by user,
            // because we don't want the user to use the application if there's preview configuration
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        };
        // build dialog
        var confirm = $mdDialog.alert(config)
                .title('Preview configuration found')
                .ariaLabel('Delete preview configuration')
                .textContent('The Dev-X Application does not function properly when preview configuration is present. ' +
                        'By continuing, all preview configuration will be deleted and any unpublished changes will be' +
                        ' LOST. Do you want to delete all preview configuration?')
                .ok('Delete preview configuration');
        // show dialog
        $mdDialog.show(confirm).then(function() {
            // if user confirmed (clicked on delete preview configuration)
            // then loop through the found preview nodes
            for(var i = 0; i < previewNodes.length; i++) {
                // double check here to only delete nodes with -preview as the suffix
                // the xpath query uses jcr:contains which returns nodes with preview anywhere in the name of the node
                if(previewNodes[i].fields != null && previewNodes[i].fields['jcr:path'] != null &&
                        previewNodes[i].fields['jcr:path'].endsWith(constants.PREVIEW_CONFIGURATION_SUFFIX)) {
                    var deleteUrl = $rootScope.apiUrl + constants.API_NODES_URL + previewNodes[i].fields['jcr:path'];
                    deletePreviewConfiguration(deleteUrl);
                }
            }
        }, function () {});
    }

    // delete the preview HST configuration
    function deletePreviewConfiguration(url) {
        $http.delete(url).then(function (response) {
            // load the component editor after the configuration has been removed
            vm.changeSiteUrl($rootScope.siteUrl);
            console.log(url);
        });
    }

    // the iframe posts a message containing the current URL
    // listen for this message so we can get the current URL
    // there is no other way for doing this with CORS disabled
    window.addEventListener("message", receiveMessageFromIframe, false);
    function receiveMessageFromIframe(event) {
        // for Chrome, the origin property is in the event.originalEvent object.
        var origin = event.origin || event.originalEvent.origin;
        // check if origin starts with site URL for security reasons, otherwise skip
        if ($rootScope.siteUrl.startsWith(origin)) {
            // check if URL is different than current site URL, otherwise it will loop
            if ($rootScope.siteUrl != event.data) {
                $rootScope.siteUrl = event.data;
                loadComponents($rootScope.siteUrl);
            }
        }
    }

    // dialog for changing API url
    vm.changeSettings = function () {
        var config =  {
            parent: angular.element("#settings-dialog")
        }
        var confirm = $mdDialog.prompt(config)
                .title('Change settings')
                .ariaLabel('Change settings')
                .textContent('Hippo API URL')
                .initialValue($rootScope.apiUrl)
                .ok('Ok')
                .cancel('Cancel');
        $mdDialog.show(confirm).then(function(result) {
            // change API URL if user clicks OK
            $rootScope.apiUrl = result;
        }, function () {});
    };
}
