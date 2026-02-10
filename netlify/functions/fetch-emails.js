
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBUHvdbk4lzbzuZGMgJutYTCjAHU3OcyG4",
  authDomain: "error-monitor-c155c.firebaseapp.com",
  projectId: "error-monitor-c155c",
  storageBucket: "error-monitor-c155c.firebasestorage.app",
  messagingSenderId: "413446394970",
  appId: "1:413446394970:web:94fadd0d22411749cbf463"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GMAIL_CONFIG = {
  user: 'marambatanaka@gmail.com',
  password: 'ovvo vbvl mxhy tekv',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

const PATTERNS = {
  TASK_NAME: /Task:\s+([^\s\n\r]+)/i,
  TASK_ID: /ID:\s+([a-f0-9-]{36})/i,
  ENTITY: /'base_entity':\s+'([^']+)'/i,
  LOG_FILE: /Log File:\s+([^\s\n\r]+)/i,
  STATUS_CODE: /Status Code:\s+(\d+)/i,
  PATH: /Path:\s+([^\s\n\r]+)/i
};

const parseError = (subject, body) => {
  let errorType = "System Error";
  if (subject.includes("Celery Task Failure")) errorType = "Celery Task Failure";
  else if (subject.includes("Loan Balances Check Errors")) errorType = "Loan Balances Check";
  else if (subject.includes("Installments Check Errors")) errorType = "Installments Check";

  const taskName = body.match(PATTERNS.TASK_NAME)?.[1] || null;
  const taskId = body.match(PATTERNS.TASK_ID)?.[1] || null;
  const entity = body.match(PATTERNS.ENTITY)?.[1] || null;
  const logFile = body.match(PATTERNS.LOG_FILE)?.[1] || null;
  const statusCode = body.match(PATTERNS.STATUS_CODE)?.[1] || null;
  const path = body.match(PATTERNS.PATH)?.[1] || null;

  return { errorType, taskName, taskId, entity, logFile, statusCode: statusCode ? parseInt(statusCode) : null, path };
};

exports.handler = async (event) => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(GMAIL_CONFIG);
    let newErrorsCount = 0;

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) return reject(err);

        // Search for emails from "alerts" in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        imap.search(['ALL', ['SENDER', 'alerts'], ['SINCE', thirtyDaysAgo]], (err, results) => {
          if (err || !results || results.length === 0) {
            imap.end();
            return resolve({ statusCode: 200, body: JSON.stringify({ message: "No emails found", newErrors: 0 }) });
          }

          const f = imap.fetch(results, { bodies: '' });
          let processed = 0;

          f.on('message', (msg) => {
            msg.on('body', async (stream) => {
              const parsed = await simpleParser(stream);
              const emailId = parsed.messageId;
              
              const docRef = doc(db, "errors", emailId);
              const docSnap = await getDoc(docRef);

              if (!docSnap.exists()) {
                const details = parseError(parsed.subject, parsed.text);
                await setDoc(docRef, {
                  emailId,
                  subject: parsed.subject,
                  body: parsed.text,
                  ...details,
                  receivedDate: Timestamp.fromDate(new Date(parsed.date)),
                  createdAt: Timestamp.now()
                });
                newErrorsCount++;
              }
            });

            msg.once('end', () => {
              processed++;
              if (processed === results.length) {
                imap.end();
              }
            });
          });

          f.once('error', (err) => reject(err));
          f.once('end', () => {
            // Ending is handled in 'message' end loop
          });
        });
      });
    });

    imap.once('error', (err) => reject(err));
    imap.once('end', () => {
      resolve({ 
        statusCode: 200, 
        body: JSON.stringify({ message: "Sync complete", newErrors: newErrorsCount }) 
      });
    });

    imap.connect();
  });
};
