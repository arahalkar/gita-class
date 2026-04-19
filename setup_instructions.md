# Google Sheets & Drive Setup Instructions

To connect this application to your real Google Sheets and Drive, follow these steps:

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named "Gita Class Portal".

## 2. Enable APIs
Enable the following APIs for your project:
- **Google Sheets API**
- **Google Drive API**

## 3. Create a Service Account & Get Keys
1. Go to **IAM & Admin > Service Accounts**.
2. Create a new Service Account (e.g., `gita-portal-service`).
3. Click on the Service Account name, then go to the **Keys** tab.
4. Click **Add Key > Create New Key** and select **JSON**.
5. Download the file. This file contains your secrets:
   - **GOOGLE_SERVICE_ACCOUNT_EMAIL**: Copy the value of `"client_email"`.
   - **GOOGLE_PRIVATE_KEY**: Copy the value of `"private_key"`. It starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`.

## 4. Set Up Spreadsheet & Folder
1. Create a new Google Spreadsheet. 
   - Add three sheets named: `Students`, `Attendance`, and `Homework`.
2. Share the spreadsheet with your Service Account Email (`client_email`).
3. Create a Google Drive Folder to store audio files.
   - Share this folder with the Service Account Email as well.
   - Copy the Folder ID from the URL (the last part of the URL after `folders/`).

## 5. Deployment with GitHub & Vercel
1. **GitHub**: Push your code to a GitHub repository.
2. **Vercel**: Import your repository into Vercel.
3. **Environment Variables**: In the Vercel Dashboard, go to **Settings > Environment Variables** and add:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Paste the email.
   - `GOOGLE_PRIVATE_KEY`: Paste the entire private key. 
     - *Important*: Vercel handles the newlines automatically, but if you face issues, ensure you copy exactly from the JSON.
   - `GOOGLE_SHEET_ID`: Found in your spreadsheet URL.
   - `GOOGLE_DRIVE_FOLDER_ID`: Found in your drive folder URL.
   - `ADMIN_PASSWORD`: Set a password for your dashboard.

## 6. Schema for Sheets
- **Students**: Columns: `ID`, `Name`, `Grade`, `Points`, `Streak`
- **Attendance**: Columns: `StudentID`, `Date`, `Status`
- **Homework**: Columns: `StudentID`, `Timestamp`, `Shloka`, `AudioURL`
