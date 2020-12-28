package danilius.favorite.games.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Value;
import reactor.core.publisher.Sinks;

@Data
@AllArgsConstructor
public class BridgItDto {
    private Cell[][] board;
    private boolean blueMove, gameEnded;
    private transient Sinks.Many<Move> moveSink;

    @Value
    @AllArgsConstructor
    public static class Cell {
        String color;
        String elementName;
    }
    
    @Value
    @AllArgsConstructor
    public static class Move {
        int i;
        int j;
        Cell cell;
        boolean winning;
    }
}
