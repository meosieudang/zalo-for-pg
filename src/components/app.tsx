import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { App, SnackbarProvider, ZMPRouter } from 'zmp-ui';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from './layout';
import Navigation from './navigation';

const MyApp = () => {
    // Create a client
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 2
            }
        }
    });

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RecoilRoot>
                    <App>
                        <SnackbarProvider>
                            <ZMPRouter>
                                <Layout />
                                {/* <Navigation /> */}
                            </ZMPRouter>
                        </SnackbarProvider>
                    </App>
                </RecoilRoot>
            </AuthProvider>
        </QueryClientProvider>
    );
};
export default MyApp;
