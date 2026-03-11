export const getShapeTourSteps = (isEn, refs) => [
  {
    title: isEn ? "Show / Hide Templates" : "Sjablonen tonen/verbergen",
    description: isEn
      ? "Toggle pre-built shape templates to quickly start your design."
      : "Schakel vooraf gebouwde vormensjablonen in om snel uw ontwerp te starten.",
    target: () => refs.ref1.current,
  },
  {
    title: isEn ? "Move Shape" : "Vorm verplaatsen",
    description: isEn
      ? "Move Shape: Drag the entire shape to reposition it on the canvas."
      : "Vorm verplaatsen: Sleep de hele vorm om deze opnieuw te positioneren.",
    target: () => refs.ref2.current,
  },
  {
    title: isEn ? "Select Point" : "Selecteer punt",
    description: isEn
      ? "Select Point: Click on any corner point to select and edit it."
      : "Selecteer punt: Klik op een hoekpunt om het te selecteren en te bewerken.",
    target: () => refs.ref3.current,
  },
  {
    title: isEn ? "Add Point" : "Punt toevoegen",
    description: isEn
      ? "Add Point: Click on a shape edge to insert a new corner point."
      : "Punt toevoegen: Klik op een vormlijn om een nieuw hoekpunt in te voegen.",
    target: () => refs.ref4.current,
  },
  {
    title: isEn ? "Delete Point" : "Punt verwijderen",
    description: isEn
      ? "Delete Point: Click on an existing point to remove it from the shape."
      : "Punt verwijderen: Klik op een bestaand punt om het van de vorm te verwijderen.",
    target: () => refs.ref5.current,
  },
  {
    title: isEn ? "Round by Drag" : "Afronden door slepen",
    description: isEn
      ? "Round corners by dragging: Select two points, then drag to set the rounding radius."
      : "Hoeken afronden door slepen: Selecteer twee punten en sleep om de afronding in te stellen.",
    target: () => refs.ref6.current,
  },
  {
    title: isEn ? "Auto Square" : "Automatisch rechthoeken",
    description: isEn
      ? "Auto Square: Automatically align all edges to 90° angles for a perfect rectangle."
      : "Automatisch rechthoeken: Lijn alle randen automatisch uit op 90° hoeken.",
    target: () => refs.ref7.current,
  },
  {
    title: isEn ? "Dimension Input" : "Afmetingen invoer",
    description: isEn
      ? "Enter exact width and height dimensions for your shape here."
      : "Voer hier de exacte breedte- en hoogte-afmetingen voor uw vorm in.",
    target: () => refs.ref11.current,
  },
  {
    title: isEn ? "Navigation" : "Navigatie",
    description: isEn
      ? "Use Next / Previous to move between steps: Draw → Holes → Material → Review → Order."
      : "Gebruik Volgende / Vorige om tussen stappen te navigeren: Tekenen → Gaten → Materiaal → Beoordeling → Bestelling.",
    target: () => refs.ref12.current,
  },
];

export const getMoveIncrementTourSteps = (isEn, refs) => [
  {
    title: isEn ? "Move Increment" : "Verplaatsingsincrement",
    description: isEn
      ? "Set the step size (in inches) for precise arrow-key point movement."
      : "Stel de stapgrootte (in inches) in voor nauwkeurige puntverplaatsing.",
    target: () => refs.ref8.current,
  },
  {
    title: isEn ? "Arrow Movement" : "Pijlbeweging",
    description: isEn
      ? "Use arrow buttons to nudge the selected point precisely in any direction."
      : "Gebruik pijlknoppen om het geselecteerde punt precies in elke richting te verschuiven.",
    target: () => refs.ref9.current,
  },
  {
    title: isEn ? "Deselect & Delete Point" : "Deselecteren & punt verwijderen",
    description: isEn
      ? "Deselect the current point or permanently delete it from the shape."
      : "Deselecteer het huidige punt of verwijder het permanent van de vorm.",
    target: () => refs.ref10.current,
  },
];

export const getHolesTourSteps = (isEn, refs) => [
  {
    title: isEn ? "Add Drilling Hole" : "Boorgat toevoegen",
    description: isEn
      ? "Click this button to activate hole-placement mode, then click inside the shape on the canvas to place a hole."
      : "Klik op deze knop om de gatplaatsingsmodus te activeren en klik vervolgens in de vorm op het canvas om een gat te plaatsen.",
    target: () => refs.refAddBtn.current,
  },
];

export const getMaterialTourSteps = (isEn, refs) => [
  {
    title: isEn ? "Select Material" : "Materiaal selecteren",
    description: isEn
      ? "Choose your desired material type from the available options. Each material has different properties and pricing."
      : "Kies uw gewenste materiaaltype uit de beschikbare opties. Elk materiaal heeft andere eigenschappen en prijzen.",
    target: () => refs.refMaterial.current,
  },
  {
    title: isEn ? "Select Color" : "Kleur selecteren",
    description: isEn
      ? "Pick a color for your material from the standard color palette. The selected color will be highlighted with a blue ring."
      : "Kies een kleur voor uw materiaal uit het standaard kleurenpalet. De geselecteerde kleur wordt gemarkeerd met een blauwe ring.",
    target: () => refs.refColor.current,
  },
  {
    title: isEn ? "Select Finish" : "Afwerking selecteren",
    description: isEn
      ? "Choose a surface finish such as Polished, Matte, or Brushed to define the final look and texture of your material."
      : "Kies een oppervlakteafwerking zoals Gepolijst, Mat of Geborsteld om het uiterlijk en de textuur van uw materiaal te bepalen.",
    target: () => refs.refFinish.current,
  },
];

export const getMaterialThecknessTourSteps = (isEn, refs) => [
  {
    title: isEn ? "Select Thickness" : "Dikte selecteren",
    description: isEn
      ? "After selecting a material, choose the thickness variant. Each variant shows the price per square metre."
      : "Kies na het selecteren van een materiaal de dikte. Elke variant toont de prijs per vierkante meter.",
    target: () => refs.refThickness.current,
  },
];

export const getCanvasTourSteps = (isEn, refs) => [
  {
    title: isEn ? "Undo" : "Ongedaan maken",
    description: isEn
      ? "Undo your last action. Click repeatedly to step back through your edit history."
      : "Maak uw laatste actie ongedaan. Klik meerdere keren om terug te gaan door uw bewerkingsgeschiedenis.",
    target: () => refs.refUndo.current,
  },
  {
    title: isEn ? "Redo" : "Opnieuw uitvoeren",
    description: isEn
      ? "Redo an action that was previously undone. Steps forward through your edit history."
      : "Voer een eerder ongedaan gemaakte actie opnieuw uit. Stap voorwaarts door uw bewerkingsgeschiedenis.",
    target: () => refs.refRedo.current,
  },
  {
    title: isEn ? "Zoom In" : "Inzoomen",
    description: isEn
      ? "Zoom into the canvas to see your shape in more detail."
      : "Zoom in op het canvas om uw vorm gedetailleerder te bekijken.",
    target: () => refs.refZoomIn.current,
  },
  {
    title: isEn ? "Zoom Out" : "Uitzoomen",
    description: isEn
      ? "Zoom out of the canvas to get a wider view of your design."
      : "Zoom uit op het canvas voor een breder overzicht van uw ontwerp.",
    target: () => refs.refZoomOut.current,
  },
  {
    title: isEn ? "Reset Zoom" : "Zoom resetten",
    description: isEn
      ? "Reset the canvas zoom back to 100% — the default view."
      : "Zet de canvaszoom terug naar 100% — de standaardweergave.",
    target: () => refs.refResetZoom.current,
  },
  {
    title: isEn ? "Total Area" : "Totaal oppervlak",
    description: isEn
      ? "Displays the total surface area of all visible shapes combined, measured in square metres."
      : "Toont het totale oppervlak van alle zichtbare vormen samen, gemeten in vierkante meter.",
    target: () => refs.refArea.current,
  },
];
