'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import './StaggeredMenu.css';

interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  icon?: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  items: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  colors?: string[];
  accentColor?: string;
  logoUrl?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  userSession?: any;
  onLogout?: () => void;
}

const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  items,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  colors = ['#6B73FF', '#9B59B6'],
  accentColor = '#9B59B6',
  logoUrl = '',
  onMenuOpen,
  onMenuClose,
  userSession,
  onLogout
}) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const toggleMenu = () => {
    setOpen(!open);
    if (!open) {
      onMenuOpen?.();
    } else {
      onMenuClose?.();
    }
  };

  // Gestion du focus pour l'accessibilité
  useEffect(() => {
    if (!open && panelRef.current) {
      // Retirer le focus de tous les éléments interactifs dans le panel fermé
      const focusableElements = panelRef.current.querySelectorAll('a, button, input, textarea, select');
      focusableElements.forEach(element => {
        if (document.activeElement === element) {
          (element as HTMLElement).blur();
        }
      });
    }
  }, [open]);

  const handleItemClick = (item: MenuItem) => {
    setOpen(false);
    onMenuClose?.();
    
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      window.location.href = item.link;
    }
  };

  const handleSocialClick = (social: SocialItem) => {
    window.open(social.link, '_blank');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="staggered-menu-button"
        style={{
          color: open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 100
        }}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <div 
          className="hamburger"
          style={{
            position: 'relative',
            width: '20px',
            height: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <span 
            className={`line ${open ? 'line-1-open' : ''}`}
            style={{
              width: '100%',
              height: '2px',
              background: 'currentColor',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transformOrigin: 'center'
            }}
          ></span>
          <span 
            className={`line ${open ? 'line-2-open' : ''}`}
            style={{
              width: '100%',
              height: '2px',
              background: 'currentColor',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transformOrigin: 'center'
            }}
          ></span>
          <span 
            className={`line ${open ? 'line-3-open' : ''}`}
            style={{
              width: '100%',
              height: '2px',
              background: 'currentColor',
              borderRadius: '1px',
              transition: 'all 0.3s ease',
              transformOrigin: 'center'
            }}
          ></span>
        </div>
      </button>

      {/* Menu Panel */}
      <div
        ref={panelRef}
        className={`staggered-menu-panel ${open ? 'open' : ''} ${position}`}
        style={{
          position: 'fixed',
          top: 0,
          right: position === 'left' ? 'auto' : 0,
          left: position === 'left' ? 0 : 'auto',
          width: '72vw',
          maxWidth: '420px',
          height: '100vh',
          background: 'linear-gradient(180deg, #6B73FF 0%, #9B59B6 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '3em 1.5em 1.5em 1.5em',
          overflowY: 'auto',
          zIndex: 50,
          transform: open ? 'translateX(0)' : `translateX(${position === 'left' ? '-100%' : '100%'})`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: open ? 1 : 0,
          boxShadow: '0 0 50px rgba(107, 115, 255, 0.3)',
          pointerEvents: open ? 'auto' : 'none'
        }}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="sm-panel-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* User Session Section */}
          <div className="sm-login-section" style={{ marginBottom: '1rem' }}>
            {userSession ? (
              <div className="sm-user-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', textAlign: 'center' }}>
                <div className="sm-user-details" style={{ marginBottom: '0.5rem' }}>
                  <div className="sm-user-name" style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#10B981', 
                      borderRadius: '50%', 
                      boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
                      flexShrink: 0
                    }}></div>
                    {userSession.user?.name || 'User'}
                  </div>
                  <div className="sm-user-email" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', fontWeight: 400 }}>
                    {userSession.user?.email || 'user@example.com'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="sm-logout-btn"
                  tabIndex={open ? 0 : -1}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem',
                    background: 'rgba(255, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 0, 0, 0.4)',
                    borderRadius: '6px',
                    color: '#ff6b6b',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleItemClick({ label: 'Login', ariaLabel: 'Login', link: '/login' })}
                className="sm-login-btn"
                tabIndex={open ? 0 : -1}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Log In / Sign Up
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={{ 
            height: '1px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            margin: '0.75rem 0',
            borderRadius: '1px'
          }}></div>

          {/* Menu Items */}
          <nav className={`sm-nav ${displayItemNumbering ? 'sm-panel-list' : ''}`} data-numbering={displayItemNumbering} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {items.map((item, index) => (
              <a
                key={item.label}
                href={item.link}
                className={`sm-panel-item ${hoveredItem === index ? 'hovered' : ''}`}
                style={{
                  position: 'relative',
                  color: hoveredItem === index ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                  textTransform: 'uppercase',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  transform: hoveredItem === index ? 'translateX(10px)' : 'translateX(0)',
                  textShadow: hoveredItem === index ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
                  padding: '0.4rem 0'
                } as React.CSSProperties}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item);
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                aria-label={item.ariaLabel}
                tabIndex={open ? 0 : -1}
              >
                {displayItemNumbering && (
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.6)',
                    minWidth: '2rem',
                    textAlign: 'left'
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                {/* Icônes pour chaque élément */}
                {item.label === 'History' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.label === 'Home' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {item.label === 'Verify' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.label === 'Settings' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {item.label === 'Contact' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {item.label === 'About' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.label === 'Services' && (
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                <span className="sm-item-label">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Divider avant les boutons de langue */}
          <div style={{ 
            height: '1px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            margin: '1.5rem 0 1rem 0',
            borderRadius: '1px'
          }}></div>

          {/* Language Selection */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              margin: '0 0 0.75rem 0', 
              fontSize: '1rem', 
              fontWeight: 500, 
              color: 'rgba(255, 255, 255, 0.8)' 
            }}>
              Language / Langue / Idioma
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* English */}
              <button
                onClick={() => handleLanguageChange('en')}
                className="sm-language-button"
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: language === 'en' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  color: language === 'en' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                tabIndex={open ? 0 : -1}
              >
                US English
              </button>
              
              {/* Spanish */}
              <button
                onClick={() => handleLanguageChange('es')}
                className="sm-language-button"
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: language === 'es' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  color: language === 'es' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                tabIndex={open ? 0 : -1}
              >
                ES Español
              </button>
              
              {/* French */}
              <button
                onClick={() => handleLanguageChange('fr')}
                className="sm-language-button"
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: language === 'fr' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  color: language === 'fr' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                tabIndex={open ? 0 : -1}
              >
                FR Français
              </button>
            </div>
          </div>

          {/* Divider avant les liens sociaux */}
          {displaySocials && socialItems.length > 0 && (
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.2)', 
              margin: '1.5rem 0 1rem 0',
              borderRadius: '1px'
            }}></div>
          )}

          {/* Social Links */}
          {displaySocials && socialItems.length > 0 && (
            <div style={{ marginTop: 'auto', paddingTop: '0', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {socialItems.map((social, index) => (
                  <li key={social.label}>
                    <a
                      href={social.link}
                      className="sm-social-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialClick(social);
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.label}`}
                      tabIndex={open ? 0 : -1}
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        position: 'relative',
                        padding: '2px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease',
                        opacity: 1
                      }}
                    >
                      {social.label === 'X' && (
                        <svg style={{ width: '2rem', height: '2rem' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )}
                      {social.label === 'Facebook' && (
                        <svg style={{ width: '2rem', height: '2rem' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                      {social.label === 'GitBook' && (
                        <svg style={{ width: '2rem', height: '2rem' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 2c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6zm0 2c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 2c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"/>
                        </svg>
                      )}
                      {social.label === 'TikTok' && (
                        <svg style={{ width: '2rem', height: '2rem' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      )}
                      {social.label === 'Instagram' && (
                        <svg style={{ width: '2rem', height: '2rem' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 5.008 0 3.324.014 3.727.072 5.008.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 5.008.072 3.324 0 3.727-.014 5.008-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-5.008 0-3.324-.014-3.727-.072-5.008-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-5.008-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      <span className="sm-social-text" style={{ fontSize: '1.2rem', fontWeight: 500 }}>{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Logo */}
          {logoUrl && (
            <div className="sm-logo-section">
              <img src={logoUrl} alt="Logo" className="sm-logo" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StaggeredMenu;


