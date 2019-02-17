const express = require('express')
const app = express()
const port = 80

const multer = require('multer')
const upload = multer()

const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

/*app.post('/', upload.single('image'), async (req, res) => {
    const [result] = await client.labelDetection(req.file.buffer)
    const labels = result.labelAnnotations
    //console.log(req.file, labels)
    //res.send(labels.map(label => `${label.description}: ${label.score}`))
    res.send(`<h1>That's a ${labels[0].description}!</h1>`)
})*/
app.post('*', upload.single('image'), async (req, res) => {
    const [result] = await client.textDetection(req.file.buffer)
    //const [result] = await client.documentTextDetection(req.file.buffer)
    const r = result.textAnnotations
    console.log(r)
    //res.send(`<h1>${r.length && r[0].description}</h1>`)
    //res.status(201);
    //res.sendFile('public/submit.html', { root: __dirname })
    //res.location('/submit.html?test=1')
    if (!r.length) {
        // no OCR matches
        res.redirect('index.html') // TODO: Add message for no match
    } else {
        let noLetters = r.filter(m => !m.description.match(/[A-Za-z]/))
        if (noLetters.length && noLetters[0]) {
            let text = noLetters[0].description;
            let textNumber = text.match(/[\d.]+/) && text.match(/[\d.]+/)[0]
            res.redirect('submit.html?amt='+(textNumber || text))
        } else {
            let text = r[0].description;
            let textNumber = text.match(/[\d.]+/) && text.match(/[\d.]+/)[0]
            res.redirect('submit.html?amt='+(textNumber || text));
        }
    }
})
/*app.get('submit/{dinero}', (req, res) => {
    
})*/


app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listen on port ${port}!`)) 
