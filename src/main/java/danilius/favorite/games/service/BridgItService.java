package danilius.favorite.games.service;

import danilius.favorite.games.dto.BridgItDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class BridgItService {

    @Getter
    private final Map<String, BridgItDto> matches;

    public BridgItDto initMatch() {
        BridgItDto.BridgItCell[][] board = new BridgItDto.BridgItCell[11][11];
        for (int i = 0; i < 11; i++) {
            for (int j = 0; j < 11; j++) {
                if ((i + j) % 2 != 0) {
                    board[i][j] = new BridgItDto.BridgItCell(i % 2 == 1 ? "red" : "blue", "dot");
                } else if ((j == 0 || j == 10) && i < 9 && i > 1) {
                    board[i][j] = new BridgItDto.BridgItCell("red", "vertical line");
                } else if ((i == 0 || i == 10) && j < 9 && j > 1) {
                    board[i][j] = new BridgItDto.BridgItCell("blue", "horizontal line");
                } else {
                    board[i][j] = new BridgItDto.BridgItCell("", "nothing");
                }
            }
        }
        BridgItDto match = new BridgItDto(board, true, false);
        matches.put("1", match);
        return match;
    }

    @Nullable
    public BridgItDto.BridgItCell makeMove(String color, int i1, int j1, int i2, int j2) {
        BridgItDto match = matches.get("1");
        BridgItDto.BridgItCell result = null;
        boolean isAllowedMove = (match.isBlueMove() && color.equals("blue")) ||
                                (!match.isBlueMove() && color.equals("red"));
        if (!match.isGameEnded() &&
                isAllowedMove &&
                match.getBoard()[i1][j1].getColor().equals(color) &&
                match.getBoard()[i1][j1].getElementName().equals("dot") &&
                match.getBoard()[i2][j2].getElementName().equals("dot")) {
            boolean isVertical = j1 == j2 && Math.abs(i1 - i2) == 2,
                    isHorizontal = i1 == i2 && Math.abs(j1 - j2) == 2;
            if (isVertical || isHorizontal) {
                int i = (i1 + i2) / 2,
                    j = (j1 + j2) / 2;
                if (match.getBoard()[i][j].getElementName().equals("nothing")) {
                    String elementName = isHorizontal ? "horizontal line" : "vertical line";
                    result = new BridgItDto.BridgItCell(color, elementName);
                    match.getBoard()[i][j] = result;
                    match.setBlueMove(!match.isBlueMove());
                }
            }
        }
        return result;
    }

    public boolean isWinningMove(String color, int i1, int j1, int i2, int j2) {

        return false;
    }

    public BridgItDto restart() {
        matches.remove("1");
        return initMatch();
    }
}
