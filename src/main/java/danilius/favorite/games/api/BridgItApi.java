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
        BridgItDto.BridgItCell newLine = bridgItService.makeMove(color, i1, j1, i2, j2);
        HttpStatus status;
        if (newLine != null) {
            if (bridgItService.haveWon(color)) {
                status = HttpStatus.ACCEPTED;
            } else {
                status = HttpStatus.OK;
            }
        } else {
            status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(newLine, status);
    }

    @GetMapping("restart")
    public BridgItDto restartGame() {
        return bridgItService.restart();
    }
}
