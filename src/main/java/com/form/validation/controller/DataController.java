package com.form.validation.controller;

import com.form.validation.entity.DataEntity;
import com.form.validation.repository.DataRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@Controller
public class DataController {

    private static final Logger logger = LoggerFactory.getLogger(DataController.class);

    @Autowired
    private DataRepository dataRepository;

    @GetMapping("/")
    public String home() {
        logger.info("Home Page");
        return "login";
    }
    @GetMapping("/sign")
    public String sign(Model model) {
        DataEntity data = new DataEntity();
        List<String> city = Arrays.asList("Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal");
        model.addAttribute("listc", city);
        logger.info("signup Page");
        model.addAttribute("data", data);
        return "signup";
    }


    @RequestMapping(path = "/signupData", method = RequestMethod.POST)
    public String home(@ModelAttribute("data") DataEntity data) {
        dataRepository.save(data);
        logger.info("Data saved");
        logger.info("Login Page");
        return "login";
    }



    @PostMapping(value = "/log")
    public String postLogin( HttpServletRequest httpServletRequest, @RequestParam String username, @RequestParam String password, Model model) {
        DataEntity user = dataRepository.findByUsernameAndPassword(username, password);
        if (user != null) {
            logger.info("successfully log in ");
            return "home";
        } else {
            logger.info("Invalid username or password");
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }
    }
}
