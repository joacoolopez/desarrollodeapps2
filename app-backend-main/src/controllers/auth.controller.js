import authService from '../services/auth.service.js';


const loginWithGoogle = (req, res, next) => {
    // Inicia la autenticación con Google
    authService.loginWithGoogle(req, res, next);
}

const googleCallback = (req, res, next) => {
    // Maneja el callback de Google
    authService.googleCallback(req, res, next);
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error al cerrar sesión.');
        }
        res.redirect('/'); // Redirige a la página de inicio o a donde desees
    });
}

export { loginWithGoogle, googleCallback, logout };
