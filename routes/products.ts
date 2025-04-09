import { Router, Response, Request } from 'express';
import prisma from '../src/prisma';
import { tokenAuthorization } from '../middleware/authorization';

const ProductsRouter = Router();

ProductsRouter.post('/', tokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { name, description, category, price, rating } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                price,
                rating,
                userId: req.user.userId,
            },
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Unable to create product.' });
    }
});

ProductsRouter.get('/', tokenAuthorization, async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                userId: req.user.userId
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch products.' });
    }
});


ProductsRouter.put('/:id', tokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updated = await prisma.product.update({
            where: { id },
            data,
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Unable to update product.' });
    }
});

ProductsRouter.delete('/:id', tokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id },
        });

        res.json({ message: 'Product deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to delete product.' });
    }
});

export default ProductsRouter;
