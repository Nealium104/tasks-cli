#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'

const [command, ...args] = process.argv.slice(2)
const filePath = './data/tasks.json'

const commands = {
    list: async (status) => listTasks(status),
    add: async (description) => addTask(description),
    update: async (id, description) => updateTask(id, description),
    "mark-in-progress": async (id) => markInProgressTask(id),
    "mark-done": async (id) => markDoneTask(id),
    delete: async (id) => deleteTask(id),
    "list-commands": async () => listCommands()
}

async function getJSON(){
    const data = await readFile(filePath)
    const jsonData = JSON.parse(data)
    return jsonData
}

async function listTasks(status){
    const taskData = await getJSON(filePath)
    const legalStatus = ['done', 'todo', 'in-progress']
    const taskArray = [];

    if (!status) {
        return taskData.tasks.map(task => printTask(task)).join('\n');
    }

    if(!legalStatus.includes(status)){
        return "Not valid status, please use 'done', 'todo', 'in-progress', or blank for all"
    }

    taskData.tasks.forEach((task) => {
        if(task.status === status){
            taskArray.push(printTask(task))
        }
    })

    return taskArray.join('\n');
}

async function addTask(description){
    let data = await getJSON();
    const lastId = data.tasks[data.tasks.length - 1].id
    const currentDate = new Date().toISOString()

    const item = {
        id: +lastId + 1,
        description: description,
        status: "todo",
        createdAt: currentDate,
        updatedAt: null
    }

    data.tasks.push(item)

    const jsonString = JSON.stringify(data, null, 2);
    await writeFile(filePath, jsonString)

    return `Task added with an id of ${item.id}`
}

async function updateTask(id, description){
    const data = await getJSON(filePath)
    const selectedItem = data.tasks.find(item => +item.id === +id)

    selectedItem.description = description

    const jsonString = JSON.stringify(data, null, 2)
    await writeFile(filePath, jsonString)

    return `Updated item with id of ${id}`
}

async function markInProgressTask(id){
    const data = await getJSON(filePath)
    const selectedItem = data.tasks.find(item => +item.id === +id)

    selectedItem.status = "in-progress"

    return `Updated status of item with id of ${id} to in progress`
}

async function markDoneTask(id){
    const data = await getJSON(filePath)
    const selectedItem = data.tasks.find(item => +item.id === +id)

    selectedItem.status = "done"

    return `Updated status of item with id of ${id} to done`
}

function listCommands(){
    return Object.keys(commands).join('\n')
}

function printTask(task){
    return `ID: ${task.id}\t${task.description}`
}


async function executeCommand(command, ...args){
    if (!(command in commands)){
        return "Not a valid command. Please try again, or use 'task list-commands' to view all commands."
    }
    return await commands[command](...args)
}

console.log(await executeCommand(command, ...args))

