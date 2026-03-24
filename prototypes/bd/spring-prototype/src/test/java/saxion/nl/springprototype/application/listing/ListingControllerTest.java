package saxion.nl.springprototype.application.listing;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@WebMvcTest(ListingController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ListingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ListingRepository repository;

    @Test
    void testFindAll() throws Exception {
        Listing listing = new Listing();
        listing.setTitle("Test");
        listing.setDescription("Desc");

        when(repository.findAll()).thenReturn(List.of(listing));

        mockMvc.perform(get("/api/listings/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test"))
                .andExpect(jsonPath("$[0].description").value("Desc"));
    }

    @Test
    void testFindById() throws Exception {
        Listing listing = new Listing();
        listing.setTitle("Test");
        listing.setDescription("Desc");

        when(repository.findById(listing.getId())).thenReturn(Optional.of(listing));

        mockMvc.perform(get("/api/listings/" + listing.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test"))
                .andExpect(jsonPath("$.description").value("Desc"));

    }


    @Test
    void testAddListing() throws Exception {
        Listing listing = new Listing();
        listing.setTitle("New Listing");
        listing.setDescription("New Description");

        when(repository.save(any(Listing.class))).thenReturn(listing);

        mockMvc.perform(post("/api/listings/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New Listing\",\"description\":\"New Description\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Listing"))
                .andExpect(jsonPath("$.description").value("New Description"));
    }
}
