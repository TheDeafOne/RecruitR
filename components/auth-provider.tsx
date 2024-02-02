"use client";
import Roles from "@/app/types/roles";
import { GoogleAuthProvider, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/client";

export function getAuthToken(): string | undefined {
    let token = Cookies.get("firebaseIdToken");
    if (!token) token = window.sessionStorage.getItem("firebaseIdToken") as string ?? undefined;
    return token;
}

export function setAuthToken(token: string): string | undefined {
    window.sessionStorage.set("firebaseIdToken", token)
    return Cookies.set("firebaseIdToken", token, { secure: true });
}

export function removeAuthToken(): void {
    window.sessionStorage.removeItem("firebaseIdToken");
    return Cookies.remove("firebaseIdToken");
}

type EmailAccountProps = {
    email: string;
    password: string;
};

type AuthContextType = {
    currentUser: User | null;
    isCoordinator: boolean;
    isRecruiter: boolean;
    isLoading: boolean;
    loginGoogle: () => Promise<void>;
    loginEmail: ({ email, password }: EmailAccountProps) => Promise<void>;
    createAccountEmail: ({ email, password }: EmailAccountProps) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isCoordinator, setIsCoordinator] = useState<boolean>(false);
    const [isRecruiter, setIsRecruiter] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Triggers when App is started
    useEffect(() => {
        if (!auth) return;

        return auth.onAuthStateChanged(async (user) => {
            // Triggers when user signs out
            setIsLoading(true);
            if (!user) {
                setCurrentUser(null);
                setIsCoordinator(false);
                setIsRecruiter(false);
                removeAuthToken();
                setIsLoading(false);
                return;
            }

            const token = await user.getIdToken(true);
            if (user) {
                setCurrentUser(user);

                // Check if is coordinator
                const tokenValues = await user.getIdTokenResult();
                setIsRecruiter(tokenValues.claims.role === Roles.RECRUITER);
                setIsCoordinator(tokenValues.claims.role === Roles.COORDINATOR);

                // check if user exists in database 

                const userResponse = await fetch(`/api/users/${user.uid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userResponse.ok) {
                    const userJson = await userResponse.json();
                    if (userJson?.role) {
                        setIsCoordinator(userJson.role === Roles.COORDINATOR);
                        setIsRecruiter(userJson.role === Roles.RECRUITER);
                    }
                    console.log(userJson);
                    console.log(isCoordinator, isRecruiter);
                } else {
                    console.error("Could not get user info");
                }
                setAuthToken(await user.getIdToken(true));
                setIsLoading(false);
            }
        });
    }, []);

    function createAccountEmail({ email, password }: EmailAccountProps): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!auth) {
                reject();
                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }

    function loginEmail({ email, password: password }: EmailAccountProps): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!auth) {
                reject();
                return;
            }
            signInWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    console.log("Signed in!");
                    resolve();
                })
                .catch((error) => {
                    console.error("signing in with email and password failed");
                    reject(error);
                });
        })
    }

    function loginGoogle(): Promise<void> {
        return new Promise((resolve, reject) => {
            setIsLoading(true);
            if (!auth) {
                reject();
                return;
            }
            signInWithPopup(auth, new GoogleAuthProvider())
                .then((user) => {
                    console.log("Signed in!");
                    resolve();
                })
                .catch(() => {
                    console.error("signing in with google failed");
                    reject();
                });
        });
    }

    function logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!auth) {
                reject();
                return;
            }
            auth.signOut()
                .then(() => {
                    console.log("Signed out");
                    resolve();
                })
                .catch(() => {
                    console.error("signing out failed");
                    reject();
                });
        });
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isCoordinator,
                isRecruiter,
                isLoading,
                loginGoogle,
                loginEmail,
                createAccountEmail,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
