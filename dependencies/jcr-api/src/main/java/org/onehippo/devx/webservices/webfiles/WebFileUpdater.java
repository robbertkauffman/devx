package org.onehippo.devx.webservices.webfiles;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.onehippo.cms7.services.webfiles.util.WatchFilesUtils;
import org.onehippo.cms7.services.webfiles.watch.WebFilesWatcherConfig;
import org.onehippo.cms7.services.webfiles.watch.WebFilesWatcherJcrConfig;
import org.slf4j.Logger;

import static org.slf4j.LoggerFactory.getLogger;


public class WebFileUpdater {
    private static Logger log = getLogger(WebFileUpdater.class);
    public static final String WEBFILE_REPO_PREFIX = "/webfiles/";
    public static final String WEBFILE_PROP_SUFFIX = "/jcr:content";
    public static final String WEBFILE_CONFIG_NODE = "/hippo:configuration/hippo:modules/webfiles/hippo:moduleconfig";

    public static boolean update(final Session session, final Node node, String template) throws RepositoryException, IOException {
        final String nodePath = node.getPath();
        if (!nodePath.startsWith(WEBFILE_REPO_PREFIX)) {
            return false;
        }
        String localPath;
        if (nodePath.endsWith(WEBFILE_PROP_SUFFIX)) {
            localPath = nodePath.substring(WEBFILE_REPO_PREFIX.length(), nodePath.length() - WEBFILE_PROP_SUFFIX.length());
        } else {
            localPath = nodePath.substring(WEBFILE_REPO_PREFIX.length());
        }
        Path path = getWebFileRootDir(session, localPath);
        for (String component : localPath.split("/")) {
            if (!isSafe(component)) {
                throw new RepositoryException("Unsafe path component in webfile path for node " + nodePath);
            }
            path = path.resolve(component);
        }
        log.info("Saving {} to {}", node, path);
        path.getParent().toFile().mkdirs();
        try (FileWriter writer = new FileWriter(path.toFile())) {
            writer.write(template);
        }
        return true;
    }

    protected static Path getWebFileRootDir(Session session, String forFile) throws RepositoryException {
        final Node configNode = session.getNode(WEBFILE_CONFIG_NODE);
        final WebFilesWatcherConfig webfilesConfig = new WebFilesWatcherJcrConfig(configNode);
        final Path projectBaseDir = WatchFilesUtils.getProjectBaseDir();
        final List<Path> webFilesDirectories = WatchFilesUtils.getWebFilesDirectories(projectBaseDir, webfilesConfig);
        switch (webFilesDirectories.size()) {
            case 1:
                return webFilesDirectories.get(0);
            case 0:
                final String message_0 = "Cannot find a webfiles directory to create '%s' in";
                throw new ConfigurationException(String.format(message_0, forFile));
            default:
                final String message_n = "Multiple webfiles directories available, don't know which to create '%s' in";
                throw new ConfigurationException(String.format(message_n, forFile));
        }
    }
    /**
     * Verify that the given path component only contains characters that are safe to use in file names.
     * @return true if safe.
     */
    public static boolean isSafe(String pathComponent) {
        if (pathComponent == null) {
            return false;
        }
        if (!pathComponent.trim().equals(pathComponent)) {
            return false;
        }
        return pathComponent.matches("\\w([- .]|\\w)*");
    }
}