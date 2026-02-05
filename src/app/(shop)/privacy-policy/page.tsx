export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black text-retro-ink mb-2">PRIVACY POLICY</h1>
            <p className="text-retro-denim mb-10">Last updated: February 2026</p>

            <div className="prose prose-lg prose-headings:font-bold prose-headings:text-retro-ink text-gray-600">

                <section className="mb-8">
                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to Vintage Store ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                        This policy explains how we handle your data when you visit our store and purchase our print-on-demand products.
                    </p>
                </section>

                <section className="mb-8">
                    <h3>2. Information We Collect</h3>
                    <p>
                        We collect personal information that you voluntarily provide to us when you make a purchase or contact us. This includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Name and Contact Data (Email, Phone Number)</li>
                        <li>Shipping Address (for delivery)</li>
                        <li>Payment Data (Processed securely by our payment providers; we do not store credit card numbers)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h3>3. How We Use Your Data</h3>
                    <p>
                        We use your data primarily to fulfill your orders. Since we operate as a Print-on-Demand business,
                        <strong> we share necessary order details (Name, Shipping Address, Item specifics) with our printing partner, Printify,</strong>
                        solely for the purpose of printing and shipping your products.
                    </p>
                </section>

                <section className="mb-8">
                    <h3>4. Cookies & Tracking</h3>
                    <p>
                        We use cookies to improve your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings,
                        though this may affect the functionality of our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h3>5. Third-Party Services</h3>
                    <p>
                        We may use third-party services for analytics and payment processing. These third parties have access to your Personal Data only to perform
                        these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>
                </section>

                <section className="mb-8">
                    <h3>6. Contact Us</h3>
                    <p>
                        If you have questions about this policy, please contact us at support@hackerslordstudios.com.
                    </p>
                </section>

            </div>
        </div>
    );
}