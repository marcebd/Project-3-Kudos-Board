const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
const PORT = process.env.PORT || 3000

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
app.use(cors());

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
            category: true,
            description:true
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
            category: true,
            description: true,
            imgUrl: true
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
    const {imgUrl, title, description, author, category} = req.body;
    const newBoard = await prisma.board.create({
        data: {
            imgUrl,
            title,
            description,
            author,
            category
        }
    })
    res.status(201).json(newBoard);
});

//Delete a board and all its cards
app.delete('/boards/:id', async (req, res) => {
    const { id } = req.params;
    const boardId = parseInt(id);

    try {
        // First, check if there are any cards associated with the board
        const cards = await prisma.card.findMany({
            where: { boardId: boardId }
        });

        if (cards.length > 0) {
            // If cards exist, delete them along with the board
            await prisma.$transaction([
                prisma.card.deleteMany({
                    where: { boardId: boardId }
                }),
                prisma.board.delete({
                    where: { id: boardId }
                })
            ]);
        } else {
            // If no cards exist, just delete the board
            await prisma.board.delete({
                where: { id: boardId }
            });
        }
        res.status(200).json({ message: 'Board and associated cards deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'P2025') {
            res.status(404).send('Board not found');
        } else {
            res.status(500).send(`Failed to delete the board and its cards: ${error.message}`);
        }
    }
});

/*********************** CARDS ***********************/
// Return all the cards objects
app.get('/cards', async (req, res) => {
    const card = await prisma.card.findMany();
    res.status(200).json(cards);
});

// Get specific card
app.get('/cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const card = await prisma.card.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (card) {
            res.status(200).json(card);
        } else {
            res.status(404).send('Card not found');
        }
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Create a new card
app.post('/boards/:boardId/cards', async (req, res) => {
    const { creator, title, message, GIFUrl, author } = req.body;
    const { boardId } = req.params;
    try {
        const newCard = await prisma.card.create({
            data: {
                creator,
                title,
                message,
                GIFUrl,
                boardId: parseInt(boardId),
                author,
                upvotes: 0
            }
        });
        res.status(201).json(newCard);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card', details: error.message });
    }
});

// Update upvotes for a specific card
app.patch('/cards/:id/upvote', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCard = await prisma.card.update({
            where: { id: parseInt(id) },
            data: {
                upvotes: {
                    increment: 1
                }
            }
        });
        res.status(200).json(updatedCard);
    } catch (error) {
        console.error('Error updating upvotes:', error);
        res.status(500).json({ error: "Failed to update upvotes" });
    }
});

// Add a comment to a card
app.post('/cards/:cardId/comments', async (req, res) => {
    const { cardId } = req.params;
    const { author, content } = req.body;
    try {
        const card = await prisma.card.findUnique({
            where: { id: parseInt(cardId) },
        });
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        const comment = await prisma.comment.create({
            data: {
                author,
                content,
                cardId: parseInt(cardId),
            },
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

//Get comments for a card
app.get('/cards/:cardId/comments', async (req, res) => {
    const { cardId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { cardId: parseInt(cardId) },
            orderBy: {
                id: 'desc',
            },
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Failed to get comments:', error);
        res.status(500).json({ message: 'Error retrieving comments' });
    }
});

app.delete('/cards/:id', async (req, res) => {
    const { id } = req.params;
    const cardId = parseInt(id);

    if (isNaN(cardId)) {
        return res.status(400).send('Invalid card ID');
    }

    try {
        const result = await prisma.$transaction(async (prisma) => {
            await prisma.comment.deleteMany({
                where: { cardId: cardId }
            });
            return prisma.card.delete({
                where: { id: cardId }
            });
        });
        res.status(204).send(); 
    } catch (error) {
        if (error.code === 'P2025') {
            // Handle specific case where the card does not exist
            return res.status(404).send('Card not found');
        }
        console.error('Failed to delete card:', error);
        res.status(500).send('Internal Server Error');
    }
});
