const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'frontend');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== '.expo') {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    }
    else {
      if (file.endsWith('.js') && !file.endsWith('ThemeContext.js') && !file.endsWith('_layout.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(targetDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // For style files
  if (file.endsWith('.styles.js') || (file.includes('components') && file.endsWith('styles.js'))) {
    if (content.includes('import { COLORS } from')) {
      content = content.replace(/import \{ COLORS.*?\n/, '');
      if (content.includes('export const styles = StyleSheet.create({')) {
        content = content.replace('export const styles = StyleSheet.create({', 'export const getStyles = (COLORS) => StyleSheet.create({');
        changed = true;
      }
    }
  } 
  // For components
  else {
    if (content.includes('import { COLORS') || content.includes("import { COLORS, GRADIENTS }") || content.includes("import { GRADIENTS, COLORS }")) {
      
      // Fix imports
      if (content.includes("import { COLORS, GRADIENTS }")) {
        content = content.replace(/import \{ COLORS, GRADIENTS \} from '@\/constants\/colors';/, "import { GRADIENTS } from '@/constants/colors';\nimport { useTheme } from '@/context/ThemeContext';");
        changed = true;
      } else if (content.includes("import { COLORS }")) {
        content = content.replace(/import \{ COLORS \} from '@\/constants\/colors';/, "import { useTheme } from '@/context/ThemeContext';");
        changed = true;
      }

      // Fix styles import
      if (content.includes("import { styles } from './")) {
        content = content.replace(/import \{ styles \} from '(\.\/[^']+)'/, "import { getStyles } from '$1'");
      } else if (content.includes("import { styles } from \"./")) {
        content = content.replace(/import \{ styles \} from \"(\.\/[^\"]+)\"/, "import { getStyles } from \"$1\"");
      }

      // Inject hook inside default function export
      const funcRegex = /export default function ([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/;
      const match = content.match(funcRegex);
      if (match) {
        const insertion = `\n  const { colors: COLORS, isDark } = useTheme();\n  const styles = typeof getStyles !== 'undefined' ? getStyles(COLORS) : {};\n`;
        content = content.replace(match[0], match[0] + insertion);
      } else {
        const funcRegex2 = /export function ([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/;
        const match2 = content.match(funcRegex2);
        if (match2) {
          const insertion = `\n  const { colors: COLORS, isDark } = useTheme();\n  const styles = typeof getStyles !== 'undefined' ? getStyles(COLORS) : {};\n`;
          content = content.replace(match2[0], match2[0] + insertion);
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
