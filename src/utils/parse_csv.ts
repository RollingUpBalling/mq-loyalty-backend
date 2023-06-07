import fs from 'fs';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';

export const readCSV = async <T>(stream: Readable): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];

    stream
      .pipe(csvParser())
      .on('data', (data: any) => results.push(data))
      .on('end', () => {
        resolve(results);
      });
  });
};
