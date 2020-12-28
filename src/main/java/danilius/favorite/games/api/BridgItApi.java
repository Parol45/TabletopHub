package danilius.favorite.games.api;

import danilius.favorite.games.dto.BridgItDto;
import danilius.favorite.games.service.BridgItService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bridg-it/")
@AllArgsConstructor
public class BridgItApi {

    private final BridgItService bridgItService;

    @GetMapping("state")
    public BridgItDto getState() {
        return bridgItService.getMatches().get("1");
    }

    @PostMapping("move")
    public BridgItDto.BridgItCell makeMove(@RequestParam String color,
                            @RequestParam int i1, @RequestParam int j1,
                            @RequestParam int i2, @RequestParam int j2) {
        return bridgItService.makeMove(color, i1, j1, i2, j2);
    }

    @GetMapping("restart")
    public BridgItDto restartGame() {
        return bridgItService.restart();
    }
}
