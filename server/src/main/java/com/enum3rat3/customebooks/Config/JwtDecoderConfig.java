package com.enum3rat3.customebooks.Config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;

@Configuration
public class JwtDecoderConfig {

    @Value("${publisher.jwt.issuer-uri}")
    private String publisherIssuerUri;

    @Value("${consumer.jwt.issuer-uri}")
    private String consumerIssuerUri;

    @Bean
    @Qualifier("publisherJwtDecoder")
    public JwtDecoder publisherJwtDecoder() {
        return JwtDecoders.fromIssuerLocation(publisherIssuerUri);
    }

    @Bean
    @Qualifier("consumerJwtDecoder")
    public JwtDecoder consumerJwtDecoder() {
        return JwtDecoders.fromIssuerLocation(consumerIssuerUri);
    }
}
