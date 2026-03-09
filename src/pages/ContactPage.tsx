import { motion } from 'motion/react';
import { Mail, MapPin, Phone } from 'lucide-react';

export const ContactPage = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-beige">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter">
                        GET IN TOUCH
                    </h1>
                    <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                        Have a question about a rare pressing? Need help tracking an order? We're here for the analog community.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-3xl text-center flex flex-col items-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-brand-accent-blue/5 rounded-full flex items-center justify-center mb-6">
                            <Mail className="w-8 h-8 text-brand-accent-blue" />
                        </div>
                        <h3 className="font-display font-bold text-xl mb-2">Email Us</h3>
                        <p className="text-zinc-600 mb-4">For general inquiries and support</p>
                        <a href="mailto:hello@marvsabbeyroad.com" className="text-brand-accent-orange font-bold hover:underline">
                            hello@marvsabbeyroad.com
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-3xl text-center flex flex-col items-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-brand-accent-green/5 rounded-full flex items-center justify-center mb-6">
                            <Phone className="w-8 h-8 text-brand-accent-green" />
                        </div>
                        <h3 className="font-display font-bold text-xl mb-2">Call Us</h3>
                        <p className="text-zinc-600 mb-4">Mon-Fri from 9am to 6pm PHT</p>
                        <a href="tel:+639000000000" className="text-brand-accent-orange font-bold hover:underline">
                            +63 900 000 0000
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 rounded-3xl text-center flex flex-col items-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-brand-accent-orange/5 rounded-full flex items-center justify-center mb-6">
                            <MapPin className="w-8 h-8 text-brand-accent-orange" />
                        </div>
                        <h3 className="font-display font-bold text-xl mb-2">Location</h3>
                        <p className="text-zinc-600 mb-4">Online Vinyl Shop serving the</p>
                        <span className="text-zinc-900 font-bold">
                            Philippines
                        </span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
