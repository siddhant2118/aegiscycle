
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
        </div>
      <span className="font-bold text-xl text-slate-900 dark:text-slate-50">AegisCycle</span>
    </Link>
  );
};

export default Logo;
