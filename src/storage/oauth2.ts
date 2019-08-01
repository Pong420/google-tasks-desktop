import { OAUTH2_KEYS_PATH } from '../constants';
import { createFileStorage } from './storage';
import { OAuthKeys } from '../typings';

export const oAuth2Storage = createFileStorage<OAuthKeys>(OAUTH2_KEYS_PATH);
