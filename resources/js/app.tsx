import { createInertiaApp } from '@inertiajs/react';
import { createRoot, type Root } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ShootingStarsGrid } from '@/components/ui/ShootingStarsGrid';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<string, { default: React.ComponentType }>;

        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        const root: Root = createRoot(el);

        root.render(
            <ShootingStarsGrid fullScreen starCount={90} shootingStarCount={8} interactive>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        className: "border border-base-300 bg-base-100 shadow-lg",
                    }}
                />
            </ShootingStarsGrid>,
        );
    },
});
