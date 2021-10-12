require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })


let moviesList = ["oie","oiee","oieee","oieeee","oieeeee","oieeeeee",]

client.on("ready", () => {
    console.log(`logged in as ${client.user.tag}`)
    // bot rich presence
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "filmes fodas",
            type: "WATCHING",
        }
    })
})

// prefixes
let addPref = ">add"
let addMorePref = ">listAdd"
let rmPref = ">rm"
let lsPref = ">ls"
let randPref =">rand"
let helpPref = ">help"
let exportPref = ">export"


client.on("message", msg => {
    if (msg.content.startsWith(addPref)) {
        addMovie(msg)

    } else if (msg.content.startsWith(addMorePref)) {
        addMore(msg)

    } else if (msg.content.startsWith(rmPref)) {
        rmMovie(msg)

    } else if (msg.content.startsWith(lsPref)) {
        msg.reply("esses são os filmes que estão na lista: \n" + "```" + `${moviesList}\n` + "```")

    } else if (msg.content.startsWith(randPref)) {
        chooseRandom(msg)

    } else if (msg.content.startsWith(helpPref)) {
        help(msg)

    } else if (msg.content.startsWith(exportPref)) {
        exportList(msg)

    }
})

function addMovie(msg) {
    let movie = msg.content.slice(5, msg.content.lenght)
    
    if(exists(movie) == 0) {
        moviesList.push(movie)
        msg.reply(`o filme " *${movie}* " foi adicionado com sucesso ✅`)
    } else {
        msg.reply(`o filme " *${movie}* " ja existe na lista ❌`)
    }
}

function addMore(msg) {
    let movie = msg.content.slice(9, msg.content.lenght)
    let list = movie.split(",")

    list.forEach(element => {

        if(exists(element) == 0) {
            moviesList.push(element)
            msg.reply(`o filme " *${element}* " foi adicionado com sucesso ✅`)
        } else {
            msg.send( `o filme " *${element}* " ja existe na lista ❌`)
        }
    });
}

function rmMovie(msg) {
    let movie = msg.content.slice(4, msg.content.lenght)

    if(exists(movie) == 1) {
        let index = moviesList.indexOf(movie)
        moviesList.splice(index, 1)

        msg.reply(`o filme '${movie}' foi removido com sucesso`)
    } else {
        msg.reply(`o filme '${movie}' não esta na lista`)
    }
}

function chooseRandom(msg) {
    let len = moviesList.length - 1 
    randEntry = Math.floor(Math.random() * len)
    msg.reply(`🎲 o filme sorteado foi o: *${moviesList[randEntry]}*`)
}


function exportList(msg) {
    let str = "``` >listAdd "
    moviesList.forEach(element => {
        str += `${element},`
    });
    let command = str.slice(0, -1)
    msg.reply(command + "```")
}

function help(msg) {
    msg.reply("```Bem-vindo(a) à central de ajuda do Bot foda de filme foda. \n Os comandos disponiveis são: \n ✏️>add: esse comando é usado para adicionar um filme a lista (mas so um filme por vez) EX: >add filme1 \n -------------------- \n 📝>listAdd: esse comando pode ser utilizado para adicionar mais de um filme por vez, EX: >listAdd filme1,filme2,filme3 \n -------------------- \n ❌>rm: esse comando é usado para remover um filme da lista, mas atenção, a grafia do nome do filme precisa ser igual a do filme que já está na lista, EX: >rm filme1  \n -------------------- \n 📜>ls: esse comando retorna a lista de filmes que estão na lista, EX: >ls \n -------------------- \n 🎲>rand: esse comando ira retornar um filme aleatório que esta na lista, EX: >rand \n -------------------- \n 📩>export: esse comando gera um comando para dar input na lista de filmes novamente, EX: >export```")
}

function exists(movie) {
    if (moviesList.includes(movie)) {
        return 1
    } else {
        return 0
    }
}

client.login(process.env.TOKEN)