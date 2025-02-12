const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const xml2js = require('xml2js');
const db = require('./models');
const Op = db.Sequelize.Op;

const { Transaction } = db;


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

express.static(path.join(__dirname, '..'))
const upload = multer({ dest: 'uploads/' });

const logUnprocessedMessage = (message) => {
 const logEntry = `[${new Date().toISOString()}] Unprocessed: ${message}\n`;
 fs.appendFileSync('failed_transactions.log', logEntry);
};

const categorizeTransaction = (description) => {
 if (/received/i.test(description)) return 'Incoming Money';
 if (/payment to/i.test(description)) return 'Payments to Code Holders';
 if (/transferred to/i.test(description)) return 'Transfers to Mobile Numbers';
 if (/bank deposit/i.test(description)) return 'Bank Deposits';
 if (/airtime/i.test(description)) return 'Airtime Bill Payments';
 if (/cash power/i.test(description)) return 'Cash Power Bill Payments';
 if (/third party/i.test(description)) return 'Transactions Initiated by Third Parties';
 if (/withdrawn/i.test(description)) return 'Withdrawals from Agents';
 if (/bank transfer/i.test(description)) return 'Bank Transfers';
 if (/internet|voice bundle/i.test(description)) return 'Internet and Voice Bundle Purchases';
 return 'Other';
};

const extractTransactionDetails = (body) => {
 const amountMatch = body.match(/(\d+(?:,\d+)*)\s*RWF/);
 const senderMatch = body.match(/from\s+(.*?)(?=\s*\()/i) || body.match(/received\s+\d+\s*RWF\s+from\s+(.*?)(?=\s*\()/i);
 const receiverMatch = body.match(/(?:transferred to|payment of .*? to)\s+(.*?)(?=\s*\d{4}|\s*\()/i);
 const dateMatch = body.match(/at\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);

 return {
  amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
  sender: senderMatch ? senderMatch[1].trim() : 'Unknown',
  receiver: receiverMatch ? receiverMatch[1].trim() : 'Unknown',
  transaction_date: dateMatch ? new Date(dateMatch[1]) : new Date()
 };
};

app.post('/upload', upload.single('file'), async (req, res) => {
 try {
  const xmlData = fs.readFileSync(req.file.path, 'utf-8');
  const parser = new xml2js.Parser();

  parser.parseString(xmlData, async (err, result) => {
   if (err) {
    return res.status(500).json({ error: 'Error parsing XML file' });
   }

   const messages = result.smses.sms;
   const transactionsToInsert = [];

   messages.forEach(msg => {
    const body = msg.$.body;
    const details = extractTransactionDetails(body);

    if (!details.amount || !details.sender || !details.receiver || !details.transaction_date) {
     logUnprocessedMessage(body);
    } else {
     transactionsToInsert.push({
      transaction_id: msg.$.date,
      type: categorizeTransaction(body),
      amount: details.amount,
      currency: 'RWF',
      sender: details.sender,
      receiver: details.receiver,
      transaction_date: details.transaction_date
     });
    }
   });

   await Transaction.bulkCreate(transactionsToInsert, { ignoreDuplicates: true });
   res.status(201).json({ message: 'Transactions uploaded successfully', failed: messages.length - transactionsToInsert.length });
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error processing file' });
 }
});

app.get('/transactions', async (req, res) => {
 try {
  const { type, start, end, minAmount, maxAmount } = req.query;
  const where = {};

  if (type) where.type = type;
  if (start && end) where.transaction_date = { [Op.between]: [new Date(start), new Date(end)] };
  if (minAmount) where.amount = { [Op.gte]: parseFloat(minAmount) };
  if (maxAmount) where.amount = { ...where.amount, [Op.lte]: parseFloat(maxAmount) };

  const transactions = await Transaction.findAll({ where });
  res.status(200).json(transactions);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error fetching transactions' });
 }
});

// Default route
app.get('/', (req, res) => {
 res.status(200).send('MoMo Data Analysis API Running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});
