import { v4 as uuidv4 } from 'uuid';
import { r as res } from './response';
import { l as log } from './logs';
import { t as translate } from './translate';

export const generateUUID = (): string => uuidv4();

export const r = res;
export const l = log;
export const t = translate;