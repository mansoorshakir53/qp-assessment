/** import packages [start] */
import fs from 'fs';
/** import packages [end] */


export const deleteFile = (path: string) => {
    fs.unlinkSync(path);
}