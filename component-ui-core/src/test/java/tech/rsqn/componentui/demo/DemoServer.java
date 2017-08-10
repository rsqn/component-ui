package tech.rsqn.componentui.demo;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ErrorHandler;
import org.eclipse.jetty.webapp.WebAppContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/*
This is a copy-paste of EmbeddedJetty in tmp-common to avoid having this project having a fat list of dependencies
 */

public class DemoServer {

    private static final Logger log = LoggerFactory.getLogger(DemoServer.class);
    private List<String> appBaseSearchPaths;
    private int port;
    private String contextPath;

    public static void main (String[] args) {
        DemoServer server = new DemoServer();
        try {
            server.start();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

    public DemoServer() {
        port = 8080;
        contextPath = "/";
        appBaseSearchPaths = new ArrayList<>();
        appBaseSearchPaths.add("src/test/webapp");
        appBaseSearchPaths.add("src/main/webapp");
    }


    public void setAppBaseSearchPaths(List<String> appBaseSearchPaths) {
        this.appBaseSearchPaths = appBaseSearchPaths;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public void setContextPath(String contextPath) {
        this.contextPath = contextPath;
    }

    public void start() throws Exception {
        Server server = null;
        try {
            log.info("Starting EmbeddedJetty on port {}", Integer.valueOf(this.port));
            log.info("Current Working Directory is ", (new File(".")).getAbsolutePath() + " search paths will be relative to this directory");
            server = new Server(this.port);
            WebAppContext context = new WebAppContext();
            File webXml = null;
            ArrayList webXmlPaths = new ArrayList();
            this.appBaseSearchPaths.forEach((s) -> {
                webXmlPaths.add(s + "/WEB-INF/web.xml");
            });

            for(Iterator webDirectory = webXmlPaths.iterator(); webDirectory.hasNext(); webXml = null) {
                String webXmlPath = (String)webDirectory.next();
                webXml = new File(webXmlPath);
                log.info("Looking for webXml at ({} : {})", webXmlPath, webXml.getAbsolutePath());
                if(webXml.exists()) {
                    log.info("Found webXML at ({})", webXml.getAbsolutePath());
                    break;
                }

                log.info("No webXML at ({})", webXmlPath);
            }

            if(webXml == null) {
                log.error("No webXML Found - exiting");
                return;
            }

            File webDirectory1 = webXml.getParentFile().getParentFile();
            log.info("Webdir is at ({})", webDirectory1);
            if(webDirectory1 == null) {
                log.error("No webDir Found - exiting");
                return;
            }

            context.setDescriptor(webXml.getPath());
            context.setResourceBase(webDirectory1.getPath());
            context.setContextPath(this.contextPath);
            context.setParentLoaderPriority(true);
            context.setThrowUnavailableOnStartupException(true);
            server.setHandler(context);
            server.start();
            server.join();
        } catch (Exception fatalException) {
            if ( server != null ) {
                server.stop();
//                System.exit(-1);
            }
            throw fatalException;
        }

    }
}
