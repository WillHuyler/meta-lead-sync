require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;

const CLIENT_CRM_MAP = {
  '123456789012345': 'https://services.leadconnectorhq.com/hooks/client_1_hook',
  '987654321098765': 'https://services.leadconnectorhq.com/hooks/client_2_hook'
};

app.get('/webhook/facebook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Meta Webhook Verified Successfully!');
    return res.status(200).send(challenge);
  } else {
    console.error('❌ Verification failed. Token mismatch.');
    return res.sendStatus(403);
  }
});

app.post('/webhook/facebook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value.leadgen_id;
            const formId = change.value.form_id;

            console.log(`📩 New Lead Notification Received! Form ID: ${formId}, Lead ID: ${leadgenId}`);

            await processAndRouteLead(leadgenId, formId);
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error('❌ Processing Error:', error.message);
    return res.status(200).send('EVENT_RECEIVED');
  }
});

async function processAndRouteLead(leadgenId, formId) {
  try {
    const url = `https://graph.facebook.com/v20.0/${leadgenId}?access_token=${META_PAGE_ACCESS_TOKEN}`;
    const response = await axios.get(url);
    const leadData = response.data;

    let parsedData = {
      meta_lead_id: leadgenId,
      form_id: formId,
      created_time: leadData.created_time
    };

    if (leadData.field_data) {
      leadData.field_data.forEach(field => {
        const name = field.name.toLowerCase();
        const value = field.values[0];

        if (name.includes('email')) parsedData.email = value;
        if (name.includes('phone')) parsedData.phone = value;
        if (name.includes('full_name') || name.includes('name')) parsedData.full_name = value;
      });
    }

    console.log('✅ Fetched Lead Data:', parsedData);

    const targetCrmUrl = CLIENT_CRM_MAP[formId] || process.env.DEFAULT_CRM_WEBHOOK_URL;

    if (targetCrmUrl) {
      await axios.post(targetCrmUrl, parsedData);
      console.log(`🚀 Lead routed successfully for Form ID: ${formId}`);
    } else {
      console.warn('⚠️ No CRM endpoint found for this Form ID.');
    }
  } catch (err) {
    console.error('❌ Failed to fetch/route lead:', err.response ? err.response.data : err.message);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Meta Lead Engine listening on http://localhost:${PORT}`);
});