import { useState } from 'react';
import {
    getDownloadURL, 
    getStorage, 
    ref, 
    uploadBytesResumable
} from 'firebase/storage';
import {app} from '../firebase';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

export default function CreateListing() {
    const navigate = useNavigate();
    const {currentUser} = useSelector((state)=>state.user);
    const [files, setFiles] = useState([]); 
    
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [erroSubmit, setErrorSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "casa",
        transactionType: "venda",
        bedroom: 1,
        bathroom: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        finished: false,
    });

    // Função para verificar se o tipo é terreno, machamba ou obra
    const isLandType = () => {
        return formData.type === 'terreno' || formData.type === 'machamba' || formData.type === 'obra';
    };

    // Função para verificar se é obra (para mostrar campo "finished")
    const isObraType = () => {
        return formData.type === 'obra';
    };

    // Função para verificar se é casa ou apartamento (para mostrar quartos/banheiros)
    const isHouseType = () => {
        return formData.type === 'casa' || formData.type === 'apartamento';
    };

    // Função para mostrar o texto do preço baseado no tipo de transação
    const getPriceLabel = () => {
        if (formData.transactionType === 'arrendar') {
            return formData.type === 'apartamento' ? '($ / mês)' : '($ / mês)';
        }
        return '($)';
    };
    
    const handleImageSubmit = (e) =>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({
                    ...formData, 
                    imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) =>{
                setImageUploadError('Falha no upload da imagem (máximo 2 MB por imagem)');
                setUploading(false);
            });
        }else{
            setImageUploadError('Você só pode fazer upload de 6 imagens por anúncio');
            setUploading(false);
        }
    };
    
    const storeImage = async (file) =>{
        return new Promise((resolve, reject) =>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload está ${progress}% concluído`);
                },
                (error) => {
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downlodURL) => {
                        resolve(downlodURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) =>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i !== index),
        });
    };
    
    const handleChange = (e) =>{
        // Para radio buttons do tipo de propriedade
        if(e.target.type === 'radio' && e.target.name === 'propertyType'){
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        
        // Para radio buttons do tipo de transação
        if(e.target.type === 'radio' && e.target.name === 'transactionType'){
            setFormData({
                ...formData,
                transactionType: e.target.id
            });
        }
        
        // Para checkboxes de características
        if(e.target.id === 'parking' || e.target.id === 'finished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }

        // Para inputs de texto, número e textarea
        if(
            e.target.type === 'number' || 
            e.target.type === 'text' || 
            e.target.type === 'textarea')
        {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            if(formData.imageUrls.length < 1) return setErrorSubmit('Você deve fazer upload de pelo menos uma imagem');
            if(+formData.regularPrice < +formData.discountPrice) return setErrorSubmit("O preço com desconto deve ser menor que o preço regular");
            
            // Validações específicas por tipo
            if(isHouseType() && (!formData.bedroom || !formData.bathroom)) {
                return setErrorSubmit("Quartos e banheiros são obrigatórios para casas e apartamentos");
            }
            
            setLoadingSubmit(true);
            setErrorSubmit(false);
            const res = await fetch('/api/listing/create',{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoadingSubmit(false);
            if(data.success === false){
                setErrorSubmit(data.message);
            }
            navigate(`/listing/${data._id}`);
        }catch(error){
            setErrorSubmit(error.message);
            setLoadingSubmit(false);
        }
    }
    
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Criar Anúncio</h1>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className='flex flex-col gap-4 flex-1'>
                    <input 
                        type="text" 
                        placeholder='Nome' 
                        className='border p-3 rounded-lg' 
                        id='name' 
                        maxLength='62' 
                        minLength='10' 
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />

                    <textarea
                        type="textarea" 
                        placeholder='Descrição' 
                        className='border p-3 rounded-lg' 
                        id='description' 
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    <input 
                        type="text" 
                        placeholder='Endereço' 
                        className='border p-3 rounded-lg' 
                        id='address' 
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    {/* Seção de Tipo de Transação */}
                    <div className='flex flex-col gap-4'>
                        <p className='font-semibold'>Tipo de Transação:</p>
                        <div className='flex flex-wrap gap-4'>
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='venda' 
                                    name='transactionType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.transactionType === 'venda'}
                                />
                                <label htmlFor='venda' className='cursor-pointer'>Venda</label>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='arrendar' 
                                    name='transactionType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.transactionType === 'arrendar'}
                                />
                                <label htmlFor='arrendar' className='cursor-pointer'>arrendar</label>
                            </div>
                        </div>
                    </div>

                    {/* Seção de Tipo de Propriedade */}
                    <div className='flex flex-col gap-4'>
                        <p className='font-semibold'>Tipo de Propriedade:</p>
                        <div className='flex flex-wrap gap-4'>
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='casa' 
                                    name='propertyType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'casa'}
                                />
                                <label htmlFor='casa' className='cursor-pointer'>Casa</label>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='apartamento' 
                                    name='propertyType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'apartamento'}
                                />
                                <label htmlFor='apartamento' className='cursor-pointer'>Apartamento</label>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='terreno' 
                                    name='propertyType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'terreno'}
                                />
                                <label htmlFor='terreno' className='cursor-pointer'>Terreno</label>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='machamba' 
                                    name='propertyType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'machamba'}
                                />
                                <label htmlFor='machamba' className='cursor-pointer'>Machamba</label>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="radio" 
                                    id='obra' 
                                    name='propertyType'
                                    className='w-5 h-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'obra'}
                                />
                                <label htmlFor='obra' className='cursor-pointer'>Obra</label>
                            </div>
                        </div>
                    </div>

                    {/* Características - Mostradas de acordo com o tipo */}
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input 
                                type="checkbox" 
                                id='parking' 
                                className='w-5 h-5 cursor-pointer'
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <label htmlFor='parking' className='cursor-pointer'>Estacionamento</label>
                        </div>
                        
                        {(isHouseType() || isObraType()) && (
                            <div className='flex gap-2'>
                                <input 
                                    type="checkbox" 
                                    id='finished' 
                                    className='w-5 h-5 cursor-pointer'
                                    onChange={handleChange}
                                    checked={formData.finished}
                                />
                                <label htmlFor='finished' className='cursor-pointer'>Finalizado</label>
                            </div>
                        )}
                        
                        <div className='flex gap-2'>
                            <input 
                                type="checkbox" 
                                id='offer' 
                                className='w-5 h-5 cursor-pointer'
                                onChange={handleChange}
                                checked={formData.offer} 
                            />
                            <label htmlFor='offer' className='cursor-pointer'>Oferta</label>
                        </div>
                    </div>

                    {/* Detalhes específicos por tipo */}
                    <div className='flex flex-wrap gap-6'>
                        {isHouseType() && (
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="number" 
                                    id='bedroom' 
                                    min='1' 
                                    max='10' 
                                    required 
                                    className='p-3 border border-gray-300 rounded-lg w-20'
                                    onChange={handleChange}
                                    value={formData.bedroom} 
                                />
                                <label htmlFor='bedroom'>Quartos</label>
                            </div>
                        )}
                        
                        {isHouseType() && (
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="number" 
                                    id='bathroom' 
                                    min='1' 
                                    max='10' 
                                    required 
                                    className='p-3 border border-gray-300 rounded-lg w-20'
                                    onChange={handleChange}
                                    value={formData.bathroom} 
                                />
                                <label htmlFor='bathroom'>Banheiros</label>
                            </div>
                        )}
                        
                        <div className='flex items-center gap-2'>
                            <input 
                                type="number" 
                                id='regularPrice' 
                                min='50' 
                                max='10000000' 
                                required 
                                className='p-3 border border-gray-300 rounded-lg w-40'
                                onChange={handleChange}
                                value={formData.regularPrice} 
                            />
                            <div className='flex flex-col items-center'>                           
                                <label htmlFor='regularPrice'>Preço Regular</label>
                                <span className='text-xs'>{getPriceLabel()}</span>
                            </div>
                        </div>
                        
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="number" 
                                    id='discountPrice' 
                                    min='0' 
                                    max='10000000' 
                                    required 
                                    className='p-3 border border-gray-300 rounded-lg w-40'
                                    onChange={handleChange}
                                    value={formData.discountPrice} 
                                />
                                <div className='flex flex-col items-center'>                           
                                    <label htmlFor='discountPrice'>Preço com Desconto</label>
                                    <span className='text-xs'>{getPriceLabel()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Seção de Upload de Imagens */}
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Imagens:
                        <span className='font-normal text-gray-600 ml-2'>
                            A primeira imagem será a capa (máx 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input 
                            onChange={(e)=>setFiles(e.target.files)}
                            className='p-3 border border-gray-300 rounded w-full cursor-pointer' 
                            type="file" 
                            id='images' 
                            accept='image/*' 
                            multiple
                        />
                        <button 
                            disabled={uploading}
                            type='button'
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 whitespace-nowrap'>
                            {uploading ? 'Carregando...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>(
                        <div 
                            key={url}
                            className='flex justify-between p-3 items-center border rounded-lg'>
                            <img 
                                src={url}
                                alt='listing image' 
                                className='w-20 h-20 object-contain rounded-lg'
                            />
                            <button 
                                type='button' 
                                onClick={()=> handleRemoveImage(index)}
                                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                                Apagar
                            </button>
                        </div>
                    ))}
                    
                    <button
                        type='submit'
                        disabled={loadingSubmit}
                        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>
                        {loadingSubmit ? 'Criando...' : 'Criar Anúncio'}
                    </button>
                    {erroSubmit && <p className='text-red-700 text-sm'>{erroSubmit}</p>}
                </div>
            </form>
        </main>
    )
}