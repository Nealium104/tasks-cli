#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import * as readline from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'

async function getJSON(){
    const data = await readFile('./data/tasks.json')
    const jsonData = JSON.parse(data)
    return jsonData
}

const rl = readline.createInterface({ input, output })

console.log('welcome to the task tracker. Here are your tasks:')
const taskData = await getJSON()

taskData.tasks.forEach(task => {
    console.log(`ID: ${task.id}\t${task.title}`)
});
const action = rl.question('Press e to exit or n to create a new task')

 