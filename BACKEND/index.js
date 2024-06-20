const express = require('express')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
/*********************** BOARDS ***********************/
//Return all the boards objects
app.get('/boards', async (req, res) => {
    const board = await prisma.board.findMany();
    res.status(200).json(board);
});

//Create a new board
app.post('/boards', async (req, res) => {
    const {imgUrl, title, category} = req.body;
    const newBoard = await prisma.board.create({
        data: {
            imgUrl,
            title,
            category
        }
    })
    res.status(201).json(newBoard);
});

//Get specific board
app.get('/boards/:id', async (req, res) => {
    const {id} = req.params;
    const board = await prisma.board.findUnique(
        {
            where: { id: parseInt(id) }
        });
    res.status(200).json(board);
});

/*********************** CARDS ***********************/

// Return all the cards objects
app.get('/cards', async (req, res) => {
    const card = await prisma.card.findMany();
    res.status(200).json(cards);
});

//Create a new card
app.post('/cards', async (req, res) => {
    const {creator, title, message, GIFUrl, signature} = req.body;
    const newCard = await prisma.card.create({
        data: {
            creator,
            title,
            message,
            GIFUrl,
            signature
        }
    })
    res.status(201).json(newCard);
});

//Get specific card
app.get('/cards/:id', async (req, res) => {
    const {id} = req.params;
    const card = await prisma.card.findUnique(
        {
            where: { id: parseInt(id) }
        });
    res.status(200).json(card);
});
