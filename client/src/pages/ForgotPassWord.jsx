import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  forgotStart, 
  forgotSuccess, 
  forgotFailure 
} from '../redux/user/userSlice.js'

export default function ForgotPassWord() {

const [formData, setFormData]=useState({});
const {loading, error}=useSelector((state)=>state.user);
const navigate =useNavigate();
const dispatch =useDispatch();

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
  });
};
const handleSubmit = async (e)=>{
  e.preventDefault();
  try{
    dispatch(forgotStart());
    const res = await fetch('/api/auth/forgot',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success===false){
      dispatch(forgotFailure(data.message));
      return;
    }
    dispatch(forgotSuccess(data));
    alert("Check your email")
    navigate('/');
  }catch(error){
    dispatch(forgotFailure(error.message));
  }
};

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Forgot Password</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
          
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...': 'Send to '}
          </button>
        </form>
        
        {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
