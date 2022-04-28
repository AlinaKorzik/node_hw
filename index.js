const http = require('http');
const fs = require('fs')
const os = require('os')

const port = 3000
const host = '127.0.0.1'
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']

const parseJsonBody = (request) => new Promise((resolve, reject) => {
    let rawJson = ''
    request
        .on('data', (chunk) => {
            rawJson += chunk
        })
        .on('end', () => {
            try {
                if (rawJson) {
                    const requestBody = JSON.parse(rawJson)
                    resolve(requestBody)
                } else {
                    resolve(null)
                }
            } catch (err) {
                reject(err)
            }
        })
        .on('error', reject)
})
const parseQueryParams = (server, request) => {
    const { address, port } = server.address()
    const parseUrl = new URL(request.url, `http://${address}:${port}`)
    const queryParams = {}
    for (const [key, value] of parseUrl.searchParams.entries()) {
        queryParams[key] = value
    }
    return {queryParams, path: parseUrl.pathname}
}
const getCats = (path) => new Promise((resolve) => {
    const readStream = fs.createReadStream(path)
    let result = ''
    readStream
        .on('data', (chunk) => {
            result += chunk.toString()
        })
        .on('end', (chunk) => {
            if (!result) {
                resolve([])
            } else {
                resolve(JSON.parse(result))
            }
        })
})
const writeFile = async (fileName, arr) => {
    const writable = fs.createWriteStream(fileName)
    await writable.write(JSON.stringify(arr))

}

const myServer = http.createServer(async(request, response) => {
    
    if (!allowedMethods.includes(request.method)) {
        response.writeHead(400)
        response.setHeader('Allow', allowedMethods.join(','))
        response.end()
        return
    }
    if(request.method === "GET") {

        try {
            
            await getCats('catDB.json')
            response.end()
            
            
        } catch (err) {
            console.error(err)
            response.writeHead(500)
            response.end('Internal server error')
            return
        }
    }

    if(request.method === "POST") {

        try {
            let arr = await getCats('catDB.json')
            let newCat = await parseJsonBody(request)
            newCat.id = arr.length+1
            arr.push(newCat)
            writeFile('catDB.json', arr)
            response.end()
                
        } catch (err) {
            console.error(err)
            response.writeHead(500)
            response.end('Internal server error')
            return
        }
    }
    if(request.method === "DELETE") {

        try {
            
            let arr = await getCats('catDB.json')
            let getId = await parseQueryParams(myServer, request)
            let deleteId = getId.queryParams.id
            arr.forEach((cat, index) => {
                if(cat.id === deleteId){
                    arr.splice(index, 1)
                }
            })
            writeFile('catDB.json', arr)
            response.end()
            
            
        } catch (err) {
            console.error(err)
            response.writeHead(500)
            response.end('Internal server error')
            return
        }
    }
    if(request.method === "PUT") {

        try {
            
            let arr = await getCats('catDB.json')
            let newCat = await parseJsonBody(request)
            arr.forEach((cat, index) => {
                if(cat.id === newCat.id || cat.name === newCat.name || cat.image === newCat.image) {
                    cat.id = newCat.id
                    cat.name = newCat.name
                    cat.image = newCat.image
                }
            })
            writeFile('catDB.json', arr)
            response.end()
            
            
        } catch (err) {
            console.error(err)
            response.writeHead(500)
            response.end('Internal server error')
            return
        }
    }
})

myServer.on('error', (err) => {
    console.error(err)
})

myServer.listen(port, host, () => {
    const { address, port, family } = myServer.address()
    console.log(`Server is running on http://${address}:${port} Family: ${family}`)
})