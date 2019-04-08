import fs from 'fs';
import path from 'path';

export const writeFileSync = (dist: string, content: object) => {
  const dir = dist.split(path.sep).slice(0, -1);

  for (let i = 1; i <= dir.length; i++) {
    const dirName = path.resolve(__dirname, dir.slice(0, i).join(path.sep));
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
  }

  fs.writeFileSync(dist, JSON.stringify(content), 'utf8');
};
