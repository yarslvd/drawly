import { Coordinates } from "@/types/types";
import { Tool } from "@/data/ToolsClass";

export class Move extends Tool {
  protected onMove(start: Coordinates, end: Coordinates): void {}

  protected onDown(point: Coordinates): void {}

  protected onUp(point: Coordinates): void {}
}
