package saxion.nl.springprototype.infrastructure.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupLoggingListener {

    private static final Logger logger = LoggerFactory.getLogger(StartupLoggingListener.class);

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        logger.info("Server started and ready to accept requests");
    }
}
