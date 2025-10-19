
import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="prose dark:prose-invert prose-slate mx-auto">
                <h1>Privacy Policy</h1>
                <p className="lead">Last Updated: July 2024</p>
                
                <h2>Demo First</h2>
                <p>
                    Welcome to AegisCycle. This website and its interactive features are for demonstration purposes only. We are committed to protecting your privacy and want to be transparent about how we operate.
                </p>

                <h2>No PHI, Please</h2>
                <p>
                    The interactive demo on this site is designed to work with mock data. <strong>You should not, under any circumstances, enter real Protected Health Information (PHI) or any personally identifiable information into the demo tools.</strong> The data you enter into the demo is processed in your browser and, if you use the "live API" mode, sent to our backend for processing. While we take measures to secure our systems, this demo environment is not HIPAA compliant.
                </p>

                <h2>What We Collect</h2>
                <p>
                    We use simple, privacy-friendly analytics to understand how visitors use our website (e.g., which pages are most popular). This data is aggregated and does not identify you personally. We do not use tracking cookies for advertising.
                </p>

                <h2>Your Consent</h2>
                <p>
                    By using our site, you consent to this privacy policy. The purpose of this site is to showcase our technology, not to collect your data.
                </p>

                <h2>Opt-Out & Contact</h2>
                <p>
                    Since we do not collect personal information, there is no data to opt-out from. If you have any questions about this privacy policy, you can contact us at <a href="mailto:privacy@aegiscycle.dev">privacy@aegiscycle.dev</a>.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPage;
