package danilius.favorite.games.controller;

import danilius.favorite.games.service.BridgItService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@AllArgsConstructor
public class Games {

    private final BridgItService bridgItService;

    @GetMapping("/")
    public ModelAndView index() {
        ModelAndView mnv = new ModelAndView("index");
        mnv.addObject("initData", bridgItService.initMatch());
        return mnv;
    }
}
