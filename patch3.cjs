const fs = require('fs');
let content = fs.readFileSync('src/components/CemeteryMap.tsx', 'utf8');

const replacement = `  { id: 'b8', name: 'TPU Legok Ciseureuh', city: 'Bandung', lat: -6.9532, lng: 107.6186 },
  { id: 'b9', name: 'TPU Nagrog', city: 'Bandung', lat: -6.9184, lng: 107.6974 },
  { id: 'b10', name: 'TPU Babakan Ciparay', city: 'Bandung', lat: -6.9388, lng: 107.5758 },
  { id: 'b11', name: 'TPU Rancacili', city: 'Bandung', lat: -6.9546, lng: 107.6627 },
  { id: 'b12', name: 'TPU Porib', city: 'Bandung', lat: -6.9254, lng: 107.5888 },
  { id: 'b13', name: 'TPU Gumuruh', city: 'Bandung', lat: -6.9348, lng: 107.6321 },
  { id: 'b14', name: 'TPU Kopo', city: 'Bandung', lat: -6.9423, lng: 107.5826 },
];`;

content = content.replace(/  \{ id: 'b8', name: 'TPU Legok Ciseureuh', city: 'Bandung', lat: -6\.9532, lng: 107\.6186 \},\n  \{ id: 'b9', name: 'TPU Nagrog', city: 'Bandung', lat: -6\.9184, lng: 107\.6974 \},\n  \/\/ Jakarta[\s\S]*?\];/m, replacement);

fs.writeFileSync('src/components/CemeteryMap.tsx', content);
