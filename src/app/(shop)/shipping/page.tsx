export default function ShippingPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-black text-retro-ink mb-2">SHIPPING INFORMATION</h1>
            <p className="text-retro-denim mb-10">Global Delivery Standards</p>

            <div className="prose prose-lg prose-headings:font-bold prose-headings:text-retro-ink text-gray-600">
                <section className="mb-8">
                    <h3>Processing Time</h3>
                    <p>
                        Because every OMNI Vintage piece is printed specifically for you, please allow <strong>2-5 business days</strong> for production before your order ships.
                    </p>
                </section>

                <section className="mb-8">
                    <h3>Estimated Delivery Times</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>USA:</strong> 3-7 business days</li>
                        <li><strong>Europe:</strong> 5-10 business days</li>
                        <li><strong>International:</strong> 10-20 business days</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h3>Tracking</h3>
                    <p>
                        Once your order ships, you will receive an email with a tracking number. Please allow up to 48 hours for the tracking portal to update.
                    </p>
                </section>
            </div>
        </div>
    );
}