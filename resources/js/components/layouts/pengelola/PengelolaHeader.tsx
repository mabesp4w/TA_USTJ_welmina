import { Menu } from "lucide-react";

type PengelolaHeaderProps = {
    title: string;
    description?: string;
    children?: React.ReactNode;
    onToggleSidebar?: () => void;
};

export default function PengelolaHeader({ title, description, children, onToggleSidebar }: PengelolaHeaderProps) {
    return (
        <div className="sticky top-0 z-20 border-b border-base-300 bg-base-100/70 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            className="btn btn-ghost btn-square lg:hidden"
                            onClick={onToggleSidebar}
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">
                                Fitness Center
                            </p>
                            <h1 className="mt-1 text-2xl font-bold text-base-content md:text-3xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-2 text-sm text-base-content/60">{description}</p>
                            )}
                        </div>
                    </div>

                    {children && (
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
