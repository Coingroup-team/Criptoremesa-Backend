# Email Environment Check Analysis

## Issue
Emails for verification approvals/rejections are not being sent in the QA environment. User suspects there might be environment-based validation preventing emails in non-production environments.

## Analysis Result

✅ **NO ENVIRONMENT RESTRICTIONS FOUND**

After thorough analysis of all three services (Criptoremesa-Backend, backend-sixm, and coingroup-mail-server), **there are NO environment checks that prevent emails from being sent in QA/staging environments**.

## Evidence

### 1. Backend-Sixm (pg_notify Listener)
**File:** `backend-sixm/src/db/pg.connection.js`  
**Lines:** 192-212

```javascript
if (level.verif_level_apb === true && level.id_verif_level === 1) {
  await mailSender.sendApprovedLevelMail({
    email_user: level.email_user,
    first_name: level.first_name,
    last_name: level.last_name,
    level: getLevelName(1),
    atcNumber
  });

  await mailSender.sendAfterVerificationMail({
    email_user: level.email_user,
    first_name: level.first_name,
    last_name: level.last_name
  });
} else if (level.verif_level_apb === false && level.id_verif_level === 1) {
  await mailSender.sendDisapprovedLevelMail({
    email_user: level.email_user,
    first_name: level.first_name,
    last_name: level.last_name,
    rejectedList: [],
    level: getLevelName(1),
    atcNumber
  });
}
```

**Finding:** ❌ No environment checks - emails are sent unconditionally

### 2. Backend-Sixm Mail Utility
**File:** `backend-sixm/src/utils/mail.js`  
**Lines:** 99-127

```javascript
sendApprovedLevelMail: async (body) => {
  let url = `${env.MAIL_SENDER}/sendApprovedLevelMail`
  try {
    let resp = await axios.post(url, body);
    console.log("Desde axios: ", resp.data);
    log(body.email_user,url,body,resp.data)
    return resp.data;
  } catch (error) {
    log(body.email_user,url,body,error)
    console.log(error);
    return error;
  }
},
sendDisapprovedLevelMail: async (body) => {
  let url = `${env.MAIL_SENDER}/sendDisapprovedLevelMail`
  try {
    let resp = await axios.post(url, body);
    console.log("Desde axios: ", resp.data);
    log(body.email_user,url,body,resp.data)
    return resp.data;
  } catch (error) {
    log(body.email_user,url,body,error)
    console.log(error);
    return error;
  }
}
```

**Finding:** ❌ No environment checks - HTTP calls are made unconditionally

### 3. Coingroup-Mail-Server Service Layer
**File:** `coingroup-mail-server/src/modules/mail/services/mail.service.js`  
**Lines:** 64-91

```javascript
mailService.sendApprovedLevelMail = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Waiting email`);
    req.body.url = req.method+ ' ' + req.originalUrl
    const info = await mailer.sendApprovedLevelMail(req.body);
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

mailService.sendDisapprovedLevelMail = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Waiting email`);
    req.body.url = req.method+ ' ' + req.originalUrl
    const info = await mailer.sendDisapprovedLevelMail(req.body);
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};
```

**Finding:** ❌ No environment checks - service calls mailer unconditionally

### 4. Coingroup-Mail-Server Mailer (Actual Email Sender)
**File:** `coingroup-mail-server/src/utils/mailSender.js`  
**Lines:** 200-292

```javascript
sendApprovedLevelMail: async (body) => {
  while (body.email_user.includes('\''))
    body.email_user = body.email_user.replace('\'','')

  let from = '"Bithonor" <no-reply@bithonor.com>'
  let to = `${body.email_user}`
  let subject = `Verificación de usuario: aprobada`

  try {
    logger.info(`[${context}]: Sending email...`);
    
    let filePath = "src/assets/levelApproved.html";
    let source = fs.readFileSync(filePath, "utf-8").toString();
    let template = handlebars.compile(source);
    let replacements = {
      username: `${body.first_name} ${body.last_name}`,
      atcNumber: `${body.atcNumber}`,
      level: `${body.level}`
    };
    let htmlToSend = template(replacements);

    let info = await transporter.sendMail({
      from,
      to,
      envelope: { from, to: to },
      subject,
      html: htmlToSend,
      attachments: [...]
    });

    logger.debug(`Message sent: ${info.response}`);
    await mailPGRepository.log({...});
    return `Email succesfully sent`;
  } catch (error) {
    logger.error(`${error.response ? error.response : error}`);
    return error;
  }
},
sendDisapprovedLevelMail: async (body) => {
  // Similar implementation - NO ENVIRONMENT CHECKS
  ...
}
```

**Finding:** ❌ No environment checks - emails are sent to actual recipients

## Conclusion

**The lack of email notifications in your QA environment is NOT due to environment-based restrictions in the code.**

All three services will send emails in ANY environment (local, development, staging, QA, production).

## Real Cause

Based on the analysis in [EMAIL_NOTIFICATION_ANALYSIS.md](EMAIL_NOTIFICATION_ANALYSIS.md), the actual issue is:

1. **SQL Migration Not Applied** - The Persona function with pg_notify hasn't been deployed to QA database
2. **Backend-Sixm Not Running** - The pg_notify listener service may not be active in QA
3. **Database Connection Issue** - Backend-sixm's listener client may not be connected to QA database

## Verification Steps for QA

### 1. Check if SQL Function Has pg_notify
```bash
# Connect to QA database
psql -U postgres -h qa-db-host -d criptoremesa_db

# Verify function exists with pg_notify
SELECT pg_get_functiondef(p.oid) 
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'sec_cust'
AND p.proname = 'sp_request_level_one_persona';

# Look for "PERFORM pg_notify('level_upgrade'" in output
```

**If missing:** Run migration on QA database
```bash
psql -U postgres -h qa-db-host -d criptoremesa_db -f sql-migrations/003-create-persona-verification-functions.sql
```

### 2. Check if Backend-Sixm is Running in QA
```bash
pm2 list | grep sixm
# or
pm2 status
```

**Expected output:**
```
│ sixmap-backend │ online │ ...
```

**If not running:**
```bash
pm2 start ecosystem.config.js
# or
pm2 restart sixmap-backend
```

### 3. Check if Backend-Sixm is Connected to QA Database
```bash
pm2 logs sixmap-backend --lines 100 | grep -i "connected\|listen"
```

**Expected output:**
```
PG-DB is connected
PG-DB client-listener is connected
```

**If not connected:**
- Check QA database credentials in backend-sixm `.env` file
- Verify database host/port is accessible from backend-sixm server
- Restart backend-sixm: `pm2 restart sixmap-backend`

### 4. Test Email Sending Manually

You can test if emails work in QA by calling the mail server directly:

```bash
curl -X POST http://qa-mail-server:port/sendApprovedLevelMail \
  -H "Content-Type: application/json" \
  -d '{
    "email_user": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "level": "Intermedio",
    "atcNumber": "Test123"
  }'
```

If this works, the mail server is fine - the issue is with the pg_notify chain.

### 5. Check Backend-Sixm Logs During Persona Approval

When you test a Persona verification in QA:

```bash
# Monitor backend-sixm logs in real-time
pm2 logs sixmap-backend

# Then trigger approval in Persona
# You should see:
channel : level_upgrade
channel : {"id_verif_level":1,"verif_level_apb":true,"email_user":"..."}
```

If you DON'T see these logs, it means:
- pg_notify is not being emitted (SQL migration issue)
- OR backend-sixm is not listening (service not running or not connected)

## Environment-Specific Configuration

The only environment variables used are:

**Backend-Sixm:**
- `MAIL_SENDER` - URL of coingroup-mail-server (e.g., `http://localhost:3003` or `http://mail-server-qa:3003`)
- `PG_DB_*` - Database connection details

**Coingroup-Mail-Server:**
- `NODE_ENV` - Only used for dotenv loading, NOT for email validation
- `PG_DB_SM_*` - Database connection for logging

**None of these prevent emails from being sent in any environment.**

## Recommendation

Since there are no environment restrictions, consider implementing one for safety in QA/staging:

```javascript
// In backend-sixm/src/db/pg.connection.js (line 192)
if (level.verif_level_apb === true && level.id_verif_level === 1) {
  // Add environment check
  if (env.ENVIROMENT === 'production') {
    await mailSender.sendApprovedLevelMail({...});
    await mailSender.sendAfterVerificationMail({...});
  } else {
    // Log instead of sending in non-production
    logger.info(`[QA] Would send approval email to: ${level.email_user}`);
  }
}
```

However, for testing Persona in QA, you currently WANT emails to be sent, so this shouldn't be implemented until after testing is complete.

## Summary

✅ **NO environment restrictions exist** - emails will be sent in QA if:
1. SQL migration is applied (pg_notify exists)
2. Backend-sixm service is running
3. Backend-sixm listener is connected to database

❌ **The problem is NOT environment validation** - focus troubleshooting on the three points above.
