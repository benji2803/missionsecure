import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with environment variables
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
  console.error('Missing required EmailJS environment variables');
}

emailjs.init(EMAILJS_PUBLIC_KEY);

// Helper function to generate recommendations based on score
function getRecommendations(percentage) {
  if (percentage >= 85) {
    return `
      • Maintain current security practices and stay updated
      • Consider advanced security measures for further improvement
      • Regular security awareness training for new employees
      • Implement continuous monitoring and testing
    `;
  } else if (percentage >= 70) {
    return `
      • Strengthen authentication with MFA across all systems
      • Review and update security policies regularly
      • Conduct regular security awareness training
      • Implement comprehensive data backup solutions
    `;
  } else {
    return `
      • Implement basic security measures immediately
      • Set up multi-factor authentication
      • Create incident response plans
      • Establish regular security training programs
      • Review and upgrade access controls
    `;
  }
}

export default function EmailCapture({ score, total }) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const percentage = Math.round((score / total) * 100);
  const verdict = 
    percentage >= 85 ? "Strong" :
    percentage >= 70 ? "Good" :
    percentage >= 50 ? "Needs Improvement" :
    "At Risk";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      // Calculate risk metrics based on percentage
      const riskLevel = percentage >= 85 ? "Low" : percentage >= 70 ? "Moderate" : "High";
      const implementationWindow = percentage >= 85 ? "≈30 days" : percentage >= 70 ? "≈60 days" : "≈90 days";
      const investmentRange = percentage >= 85 ? "$0.5K–2K" : percentage >= 70 ? "$2K–8K" : "$8K–20K";
      const ranking = percentage >= 85 ? "Top 10%" : percentage >= 67 ? "Above Average" : "Below Average";

      const templateParams = {
        to_email: email,
        company_name: companyName,
        score: score,
        total: total,
        percentage: percentage,
        verdict: verdict,
        date: new Date().toLocaleDateString(),
        risk_level: riskLevel,
        implementation_window: implementationWindow,
        investment_range: investmentRange,
        ranking: ranking,
        recommendations: getRecommendations(percentage),
        to_name: companyName
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSent(true);
      } else {
        setError('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="email-success">
        <h3>Thank you!</h3>
        <p>Your results have been sent to {email}</p>
        <p className="success-detail">Please check your inbox for the detailed report.</p>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <h3>Get Your Results by Email</h3>
      <p className="email-subtitle">
        We'll send you a detailed report with personalized recommendations for improvement.
      </p>
      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="Your company name"
            disabled={sending}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            disabled={sending}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send My Results'}
        </button>
      </form>
    </div>
  );
}