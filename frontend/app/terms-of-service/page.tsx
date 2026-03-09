'use client';

export default function TermsOfServicePage() {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,217,255,0.1))',
                borderBottom: '1px solid rgba(168,85,247,0.2)',
                padding: '60px 24px 40px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(168,85,247,0.15)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        marginBottom: '16px',
                        fontSize: '12px',
                        color: '#a855f7',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}>Legal Document</div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#fff', margin: '0 0 12px 0' }}>
                        Terms of Service
                    </h1>
                    <p style={{ color: '#718096', fontSize: '15px', margin: '0' }}>
                        Last Updated: March 9, 2025 &nbsp;|&nbsp; Effective Date: March 9, 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
                <div style={{
                    background: '#15151f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '40px',
                    lineHeight: '1.8',
                    color: '#cbd5e0',
                    fontSize: '15px',
                }}>

                    <Section title="1. Agreement to Terms" accent="#a855f7">
                        <p>
                            These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and ImageBulk (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) governing your access to and use of the ImageBulk web application and all related services (collectively, the &quot;Service&quot;).
                        </p>
                        <p>
                            By creating an account or using the Service, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree, do not use the Service.
                        </p>
                    </Section>

                    <Section title="2. Eligibility" accent="#a855f7">
                        <p>You must meet the following criteria to use the Service:</p>
                        <ul>
                            <li>You must be at least 13 years of age.</li>
                            <li>You must provide accurate and truthful registration information.</li>
                            <li>You must not be prohibited from using the Service under applicable law.</li>
                            <li>You must maintain the security of your account credentials.</li>
                        </ul>
                    </Section>

                    <Section title="3. Account Registration and Security" accent="#a855f7">
                        <p>
                            To access the Service, you must register for an account using a valid email address. You agree to:
                        </p>
                        <ul>
                            <li>Provide accurate, current, and complete registration information.</li>
                            <li>Complete email verification as required.</li>
                            <li>Maintain the confidentiality of your password and not share it with any third party.</li>
                            <li>Notify us immediately at <a href="mailto:mrproducts.pvtltd@gmail.com" style={{ color: '#a855f7' }}>mrproducts.pvtltd@gmail.com</a> if you suspect any unauthorized access to your account.</li>
                            <li>Accept full responsibility for all activity occurring under your account.</li>
                        </ul>
                    </Section>

                    <Section title="4. Credit System" accent="#a855f7">
                        <SubHeading>4.1 How Credits Work</SubHeading>
                        <p>
                            ImageBulk operates on a credit-based system. Each image download consumes one (1) credit. New accounts may receive free credits upon registration. Credits can be purchased through the Service using supported payment methods.
                        </p>

                        <SubHeading>4.2 Download Limits</SubHeading>
                        <p>
                            The Service allows bulk downloads of 10, 20, 30, 50, 75, or 100 images per download session, subject to your available credit balance.
                        </p>

                        <SubHeading>4.3 Non-Refundable Credits</SubHeading>
                        <p>
                            All credit purchases are final and non-refundable, except as required by applicable law. Credits have no cash value and cannot be transferred between accounts. Credits expire upon account deletion.
                        </p>

                        <SubHeading>4.4 Payments</SubHeading>
                        <p>
                            Payment processing is handled by Razorpay. By purchasing credits, you agree to Razorpay&apos;s Terms of Service and Privacy Policy. We do not store your payment card details.
                        </p>
                    </Section>

                    <Section title="5. Image Content and Copyright" accent="#a855f7">
                        <p>
                            ImageBulk provides access to images sourced from publicly available sources on the internet, including third-party APIs such as Pexels. We expressly disclaim any ownership of or responsibility for the content of such images.
                        </p>
                        <p>
                            <strong style={{ color: '#fff' }}>You are solely and exclusively responsible for:</strong>
                        </p>
                        <ul>
                            <li>Verifying the licensing terms of each image before use.</li>
                            <li>Ensuring your use of any downloaded image complies with applicable copyright law, creative commons licenses, and any applicable platform terms.</li>
                            <li>Obtaining any necessary permissions or licenses for commercial use of downloaded images.</li>
                        </ul>
                        <p>
                            ImageBulk shall not be liable for any copyright infringement or licensing violations resulting from your use of downloaded images.
                        </p>
                    </Section>

                    <Section title="6. Acceptable Use Policy" accent="#a855f7">
                        <p>You agree not to use the Service to:</p>
                        <ul>
                            <li>Download, distribute, or use images that infringe upon any third-party intellectual property rights.</li>
                            <li>Download or distribute illegal, obscene, defamatory, or harmful content.</li>
                            <li>Engage in any automated scraping, crawling, or mass downloading beyond the intended Service functionality.</li>
                            <li>Attempt to circumvent or bypass the credit system or any usage limits.</li>
                            <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service.</li>
                            <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations.</li>
                            <li>Interfere with or disrupt the integrity or performance of the Service or its servers.</li>
                            <li>Create multiple accounts to circumvent credit restrictions or account limitations.</li>
                            <li>Sell, resell, or commercialize access to the Service without our express written consent.</li>
                        </ul>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate this Acceptable Use Policy without notice or refund.
                        </p>
                    </Section>

                    <Section title="7. Intellectual Property" accent="#a855f7">
                        <p>
                            All rights, title, and interest in and to the Service (excluding third-party images accessed through the Service), including but not limited to software, user interface design, logos, and trademarks, are and shall remain the exclusive property of ImageBulk.
                        </p>
                        <p>
                            Nothing in these Terms grants you the right to use ImageBulk&apos;s name, trademarks, logos, or other proprietary designations without our prior written consent.
                        </p>
                    </Section>

                    <Section title="8. Disclaimer of Warranties" accent="#a855f7">
                        <p>
                            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                        </p>
                        <p>We do not warrant that:</p>
                        <ul>
                            <li>The Service will be uninterrupted, error-free, or free from harmful components.</li>
                            <li>The quality or availability of images searched or downloaded through the Service will meet your expectations.</li>
                            <li>Any errors in the Service will be corrected.</li>
                        </ul>
                    </Section>

                    <Section title="9. Limitation of Liability" accent="#a855f7">
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IMAGEBULK AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE.
                        </p>
                        <p>
                            IN NO EVENT SHALL IMAGEBULK&apos;S TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US IN THE SIX (6) MONTHS PRECEDING THE CLAIM.
                        </p>
                    </Section>

                    <Section title="10. Account Deletion and Termination" accent="#a855f7">
                        <SubHeading>10.1 Your Right to Delete</SubHeading>
                        <p>
                            You may request deletion of your account at any time by contacting <a href="mailto:mrproducts.pvtltd@gmail.com" style={{ color: '#a855f7' }}>mrproducts.pvtltd@gmail.com</a> with the subject &quot;Account Deletion Request.&quot; Account deletion will result in the permanent loss of all credits, download history, and user data associated with the account.
                        </p>

                        <SubHeading>10.2 Our Right to Terminate</SubHeading>
                        <p>
                            We reserve the right to suspend or permanently terminate your account and access to the Service at our sole discretion, without prior notice, in the event of:
                        </p>
                        <ul>
                            <li>Violation of these Terms or the Acceptable Use Policy.</li>
                            <li>Fraudulent, abusive, or illegal activity.</li>
                            <li>Actions that may harm other users or the integrity of the Service.</li>
                        </ul>
                    </Section>

                    <Section title="11. Google Play Store Compliance" accent="#a855f7">
                        <p>
                            If the Service is made available through the Google Play Store, the following additional terms apply:
                        </p>
                        <ul>
                            <li>Google Play&apos;s Terms of Service apply in addition to these Terms.</li>
                            <li>In the event of a conflict between Google Play&apos;s Terms and these Terms, Google Play&apos;s Terms shall prevail.</li>
                            <li>We comply with Google Play&apos;s Families Policy and do not target the Service toward children under 13.</li>
                            <li>We comply with Google Play&apos;s requirements regarding user data disclosure and privacy.</li>
                        </ul>
                    </Section>

                    <Section title="12. Changes to Terms" accent="#a855f7">
                        <p>
                            We reserve the right to modify these Terms at any time. Material changes will be communicated by updating the &quot;Last Updated&quot; date at the top of this page. Your continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.
                        </p>
                    </Section>

                    <Section title="13. Governing Law" accent="#a855f7">
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of India.
                        </p>
                    </Section>

                    <Section title="14. Contact Information" accent="#a855f7">
                        <p>For any questions, concerns, or requests related to these Terms, please contact us:</p>
                        <div style={{
                            background: 'rgba(168,85,247,0.08)',
                            border: '1px solid rgba(168,85,247,0.2)',
                            borderRadius: '8px',
                            padding: '16px 20px',
                            marginTop: '12px',
                        }}>
                            <p style={{ margin: '0', color: '#fff' }}><strong>ImageBulk</strong></p>
                            <p style={{ margin: '4px 0 0 0' }}>
                                Email: <a href="mailto:mrproducts.pvtltd@gmail.com" style={{ color: '#a855f7' }}>mrproducts.pvtltd@gmail.com</a>
                            </p>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    );
}

function Section({ title, children, accent = '#00ff9d' }: { title: string; children: React.ReactNode; accent?: string }) {
    return (
        <div style={{ marginBottom: '36px' }}>
            <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: accent,
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: `1px solid ${accent}25`,
            }}>{title}</h2>
            {children}
        </div>
    );
}

function SubHeading({ children }: { children: React.ReactNode }) {
    return (
        <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#00d9ff',
            margin: '16px 0 8px 0',
        }}>{children}</h3>
    );
}
