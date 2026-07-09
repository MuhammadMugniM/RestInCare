const fs = require('fs');
let content = fs.readFileSync('src/components/CemeteryMap.tsx', 'utf8');

const replacement = `  { id: 'b8', name: 'TPU Legok Ciseureuh', city: 'Bandung', lat: -6.9532, lng: 107.6186 },
  { id: 'b9', name: 'TPU Nagrog', city: 'Bandung', lat: -6.9184, lng: 107.6974 },
  // Jakarta
  { id: 'j1', name: 'TPU Tanah Kusir', city: 'Jakarta', lat: -6.2625, lng: 106.7766 },
  { id: 'j2', name: 'TPU Jeruk Purut', city: 'Jakarta', lat: -6.2737, lng: 106.8143 },
  { id: 'j3', name: 'TPU Karet Bivak', city: 'Jakarta', lat: -6.2046, lng: 106.8150 },
  { id: 'j4', name: 'TPU Pondok Kelapa', city: 'Jakarta', lat: -6.2415, lng: 106.9248 },
  { id: 'j5', name: 'TPU Pondok Ranggon', city: 'Jakarta', lat: -6.3458, lng: 106.9038 },
];`;

content = content.replace(/  \{ id: 'b8', name: 'TPU Legok Ciseureuh', city: 'Bandung', lat: -6\.9532, lng: 107\.6186 \},\n  \{ id: 'b9', name: 'TPU Nagrog', city: 'Bandung', lat: -6\.9184, lng: 107\.6974 \},\n\];/g, replacement);

fs.writeFileSync('src/components/CemeteryMap.tsx', content);
