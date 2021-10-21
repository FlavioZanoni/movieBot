require("dotenv").config()
let fs = require("fs").promises
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })


// read file to uptade
async function readList() {
    let data = await fs.readFile('./src/movie.json', 'utf8')

    parsed = await JSON.parse(data)
    let moviesList = {
        lista: parsed.lista

    }
    return  moviesList.lista
}

client.on("ready", () => {
    console.log(`logged in as ${client.user.tag}`)
    // bot rich presence
    client.user.setActivity({
        name: "Filme Foda",
        type: "WATCHING",
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
        ls(msg)

    } else if (msg.content.startsWith(randPref)) {
        chooseRandom(msg)

    } else if (msg.content.startsWith(helpPref)) {
        help(msg)

    } else if (msg.content.startsWith(exportPref)) {
        exportList(msg)

    }
})

async function addMovie(msg) {
    let moviesList = await readList()

    let movie = msg.content.slice(5, msg.content.lenght)
    
    if(exists(movie, moviesList) == 0) {
        moviesList.push(movie)

        //  push to json
        fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));


        msg.reply(`o filme " *${movie}* " foi adicionado com sucesso ✅`)
    } else {
        msg.reply(`o filme " *${movie}* " ja existe na lista ❌`)
    }
}

async function addMore(msg) {
    let moviesList = await readList()

    let movie = msg.content.slice(9, msg.content.lenght)
    let list = movie.split(",")

    list.forEach(element => {
        if(exists(element, moviesList) == 0) {
            moviesList.push(element )

            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));

            msg.reply(`o filme " *${element}* " foi adicionado com sucesso ✅`)
        } else {
            msg.reply( `o filme " *${element}* " ja existe na lista ❌`)
        }
    })
}

async function ls(msg){
    let moviesList = await readList()

    if (moviesList.length == 0 ) {
        msg.reply("🧐 huh? nao tem nenum filme na lista !! 😩😫😢😭😭😖😈. Para adicionar é so usar o comando '>add {nomeDoFilme'} 😉")
    } else {
        msg.reply("📜 Esses são os filmes que estão na lista: \n" + "```" + `${moviesList}` + "```")
    }
}

async function rmMovie(msg) {
    let moviesList = await readList()
    let movie = msg.content.slice(4, msg.content.lenght)

    if(exists((movie), moviesList) == 1) {
        let index = moviesList.indexOf(movie)
        moviesList.splice(index, 1)

        //  push to json
        fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));

        msg.reply(`o filme '${movie}' foi removido com sucesso ✅`)
    } else {
        msg.reply(`o filme '${movie}' não esta na lista ❌`)
    }
}

async function chooseRandom(msg) {
    let moviesList = await readList()
    let len = moviesList.length - 1 
    randEntry = Math.floor(Math.random() * len)
    msg.reply(`🎲 O filme sorteado foi o: *${moviesList[randEntry]}*`)
}

async function exportList(msg) {
    let moviesList = await readList()

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

function exists(movie, moviesList) {
    if (moviesList.includes(movie)) {
        return 1
    } else {
        return 0
    }
}

client.login(process.env.TOKEN)