package com.enum3rat3.customebooks.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dkkfqldh3",
                "api_key", "628897397559848",
                "api_secret", "V6VQINLjqB6APhBmUMFIPZ0uQ7M",
                "secure", true
        ));
    }
}