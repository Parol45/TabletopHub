package danilius.favorite.games.service;

import danilius.favorite.games.dto.BridgItDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.*;

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
                (!match.isBlueMove() && color.equals("red")),
                areCoordsInBounds = (i1 >= 0 && i1 < 11) && (j1 >= 0 && j1 < 11) &&
                        (i2 >= 0 && i2 < 11) && (j2 >= 0 && j2 < 11);
        if (!match.isGameEnded() &&
                isAllowedMove &&
                areCoordsInBounds &&
                match.getBoard()[i1][j1].getColor().equals(color) &&
                match.getBoard()[i1][j1].getElementName().equals("dot")) {
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
    
    public boolean haveWon(String color) {
        BridgItDto.BridgItCell[][] board = matches.get("1").getBoard();
        Set<CoordPair> visitedNodes = new HashSet<>(),
                goal = new HashSet<>();
        Queue<CoordPair> queue = new ArrayDeque<>();
        for (int i = 0; i < 5; i++) {
            if (color.equals("blue")) {
                queue.add(new CoordPair(0, 1 + 2 * i));
                goal.add(new CoordPair(10, 1 + 2 * i));
            } else {
                queue.add(new CoordPair(1 + 2 * i, 0));
                goal.add(new CoordPair(1 + 2 * i, 10));
            }
        }
        while (!queue.isEmpty()) {
            CoordPair currentNode = queue.remove();
            int i = currentNode.i,
                    j = currentNode.j;
            if (visitedNodes.stream()
                    .noneMatch(vn -> i == vn.i && j == vn.j)) {
                if (goal.stream()
                        .anyMatch(goalCell -> i == goalCell.i && j == goalCell.j)) {
                    matches.get("1").setGameEnded(true);
                    return true;
                }
                addNeighborNodeToQueue(queue, board, i, j, i - 2, j, i - 1, j);
                addNeighborNodeToQueue(queue, board, i, j, i + 2, j, i + 1, j);
                addNeighborNodeToQueue(queue, board, i, j, i, j - 2, i, j - 1);
                addNeighborNodeToQueue(queue, board, i, j, i, j + 2, i, j + 1);
                visitedNodes.add(currentNode);
            }
        }
        return false;
    }
    
    private void addNeighborNodeToQueue(Queue<CoordPair> queue, BridgItDto.BridgItCell[][] board,
                                        int currI, int currJ,
                                        int newI, int newJ,
                                        int lineI, int lineJ) {
        if (newI <= 10 && newI >= 0 && newJ <= 10 && newJ >= 0 &&
                board[currI][currJ].getColor().equals(board[lineI][lineJ].getColor()) &&
                queue.stream()
                        .noneMatch(vn -> newI == vn.i && newJ == vn.j)) {
            queue.add(new CoordPair(newI, newJ));
        }
    }
    
    @AllArgsConstructor
    public static class CoordPair {
        public final int i;
        public final int j;
    }
    
    public BridgItDto restart() {
        matches.remove("1");
        return initMatch();
    }
}
