package saxion.nl.springprototype.application.listing.exception;


import org.springframework.http.HttpStatus;
import saxion.nl.springprototype.infrastructure.exception.DomainException;

public class ListingNotFoundException extends DomainException {
    public ListingNotFoundException(long id) {
        super("LISTING_NOT_FOUND", "Listing with id " + id + " not found", HttpStatus.NOT_FOUND);
    }
}
