package saxion.nl.springprototype.application.listing;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import saxion.nl.springprototype.application.listing.exception.ListingNotFoundException;
import saxion.nl.springprototype.application.user.User;
import saxion.nl.springprototype.application.user.UserRepository;

import java.util.List;

@Service
public class ListingService {
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public ListingService(ListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    public List<Listing> findAll() {
        return listingRepository.findAll();
    }

    public Listing getById(long id) {
        return listingRepository.findById(id).orElseThrow(() -> new ListingNotFoundException(id));
    }

    public Listing create(Listing listing, Authentication authentication) {
        String username = authentication.getName();
        User author = userRepository.findByUsername(username).orElseThrow();
        listing.setAuthor(author);
        return listingRepository.save(listing);
    }

    public Listing update(long id, Listing updatedListing) {
        Listing existing = getById(id);

        existing.setTitle(updatedListing.getTitle());
        existing.setDescription(updatedListing.getDescription());

        return listingRepository.save(existing);
    }

    public Listing deleteById(long id) {
        Listing existing = getById(id);
        listingRepository.delete(existing);
        return existing;
    }
}
