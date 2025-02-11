import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../models/userModel.js";
import 'dotenv/config';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await userModel.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}))

// passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
//     console.log('JWT Payload:', jwt_payload);

//     try {
//         const user = await userModel.findById(jwt_payload.id);
//         if (user) {
//             console.log('Usuario encontrado:', user);
//             return done(null, user);
//     } else {
//         console.log('Usuario no encontrado')
//         return done(null, false);
//     }
// } catch (err) {
//     console.error('Error en Passport:', err.message);
//     return done(err, false);
// }
// }));

export default passport; 