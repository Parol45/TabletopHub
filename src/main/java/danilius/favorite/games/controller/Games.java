package danilius.favorite.games.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Games {

    @GetMapping("/bridge-it")
    public String bridgeIt() {
        return "bridge-it";
    }
}
