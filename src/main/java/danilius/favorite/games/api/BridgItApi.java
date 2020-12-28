package danilius.favorite.games.api;

import danilius.favorite.games.dto.BridgItDto;
import danilius.favorite.games.service.BridgItService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<BridgItDto.BridgItCell> makeMove(@RequestParam String color,
                            @RequestParam int i1, @RequestParam int j1,
                            @RequestParam int i2, @RequestParam int j2) {
        BridgItDto.BridgItCell result = bridgItService.makeMove(color, i1, j1, i2, j2);
        boolean isGameEnded = bridgItService.isWinningMove(color, i1, j1, i2, j2);
        return result != null ?
                isGameEnded ? new ResponseEntity<>(result, HttpStatus.ACCEPTED) : new ResponseEntity<>(result, HttpStatus.OK)
                :
                new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("restart")
    public BridgItDto restartGame() {
        return bridgItService.restart();
    }
}
