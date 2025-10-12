import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      addJsExtensions(filePath);
    } else if (path.extname(file) === '.js') {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Match import/export statements
      const patterns = [
        // import ... from './path'
        /from\s+['"`](\.[^'"`]+)['"`]/g,
        // import('./path')
        /import\s*\(\s*['"`](\.[^'"`]+)['"`]\s*\)/g,
        // export ... from './path'
        /from\s+['"`](\.[^'"`]+)['"`]/g
      ];
      
      patterns.forEach(pattern => {
        content = content.replace(pattern, (match, importPath) => {
          // Skip jika sudah ada ekstensi
          if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
            return match;
          }
          // Skip jika bukan relative import
          if (!importPath.startsWith('.')) {
            return match;
          }
          
          return match.replace(importPath, importPath + '.js');
        });
      });
      
      fs.writeFileSync(filePath, content);
    }
  });
}

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('🔧 Adding .js extensions to imports...');
  addJsExtensions(distPath);
  console.log('✅ Done!');
} else {
  console.error('❌ dist folder not found!');
}