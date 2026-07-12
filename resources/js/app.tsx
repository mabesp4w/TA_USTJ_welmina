import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ShootingStarsGrid } from '@/components/ui/ShootingStarsGrid';
import AosProvider from '@/components/ui/AosProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    setup({ el, App, props }) {
        const content = (
            <AosProvider>
                <ShootingStarsGrid fullScreen starCount={90} shootingStarCount={8} interactive>
                    <App {...props} />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            className: "border border-base-300 bg-base-100 shadow-lg",
                        }}
                    />
                </ShootingStarsGrid>
            </AosProvider>
        );

        if (typeof document !== "undefined") {
            createRoot(el).render(content);
        }

        return content;
    },
});
