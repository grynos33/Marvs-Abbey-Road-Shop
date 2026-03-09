import { motion } from 'motion/react';

export const PrivacyPage = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-beige">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tighter">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500">Last updated: March 1, 2026</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-lg prose-zinc prose-a:text-brand-accent-orange bg-white p-8 md:p-12 rounded-3xl shadow-sm max-w-none"
                >
                    <h2>1. Information We Collect</h2>
                    <p>
                        When you visit Marv's Abbey Road Shop, we collect the following types of information:
                        <ul>
                            <li><strong>Contact Information:</strong> Name, email address, postal address, and telephone number.</li>
                            <li><strong>Order Data:</strong> Information relevant to your purchases such as specific item selections and payment confirmation status.</li>
                            <li><strong>Newsletter Subscription:</strong> Email addresses provided via our newsletter sign-up form.</li>
                        </ul>
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use your collected information strictly for the following purposes:
                        <ul>
                            <li>To fulfill and deliver orders.</li>
                            <li>To communicate order statuses and tracking details.</li>
                            <li>To send newsletter restocks and updates (if subscribed).</li>
                            <li>To improve user experience and customize analog shop offerings.</li>
                        </ul>
                    </p>

                    <h2>3. Data Protection</h2>
                    <p>
                        Your information is stored securely in our database managed by Supabase. We take extensive measures to guard against unauthorized access, use, or disclosure. We do NOT sell your data to third party providers.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
