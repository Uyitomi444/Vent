import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProfileStore, PRESET_AVATARS } from './profileStore';
import { auth as firebaseAuth } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile 
} from 'firebase/auth';

export interface UserAccount {
  id: string;
  username: string; // e.g. "chidi_vibes" (lowercase, unique)
  displayName: string; // e.g. "Chidi Okonkwo"
  email: string; // Mandatory email address
  password: string; // Mandatory password for authentication
  avatarUrl: string;
  companionTone?: 'gentle' | 'grounding' | 'uplifting' | 'direct';
  registeredAt: number;
  lastLoginAt: number;
}

interface AuthState {
  currentUser: UserAccount | null;
  registeredUsers: UserAccount[];
  isAuthenticated: boolean;
  
  // Actions
  register: (params: {
    username: string;
    displayName: string;
    email: string;
    password: string;
    avatarUrl?: string;
    companionTone?: 'gentle' | 'grounding' | 'uplifting' | 'direct';
  }) => Promise<{ success: boolean; error?: string }>;
  
  login: (params: {
    usernameOrEmail: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  
  logout: () => Promise<void>;
  
  switchUser: (userId: string) => boolean;
  
  updateCurrentUser: (updates: Partial<UserAccount>) => void;
  
  isUsernameAvailable: (username: string) => boolean;
}

const cleanUsername = (raw: string): string => {
  return raw.trim().toLowerCase().replace(/^@+/, '').replace(/\s+/g, '_');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      registeredUsers: [],
      isAuthenticated: false,

      isUsernameAvailable: (username: string) => {
        const cleaned = cleanUsername(username);
        if (!cleaned || cleaned.length < 3) return false;
        const currentUserId = get().currentUser?.id;
        return !get().registeredUsers.some(
          (u) => u.username.toLowerCase() === cleaned && u.id !== currentUserId
        );
      },

      register: async ({
        username,
        displayName,
        email,
        password,
        avatarUrl = PRESET_AVATARS[0].url,
        companionTone = 'gentle',
      }) => {
        const cleanedUsername = cleanUsername(username);

        if (!cleanedUsername) {
          return { success: false, error: 'Please enter a valid username.' };
        }

        if (cleanedUsername.length < 3) {
          return { success: false, error: 'Username must be at least 3 characters long.' };
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(cleanedUsername)) {
          return { success: false, error: 'Username can only contain letters, numbers, underscores, and periods.' };
        }

        const existingUsername = get().registeredUsers.find(
          (u) => u.username.toLowerCase() === cleanedUsername
        );
        if (existingUsername) {
          return { success: false, error: `The username @${cleanedUsername} is already registered. Please sign in or pick another.` };
        }

        // Email is strictly required
        const cleanedEmail = (email || '').trim().toLowerCase();
        if (!cleanedEmail) {
          return { success: false, error: 'Email address is required.' };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
          return { success: false, error: 'Please enter a valid email address.' };
        }

        const existingEmail = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === cleanedEmail
        );
        if (existingEmail) {
          return { success: false, error: `The email "${cleanedEmail}" is already registered. Please sign in instead.` };
        }

        // Password is strictly required
        if (!password || password.length < 6) {
          return { success: false, error: 'Password is required and must be at least 6 characters long.' };
        }

        // Optional Firebase Auth integration if available
        let firebaseUid: string | null = null;
        if (firebaseAuth) {
          try {
            const userCred = await createUserWithEmailAndPassword(firebaseAuth, cleanedEmail, password);
            firebaseUid = userCred.user.uid;
            await updateFirebaseProfile(userCred.user, {
              displayName: displayName.trim() || cleanedUsername,
              photoURL: avatarUrl,
            });
          } catch (fbErr: any) {
            console.warn('[Firebase Auth] registration fallback:', fbErr.message);
          }
        }

        const now = Date.now();
        const finalDisplayName = displayName.trim() || cleanedUsername;
        const newUser: UserAccount = {
          id: firebaseUid || `usr_${now}_${Math.random().toString(36).substring(2, 7)}`,
          username: cleanedUsername,
          displayName: finalDisplayName,
          email: cleanedEmail,
          password,
          avatarUrl,
          companionTone,
          registeredAt: now,
          lastLoginAt: now,
        };

        // Sync with ProfileStore
        useProfileStore.getState().updateProfile({
          name: finalDisplayName,
          nickname: cleanedUsername,
          avatarUrl,
          companionTone,
        });

        set((state) => ({
          currentUser: newUser,
          registeredUsers: [...state.registeredUsers.filter((u) => u.id !== newUser.id), newUser],
          isAuthenticated: true,
        }));

        return { success: true };
      },

      login: async ({ usernameOrEmail, password }) => {
        const query = (usernameOrEmail || '').trim().toLowerCase().replace(/^@+/, '');
        if (!query) {
          return { success: false, error: 'Please enter your email or username.' };
        }

        if (!password) {
          return { success: false, error: 'Please enter your password.' };
        }

        // Try Firebase sign-in if configured and email is provided
        if (firebaseAuth && query.includes('@')) {
          try {
            const userCred = await signInWithEmailAndPassword(firebaseAuth, query, password);
            const fbUser = userCred.user;
            
            let localUser = get().registeredUsers.find(
              (u) => u.email.toLowerCase() === query || u.id === fbUser.uid
            );

            if (!localUser) {
              localUser = {
                id: fbUser.uid,
                username: fbUser.email ? fbUser.email.split('@')[0] : 'friend',
                displayName: fbUser.displayName || 'Friend',
                email: fbUser.email || query,
                password,
                avatarUrl: fbUser.photoURL || PRESET_AVATARS[0].url,
                registeredAt: Date.now(),
                lastLoginAt: Date.now(),
              };
            } else {
              localUser = { ...localUser, password, lastLoginAt: Date.now() };
            }

            // Sync with profileStore
            useProfileStore.getState().updateProfile({
              name: localUser.displayName,
              nickname: localUser.username,
              avatarUrl: localUser.avatarUrl,
            });

            set((state) => ({
              currentUser: localUser,
              registeredUsers: [
                ...state.registeredUsers.filter((u) => u.id !== localUser!.id),
                localUser!,
              ],
              isAuthenticated: true,
            }));

            return { success: true };
          } catch (fbErr: any) {
            console.warn('[Firebase Auth] Sign in failed, checking local users:', fbErr.message);
          }
        }

        // Local credentials check
        const user = get().registeredUsers.find(
          (u) =>
            u.username.toLowerCase() === query ||
            (u.email && u.email.toLowerCase() === query)
        );

        if (!user) {
          return {
            success: false,
            error: `No account found for "${query}". Please check your email/username or register.`,
          };
        }

        if (user.password !== password) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }

        const updatedUser = {
          ...user,
          lastLoginAt: Date.now(),
        };

        // Sync with ProfileStore
        useProfileStore.getState().updateProfile({
          name: updatedUser.displayName,
          nickname: updatedUser.username,
          avatarUrl: updatedUser.avatarUrl,
          companionTone: updatedUser.companionTone || 'gentle',
        });

        set((state) => ({
          currentUser: updatedUser,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          ),
          isAuthenticated: true,
        }));

        return { success: true };
      },

      logout: async () => {
        if (firebaseAuth) {
          try {
            await firebaseSignOut(firebaseAuth);
          } catch (e) {
            console.warn('Firebase sign out error:', e);
          }
        }
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },

      switchUser: (userId: string) => {
        const target = get().registeredUsers.find((u) => u.id === userId);
        if (!target) return false;

        const updatedUser = {
          ...target,
          lastLoginAt: Date.now(),
        };

        useProfileStore.getState().updateProfile({
          name: updatedUser.displayName,
          nickname: updatedUser.username,
          avatarUrl: updatedUser.avatarUrl,
          companionTone: updatedUser.companionTone || 'gentle',
        });

        set({
          currentUser: updatedUser,
          isAuthenticated: true,
        });
        return true;
      },

      updateCurrentUser: (updates: Partial<UserAccount>) => {
        const current = get().currentUser;
        if (!current) return;

        const updated = { ...current, ...updates };

        // Also reflect to profileStore
        if (updates.displayName || updates.username || updates.avatarUrl || updates.companionTone) {
          useProfileStore.getState().updateProfile({
            ...(updates.displayName ? { name: updates.displayName } : {}),
            ...(updates.username ? { nickname: updates.username } : {}),
            ...(updates.avatarUrl ? { avatarUrl: updates.avatarUrl } : {}),
            ...(updates.companionTone ? { companionTone: updates.companionTone } : {}),
          });
        }

        set((state) => ({
          currentUser: updated,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === updated.id ? updated : u
          ),
        }));
      },
    }),
    {
      name: 'itoura-auth-store-v1',
    }
  )
);
