import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    // Check if user is super admin or has organization membership
    const checkUserRole = async (userId) => {
        if (!userId) {
            setIsSuperAdmin(false);
            setOrganization(null);
            setRoleLoading(false);
            return;
        }

        setRoleLoading(true);

        try {
            const { data, error } = await supabase
                .from('organization_members')
                .select(`
                    organization_id,
                    role,
                    organizations (
                        id,
                        name,
                        slug,
                        billing_email,
                        status
                    )
                `)
                .eq('user_id', userId)
                .single();

            if (error || !data) {
                // No organization membership = Super Admin
                setIsSuperAdmin(true);
                setOrganization(null);
            } else {
                // Has organization membership = Client
                setIsSuperAdmin(false);
                setOrganization(data.organizations);
            }
        } catch (err) {
            console.error('Error checking user role:', err);
            setIsSuperAdmin(false);
            setOrganization(null);
        } finally {
            setRoleLoading(false);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Check role after setting user
            if (session?.user) {
                checkUserRole(session.user.id);
            } else {
                setRoleLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Check role on auth change
            if (session?.user) {
                checkUserRole(session.user.id);
            } else {
                setIsSuperAdmin(false);
                setOrganization(null);
                setRoleLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // Check role after successful login
        if (data?.user && !error) {
            await checkUserRole(data.user.id);
        }

        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        setIsSuperAdmin(false);
        setOrganization(null);
        return { error };
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { data, error };
    };

    const value = {
        user,
        session,
        loading: loading || roleLoading,
        isSuperAdmin,
        organization,
        checkUserRole,
        signIn,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
