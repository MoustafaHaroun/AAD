package saxion.nl.springprototype.application.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import saxion.nl.springprototype.application.user.dto.RegisterRequest;
import saxion.nl.springprototype.infrastructure.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        // For prototype: hardcode user/password
        String hardcodedUser = "admin";
        String hardcodedPass = passwordEncoder.encode("admin");

        if (!request.username().equals(hardcodedUser) ||
                !passwordEncoder.matches(request.password(), hardcodedPass)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(request.username());
        return Map.of("token", token);
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        return userRepository.save(user);
    }
}
