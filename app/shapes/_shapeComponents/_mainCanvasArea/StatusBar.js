import React from "react";

function StatusBar({
  lang,
  shapes,
  selectedShape,
  selectedPoint,
  toolMode,
  gridSize,
  moveIncrement,
  history,
  historyIndex,
}) {
  const isEn = lang === "en";

  const t = {
    pointSelected: isEn ? "📍 Point Selected" : "📍 Punt geselecteerd",
    moveArrow: isEn
      ? "Use arrow buttons to move"
      : "Gebruik pijlknoppen om te verplaatsen",
    selected: isEn ? "✓ Selected" : "✓ Geselecteerd",
    mode: isEn ? "ℹ️ Mode" : "ℹ️ Modus",
    selectMove: isEn ? "Select & Move" : "Selecteren & verplaatsen",
    addPoint: isEn ? "Add Point" : "Punt toevoegen",
    deletePoint: isEn ? "Delete Point" : "Punt verwijderen",
    grid: isEn ? "📏 Grid" : "📏 Raster",
    move: isEn ? "Move" : "Stap",
    totalPoints: isEn ? "📊 Total Points" : "📊 Totaal punten",
    history: isEn ? "📜 History" : "📜 Geschiedenis",
  };

  return (
    <div>
      <div className="mt-3 flex justify-between items-center text-sm bg-gray-50 p-3 rounded">
        <div className="font-medium">
          {selectedPoint ? (
            <span className="text-red-600">
              {t.pointSelected}: (
              {Math.round(
                shapes[selectedPoint.shapeIndex]?.points[
                  selectedPoint.pointIndex
                ][0],
              )}
              ,
              {Math.round(
                shapes[selectedPoint.shapeIndex]?.points[
                  selectedPoint.pointIndex
                ][1],
              )}
              ) - {t.moveArrow}
            </span>
          ) : selectedShape ? (
            <span className="text-blue-600">
              {t.selected}: {shapes.find((s) => s.id === selectedShape)?.name}
            </span>
          ) : (
            <span className="text-gray-500">
              {t.mode}:{" "}
              {toolMode === "select"
                ? t.selectMove
                : toolMode === "add-point"
                  ? t.addPoint
                  : t.deletePoint}
            </span>
          )}
        </div>
        <div className="flex gap-4 text-gray-600">
          <span>
            {t.grid}: {gridSize}" | {t.move}: {moveIncrement}"
          </span>
          <span>
            {t.totalPoints}:{" "}
            {shapes.reduce((sum, shape) => sum + shape.points.length, 0)}
          </span>
          <span>
            {t.history}: {historyIndex + 1} / {history.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
