/*
 * Copyright 2016 Hippo B.V. (http://www.onehippo.com)
 */

package org.onehippo.devx.webservices.webfiles;

/**
 * Exception that can be thrown if an exception occurs due to misconfiguration.
 */
public class ConfigurationException extends RuntimeException {
    public ConfigurationException(final String message, final Throwable cause) {
        super(message, cause);
    }

    public ConfigurationException(final String message) {
        super(message);
    }
}
