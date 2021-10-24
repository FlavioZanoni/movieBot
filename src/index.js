require("dotenv").config()
let fs = require("fs").promises
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

// --- globals ---
let lastRemoved = ""

// prefixes
let addPref = ">add"
let addMorePref = ">listAdd"
let rmPref = ">rm"
let lsPref = ">ls"
let randPref =">rand"
let helpPref = ">help"
let exportPref = ">export"
let unRemovePref = ">unRem"

//msg padrão
let incompleteErr = "❌ O comando enviado está incompleto ❌\n```>help para mais detalhes```"

// ------

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

    } else if (msg.content.startsWith(unRemovePref)) {
        unRemove(msg)

    } else if (msg.content.startsWith(">listadd")) {
        msg.reply("❌ Acho que você esta procurando pelo comando: ```>listAdd```")
    }
})

async function addMovie(msg) {
    let moviesList = await readList()

    let msgContent = msg.content.slice(5, msg.content.lenght)

    if(msgContent == "") {
        msg.reply(incompleteErr)
    } else {
        let movie = msgContent.trim()
        if(exists(movie, moviesList) == 0) {
            moviesList.push(movie)

            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));

            msg.reply(`o filme " *${movie}* " foi adicionado com sucesso ✅`)
        } else {
            msg.reply(`o filme " *${movie}* " ja existe na lista ❌`)
        }
    }
}

async function addMore(msg) {
    let moviesList = await readList()

    let movie = msg.content.slice(9, msg.content.lenght)
    
    if(movie == "") {
        msg.reply(incompleteErr)
    } else {
        let list = movie.split(",")
        list.forEach(element => {
            let trimmed = element.trim()
            if(exists(element, moviesList) == 0) {
                moviesList.push(trimmed)
    
                //  push to json
                fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));
    
                msg.reply(`o filme " *${trimmed}* " foi adicionado com sucesso ✅`)
            } else {
                msg.reply( `o filme " *${trimmed}* " ja existe na lista ❌`)
            }
        })
    }
}

async function ls(msg){
    let moviesList = await readList()
    let len = moviesList.length
    if (len == 0 ) {
        msg.reply("🧐 huh? não tem nenhum filme na lista !! 😩😫😢😭😭😖😈. Para adicionar é so usar o comando '>add {nomeDoFilme'} 😉")
    } else {
        let list = []
        let i = 1

        moviesList.forEach(element => {
            list.push('\n' + i + " - " + element)
            i++
        })
        msg.reply(`📜 Existem atualmente **${len}** filmes na lista, \nOs filmes são: \n` + "```" + `${list}` + "\n```")
    }
}

async function rmMovie(msg) {
    let moviesList = await readList()
    let movie = msg.content.slice(4, msg.content.lenght)

    if(movie == "") {
        msg.reply(incompleteErr)

    } else if (parseInt(movie)) {
        let num = 1
        if(exists(movie, moviesList, num) == 1) {

            lastRemoved = moviesList[movie -1]

            msg.reply(`O filme ' *${movie} - ${moviesList[movie -1]}* ' foi removido com sucesso ✅`)
            moviesList.splice(movie - 1, 1)
    
            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));

        } else {
            msg.reply(`❌ O filme de index ' *${movie}* ' não existe ❌`)
        }

    } else {

        if(exists(movie, moviesList) == 1) {
            let index = moviesList.indexOf(movie)
            lastRemoved = moviesList[index]
            moviesList.splice(index, 1)
    
            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));
    
            msg.reply(`O filme ' *${index + 1} - ${movie}* ' foi removido com sucesso ✅`)
        } else {
            msg.reply(`O filme ' *${movie}* ' não esta na lista ❌`)
        }
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
    msg.reply(
        "```Bem-vindo(a) à central de ajuda do Bot foda de filme foda.\n Os comandos disponiveis são: \n ✏️>add: esse comando é usado para adicionar um filme à lista (mas só um filme por vez) EX: >add filme1 \n -------------------- \n 📝>listAdd: esse comando pode ser utilizado para adicionar mais de um filme por vez, os filmes precisam ser separados por vírgula, EX: >listAdd filme1, filme2, filme3 \n -------------------- \n ❌>rm: esse comando é usado para remover um filme da lista, mas atenção, a grafia do nome do filme precisa ser igual a do filme que já está na lista, EX: >rm filme1 \n ou você pode simplesmente usar a posição do filme na lista para retira-lo EX: >rm 6  \n -------------------- \n 📜>ls: esse comando retorna a lista de filmes que estão na lista, EX: >ls \n -------------------- \n 🎲>rand: esse comando ira retornar um filme aleatório que esta na lista, EX: >rand \n -------------------- \n 📩>export: esse comando gera um comando para dar input na lista de filmes novamente, EX: >export \n -------------------- \n 🤫 >unRem: esse comando coloca de novo na lista o ultimo filme tirado, (tenha cuidado, a memoria é so de um filme, e se o bot for desligado esse ultimo filme será perdido), EX: >unRem```"
    )
}

async function unRemove(msg) {
    if (lastRemoved == "") {
        msg.reply("De-desculpa se-senpai 😭😭🥺, eu esque-esqueci o ultimo filme que havia sido removido 😩😩 \nToma esse bolo de consolo 🍰")
    } else {
        let moviesList = await readList()

        if (exists(lastRemoved, moviesList) == 0) {
            moviesList.push(lastRemoved)
        
            fs.writeFile('./src/movie.json', JSON.stringify(obj = {lista: moviesList}));
        
            msg.reply(`o filme ${lastRemoved} foi readicionado à lista ✅`)
        } else {

            msg.reply(`o filme " *${lastRemoved}* " ja existe na lista ❌`)
        }
    }
}

function exists(movie, moviesList, num) {
    if (num) {
        if (moviesList[movie -1]) {
            return 1
        } else {
            return 0
        }
    } else {
        if (moviesList.includes(movie)) {
            return 1
        } else {
            return 0
        }
    }
}

client.login(process.env.TOKEN)