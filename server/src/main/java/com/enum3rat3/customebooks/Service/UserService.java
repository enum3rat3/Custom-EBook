package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.Repo.ConsumerRepo;
import com.enum3rat3.customebooks.Repo.PublisherRepo;
import com.enum3rat3.customebooks.model.Consumer;
import com.enum3rat3.customebooks.model.Publisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final PublisherRepo publisherRepository;
    private final ConsumerRepo consumerRepository;

    public UserService(PublisherRepo publisherRepository, ConsumerRepo consumerRepository) {
        this.publisherRepository = publisherRepository;
        this.consumerRepository = consumerRepository;
    }

    @Transactional
    public void syncUserFromJwt(Jwt jwt, List<String> roles) {

        String firstName = jwt.getClaimAsString("preferred_username");
        String lastName= jwt.getClaimAsString("family_name");
        String email = jwt.getClaimAsString("email");

        if (roles.contains("publisher") && !publisherRepository.findByEmail(email)) {
            Publisher publisher = new Publisher();

            publisher.setFirstName(firstName);
            publisher.setLastName(lastName);
            publisher.setEmail(email);
            publisherRepository.save(publisher);
        }

        if (roles.contains("consumer") && !consumerRepository.findByEmail(email)) {
            Consumer consumer = new Consumer();
            consumer.setFirstName(firstName);
            consumer.setLastName(lastName);
            consumer.setEmail(email);
            consumerRepository.save(consumer);
        }
    }

    @Transactional(readOnly = true)
    public List<String> extractRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");

        if (realmAccess == null || realmAccess.get("roles") == null) {
            return List.of();
        }

        return (List<String>) realmAccess.get("roles");
    }
}