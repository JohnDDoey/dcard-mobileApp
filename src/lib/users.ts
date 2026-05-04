// src/lib/users.ts

export interface StoredUser {
    id: string
    email: string
    passwordHash: string
    name: string
  }
  
  const users: StoredUser[] = []
  
  export const userStorage = {
    async emailExists(email: string): Promise<boolean> {
      return users.some(u => u.email === email)
    },
  
    async create(email: string, passwordHash: string, name: string): Promise<StoredUser> {
      const user: StoredUser = {
        id: crypto.randomUUID(),
        email,
        passwordHash,
        name,
      }
  
      users.push(user)
      return user
    },
  
    async getByEmail(email: string): Promise<StoredUser | null> {
      return users.find(u => u.email === email) || null
    }
  }