import { motion } from 'motion/react';

export const TermsPage = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-beige">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tighter">
                        Terms of Use
                    </h1>
                    <p className="text-zinc-500">Last updated: March 1, 2026</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-lg prose-zinc prose-a:text-brand-accent-orange bg-white p-8 md:p-12 rounded-3xl shadow-sm max-w-none"
                >
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Marv's Abbey Road Shop. By accessing our website and using our services, you agree to these Terms of Use. Please read them carefully.
                    </p>

                    <h2>2. Products and Pricing</h2>
                    <p>
                        All vinyl records, equipment, and accessories are subject to availability. We reserve the right to modify prices without prior notice. Rare and vintage records are graded strictly according to standard vinyl grading guidelines.
                    </p>

                    <h2>3. Shipping and Delivery</h2>
                    <p>
                        We ship specifically within the Philippines. Shipping costs and delivery times are estimated at checkout. We are not liable for delays caused by third-party couriers once the package has been handed over.
                    </p>

                    <h2>4. Returns and Refunds</h2>
                    <p>
                        Because of the delicate nature of vinyl records, we generally only accept returns for items damaged during transit or graded incorrectly. Contact us within 7 days of receiving your order to initiate a claim.
                    </p>

                    <h2>5. User Accounts</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
