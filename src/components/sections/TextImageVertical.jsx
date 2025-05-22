import React from 'react';

const TextImageVertical = ({ title, text, image }) => {
  return (
    <section>
      <div>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div>
          <img src={image} alt={title} />
        </div>
      </div>
    </section>
  );
};

export default TextImageVertical; 