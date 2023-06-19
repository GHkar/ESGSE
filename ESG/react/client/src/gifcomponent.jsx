import React from 'react';


const GifComponent = ({ gif }) => {
  return (
    <div>
      <img className="block w-3/4 h-3/4 m-auto" src={gif} alt="..." />
    </div>
  );
};

export default GifComponent;
