import { iResponse } from './iResponse';

export interface iSkill<T> {
    exec(args?: T): Promise<iResponse>;
}