import { TOKEN_PATH } from '../constants';
import { createFileStorage } from './storage';

export const tokenStorage = createFileStorage<{}>(TOKEN_PATH);
