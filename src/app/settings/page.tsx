'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');

  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+33 6 12 34 56 78'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailTransactions: true,
    emailPromotions: false,
    pushNotifications: true,
    smsAlerts: false
  });

  const [preferences, setPreferences] = useState({
    currency: 'EUR',
    theme: 'dark'
  });

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    // Appel API pour sauvegarder le profil
  };

  const handleSaveSecurity = () => {
    console.log('Saving security:', securityData);
    // Appel API pour changer le mot de passe
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Préférences', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header avec retour */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Retour"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">DCARD</h1>
          <span className="text-sm opacity-75">• Paramètres</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sécurité */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleSaveSecurity}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Authentification à deux facteurs</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activer 2FA</p>
                  <p className="text-sm opacity-70">Protection supplémentaire de votre compte</p>
                </div>
                <button
                  onClick={() => setSecurityData({ ...securityData, twoFactorEnabled: !securityData.twoFactorEnabled })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    securityData.twoFactorEnabled ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Gérer les notifications</h2>
            
            <div className="space-y-4">
              {[
                { key: 'emailTransactions', label: 'Emails de transaction', desc: 'Recevoir un email pour chaque transaction' },
                { key: 'emailPromotions', label: 'Emails promotionnels', desc: 'Offres spéciales et nouveautés' },
                { key: 'pushNotifications', label: 'Notifications push', desc: 'Alertes sur votre appareil' },
                { key: 'smsAlerts', label: 'Alertes SMS', desc: 'SMS pour les transactions importantes' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm opacity-70">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({ 
                      ...notificationSettings, 
                      [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings] 
                    })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Préférences */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Langue</h2>
              
              <div className="space-y-2">
                {[
                  { code: 'fr', label: '🇫🇷 Français' },
                  { code: 'en', label: '🇬🇧 English' },
                  { code: 'es', label: '🇪🇸 Español' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                      language === lang.code
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Devise</h2>
              
              <div className="space-y-2">
                {[
                  { code: 'EUR', label: '€ Euro (EUR)' },
                  { code: 'USD', label: '$ Dollar (USD)' },
                  { code: 'GBP', label: '£ Livre (GBP)' }
                ].map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => setPreferences({ ...preferences, currency: curr.code })}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                      preferences.currency === curr.code
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-red-400">Zone de danger</h2>
              
              <button
                onClick={logout}
                className="w-full py-3 bg-red-600/20 border border-red-600 rounded-xl font-semibold hover:bg-red-600/30 transition-all mb-3"
              >
                Déconnecter
              </button>

              <button
                onClick={() => console.log('Delete account')}
                className="w-full py-3 bg-red-600 rounded-xl font-semibold hover:bg-red-700 transition-all"
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

