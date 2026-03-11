package saxion.nl.springprototype.application.notification;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/receiver/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Notification> findByReceiverId(@PathVariable long id) {
        return notificationService.findByReceiverId(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Notification getById(@PathVariable long id) {
        return notificationService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(@RequestBody Notification notification) {
        return notificationService.create(notification);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Notification update(@PathVariable long id, @RequestBody Notification updatedNotification) {
        return notificationService.update(id, updatedNotification);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        notificationService.delete(id);
    }
}
