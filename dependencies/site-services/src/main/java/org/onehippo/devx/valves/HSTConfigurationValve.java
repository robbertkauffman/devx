/*
 *  Copyright 2011-2017 Hippo B.V. (http://www.onehippo.com)
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.onehippo.devx.valves;

import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hippoecm.hst.configuration.components.HstComponentInfo;
import org.hippoecm.hst.container.valves.AbstractOrderableValve;
import org.hippoecm.hst.core.component.HstComponent;
import org.hippoecm.hst.core.component.HstComponentException;
import org.hippoecm.hst.core.component.HstComponentMetadata;
import org.hippoecm.hst.core.component.HstResponseState;
import org.hippoecm.hst.core.container.ContainerException;
import org.hippoecm.hst.core.container.HstComponentWindow;
import org.hippoecm.hst.core.container.ValveContext;

public class HSTConfigurationValve extends AbstractOrderableValve {
    private final static String DEV_MODE_PARAM = "dev=true";
    private final static String DEV_MODE_TEMPLATE = "classpath:/org/onehippo/devx/hst-config-valve.ftl";

    public HSTConfigurationValve() {
    }

    public void invoke(ValveContext context) throws ContainerException {
        HttpServletRequest servletRequest = context.getServletRequest();

        final HstComponentWindow window = context.getRootComponentWindow();

        if(checkDevMode(servletRequest)) {
            window.getChildWindowMap().clear();
            HstComponentWindow newWindow = new HstComponentWindow() {
                public String getName() {
                    return window.getName();
                }

                public String getReferenceName() {
                    return window.getReferenceName();
                }

                public String getReferenceNamespace() {
                    return window.getReferenceNamespace();
                }

                public String getComponentName() {
                    return window.getComponentName();
                }

                public HstComponent getComponent() {
                    return window.getComponent();
                }

                public HstComponentMetadata getComponentMetadata() {
                    return window.getComponentMetadata();
                }

                public boolean hasComponentExceptions() {
                    return window.hasComponentExceptions();
                }

                public List<HstComponentException> getComponentExceptions() {
                    return window.getComponentExceptions();
                }

                public void addComponentExcpetion(final HstComponentException e) {
                    window.addComponentExcpetion(e);
                }

                public void clearComponentExceptions() {
                    window.clearComponentExceptions();
                }

                public String getRenderPath() {
                    return DEV_MODE_TEMPLATE;
                }

                public String getNamedRenderer() {
                    return window.getNamedRenderer();
                }

                public String getServeResourcePath() {
                    return window.getServeResourcePath();
                }

                public String getNamedResourceServer() {
                    return window.getNamedResourceServer();
                }

                public String getParameter(final String s) {
                    return window.getParameter(s);
                }

                public String getLocalParameter(final String s) {
                    return window.getLocalParameter(s);
                }

                public HstComponentWindow getParentWindow() {
                    return window.getParentWindow();
                }

                public Map<String, HstComponentWindow> getChildWindowMap() {
                    return window.getChildWindowMap();
                }

                public List<String> getChildWindowNames() {
                    return window.getChildWindowNames();
                }

                public HstComponentWindow getChildWindow(final String s) {
                    return window.getChildWindow(s);
                }

                public HstComponentWindow getChildWindowByReferenceName(final String s) {
                    return window.getChildWindowByReferenceName(s);
                }

                public void bindResponseState(final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse) {
                    window.bindResponseState(httpServletRequest, httpServletResponse);
                }

                public HstResponseState getResponseState() {
                    return window.getResponseState();
                }

                public HstComponentInfo getComponentInfo() {
                    return window.getComponentInfo();
                }

                public Object getAttribute(final String s) {
                    return window.getAttribute(s);
                }

                public void setAttribute(final String s, final Object o) {
                    window.setAttribute(s, o);
                }

                public Object removeAttribute(final String s) {
                    return window.removeAttribute(s);
                }

                public Enumeration<String> getAttributeNames() {
                    return window.getAttributeNames();
                }

                public String getPageErrorHandlerClassName() {
                    return window.getPageErrorHandlerClassName();
                }

                public boolean isVisible() {
                    return window.isVisible();
                }

                public void setVisible(final boolean b) {
                    window.setVisible(b);
                }

                public void removeChildWindow(final HstComponentWindow hstComponentWindow) {
                    window.removeChildWindow(hstComponentWindow);
                }
            };
            context.setRootComponentWindow(newWindow);
        }
        context.invokeNext();
    }

    private boolean checkDevMode(HttpServletRequest servletRequest) {
        if(servletRequest.getQueryString() != null) {
            Set<String> queryParams = new HashSet<String>(Arrays.asList(servletRequest.getQueryString().split("&")));
            if (queryParams.contains(DEV_MODE_PARAM)) {
                return true;
            }
        }
        return false;
    }
}