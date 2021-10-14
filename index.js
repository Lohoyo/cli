#! /usr/bin/env node

const yargs = require('yargs/yargs');
const path = require('path');
const prompts = require('prompts');
const child_process = require('child_process');

yargs(process.argv.slice(2))
    .command(
        'init [dirname]',
        'create a new project',
        yargs => yargs.positional('dirname', {
            describe: 'the directory of the new project',
            default: 'project-template'
        }), 
        async argv => {
            child_process.execSync('git clone https://github.com/Lohoyo/project-template.git ' + argv.dirname);

            let install;
            if (argv.install === undefined) {
                const response = await prompts({
                    type: 'confirm',
                    name: 'value',
                    message: 'Would you like to install npm dependencies now?',
                    initial: true
                });
                install = response.value;
            } else {
                install = argv.install;
            }
            if (install) {
                child_process.execSync('npm i', {cwd: argv.dirname});
            }
        }
    )
    .option('install', {
        type: 'boolean',
        description: 'Install npm dependencies'
    })
    .argv;
