const fs = require('fs');
let content = fs.readFileSync('src/components/SuccessReceipt.tsx', 'utf8');

const regex = /\{selectedPayment === 'QRIS' \? \([\s\S]*?\) : \([\s\S]*?<>([\s\S]*?)<\/>\s*\)\}/m;
content = content.replace(regex, `<>$1</>`);

fs.writeFileSync('src/components/SuccessReceipt.tsx', content);
