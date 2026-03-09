import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Home } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-brand-accent-orange/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-10 h-10 text-brand-accent-orange" />
                        </div>
                        <h1 className="text-3xl font-display font-bold tracking-tighter">Oops! Something went wrong.</h1>
                        <p className="text-zinc-600">
                            We're sorry, but an unexpected error occurred. Please try refreshing the page or head back out.
                        </p>
                        <div className="pt-4 flex flex-col gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-luxury btn-luxury-filled w-full"
                            >
                                REFRESH PAGE
                            </button>
                            <a
                                href="/"
                                className="btn-luxury btn-luxury-outline w-full flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> RETURN TO SHOP
                            </a>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
