import React, { useEffect, useState } from 'react'
import { Cards, FormsFields, Loader } from '../components'

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://brownie-gallery.onrender.com/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const result = await response.json();
          console.log({result});
          setPosts(result.data.reverse());
        } 
      } catch(err) {
        alert(err);
      } 
      finally {
        setLoading(false);
      }
    }
    fetchPosts()
  }, [])


  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    console.log({searchText});
    setSearchTimeout(
      setTimeout(() => {
      const searchResult = post.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes((searchText.toLowerCase())));
      setSearchResult(searchResult);
    }, 500));
  }

  const RenderCards = ({ data, title }) => {
    if (data?.length) {
      return data.map((post) => <Cards key={post._id} {...post} />)
    }
    return <h2 className='mt-5 font-bold text-[#64] text-xl uppercase'>{title}</h2>
  };


  return (
    <section className='max-w-7xl mm-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          The Brownie Gallery
        </h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'>Browse through a collection of imaginative and visually stunning images</p>
      </div>

      <div className='mt-16'>
        <FormsFields
          labelName="Search Post"
          type="text"
          name="text"
          placeholder="Search Post"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-10'>
        {
          loading ? (<div className='flex justify-center'>
            <Loader />
          </div>) : (
            <>
              {searchText && (
                <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                  Showing results for <span className='text-[#222328]'>{searchText}</span>
                </h2>
              )}
              <div className='grid lg:grid-cols-4 sm:gird-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                    { searchText ? (
                      <RenderCards data={searchResult} title="No Search Results founds"/>
                    ): (
                      <RenderCards data={post} title="No Posts found" />
                    )
                    }
              </div>
            </>
          )
        }
      </div>


    </section>
  )
}

export default Home