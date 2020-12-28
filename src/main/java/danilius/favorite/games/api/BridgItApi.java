package danilius.favorite.games.api;

import danilius.favorite.games.dto.BridgItDto;
import danilius.favorite.games.service.BridgItService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

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
    public ResponseEntity<BridgItDto.Cell> makeMove(@RequestParam String color,
                                                    @RequestParam int i1, @RequestParam int j1,
                                                    @RequestParam int i2, @RequestParam int j2) {
        BridgItDto.Cell newLine = bridgItService.makeMove("1", color, i1, j1, i2, j2);
        return new ResponseEntity<>(newLine, newLine != null ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @GetMapping(value = "subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<BridgItDto.Move> subscribeToMoveStream() {
        return bridgItService.getMatches().get("1").getMoveSink().asFlux();
    }
    
    @GetMapping("restart")
    public BridgItDto restartGame() {
        return bridgItService.restart();
    }
}
