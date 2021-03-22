import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { ru } from 'date-fns/locale'

import mapiService from '../../services/mapi-service';
// import posterNone from '../../img/poster_none.jpg';

import './movies-list.css';


export default class MoviesList extends React.Component {
  // constructor(props) {
  //   super(props);

  //   // this.state = {
  //   //   name: "Movie1",
  //   // }
  // }

  componentDidMount() {
    
    mapiService.getLocalGenreConfig();
    // const genreList = mapiService.getLocalGenreConfig();
    // console.log(genreList);
  }

  componentDidUpdate() {

    const descriptionsArr = document.querySelectorAll('.movie__description--text');
    const maxlength = 200;
    // let acc = 0;

    const reduceLength = (text, currentLength) => {
      const newTextLength = currentLength - 1;
        if (text[newTextLength] !== " ") {
          /* eslint no-unused-vars: "off" */
          return reduceLength(text, newTextLength );
        } 
      return newTextLength ;
    };

    descriptionsArr.forEach((description) => {

      const countChildElementsHeight = (element) => {

        // console.log(element);

        let acc = 0;

          for (const child of element) {
            acc += child.offsetHeight;         
          };

        console.log(`ACC = ${acc}`);
        return acc;
      };

      const allChildrenHeight = countChildElementsHeight(description.parentElement.children);
      console.log(` all children height: ${allChildrenHeight}`);

      let lessLength = maxlength - 10;

      if ( countChildElementsHeight(description.parentElement.children) > 
      description.parentElement.offsetHeight ) {
        console.log(`All elements scrollHeight (text included) : 
          ${countChildElementsHeight(description.parentElement.children)}`);

        let test = 0;
        while( countChildElementsHeight(description.parentElement.children) 
        > description.parentElement.offsetHeight || test < 10) {

          const currentLength = reduceLength(description.innerText, lessLength);
          console.log(currentLength);
          console.log(description.innerText);

          const txt = `${description.innerText.slice( 0, currentLength )  }`
          description.innerText = `${txt.trim()  }...`;
          
          console.log(test);
          console.log(`All elements scrollHeight (text included) : 
            ${countChildElementsHeight(description.parentElement.children)}`);
     
          lessLength -= 10;
          test ++;
        }
      }

      if (description.offsetHeight > description.parentElement.offsetHeight - 
        (description.parentElement.scrollHeight - description.offsetHeight)) {
          const currentLength = reduceLength(description.innerText, lessLength);

          const txt = `${description.innerText.slice( 0, currentLength )  }`
          description.innerText = `${txt.trim()  }...`;
        }
          
    });
  }
  
  render() {
    const { moviesList } = this.props
    const genreList = mapiService.getLocalGenreConfig();

    // console.log(moviesList);

    const recievedMovies = moviesList.map((movie) => { 

      let attachedGenres;
 
      // console.log(releaseDate);
      // if (Object.prototype.toString.call(releaseDate) === "[object Date]") {
      //   // it is a date
      //   /* eslint no-restricted-globals: ["off", "isNaN"] */
      //   if (isNaN(releaseDate.getTime())) {  // d.valueOf() could also work
      //     // date is not valid
          
      //     timeBlock = null;
      //     console.log(timeBlock);
      //     console.log("date is not valid");
      //   } else {
      //     // date is valid
          
      //     timeBlock = releaseDate;
      //     console.log(timeBlock);
      //     console.log(timeBlock);
      //     console.log("date is valid!");
      //   }
      // } else {
      //   // not a date
        
      //   timeBlock = null;
      //   console.log("not a date");
      // }
      // }
 

      if (movie.genre_ids.length === 0) {
        attachedGenres = null;
      } else {
        attachedGenres = movie.genre_ids.map((attachedGenre) =>  
      // <span className="movie__genre--name">{attachedGenre}</span>
      {
        const idx = genreList.find(item => item.id === attachedGenre);
      return <span className="movie__genre--name" key={attachedGenre}>{idx.name}</span>
      }
      );
      }

      const ReleaseDate = () => {
        if ( !Date.parse(movie.release_date) ) {
          return (<div className="movie__no-release-date">Release date not available</div>);
        }
        return (<div className="movie__release-date">{
          format(Date.parse(movie.release_date), 
          'MM/dd/yyyy', 
          {locale: ru})}
        </div>)
      }

     return  (<div className="movie" key={movie.id}>
      <a href="#" className="movie__link">
        <img src={mapiService.createPosterUrl(movie.poster_path)}
            className="movie__poster" 
            alt={movie.original_title} 
            width="183" 
            height="281"/>
      </a>
      <div className="movie__description">
        <h2 className="movie__name">{movie.original_title}</h2>
        <ReleaseDate />
        <div className="movie__genre">
        {attachedGenres}
        </div>
        <div className="movie__description--text">
          { movie.overview }
        </div>
      </div>
    </div>)
    });

    return (
      <section className="movies">
        <section className="movies-list">
        { recievedMovies }
          </section>
        </section>
    );
  }
}

MoviesList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};





// /*
// import React from 'react';
// import PropTypes from 'prop-types';
// import format from 'date-fns/format';
// import { ru } from 'date-fns/locale'

// import mapiService from '../../services/mapi-service';
// // import posterNone from '../../img/poster_none.jpg';

// import './movies-list.css';


// export default class MoviesList extends React.Component {
//   // constructor(props) {
//   //   super(props);

//   //   // this.state = {
//   //   //   name: "Movie1",
//   //   // }
//   // }

//   componentDidMount() {
    
//     mapiService.getLocalGenreConfig();
//     // const genreList = mapiService.getLocalGenreConfig();
//     // console.log(genreList);
//   }

//   componentDidUpdate() {

//     const descriptionsArr = document.querySelectorAll('.movie__description--text');
//     const maxlength = 200;
//     // let acc = 0;

//     const reduceLength = (text, currentLength) => {
//       const reducedLength = currentLength - 1;

//         if (text[reducedLength] !== " ") {
 
//           return reduceLength(text, reducedLength );
//         } 
        
//       return reducedLength ;
//     };

//     // console.log(descriptionsArr);

//     descriptionsArr.forEach(async (description) => {
//       const lessLength = maxlength - 10;
//       // let len = maxlength;
//       // console.log(description);
//       // console.log(description.parentElement);
//       // console.log(description.parentElement.offsetHeight);
//       // console.log(description.parentElement.scrollHeight);

//       // console.log(`CONTAINER : ${ description.parentElement.offsetHeight}`)
//       // console.log(`TEXT HEIGHT : ${description.offsetHeight}`);
//       console.log(description.parentElement);


//       // console.log(description.parentElement.children);
//       // console.log(description.parentElement[0]);

//       const countChildElementsHeight = (element) => {
//         let acc = 0;

//         // acc +=1;
//         console.log(element);
//         // return (element);

//         return () => {

//           for (const child of element) {
//             // console.log(child.offsetHeight);
//             // console.log(child.offsetHeight);
//             acc += child.offsetHeight;
            
//           };
//         //   acc += child.offsetHeight;
//         //   console.log(child.offsetHeight);
//         //   console.log(acc);
//         // console.log(` All elements height (text included)  = ${acc}`);
//         return acc;
//         }
//       };

//       const allChildrenHeight = countChildElementsHeight(description.parentElement.children);
//       console.log(`All elements scrollHeight (text included) : ${allChildrenHeight()}`);
//       console.log(`CONTAINER : ${description.parentElement.offsetHeight}`)
//       // console.log(`description.offsetHeight BEFORE : ${description.offsetHeight}`);
//       // console.log(`description.scrollHeight BEFORE : ${description.scrollHeight}`);

//       if (description.offsetHeight < description.scrollHeight) {
        
//         // console.log(description.offsetHeight);
//         // console.log(description.parentElement.offsetHeight);
//         // console.log(description.parentElement.children);
//         // console.log(description.parentElement.children.length);

//         // console.log(description.parentElement.offsetHeight - 
//         // (description.parentElement.scrollHeight - description.offsetHeight));
//         // console.log(description.innerText);

//         const lengthToBSP = reduceLength(description.innerText, maxlength);

//         if (description.offsetHeight > description.parentElement.offsetHeight - 
//             (description.parentElement.scrollHeight - description.offsetHeight)) {
//               // lengthToBSP = reduceLength( description.innerText, lessLength );
//               console.log(lengthToBSP);
//               console.error(lessLength);
//             }
          
//         while( countChildElementsHeight(description.parentElement.children) 
//           > description.parentElement.offsetHeight) {
            
//             // lengthToBSP = reduceLength( description.innerText, lessLength );
//             // lessLength -= 10;
            
//             // const txt = `${description.innerText.slice( 0, lengthToBSP )  }`
//             // description.innerText = `${txt.trim()  }...`;
//           }

//       //   $(".news").each(function() {
//       //     var $title = $(this).find("p");
     
//       //     while ($title.height() > $(this).height()) {
//       //       $title.text($title.text().split(" ").slice(0, $title.text().split(" ").length - 1).join(" ") + "...");
//       //     }
//       //   });
//       // })();
          
//         // console.log(description.parentElement.clientHeight);
//         // console.log(description.parentElement.offsetHeight);
//         // console.log(description.parentElement.scrollHeight);
//         // console.log(reduceLength);
        
        
//         // const txt = `${description.innerText.slice( 0, lengthToBSP )  }`
//         // description.innerText = `${txt.trim()  }...`;
//       }

//         // console.log(`UFTER`);
//         // console.log(`description.clientHeight = ${  description.clientHeight}`);
//         // console.log(`description.offsetHeight = ${  description.offsetHeight}`);
//         // console.log(`description.scrollHeight = ${  description.scrollHeight}`);
//         // console.log(description.offsetHeight < description.scrollHeight);
//         // console.log(description.parentElement);
//         // console.log("/-----/");

//       // console.log(`description.offsetHeight UFTER :  ${description.offsetHeight}`);
//       // console.log(`description.scrollHeight UFTER : ${description.scrollHeight}`);
//       // console.log(`CONTAINER : ${description.parentElement.offsetHeight}`)
//       // console.log(`TEXT HEIGHT : ${description.offsetHeight}`);
//       // console.log(`TEXT HEIGHT : ${description.offsetHeight}`);
//       console.log(`//--------`);
//     });
//   }
  
//   render() {
//     const { moviesList } = this.props
//     const genreList = mapiService.getLocalGenreConfig();

//     // console.log(moviesList);

//     const recievedMovies = moviesList.map((movie) => { 

//       let attachedGenres;
 
//       // console.log(releaseDate);
//       // if (Object.prototype.toString.call(releaseDate) === "[object Date]") {
//       //   // it is a date
//       //   /* eslint no-restricted-globals: ["off", "isNaN"] */
//       //   if (isNaN(releaseDate.getTime())) {  // d.valueOf() could also work
//       //     // date is not valid
          
//       //     timeBlock = null;
//       //     console.log(timeBlock);
//       //     console.log("date is not valid");
//       //   } else {
//       //     // date is valid
          
//       //     timeBlock = releaseDate;
//       //     console.log(timeBlock);
//       //     console.log(timeBlock);
//       //     console.log("date is valid!");
//       //   }
//       // } else {
//       //   // not a date
        
//       //   timeBlock = null;
//       //   console.log("not a date");
//       // }
//       // }
 

//       if (movie.genre_ids.length === 0) {
//         attachedGenres = null;
//       } else {
//         attachedGenres = movie.genre_ids.map((attachedGenre) =>  
//       // <span className="movie__genre--name">{attachedGenre}</span>
//       {
//         const idx = genreList.find(item => item.id === attachedGenre);
//       return <span className="movie__genre--name" key={attachedGenre}>{idx.name}</span>
//       }
//       );
//       }

//       const ReleaseDate = () => {
//         if ( !Date.parse(movie.release_date) ) {
//           return (<div className="movie__no-release-date">Release date not available</div>);
//         }
//         return (<div className="movie__release-date">{
//           format(Date.parse(movie.release_date), 
//           'MM/dd/yyyy', 
//           {locale: ru})}
//         </div>)
//       }

//      return  (<div className="movie" key={movie.id}>
//       <a href="#" className="movie__link">
//         <img src={mapiService.createPosterUrl(movie.poster_path)}
//             className="movie__poster" 
//             alt={movie.original_title} 
//             width="183" 
//             height="281"/>
//       </a>
//       <div className="movie__description">
//         <h2 className="movie__name">{movie.original_title}</h2>
//         <ReleaseDate />
//         <div className="movie__genre">
//         {attachedGenres}
//         </div>
//         <div className="movie__description--text">
//           { movie.overview }
//         </div>
//       </div>
//     </div>)
//     });

//     return (
//       <section className="movies">
//         <section className="movies-list">
//         { recievedMovies }
//           </section>
//         </section>
//     );
//   }
// }

// MoviesList.propTypes = {
//   moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
// };
// */