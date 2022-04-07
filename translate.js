const fs = require('fs');
const readline = require('readline');
const os = require('os');
const { translate } = require('free-translate');

const writableEn = fs.createWriteStream('en.output.txt')
const writableCn = fs.createWriteStream('cn.output.txt')

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt'),
    crlfDelay: Infinity
})

async function translateTextToEn(ruText) {
   
    const translatedText = await translate(ruText, { from: 'ru', to: 'en' });
    writableEn.write(translatedText + os.EOL)
}

async function translateTextToCn(ruText) {
   
    const translatedText = await translate(ruText, { from: 'ru', to: 'zh-CN' });
    writableCn.write(translatedText + os.EOL)
}

(async()=> {

    for await (const line of rl) {

        if(line) {

            await translateTextToEn(line)

            await translateTextToCn(line)
        } else {

            continue
        }
       
    }
})()









// const rl = readline.createInterface({
//     input: fs.createReadStream('input.txt'),
//     crlfDelay: Infinity
// })

// const defaultHandler = err => {
//     if (err) {
//         throw new Error(err)
//     }
// }

// const writableEn = fs.createWriteStream('en.output.txt')

// rl.on('line', (line) => {

//     async function translateText(ruText) {

//         const translatedText = await translate(line, { from: 'ru', to: 'en' });

//         writableEn.write(translatedText + os.EOL)
//     }
//     translateText(line)
// })
