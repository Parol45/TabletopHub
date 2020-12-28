package danilius.favorite.games.controller;

import danilius.favorite.games.dto.BridgItDto;
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
        BridgItDto initData;
        if (bridgItService.getMatches().containsKey("1")) {
            initData = bridgItService.getMatches().get("1");
        } else {
            initData = bridgItService.initMatch();
        }
        ModelAndView mnv = new ModelAndView("index");
        mnv.addObject("initData", initData);
        return mnv;
    }
}
