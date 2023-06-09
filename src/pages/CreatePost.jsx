import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormsFields, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generatedImage = async () => {
    console.log({form});
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://brownie-gallery.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt: form.prompt })
        })

        const data = await response.json()
        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})
      } catch(err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      try {
        setLoading(true);
        const response = await fetch('https://brownie-gallery.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })
        await response.json();
        navigate('/')
      }
      catch(err) {
        alert(err);
      }
      finally {
        setLoading(false);
      }
      
    }
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt: randomPrompt});
    console.log({randomPrompt});
    console.log({form})
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        {/* <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create
        </h1> */}
        <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'>
          Create imaginative and visually stunning images and share them with the brownie gallery
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormsFields 
            labelName="Your Name"
            type="text"
            name="name"
            placeholder='John Doe'
            value={form.name}
            handleChange={handleChange}
          />
          <FormsFields 
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder='A painting of a fox in the style of Starry Night'
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
        </div>

        <div
            className='relative mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-contain'
        >
            {
                form.photo ? 
                (<img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />) 
                : ( <img src={preview} alt='Preview' className='w-9/12 h-9/12 object-contain opacity-40' />)
            }

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}

        </div>

        {/* {
          generatingImg && (
            <div className='absolute inset-0 z-0 flex justify-content items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
              <Loader />
            </div>
          )
        } */}

          

        <div className='mt-5 flex gap-5'>
          <button type='button' className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' onClick={generatedImage}>
            { generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            Once you have created the image you want, you can share it with others in the community
            <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
              {loading ? 'Sharing...' : 'Share with the Brownie Gallery'}
            </button>
          </p>
        </div>

      </form>
    </section>
  )
}

export default CreatePost
