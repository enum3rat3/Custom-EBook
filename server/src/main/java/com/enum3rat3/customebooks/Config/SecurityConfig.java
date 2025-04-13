package com.enum3rat3.customebooks.Config;

import com.enum3rat3.customebooks.Service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain publisherFilterChain(
            HttpSecurity http,
            @Qualifier("publisherJwtDecoder") JwtDecoder jwtDecoder, UserService userService) throws Exception {

        http.cors() // 🔥 enable CORS using your CorsFilter bean
                .and()
                .csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/api/publisher/**")
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().hasRole("publisher")
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder)
                                .jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter(userService))
                        )
                );

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain consumerFilterChain(
            HttpSecurity http,
            @Qualifier("consumerJwtDecoder") JwtDecoder jwtDecoder, UserService userService) throws Exception {

        http
                .cors() // 🔥 enable CORS using your CorsFilter bean
                .and()
                .securityMatcher("/api/consumer/**")
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/consumer/books","/api/consumer/book/**").permitAll() // 👈 public access
                        .anyRequest().hasRole("consumer")
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder)
                                .jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter(userService))
                        )
                );

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000","http://localhost:4000")); // Allow React frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
