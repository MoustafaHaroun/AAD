package saxion.nl.springprototype.infrastructure.seeder;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import saxion.nl.springprototype.application.listing.Listing;
import saxion.nl.springprototype.application.listing.ListingRepository;
import saxion.nl.springprototype.application.user.User;
import saxion.nl.springprototype.application.user.UserRepository;

import java.util.Optional;

@Component
public class ListingSeeder implements CommandLineRunner {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public ListingSeeder(ListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (listingRepository.count() == 0) {
            // Fetch some users to assign as authors
            Optional<User> admin = userRepository.findByUsername("admin");
            Optional<User> user = userRepository.findByUsername("user");

            if (admin.isPresent() && user.isPresent()) {
                Listing l1 = new Listing("Spring Boot Tips", "Some useful Spring Boot tips for beginners.");
                l1.setAuthor(admin.orElse(null));

                Listing l2 = new Listing("Vue.js Tricks", "Tips for building reactive interfaces with Vue.");
                l2.setAuthor(user.orElse(null));

                Listing l3 = new Listing("Docker Guide", "A simple guide to Docker containers.");
                l3.setAuthor(admin.orElse(null));

                listingRepository.save(l1);
                listingRepository.save(l2);
                listingRepository.save(l3);

                System.out.println("Seeded sample listings.");
            }
        }
    }
}
