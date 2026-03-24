package saxion.nl.springprototype.application.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import saxion.nl.springprototype.application.listing.Listing;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverId(Long id);
}
