import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <main>
      <div className="container">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>Address</h3>
                <p>123 Tech Street</p>
                <p>Silicon Valley, CA 94025</p>
              </div>
              
              <div className="contact-item">
                <h3>Email</h3>
                <p>info@joyspan.com</p>
                <p>support@joyspan.com</p>
              </div>
              
              <div className="contact-item">
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>+1 (555) 987-6543</p>
              </div>
            </div>
          </div>
          
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact; 