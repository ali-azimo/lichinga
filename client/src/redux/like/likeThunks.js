import { 
  likeStart, 
  likeSuccess, 
  likeCountSuccess, 
  likeFailure,
  viewCountSuccess,
  shareCountSuccess,
  incrementViewLocal,
  incrementShareLocal,
  updateAllStats,
  setListingDetails
} from './likeSlice';

// Thunk para carregar todas as estatísticas
export const fetchAllStats = (listingId) => async (dispatch) => {
  try {
    dispatch(likeStart());
    
    // Buscar múltiplas estatísticas em paralelo
    const [likesRes, viewsRes, listingRes] = await Promise.all([
      fetch(`/api/like/count/${listingId}`),
      fetch(`/api/listing/views/${listingId}`),
      fetch(`/api/listing/get/${listingId}`)
    ]);
    
    const likesData = await likesRes.json();
    const viewsData = await viewsRes.json();
    const listingData = await listingRes.json();
    
    // Verificar se usuário atual curtiu
    let liked = false;
    if (listingData.userRef) {
      const checkRes = await fetch(`/api/like/check/${listingId}`);
      const checkData = await checkRes.json();
      liked = checkData.liked || false;
    }
    
    dispatch(updateAllStats({
      count: likesData.count || 0,
      views: viewsData.views || 0,
      shares: listingData.shares || 0,
      liked
    }));
    
    dispatch(setListingDetails({
      createdAt: listingData.createdAt
    }));
    
  } catch (error) {
    dispatch(likeFailure(error.message));
  }
};

// Thunk para incrementar visualizações
export const incrementViews = (listingId) => async (dispatch) => {
  try {
    dispatch(incrementViewLocal()); // Feedback imediato
    
    const res = await fetch(`/api/listing/view/${listingId}`, {
      method: 'POST',
    });
    
    const data = await res.json();
    if (data.success) {
      dispatch(viewCountSuccess(data.views));
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
  }
};

// Thunk para incrementar compartilhamentos
export const incrementShares = (listingId) => async (dispatch) => {
  try {
    dispatch(incrementShareLocal()); // Feedback imediato
    
    const res = await fetch(`/api/listing/share/${listingId}`, {
      method: 'POST',
    });
    
    const data = await res.json();
    if (data.success) {
      dispatch(shareCountSuccess(data.shares));
    }
  } catch (error) {
    console.error('Erro ao incrementar compartilhamentos:', error);
  }
};

// Thunk para alternar curtida
export const toggleLike = (listingId) => async (dispatch, getState) => {
  try {
    const { currentUser } = getState().user;
    
    if (!currentUser) {
      alert("Faça login para curtir esta propriedade!");
      return;
    }
    
    dispatch(likeStart());
    
    const res = await fetch(`/api/like/toggle/${listingId}`, {
      method: "POST",
    });
    
    const data = await res.json();
    dispatch(likeSuccess({ liked: data.liked }));
    
    // Atualizar contagem de curtidas
    const countRes = await fetch(`/api/like/count/${listingId}`);
    const countData = await countRes.json();
    dispatch(likeCountSuccess(countData.count));
    
  } catch (error) {
    dispatch(likeFailure(error.message));
  }
};