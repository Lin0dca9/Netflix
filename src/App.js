
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import React, { useEffect, useState } from 'react';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

// eslint-disable-next-line import/no-anonymous-default-export
export default ()=> {
  
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState([null]);
  const [blackHeader, setBlackHeader] = useState([false])
  useEffect(()=>{
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let item  = await Tmdb.getHomeList();
      setMovieList(item);

      // Pegando o Featured
      let originals = item.filter(i=> i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen =originals[0].items.results[randomChosen];
      console.log(chosen.id)
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      console.log(chosenInfo)
      setFeaturedData(chosenInfo);


    }

    loadAll();
  },[]);

  useEffect(()=>{
    const scrollListener = ()=> {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }

    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },[]);
  return(
    <div className="page">
      <Header black={blackHeader} />
        {featuredData &&
          <FeaturedMovie item={featuredData} />
        }
        <section className="lists">
          {movieList.map((item, key)=>(
            <MovieRow key={key} title={item.title} items={item.items}/>
          ))}
        </section>

        <footer>
          Feito com <span role="img" aria-label="coração">❤️</span>pela B7Web<br/>
          Direitos de imagem para Netflix<br/>
          Dados pegos do site Themoviedb.org
        </footer>
              {movieList.length <= 0 &&
              <div className="loading">
                <img src="./netflix-loading.gif" alt="Carregando" />
              </div>
              }
      </div>
  );
}
