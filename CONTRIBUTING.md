# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à DCARD Mobile App ! Ce document vous guidera dans le processus de contribution.

---

## 📋 Table des matières

- [Code de conduite](#-code-de-conduite)
- [Comment contribuer](#-comment-contribuer)
- [Standards de code](#-standards-de-code)
- [Workflow Git](#-workflow-git)
- [Tests](#-tests)
- [Documentation](#-documentation)

---

## 🤝 Code de conduite

### Notre engagement

Nous nous engageons à faire de la participation à ce projet une expérience sans harcèlement pour tous, indépendamment de :
- L'âge
- La taille corporelle
- Le handicap
- L'ethnicité
- L'identité et l'expression de genre
- Le niveau d'expérience
- La nationalité
- L'apparence personnelle
- La race
- La religion
- L'identité et l'orientation sexuelles

### Nos standards

**Comportements encouragés** ✅
- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres

**Comportements inacceptables** ❌
- Langage ou images à caractère sexuel
- Commentaires insultants ou désobligeants
- Harcèlement public ou privé
- Publication d'informations privées sans permission
- Autres conduites inappropriées en contexte professionnel

---

## 💡 Comment contribuer

### Types de contributions

Nous acceptons plusieurs types de contributions :

#### 🐛 Signaler un bug
1. Vérifier que le bug n'a pas déjà été signalé dans [Issues](https://github.com/JohnDDoey/dcard-mobileApp/issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure :
   - Description claire et concise
   - Étapes pour reproduire
   - Comportement attendu vs. observé
   - Screenshots si applicable
   - Environnement (OS, navigateur, version Node.js)

#### ✨ Proposer une fonctionnalité
1. Vérifier que la fonctionnalité n'a pas déjà été proposée
2. Créer une issue avec le template "Feature Request"
3. Inclure :
   - Description détaillée de la fonctionnalité
   - Cas d'usage
   - Mockups ou exemples si possible
   - Impact potentiel sur l'existant

#### 📝 Améliorer la documentation
- Corriger des typos
- Clarifier des explications
- Ajouter des exemples
- Traduire la documentation

#### 🔧 Soumettre du code
1. Fork le repository
2. Créer une branche depuis `main`
3. Faire vos modifications
4. Soumettre une Pull Request

---

## 📏 Standards de code

### TypeScript / JavaScript

#### Conventions de nommage

```typescript
// Variables et fonctions : camelCase
const userName = "John";
function getUserData() { }

// Classes et types : PascalCase
class UserProfile { }
type UserData = { };
interface IUser { }

// Constantes : UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";

// Composants React : PascalCase
export default function UserCard() { }

// Fichiers : kebab-case ou PascalCase selon le type
// Pages : page.tsx
// Composants : UserCard.tsx
// Services : cashback-service.ts
```

#### Style de code

```typescript
// ✅ BON
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  const handleClick = () => {
    setCount(prev => prev + 1);
  };
  
  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}

// ❌ MAUVAIS
import {useState,useEffect} from 'react'
export default function MyComponent(){
const [count,setCount]=useState(0)
useEffect(()=>{console.log('Count changed:',count)},[count])
return <button onClick={()=>{setCount(count+1)}}>Count: {count}</button>
}
```

#### Indentation et formatage

- **Indentation** : 2 espaces (pas de tabs)
- **Ligne max** : 100 caractères
- **Point-virgules** : Oui
- **Quotes** : Simple quotes `'` pour les strings, backticks `` ` `` pour les templates
- **Trailing commas** : Oui pour les objets et tableaux multi-lignes

```typescript
// ✅ BON
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

// Template literals pour interpolation
const greeting = `Hello, ${user.name}!`;

// ❌ MAUVAIS
const user = {
  name: "John",
  age: 30,
  email: "john@example.com"
}
```

### React / Next.js

#### Structure des composants

```typescript
'use client'; // Si nécessaire

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MyChildComponent from './MyChildComponent';

// Types/Interfaces en premier
interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// Composant principal
export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  // 1. Hooks React
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. useEffect
  useEffect(() => {
    // Side effects
  }, []);
  
  // 3. Fonctions handlers
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Logic
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 4. Render
  return (
    <div className="container">
      <h1>{title}</h1>
      <MyChildComponent />
    </div>
  );
}
```

#### Hooks personnalisés

```typescript
// useCustomHook.ts
import { useState, useEffect } from 'react';

export function useCustomHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // Logic
  }, [value]);
  
  return { value, setValue };
}
```

### CSS / Tailwind

#### Classes Tailwind

```tsx
// ✅ BON - Classes organisées par catégorie
<div className="
  flex items-center justify-center
  w-full max-w-lg
  p-4 m-2
  bg-gray-800 border border-gray-600 rounded-lg
  text-white font-bold
  hover:bg-gray-700 transition-colors
">
  Content
</div>

// ✅ BON - Utiliser des composants réutilisables
const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded";

// ❌ MAUVAIS - Classes en désordre et illisibles
<div className="text-white bg-gray-800 flex w-full p-4 m-2 items-center hover:bg-gray-700 justify-center">
```

#### CSS personnalisé

```css
/* ✅ BON - Noms de classes descriptifs */
.staggered-menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: clamp(260px, 38vw, 420px);
}

/* ❌ MAUVAIS - Noms génériques */
.panel {
  position: fixed;
}
```

### Solidity (Smart Contracts)

```solidity
// ✅ BON
pragma solidity ^0.8.0;

contract CashbackRegistry {
    // State variables
    mapping(string => Coupon) private coupons;
    
    // Events
    event CashbackRegistered(
        string indexed cashbackCode,
        address indexed beneficiary,
        uint256 amount
    );
    
    // Modifiers
    modifier onlyValidCode(string memory code) {
        require(bytes(code).length > 0, "Code cannot be empty");
        _;
    }
    
    // Functions
    function registerCashback(
        string memory cashbackCode,
        address issuer,
        address beneficiary,
        uint256 amount
    ) public onlyValidCode(cashbackCode) {
        // Implementation
    }
}
```

---

## 🔄 Workflow Git

### Branches

Nous utilisons le modèle Git Flow simplifié :

- **`main`** : Branche principale, toujours stable
- **`feature/*`** : Nouvelles fonctionnalités
- **`fix/*`** : Corrections de bugs
- **`docs/*`** : Documentation
- **`refactor/*`** : Refactoring de code
- **`test/*`** : Tests

### Conventions de commit

Format : `type(scope): description`

**Types** :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage, style
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Tâches de maintenance

**Exemples** :
```bash
feat(auth): add password reset functionality
fix(blockchain): resolve contract address loading issue
docs(readme): update installation instructions
style(menu): improve mobile responsive design
refactor(api): simplify blockchain service calls
test(auth): add login component tests
chore(deps): update Next.js to v15
```

### Processus de Pull Request

1. **Fork** le repository

2. **Clone** votre fork
```bash
git clone https://github.com/YOUR_USERNAME/dcard-mobileApp.git
cd dcard-mobileApp
```

3. **Créer une branche**
```bash
git checkout -b feature/my-awesome-feature
```

4. **Faire vos modifications**
```bash
# Editer les fichiers
git add .
git commit -m "feat(scope): description"
```

5. **Push** vers votre fork
```bash
git push origin feature/my-awesome-feature
```

6. **Créer une Pull Request** sur GitHub
   - Titre clair et descriptif
   - Description détaillée des changements
   - Lien vers les issues associées (#123)
   - Screenshots si changements UI

7. **Review process**
   - Au moins 1 reviewer requis
   - Tests doivent passer
   - Pas de conflits
   - Code review approuvé

---

## 🧪 Tests

### Tests unitaires

```typescript
// UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard name="John Doe" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<UserCard name="John" onClick={handleClick} />);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Tests d'intégration

```typescript
// send-money.integration.test.tsx
describe('Send Money Flow', () => {
  it('completes full transaction flow', async () => {
    // 1. Navigate to send money page
    // 2. Fill form
    // 3. Submit payment
    // 4. Verify blockchain recording
    // 5. Check success message
  });
});
```

### Lancer les tests

```bash
npm run test          # Tests unitaires
npm run test:watch    # Mode watch
npm run test:coverage # Coverage report
```

---

## 📚 Documentation

### Code documentation

```typescript
/**
 * Enregistre un nouveau coupon cashback sur la blockchain
 * 
 * @param cashbackCode - Code unique du coupon (8 caractères)
 * @param issuer - Adresse de l'émetteur
 * @param beneficiary - Adresse du bénéficiaire
 * @param amount - Montant en wei
 * @param currency - Code devise (EUR, USD, etc.)
 * @returns Transaction hash
 * @throws Error si l'enregistrement échoue
 * 
 * @example
 * ```typescript
 * const txHash = await recordCashback(
 *   'ABC12345',
 *   '0x123...',
 *   '0x456...',
 *   100,
 *   'EUR'
 * );
 * ```
 */
export async function recordCashback(
  cashbackCode: string,
  issuer: string,
  beneficiary: string,
  amount: number,
  currency: string
): Promise<string> {
  // Implementation
}
```

### README des composants

Chaque composant complexe devrait avoir son propre README :

```markdown
# UserCard Component

## Description
Affiche une carte utilisateur avec photo, nom et actions.

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| name | string | Yes | - | Nom de l'utilisateur |
| email | string | No | '' | Email de l'utilisateur |
| onEdit | () => void | No | undefined | Callback au clic sur Edit |

## Usage
\`\`\`tsx
<UserCard
  name="John Doe"
  email="john@example.com"
  onEdit={() => console.log('Edit clicked')}
/>
\`\`\`
```

---

## ✅ Checklist avant PR

Avant de soumettre votre Pull Request, vérifiez :

- [ ] Mon code suit les conventions du projet
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Mes commits sont clairs et suivent la convention
- [ ] J'ai ajouté/mis à jour les tests
- [ ] Tous les tests passent
- [ ] Pas de warnings ESLint
- [ ] Le code est formaté (Prettier)
- [ ] J'ai testé sur mobile et desktop
- [ ] Pas de console.log oubliés (sauf logs intentionnels)
- [ ] Les traductions sont à jour (FR/EN/ES)
- [ ] Le README est à jour si nécessaire

---

## 🆘 Besoin d'aide ?

- 💬 **Discord** : [Rejoindre le serveur](https://discord.gg/dcard)
- 📧 **Email** : dev@dcard.com
- 📖 **Documentation** : [docs.dcard.com](https://docs.dcard.com)
- 🐛 **Issues** : [GitHub Issues](https://github.com/JohnDDoey/dcard-mobileApp/issues)

---

## 🙏 Remerciements

Merci à tous les contributeurs qui aident à améliorer DCARD Mobile App ! 🎉

Chaque contribution, petite ou grande, est précieuse et appréciée.

---

**Happy Coding! 💻🚀**

