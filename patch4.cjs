const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

content = content.replace(
  'className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-20 border-b border-[#eae7e9]/50"',
  'className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-20 border-b border-[#eae7e9]/50 bg-cover bg-center bg-no-repeat min-h-screen"'
);

content = content.replace(
  '<div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">',
  '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">'
);

content = content.replace(
  '<div className="md:col-span-7 space-y-6 text-left">',
  '<div className="space-y-6 text-left w-full">'
);

content = content.replace(
  '<div className="md:col-span-5 relative mt-8 md:mt-0">',
  '<div className="relative mt-8 md:mt-0 w-full">'
);

fs.writeFileSync('src/components/HeroSection.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  '<div className="max-w-[1200px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">',
  '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 md:h-20 flex items-center justify-between">'
);
fs.writeFileSync('src/App.tsx', appContent);
