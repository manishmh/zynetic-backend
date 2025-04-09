import { Response, Router, Request } from "express";
import { tokenAuthorization } from "../middleware/authorization";

const validateRouter = Router();

validateRouter.get('/', tokenAuthorization, (req: Request, res: Response) => {
    res.status(200).json({ user: req.user})
})

export default validateRouter;