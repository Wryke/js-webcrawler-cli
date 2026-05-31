const { getPlayerRecentlyPlayedWith, getHTMLFromURL, printReport } = require('./playerCrawler.js')

async function main(){
    if(process.argv.length < 3){
        console.log("no name provided")
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log("too many command line args")
        process.exit(1)
    }
    const URL = `https://u.gg/lol/profile/na1/${process.argv[2]}/overview`
    const htmlBody = await getHTMLFromURL(URL)

    console.log(`starting crawl of ${URL}`)
    const players = await getPlayerRecentlyPlayedWith(htmlBody, URL)

    printReport(players)
}

main()