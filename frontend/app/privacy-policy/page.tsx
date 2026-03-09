'use client';

export default function PrivacyPolicyPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(0,255,157,0.1), rgba(0,217,255,0.1))',
                borderBottom: '1px solid rgba(0,255,157,0.2)',
                padding: '60px 24px 40px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(0,255,157,0.15)',
                        border: '1px solid rgba(0,255,157,0.3)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        marginBottom: '16px',
                        fontSize: '12px',
                        color: '#00ff9d',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}>Legal Document</div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#fff', margin: '0 0 12px 0' }}>
                        Privacy Policy
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

                    <Section title="1. Introduction">
                        <p>
                            ImageBulk (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the ImageBulk web application (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using ImageBulk, you consent to the data practices described in this policy.
                        </p>
                        <p>
                            If you do not agree with the terms of this Privacy Policy, please do not access or use the Service.
                        </p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <SubHeading>2.1 Information You Provide Directly</SubHeading>
                        <ul>
                            <li><strong style={{ color: '#fff' }}>Email Address:</strong> Collected when you register an account. Used for authentication, email verification, and account-related communications.</li>
                            <li><strong style={{ color: '#fff' }}>Password:</strong> Stored in a securely hashed format using industry-standard bcrypt encryption. We never store your plaintext password.</li>
                        </ul>

                        <SubHeading>2.2 Information Collected Automatically</SubHeading>
                        <ul>
                            <li><strong style={{ color: '#fff' }}>Download History:</strong> We record the images you download, including timestamps and search keywords, to display your activity history.</li>
                            <li><strong style={{ color: '#fff' }}>Search Keywords:</strong> The keywords you use to search for images are stored to facilitate the download history feature.</li>
                            <li><strong style={{ color: '#fff' }}>Credit Usage:</strong> We track credit purchases and consumption to maintain your account balance accurately.</li>
                            <li><strong style={{ color: '#fff' }}>Account Verification Status:</strong> We record whether your email address has been verified.</li>
                        </ul>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <p>We use the collected information solely for the following purposes:</p>
                        <ul>
                            <li>To create, manage, and authenticate your account.</li>
                            <li>To deliver the core Service functionality (image search and bulk download).</li>
                            <li>To process credit purchases and maintain your credit balance.</li>
                            <li>To send transactional emails, including email verification codes and account-related notices.</li>
                            <li>To display your personal download history within your account dashboard.</li>
                            <li>To prevent fraud, unauthorized access, and abuse of the Service.</li>
                            <li>To comply with applicable legal obligations.</li>
                        </ul>
                        <p>We do <strong style={{ color: '#00ff9d' }}>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.</p>
                    </Section>

                    <Section title="4. Image Sources & Third-Party Content">
                        <p>
                            ImageBulk provides access to images sourced from publicly available areas of the internet, including the Pexels API and other public image repositories. We do not host, own, or claim copyright over any images provided through the Service. All image copyrights belong to their respective creators and rights holders.
                        </p>
                        <p>
                            You are solely responsible for ensuring that your use of any downloaded images complies with applicable copyright laws and the licensing terms associated with each image. We strongly encourage you to review the license of each image before use.
                        </p>
                    </Section>

                    <Section title="5. Data Sharing and Third-Party Services">
                        <p>To operate the Service, we engage the following third-party service providers. Each provider processes data only as necessary to deliver their service:</p>
                        <ul>
                            <li><strong style={{ color: '#fff' }}>Render (render.com):</strong> Cloud infrastructure provider hosting our backend application servers.</li>
                            <li><strong style={{ color: '#fff' }}>MongoDB Atlas:</strong> Cloud database provider storing your account data and usage history.</li>
                            <li><strong style={{ color: '#fff' }}>Email Service Provider:</strong> Used exclusively to deliver transactional emails such as OTP verification codes.</li>
                            <li><strong style={{ color: '#fff' }}>Razorpay:</strong> Payment gateway used to process credit purchases. We do not store your payment card details. All payment data is handled by Razorpay in accordance with their Privacy Policy and PCI-DSS standards.</li>
                        </ul>
                    </Section>

                    <Section title="6. Data Security">
                        <p>
                            We implement industry-standard security measures to protect your information, including:
                        </p>
                        <ul>
                            <li>Passwords hashed using bcrypt with appropriate salt rounds.</li>
                            <li>JSON Web Tokens (JWT) for secure session authentication.</li>
                            <li>HTTPS/TLS encryption for all data in transit.</li>
                            <li>Rate limiting on authentication endpoints to prevent brute-force attacks.</li>
                        </ul>
                        <p>
                            However, no method of electronic storage or transmission is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
                        </p>
                    </Section>

                    <Section title="7. Data Retention">
                        <p>
                            We retain your personal data for as long as your account remains active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., transaction records for financial compliance).
                        </p>
                    </Section>

                    <Section title="8. Account Deletion">
                        <p>
                            You have the right to request deletion of your account and associated personal data at any time. To initiate an account deletion request, please contact us at{' '}
                            <a href="mailto:mrproducts.pvtltd@gmail.com" style={{ color: '#00ff9d' }}>mrproducts.pvtltd@gmail.com</a>{' '}
                            with the subject line &quot;Account Deletion Request.&quot; We will process your request within 30 business days.
                        </p>
                        <p>
                            Please note that deleting your account will permanently forfeit any remaining credits, and this action cannot be reversed.
                        </p>
                    </Section>

                    <Section title="9. Children's Privacy">
                        <p>
                            ImageBulk is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will promptly delete it. If you believe we may have collected information from a child under 13, please contact us immediately.
                        </p>
                    </Section>

                    <Section title="10. Your Rights">
                        <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                        <ul>
                            <li><strong style={{ color: '#fff' }}>Right to Access:</strong> Request a copy of the data we hold about you.</li>
                            <li><strong style={{ color: '#fff' }}>Right to Rectification:</strong> Request correction of inaccurate data.</li>
                            <li><strong style={{ color: '#fff' }}>Right to Erasure:</strong> Request deletion of your personal data.</li>
                            <li><strong style={{ color: '#fff' }}>Right to Object:</strong> Object to certain types of data processing.</li>
                        </ul>
                        <p>To exercise any of these rights, contact us at <a href="mailto:mrproducts.pvtltd@gmail.com" style={{ color: '#00ff9d' }}>mrproducts.pvtltd@gmail.com</a>.</p>
                    </Section>

                    <Section title="11. Changes to This Policy">
                        <p>
                            We reserve the right to update this Privacy Policy at any time. When we make material changes, we will notify you by updating the &quot;Last Updated&quot; date at the top of this page. Your continued use of the Service after changes are posted constitutes your acceptance of the revised policy.
                        </p>
                    </Section>

                    <Section title="12. Contact Us">
                        <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
                        <div style={{
                            background: 'rgba(0,255,157,0.08)',
                            border: '1px solid rgba(0,255,157,0.2)',
                            borderRadius: '8px',
                            padding: '16px 20px',
                            marginTop: '12px',
                        }}>
                            <p style={{ margin: '0', color: '#fff' }}><strong>ImageBulk</strong></p>
                            <p style={{ margin: '4px 0 0 0' }}>
                                Email: <a href="mailto:mrproducts.pvtltd@gmail.com" style={{ color: '#00ff9d' }}>mrproducts.pvtltd@gmail.com</a>
                            </p>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '36px' }}>
            <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#00ff9d',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(0,255,157,0.15)',
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
