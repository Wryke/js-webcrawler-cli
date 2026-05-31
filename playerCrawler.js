const { JSDOM } = require('jsdom')

module.exports = {
    getPlayerRecentlyPlayedWith,
    getHTMLFromURL,
    printReport
}

async function getPlayerRecentlyPlayedWith(htmlBody) {
    const dom = new JSDOM(htmlBody)
    console.log(htmlBody.includes('Recently Played With'))
    console.log(htmlBody.includes('group/player'))
    const playerElements = dom.window.document.querySelectorAll(`a.group\\/player`)
    const players = []

    for (const player of playerElements) {
        const columns = player.querySelectorAll(`.grid > div`)

        const summoner = columns[0]?.textContent.trim()
        const played = Number(columns[1]?.textContent.trim())
        const record = columns[2]?.textContent.trim()
        const winRatio = columns[3]?.textContent.trim()

        const [wins, losses] = record.split('-').map(num => Number(num.trim()))

        players.push({
            summoner: summoner,
            played: played,
            wins: wins,
            losses: losses,
            winRatio: winRatio,
            profileURL: player.href
        })
    }

    return players
}

async function getHTMLFromURL(currentURL){
    console.log(`Obtaining ${currentURL}...`)
    try {
        const resp = await fetch(currentURL)

        // ensure valid status code
        if (resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            process.exit(1)
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
            process.exit(1)
        }

        const htmlBody = await resp.text()        
        return htmlBody
    } catch(err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
        process.exit(1)
    }
}

function printReport(players){
    console.log("=============================")
    console.log("Recent Players: Last 20 Games")
    console.log("=============================")

    const sortedPlayers = sortPlayers(players)

    for(const player of sortedPlayers){
        console.log(
            `${player.summoner} - ${player.played} games (${player.winRatio})`
        )
    }
    console.log("=============================")
}

function sortPlayers(players){
    return players.sort((a,b) => {
        return b.played - a.played
    })
}