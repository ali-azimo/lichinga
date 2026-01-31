import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    createListing, 
    deleteListing, 
    updateListing, 
    getListing, 
    getListings,
    incrementViews,
    incrementShares,
    getViews 
} from '../controllers/listar.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing)
router.get('/get/:id', getListing);
router.get('/get', getListings)

// NOVAS ROTAS PARA ESTATÍSTICAS
router.post('/view/:id', incrementViews);           // Incrementar visualizações
router.post('/share/:id', incrementShares);         // Incrementar compartilhamentos
router.get('/views/:id', getViews);                 // Buscar contagem de visualizações

export default router;