import fs from 'fs';
import path from 'path';

export const cleanLegacyFiles = (): void => {
  const rootDir = path.resolve(__dirname, '../../');

  const filesToRemove = [
    path.join(rootDir, 'app.js'),
    path.join(rootDir, 'server.js'),
    path.join(rootDir, 'config/db.js'),
    path.join(rootDir, 'artcorner.artifacts.json'),
    path.join(rootDir, 'artcorner.communities.json'),
    path.join(rootDir, 'artcorner.newsletters.json'),
    path.join(rootDir, 'artcorner.users.json'),
    path.join(rootDir, 'test.artifacts.json'),
    path.join(rootDir, 'test.images.json'),
  ];

  const dirsToRemove = [
    path.join(rootDir, 'model'),
    path.join(rootDir, 'router'),
    path.join(rootDir, 'utils'),
    path.join(rootDir, 'config'),
  ];

  // Remove obsolete files
  for (const filePath of filesToRemove) {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Removed obsolete file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to remove file ${filePath}:`, err);
      }
    }
  }

  // Remove obsolete directories
  for (const dirPath of dirsToRemove) {
    if (fs.existsSync(dirPath)) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Removed obsolete directory: ${dirPath}`);
      } catch (err) {
        console.error(`Failed to remove directory ${dirPath}:`, err);
      }
    }
  }
};

if (require.main === module) {
  cleanLegacyFiles();
}

export default cleanLegacyFiles;
