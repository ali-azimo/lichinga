import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Curtidas
  count: 0,
  liked: false,
  
  // Estatísticas dinâmicas
  views: 0,
  shares: 0,
  
  // Status
  loading: false,
  error: null,
  
  // Detalhes da propriedade para cálculo de tempo no ar
  listingDetails: {
    createdAt: null,
  }
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    // Ações para loading/error
    likeStart: (state) => {
      state.loading = true;
    },
    likeFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Ações para curtidas
    likeSuccess: (state, action) => {
      state.liked = action.payload.liked;
      state.loading = false;
    },
    likeCountSuccess: (state, action) => {
      state.count = action.payload;
      state.loading = false;
    },

    // Ações para visualizações
    viewCountStart: (state) => {
      state.loading = true;
    },
    viewCountSuccess: (state, action) => {
      state.views = action.payload;
      state.loading = false;
    },

    // Ações para compartilhamentos
    shareCountStart: (state) => {
      state.loading = true;
    },
    shareCountSuccess: (state, action) => {
      state.shares = action.payload;
      state.loading = false;
    },

    // Ação para incrementar visualizações localmente
    // (para feedback imediato enquanto a API responde)
    incrementViewLocal: (state) => {
      state.views += 1;
    },

    // Ação para incrementar compartilhamentos localmente
    incrementShareLocal: (state) => {
      state.shares += 1;
    },

    // Ação para incrementar curtidas localmente
    // (para feedback visual sem afetar estatísticas reais)
    incrementLikeLocal: (state) => {
      state.count += state.liked ? -1 : 1;
      state.liked = !state.liked;
    },

    // Ação para definir detalhes da propriedade
    setListingDetails: (state, action) => {
      state.listingDetails = {
        ...state.listingDetails,
        ...action.payload
      };
    },

    // Ação para resetar o estado
    resetLikeState: (state) => {
      return initialState;
    },

    // Ação para atualizar múltiplas estatísticas de uma vez
    updateAllStats: (state, action) => {
      if (action.payload.count !== undefined) {
        state.count = action.payload.count;
      }
      if (action.payload.views !== undefined) {
        state.views = action.payload.views;
      }
      if (action.payload.shares !== undefined) {
        state.shares = action.payload.shares;
      }
      if (action.payload.liked !== undefined) {
        state.liked = action.payload.liked;
      }
    },
  },
});

export const {
  likeStart,
  likeSuccess,
  likeCountSuccess,
  likeFailure,
  viewCountStart,
  viewCountSuccess,
  shareCountStart,
  shareCountSuccess,
  incrementViewLocal,
  incrementShareLocal,
  incrementLikeLocal,
  setListingDetails,
  resetLikeState,
  updateAllStats,
} = likeSlice.actions;

// Seletor para calcular tempo no ar
export const selectTimeOnline = (state) => {
  if (!state.like.listingDetails.createdAt) return '0 dias';
  
  const createdDate = new Date(state.like.listingDetails.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1 ? '1 dia' : `${diffDays} dias`;
};

// Seletor para obter todas as estatísticas
export const selectAllStats = (state) => ({
  likes: state.like.count,
  views: state.like.views,
  shares: state.like.shares,
  liked: state.like.liked,
  timeOnline: selectTimeOnline(state),
});

// Seletor para verificar se está carregando
export const selectLoading = (state) => state.like.loading;

// Seletor para obter erro
export const selectError = (state) => state.like.error;

export default likeSlice.reducer;