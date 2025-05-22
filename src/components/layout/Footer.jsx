import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RiFacebookCircleFill,
  RiTwitterXFill,
  RiInstagramFill,
  RiLinkedinBoxFill
} from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="bg-light py-5 mt-auto">
      <div className="container">
        <div className="row align-items-center mb-4">
          <div className="col-md-4 text-center text-md-start">
            <Link to="/">
              <img src="/logo.png" alt="JoySpan Logo" className="h-40" />
            </Link>
          </div>
          <div className="col-md-4">
            <nav className="d-flex justify-content-center">
              <ul className="nav">
                <li className="nav-item">
                  <Link to="/me" className="nav-link text-dark">ME</Link>
                </li>
                <li className="nav-item">
                  <Link to="/you" className="nav-link text-dark">You</Link>
                </li>
                <li className="nav-item">
                  <Link to="/us" className="nav-link text-dark">Us</Link>
                </li>
                <li className="nav-item">
                  <Link to="/support" className="nav-link text-dark">Support</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiFacebookCircleFill />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiTwitterXFill />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiInstagramFill />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiLinkedinBoxFill />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center border-top pt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Joyspan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 