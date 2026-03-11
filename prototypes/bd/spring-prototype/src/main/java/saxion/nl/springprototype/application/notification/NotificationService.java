package saxion.nl.springprototype.application.notification;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> findByReceiverId(long receiverId) {
        return notificationRepository.findByReceiverId(receiverId);
    }

    public Notification getById(long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public Notification create(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification update(long id, Notification updatedNotification) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setReceiver(updatedNotification.getReceiver());
        notification.setMessage(updatedNotification.getMessage());

        return notificationRepository.save(notification);
    }

    public void delete(long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }
}
