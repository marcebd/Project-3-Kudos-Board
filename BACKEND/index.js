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
//Get board all boards basic information
app.get('/boards', async (req, res) => {
    const boards = await prisma.board.findMany({
        select: {
            imgUrl: true,
            id: true,
            title: true,
            category: true
        }
    });
    res.status(200).json(boards);
});

//Get specific board basic information
app.get('/boards/:id', async (req, res) => {
    const { id } = req.params;
    const board = await prisma.board.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            id: true,
            title: true,
            category: true
        }
    });

    if (board) {
        res.status(200).json(board);
    } else {
        res.status(404).send('Board not found');
    }
});

//Get a specific board with all its cards
app.get('/boards/:id/cards', async (req, res) => {
    const { id } = req.params;
    const board = await prisma.board.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            cards: {
                select: {
                    id: true,
                    title: true,
                    message: true,
                    GIFUrl: true,
                    signature: true,
                    creator: true
                }
            }
        }
    });
    if (board) {
        res.status(200).json(board);
    } else {
        res.status(404).send('Board not found');
    }
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

//Delete a board and all its cards
app.delete('/boards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.$transaction([
            prisma.card.deleteMany({
                where: {
                    boardId: parseInt(id),
                }
            }),
            prisma.board.delete({
                where: {
                    id: parseInt(id),
                }
            })
        ]);
        res.status(200).json({ message: 'Board and associated cards deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'P2025') {
            res.status(404).send('Board not found');
        } else {
            res.status(500).send('Failed to delete the board and its cards');
        }
    }
});

/*********************** CARDS ***********************/
// Return all the cards objects
app.get('/cards', async (req, res) => {
    const card = await prisma.card.findMany();
    res.status(200).json(cards);
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

//Delete a specific card
app.delete('/cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCard = await prisma.card.delete({
            where: {
                id: parseInt(id),
            }
        });
        res.status(200).json(deletedCard);
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).send('Card not found');
        } else {
            res.status(500).send('Error deleting the card');
        }
    }
});
