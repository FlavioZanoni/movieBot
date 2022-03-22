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
let randPref = ">rand"
let helpPref = ">help"
let exportPref = ">export"
let unRemovePref = ">unRem"
let watched = ">assistido"
let watchedList = ">watchedLs"
let watchedAdd = ">watchedAdd"
let watchedRm = ">watchedRm"
let github = ">github"

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
    return moviesList.lista
}

async function readWatchedList() {
    let data = await fs.readFile('./src/watched.json', 'utf8')

    parsed = await JSON.parse(data)
    let watchedList = {
        lista: parsed.lista

    }
    return watchedList.lista
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

    } else if (msg.content.startsWith(watchedList)) {
        showWatchedList(msg)

    } else if (msg.content.startsWith(watchedAdd)) {
        addWatched(msg)

    } else if (msg.content.startsWith(watchedRm)) {
        rmWatched(msg)

    } else if (msg.content.startsWith(watched)) {
        markWatched(msg)

    } else if (msg.content.startsWith(github)) {
        githubMsg(msg)

    }
})

async function addMovie(msg) {
    let moviesList = await readList()

    let msgContent = msg.content.slice(5, msg.content.lenght)

    if (msgContent == "") {
        msg.reply(incompleteErr)
    } else {
        let movie = msgContent.trim()
        if (exists(movie, moviesList) == 0) {
            moviesList.push(movie)

            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = { lista: moviesList }));

            msg.reply(`o filme " *${movie}* " foi adicionado com sucesso ✅`)
        } else {
            msg.reply(`o filme " *${movie}* " ja existe na lista ❌`)
        }
    }
}

async function addMore(msg) {
    let moviesList = await readList()

    let movie = msg.content.slice(9, msg.content.lenght)

    if (movie == "") {
        msg.reply(incompleteErr)
    } else {
        let list = movie.split(",")
        list.forEach(element => {
            if (element != '') {
                let trimmed = element.trim()
                if (exists(element, moviesList) == 0) {
                    moviesList.push(trimmed)

                    //  push to json
                    fs.writeFile('./src/movie.json', JSON.stringify(obj = { lista: moviesList }));

                    msg.reply(`o filme " *${trimmed}* " foi adicionado com sucesso ✅`)
                } else {
                    //console.count("movieadd")
                    msg.reply(`o filme " *${trimmed}* " ja existe na lista ❌`)
                }
            }
        })
    }
}

async function ls(msg) {
    let moviesList = await readList()
    let len = moviesList.length
    let charsLen = 0

    moviesList.forEach(element => {
        charsLen += element.length
        // +or- number of chars that are added latter for each movie assuming no one is puttin more than 999 movies in this
        charsLen += 8
    })

    let divisions = Math.ceil(charsLen / 2000)
    let elementsForEachDivision = Math.ceil(len / divisions)

    if (len == 0) {
        msg.reply("🧐 huh? não tem nenhum filme na lista !! 😩😫😢😭😭😖😈. Para adicionar é so usar o comando '>add {nomeDoFilme}' 😉")
    } else {
        let list = []
        let count = 0
        let i = 1

        if (divisions == 1) {
            moviesList.forEach(element => {
                list.push('\n' + i + " - " + element)
                i++
            })

            msg.reply(`📜 Existem atualmente **${len}** filmes na lista, \nOs filmes são: \n`)
            msg.reply("```" + `${list}` + "\n```")
        } else {
            msg.reply(`📜 Existem atualmente **${len}** filmes na lista, \nOs filmes são: \n`)
            for (let c = 0; c < divisions; c++) {
                for (let d = 0; d < elementsForEachDivision; d++) {
                    // not the best solution buuuut....
                    if (moviesList[count] != undefined) {
                        // the +1 just to make the movies list start at 1 and not 0
                        list.push(`\n ${(count + 1)} - ${moviesList[count]}`)
                        count++
                    }
                }
                msg.reply("```" + `${list}` + "\n```")
                list = []
            }
        }

        //#region // code if you want to break the list by some fixed amout of movies
        /* let list = []
        let i = 1
        let c = 1
        amountOfMovies = 50

        msg.reply(`📜 Existem atualmente **${len}** filmes na lista, \nOs filmes são: \n`)

        moviesList.forEach(element => {
            list.push('\n' + i + " - " + element)
            i++
            c++
            if(c > amountOfMovies) {
                msg.reply("```" + `${list}` + "\n```")
                list = []
                c = 1
            }
        })
        if(list.length != 0) {
            msg.reply("```" + `${list}` + "\n```")
        } */
        //#endregion
    }
}

async function rmMovie(msg, movieParsed, inside) {

    let moviesList = await readList()
    let movie;
    if (inside == true) {
        movie = movieParsed.trim()
    } else {
        movie = msg.content.slice(4, msg.content.lenght)
    }

    if (movie == "") {
        msg.reply(incompleteErr)

    } else if (parseInt(movie)) {
        let num = 1
        if (exists(movie, moviesList, num) == 1) {

            lastRemoved = moviesList[movie - 1]

            msg.reply(`O filme ' *${movie} - ${moviesList[movie - 1]}* ' foi removido com sucesso ✅`)
            moviesList.splice(movie - 1, 1)

            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = { lista: moviesList }));

        } else {
            msg.reply(`❌ O filme de index ' *${movie}* ' não existe ❌`)
        }

    } else {

        if (exists(movie, moviesList) == 1) {
            let index = moviesList.indexOf(movie)
            lastRemoved = moviesList[index]
            moviesList.splice(index, 1)

            //  push to json
            fs.writeFile('./src/movie.json', JSON.stringify(obj = { lista: moviesList }));

            msg.reply(`O filme ' *${index + 1} - ${movie}* ' foi removido com sucesso ✅`)
        } else {
            msg.reply(`O filme ' *${movie}* ' não esta na lista ❌`)
        }
    }
}

async function markWatched(msg) {

    movie = msg.content.slice(10, msg.content.lenght)
    rmMovie(msg, movie, true)
    // adiciona o filme na lista de ja assistidos
    addWatched(msg, movie, true)
}

async function chooseRandom(msg) {
    let moviesList = await readList()
    let len = moviesList.length - 1
    randEntry = Math.floor(Math.random() * len)
    msg.reply(`🎲 O filme sorteado foi:  *${(moviesList.indexOf(moviesList[randEntry]) + 1)} - ${moviesList[randEntry]}*`)
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

async function unRemove(msg) {
    if (lastRemoved == "") {
        msg.reply("De-desculpa se-senpai 😭😭🥺, eu esque-esqueci o ultimo filme que havia sido removido 😩😩 \nToma esse bolo de consolo 🍰")
    } else {
        let moviesList = await readList()

        if (exists(lastRemoved, moviesList) == 0) {
            moviesList.push(lastRemoved)

            fs.writeFile('./src/movie.json', JSON.stringify(obj = { lista: moviesList }));

            msg.reply(`o filme ${lastRemoved} foi readicionado à lista ✅`)
        } else {

            msg.reply(`o filme " *${lastRemoved}* " ja existe na lista ❌`)
        }
    }
}

function exists(movie, moviesList, num) {
    if (num) {
        if (moviesList[movie - 1]) {
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

// ----- watched list -----

async function showWatchedList(msg) {
    let watchedList = await readWatchedList()

    let len = watchedList.length
    let charsLen = 0

    watchedList.forEach(element => {
        charsLen += element.length
        // +or- number of chars that are added latter for each movie assuming no one is puttin more than 999 movies in this
        charsLen += 8
    })

    let divisions = Math.ceil(charsLen / 2000)
    let elementsForEachDivision = Math.ceil(len / divisions)

    if (len == 0) {
        msg.reply("🧐 huh? não tem nenhum filme na lista !! 😩😫😢😭😭😖😈. Para adicionar é só usar o comando '>watchedAdd {nomeDoFilme}' 😉")
    } else {
        let list = []
        let count = 0
        let i = 1

        if (divisions == 1) {
            watchedList.forEach(element => {
                list.push('\n' + i + " - " + element)
                i++
            })

            msg.reply(`📜 Existem atualmente **${len}** filmes na lista de filmes assistidos, \nOs filmes são: \n`)
            msg.reply("```" + `${list}` + "\n```")
        } else {
            msg.reply(`📜 Existem atualmente **${len}** filmes na lista de filmes assistidos, \nOs filmes são: \n`)
            for (let c = 0; c < divisions; c++) {
                for (let d = 0; d < elementsForEachDivision; d++) {
                    // not the best solution buuuut....
                    if (watchedList[count] != undefined) {
                        // the +1 just to make the movies list start at 1 and not 0
                        list.push(`\n ${(count + 1)} - ${watchedList[count]}`)
                        count++
                    }
                }
                msg.reply("```" + `${list}` + "\n```")
                list = []
            }
        }
    }

}

async function addWatched(msg, movie) {
    let watchedList = await readWatchedList()

    let msgContent;
    if (movie == undefined) {
        msgContent = msg.content.slice(11, msg.content.lenght)
    } else {
        msgContent = movie
    }

    if (msgContent == "") {
        msg.reply(incompleteErr)
    } else {
        let movie = msgContent.trim()
        if (exists(movie, watchedList) == 0) {
            watchedList.push(movie)

            //  push to json
            fs.writeFile('./src/watched.json', JSON.stringify(obj = { lista: watchedList }));

            msg.reply(`o filme " *${movie}* " foi adicionado com sucesso à lista de assistidos ✅`)
        } else {
            msg.reply(`o filme " *${movie}* " ja existe na lista de assistidos ❌`)
        }
    }
}

async function rmWatched(msg, movieRm) {
    let watchedList = await readWatchedList()
    let movie;
    if (movieRm == undefined) {
        movie = msg.content.slice(11, msg.content.lenght)
    } else {
        movie = movie
    }

    if (movie == "") {
        msg.reply(incompleteErr)

    } else if (parseInt(movie)) {
        let num = 1
        if (exists(movie, watchedList, num) == 1) {

            lastRemoved = watchedList[movie - 1]

            msg.reply(`O filme ' *${movie} - ${watchedList[movie - 1]}* ' foi removido com sucesso ✅`)
            watchedList.splice(movie - 1, 1)

            //  push to json
            fs.writeFile('./src/watched.json', JSON.stringify(obj = { lista: watchedList }));

        } else {
            msg.reply(`❌ O filme de index ' *${movie}* ' não existe ❌`)
        }

    } else {

        if (exists(movie, watchedList) == 1) {
            let index = watchedList.indexOf(movie)
            lastRemoved = watchedList[index]
            moviesList.splice(index, 1)

            //  push to json
            fs.writeFile('./src/watched.json', JSON.stringify(obj = { lista: watchedList }));

            msg.reply(`O filme ' *${index + 1} - ${movie}* ' foi removido com sucesso ✅`)
        } else {
            msg.reply(`O filme ' *${movie}* ' não esta na lista ❌`)
        }
    }
}

// help

let helpMsg = {
    'aspas': '```',
    'help': `
Bem-vindo(a) à central de ajuda do Bot foda de filme foda, **essa é a versão 1.1.0**.

        🔴----- ATENÇÃO -----🔴

        Para filmes que não vão ser assistidos use o comando >rm, e para filmes que ja foram assistidos use o comando >assistido
                --------

🔴 Os comandos disponiveis são:

👀>assistido: esse comando é utilizado para retirar o filme asssitido da lista e coloca-lo na lsita de filmes asssistidos, Ex: >assistido filme1
    ----
✏️>add: esse comando é usado para adicionar um filme à lista (mas só um filme por vez) Ex: >add filme1
    ----
📝>listAdd: esse comando pode ser utilizado para adicionar mais de um filme por vez, os filmes precisam ser separados por vírgula, Ex: >listAdd filme1, filme2, filme3
    ----
❌>rm: esse comando é usado para remover um filme da lista, mas atenção, a grafia do nome do filme precisa ser igual a do filme que já está na lista, Ex: >rm filme1
    ou você pode simplesmente usar a posição do filme na lista para retira-lo Ex: >rm 6 
    ----
📜>ls: esse comando retorna a lista de filmes que estão na lista, Ex: >ls
    ----
🎲>rand: esse comando ira retornar um filme aleatório que esta na lista, Ex: >rand
    ----
📩>export: esse comando gera um comando para dar input na lista de filmes novamente, Ex: >export
    ----
🤫>unRem: esse comando coloca de novo na lista o ultimo filme tirado, (tenha cuidado, a memoria é so de um filme, e se o bot for desligado esse ultimo filme será perdido), Ex: >unRem


🔴 Os comandos para as listas de filmes já assistidos são:


📜>watchedLs: esse comando retorna a lista os filmes assistidos, Ex: >watchedLs
    ----
✏️>watchedAdd: esse comando é utilizado para adiciona filmes assistidos, Ex: >watchedAdd filme1
    ----
❌>watchedRm: esse comando é utilizado para remover filmes assistidos, Ex: >watchedRm filme1
    ----
>github: esse comando pega o link do repositório do bot no github, Ex: >github
            `
}

function help(msg) {
    msg.reply(
        `${helpMsg.aspas} ${helpMsg.help} ${helpMsg.aspas}`
    )
}

function githubMsg(msg) {
    msg.reply("https://github.com/FlavioZanoni/movieBot")
}

client.login(process.env.TOKEN)