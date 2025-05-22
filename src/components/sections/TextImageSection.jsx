import React from 'react';

const TextImageSection = ({ title, text, image, reverse }) => {
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

export default TextImageSection; 