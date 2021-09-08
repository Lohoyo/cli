#! /usr/bin/env node

const yargs = require('yargs/yargs');
const path = require('path');
const vfs = require('vinyl-fs');
const prompts = require('prompts');
const child_process = require('child_process');

yargs(process.argv.slice(2))
    .command('init [dirname]', 'create a new project', yargs => {
        return yargs
            .positional('dirname', {
                describe: 'the directory of the new project',
                default: './'
            });
    }, async argv => {
        const dest = path.resolve(argv.dirname);
        await new Promise((resolve, reject) => {
            vfs.src(['template/**/*'], {cwd: __dirname, dot: true})
                .pipe(vfs.dest(dest))
                .on('end', () => resolve());
        });
        let install;
        if (argv.install === undefined) {
            const response = await prompts({
                type: 'confirm',
                name: 'value',
                message: 'Would you like to install npm dependencies now?'
            });
            install = response.value;
        } else {
            install = argv.install;
        }
        if (install) {
            child_process.execSync('npm i', {cwd: dest});
        }
    })
    .option('install', {
        type: 'boolean',
        description: 'Install npm dependencies'
    })
    .argv;
