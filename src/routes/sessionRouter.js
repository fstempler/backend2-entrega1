import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('Usuario autenticado:', req.user)
    const { password, ...userWithoutPassword } = req.user.toObject();
    if (!req.user) {
        return res.status(401).json({ message: 'No user found' });
    }
    res.send({
        status: 'succes',
        user: req.userWithoutPassword
    });
});

export default router;