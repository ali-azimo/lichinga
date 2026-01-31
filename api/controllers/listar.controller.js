import Listing from "../models/listar.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Anúncio não encontrado'));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'Você só pode excluir seus próprios anúncios'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Anúncio excluído com sucesso');
    } catch (error) {
        next(error);
    }
}

export const updateListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Anúncio não encontrado"));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "Você só pode atualizar seus próprios anúncios"));
    }
    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        res.status(200).json(updateListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Anúncio não encontrado"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

//Pesquisar
export const getListings = async(req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        // Filtros
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let finished = req.query.finished;
        if (finished === undefined || finished === 'false') {
            finished = { $in: [false, true] };
        }
        
        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        // Filtro de tipo de propriedade
        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['casa', 'apartamento', 'terreno', 'machamba', 'obra'] };
        }

        // ADICIONADO: Filtro de tipo de transação
        let transactionType = req.query.transactionType;
        if (transactionType === undefined || transactionType === 'all') {
            transactionType = { $in: ['venda', 'arrendar'] };
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
                name: { $regex: searchTerm, $options: 'i' },
                offer,
                finished,
                parking,
                type,
                transactionType,
            })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);
            
        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}

// NOVAS FUNÇÕES PARA ESTATÍSTICAS

// Função para incrementar visualizações
export const incrementViews = async (req, res, next) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!listing) {
            return next(errorHandler(404, 'Listing não encontrado!'));
        }
        
        res.status(200).json({ 
            success: true, 
            views: listing.views || 0 
        });
    } catch (error) {
        next(error);
    }
};

// Função para incrementar compartilhamentos
export const incrementShares = async (req, res, next) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $inc: { shares: 1 } },
            { new: true }
        );
        
        if (!listing) {
            return next(errorHandler(404, 'Listing não encontrado!'));
        }
        
        res.status(200).json({ 
            success: true, 
            shares: listing.shares || 0 
        });
    } catch (error) {
        next(error);
    }
};

// Função para buscar visualizações
export const getViews = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return next(errorHandler(404, 'Listing não encontrado!'));
        }
        
        res.status(200).json({ 
            success: true, 
            views: listing.views || 0 
        });
    } catch (error) {
        next(error);
    }
};
