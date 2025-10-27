// /api/send-results.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, companyName, score, total } = req.body;

    // Here you would typically integrate with your email service
    // For example, using SendGrid, Mailgun, or another provider
    
    // Example with SendGrid:
    // const msg = {
    //   to: email,
    //   from: 'your-verified-sender@yourdomain.com',
    //   subject: 'Your Cybersecurity Assessment Results',
    //   template_id: 'your-template-id',
    //   dynamic_template_data: {
    //     company_name: companyName,
    //     score: score,
    //     total: total,
    //     percentage: Math.round((score / total) * 100)
    //   }
    // };
    // await sgMail.send(msg);

    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Error sending email' });
  }
}