import { promises, open } from 'fs';
import path from 'path';
import { exec } from 'child_process';

const [, , challengeName] = process.argv;

exec(`git checkout master && git pull && git checkout -b ${challengeName}`);

function getNextIndex() {
    return promises
        .readdir('./challenges')
        .then((files) => files.map((file) => Number(file.split('-')[0])))
        .then((indices) => Math.max(...indices) + 1);
}

const nextIndex = await getNextIndex();

const newChallenge = path.resolve(
    './challenges',
    `${nextIndex}-${challengeName}`
);

await promises.mkdir(newChallenge);
await promises.mkdir(path.resolve(newChallenge, '__tests__'));

await Promise.all([
    promises.open(path.resolve(newChallenge, `${challengeName}.ts`), 'w'),
    promises.open(
        path.resolve(newChallenge, '__tests__', `${challengeName}.test.ts`),
        'w'
    ),
]);
