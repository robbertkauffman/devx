/*
 *  Copyright 2014-2016 Hippo B.V. (http://www.onehippo.com)
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
package org.onehippo.devx.appenders;

import org.hippoecm.hst.core.channelmanager.AbstractComponentWindowResponseAppender;
import org.hippoecm.hst.core.channelmanager.ComponentWindowResponseAppender;
import org.hippoecm.hst.core.component.HstRequest;
import org.hippoecm.hst.core.component.HstResponse;
import org.hippoecm.hst.core.container.HstComponentWindow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Element;

public class IframeMessagerResponseAppender extends AbstractComponentWindowResponseAppender implements ComponentWindowResponseAppender {

    private static final String IFRAME_MESSAGER_KEY_HINT = IframeMessagerResponseAppender.class.getName() + ".iframeMessager";
    private static final String SCRIPT_CONTENT = "parent.postMessage(window.location.href, \"*\");";

    private static final Logger log = LoggerFactory.getLogger(IframeMessagerResponseAppender.class);

    @Override
    public void process(final HstComponentWindow rootWindow,
                        final HstComponentWindow rootRenderingWindow,
                        final HstComponentWindow window,
                        final HstRequest request,
                        final HstResponse response) {

        final boolean isComponentRenderingRequest = (request.getRequestContext().getBaseURL().getComponentRenderingWindowReferenceNamespace() != null);
        if (isComponentRenderingRequest) {
            log.debug("No iframe-messager head element will be added for component rendering request");
            return;
        }

        // only process it for top window
        if (!isTopHstResponse(rootWindow, rootRenderingWindow, window)) {
            return;
        }

        if (!response.containsHeadElement(IFRAME_MESSAGER_KEY_HINT)) {
            final Element iframeMessagerScript = getIframeMessagerScriptElement(request, response);
            if (iframeMessagerScript != null) {
                log.info("Append iframe-messager script");
                response.addHeadElement(iframeMessagerScript, IFRAME_MESSAGER_KEY_HINT);
            }
        }
    }

    private Element getIframeMessagerScriptElement(final HstRequest request, final HstResponse response) {
        try {
            final Element headElement = response.createElement("script");
            headElement.setAttribute("type", "text/javascript");
            headElement.setTextContent(SCRIPT_CONTENT);
            return headElement;
        } catch (IllegalArgumentException e) {
            log.warn("Failed to append iframe-messager script", e);
        }
        return null;
    }
}
