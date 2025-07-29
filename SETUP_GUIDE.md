# Attendance Tracker Setup Guide

## 1. Google Sheets Setup

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Student Attendance Tracker"

### Step 2: Set up Google Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Replace the default code with the content from `google-apps-script.gs`
3. Save the script with a name like "Attendance Tracker API"
4. Click **Deploy** > **New deployment**
5. Choose **Web app** as the type
6. Set **Execute as**: "Me"
7. Set **Who has access**: "Anyone"
8. Click **Deploy**
9. Copy the **Web app URL** that's generated

### Step 3: Update the JavaScript
1. Open `script.js`
2. Find the line: `const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';`
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with the URL you copied in Step 2

## 2. Customize Student List

Edit the `students` array in `script.js` to include your actual students:

```javascript
const students = [
    { id: "ST001", name: "Your Student Name 1" },
    { id: "ST002", name: "Your Student Name 2" },
    // Add more students...
];
```

## 3. Deploy the Web App

### Option A: Local Development
1. Open `index.html` in a web browser
2. The app will work locally for testing

### Option B: Web Hosting
1. Upload all files to a web hosting service (GitHub Pages, Netlify, etc.)
2. Access the app via the hosted URL

## 4. How It Works

1. **Search**: Type in the search bar to filter students by name or ID
2. **Select**: Check the boxes next to present students
3. **Submit**: Click "Submit Attendance" to send data to Google Sheets
4. **Google Sheets**: A new row is created with today's date and "X" marks for present students

## 5. Google Sheets Format

The sheet will automatically create columns like:
- Date
- Student ID  
- Student Name
- ST001 - Alice Johnson
- ST002 - Bob Smith
- etc.

Each submission creates a new row with the date and "X" marks for present students.

## 6. Mobile Usage

The app is optimized for mobile use:
- Touch-friendly checkboxes
- Responsive design
- Easy-to-use interface
- Works offline (except for submission)

## Troubleshooting

- **CORS Issues**: Make sure your Google Apps Script is deployed as a web app
- **Permission Errors**: Ensure the Google Apps Script has proper permissions
- **Data Not Appearing**: Check the Google Apps Script logs for errors 