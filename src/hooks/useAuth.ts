 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { User, Session } from "@supabase/supabase-js";
 
 interface AuthState {
   user: User | null;
   session: Session | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   isAdmin: boolean;
   userRole: string | null;
 }
 
 export const useAuth = () => {
   const [state, setState] = useState<AuthState>({
     user: null,
     session: null,
     isLoading: true,
     isAuthenticated: false,
     isAdmin: false,
     userRole: null,
   });
 
   useEffect(() => {
     // Set up auth state listener FIRST
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         console.log("Auth state changed:", event, session?.user?.email);
         
         if (session?.user) {
           // Check user role
           const { data: roleData } = await supabase
             .from('user_roles')
             .select('role')
             .eq('user_id', session.user.id)
             .maybeSingle();
           
           setState({
             user: session.user,
             session,
             isLoading: false,
             isAuthenticated: true,
             isAdmin: roleData?.role === 'admin',
             userRole: roleData?.role || 'user',
           });
         } else {
           setState({
             user: null,
             session: null,
             isLoading: false,
             isAuthenticated: false,
             isAdmin: false,
             userRole: null,
           });
         }
       }
     );
 
     // THEN get initial session
     supabase.auth.getSession().then(async ({ data: { session } }) => {
       if (session?.user) {
         const { data: roleData } = await supabase
           .from('user_roles')
           .select('role')
           .eq('user_id', session.user.id)
           .maybeSingle();
         
         setState({
           user: session.user,
           session,
           isLoading: false,
           isAuthenticated: true,
           isAdmin: roleData?.role === 'admin',
           userRole: roleData?.role || 'user',
         });
       } else {
         setState(prev => ({ ...prev, isLoading: false }));
       }
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const logout = async () => {
     await supabase.auth.signOut();
     window.location.href = "/";
   };
 
   const signIn = async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
     return { data, error };
   };
 
   const signUp = async (email: string, password: string, name: string) => {
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: window.location.origin,
         data: {
           full_name: name,
         },
       },
     });
     return { data, error };
   };
 
   return {
     user: state.user,
     session: state.session,
     isLoading: state.isLoading,
     isAuthenticated: state.isAuthenticated,
     isAdmin: state.isAdmin,
     userRole: state.userRole,
     logout,
     signIn,
     signUp,
   };
 };
