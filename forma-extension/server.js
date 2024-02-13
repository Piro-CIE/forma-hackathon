import express from 'express'

const PORT = 3006;

const app = express()

app.use(express.static('www'))

app.use('*', (req, res)=>{
    res.send('www/index.html')
})

const server = app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT} ...`)
})

