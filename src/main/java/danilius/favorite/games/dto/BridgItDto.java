package danilius.favorite.games.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Value;

@Data
@AllArgsConstructor
public class BridgItDto {
    private BridgItCell[][] board;
    private boolean blueMove, gameEnded;

    @Value
    @AllArgsConstructor
    public static class BridgItCell {
        String color;
        String elementName;
    }
}
