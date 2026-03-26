package saxion.nl.springprototype.application.listing;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Listing> findAll() {
        return listingService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Listing findById(@PathVariable long id) {
        return listingService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Listing addListing(@RequestBody Listing listing, Authentication authentication) {
        return listingService.create(listing, authentication);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public Listing updateListing(@PathVariable long id, @RequestBody Listing listing) {
        return listingService.update(id, listing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Listing deleteListing(@PathVariable long id) {
        return listingService.deleteById(id);
    }
}
