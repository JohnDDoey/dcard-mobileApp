# 🌍 Guide des Traductions DCARD

## 📋 Langues supportées

- 🇺🇸 **Anglais** (US English) - `en`
- 🇫🇷 **Français** (FR Français) - `fr`
- 🇪🇸 **Espagnol** (ES Español) - `es`

## 📁 Structure

```
src/
├── locales/
│   └── translations.json      # Toutes les traductions
├── contexts/
│   └── LanguageContext.tsx    # Context pour gérer la langue
└── components/
    └── LanguageSelector.tsx   # Composant sélecteur de langue
```

## 🎯 Utilisation dans les composants

### 1. Importer le hook

```tsx
import { useLanguage } from '@/contexts/LanguageContext';
```

### 2. Utiliser dans le composant

```tsx
export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <button>{t('common.sendMoney')}</button>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### 3. Changer la langue

```tsx
// Dans un bouton
<button onClick={() => setLanguage('fr')}>
  Français
</button>
```

## 📝 Structure des clés de traduction

Les traductions sont organisées par section :

```
translations.json
├── en / fr / es
    ├── common          # Textes communs (welcome, continue, etc.)
    ├── home            # Page d'accueil
    ├── login           # Page de connexion/inscription
    ├── sendMoney       # Flow d'envoi d'argent
    ├── history         # Page historique
    └── menu            # Menu de navigation
```

### Exemple d'accès :

```tsx
t('common.welcome')           // "Welcome" / "Bienvenue" / "Bienvenido"
t('sendMoney.estimate')       // "Estimate" / "Estimation" / "Estimación"
t('history.totalTransactions') // "Total transactions:" / ...
```

## ✏️ Ajouter une nouvelle traduction

### 1. Ouvrir `src/locales/translations.json`

### 2. Ajouter la clé dans les 3 langues

```json
{
  "en": {
    "newSection": {
      "newKey": "English text"
    }
  },
  "fr": {
    "newSection": {
      "newKey": "Texte français"
    }
  },
  "es": {
    "newSection": {
      "newKey": "Texto español"
    }
  }
}
```

### 3. Utiliser dans le composant

```tsx
const { t } = useLanguage();
<p>{t('newSection.newKey')}</p>
```

## 🎨 Composants déjà traduits

- ✅ **Page d'accueil** (`/`)
- ✅ **Menu de navigation** (`StaggeredMenu`)
- 🚧 **Page Login** (à faire)
- 🚧 **Send Money** (à faire)
- 🚧 **History** (à faire)

## 🔄 Exemple complet - Page Login

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('login.title')}</h1>
      
      <input 
        type="email" 
        placeholder={t('login.enterEmail')}
      />
      
      <input 
        type="password" 
        placeholder={t('login.enterPassword')}
      />
      
      <button>{t('login.loginButton')}</button>
      <button>{t('login.registerNow')}</button>
    </div>
  );
}
```

## 🌐 Sélecteur de langue

Le sélecteur de langue est intégré dans le `StaggeredMenu` (menu hamburger).

Pour l'utiliser ailleurs :

```tsx
import LanguageSelector from '@/components/LanguageSelector';

<LanguageSelector />
```

## 💾 Persistance

La langue sélectionnée est sauvegardée dans `localStorage` :
- Clé : `dcard-language`
- Valeur : `en` | `fr` | `es`

Elle est automatiquement rechargée au prochain chargement de la page.

## 🚀 TODO - Pages à traduire

### Pages prioritaires :

1. [ ] **Login/Register** - `/login`
2. [ ] **Send Money** - `/send-money` et ses étapes
3. [ ] **History** - `/history`
4. [ ] **Components** :
   - [ ] EstimateStep
   - [ ] ReceiverInformation
   - [ ] PaymentStep
   - [ ] ReviewStep
   - [ ] LoadingPage

### Commandes pour traduire :

Pour chaque composant :
1. Importer `useLanguage`
2. Remplacer les textes hardcodés par `t('section.key')`
3. Tester les 3 langues

## 📊 Statistiques actuelles

- **Total de clés** : ~100+
- **Langues** : 3
- **Sections** : 6
- **Pages traduites** : 1/5 (20%)

## 🎯 Prochaines étapes

1. Traduire la page Login
2. Traduire Send Money (4 étapes)
3. Traduire History
4. Ajouter un indicateur de langue dans le header
5. Tester toutes les traductions



