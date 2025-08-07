// Google Apps Script for Google Sheets Integration
// Deploy this as a web app in Google Apps Script

// Replace with your specific Google Sheet ID
const SPREADSHEET_ID = '1oVQu0gQvn87ls365KRspN_GO4G-IEKXTcJJWFA3OVLE';
const TIMEZONE = 'Europe/Tallinn'; // Your local timezone

// Estonian month names
const ESTONIAN_MONTHS = [
  'Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni',
  'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'
];

// Google Apps Script for Google Sheets Integration
// ... (keep your SPREADSHEET_ID declaration as is) ...

function formatDateToEstonian(dateString) {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = ESTONIAN_MONTHS[date.getMonth()];
    return `${day}. ${month}`;
  } catch (e) {
    console.log('Error formatting date:', dateString, e);
    return dateString; // Return original if formatting fails
  }
}

function doGet(e) {
  try {
    console.log('Received parameters:', e.parameter);
    
    if (e.parameter.date && e.parameter.allStudents) {
      const dateString = e.parameter.date; // e.g., "6. August"
      const allStudents = JSON.parse(e.parameter.allStudents);
      
      console.log('Original Date String:', dateString);
      
      // Parse Estonian date format to get the actual date
      let actualDate;
      try {
        // Extract day and month from Estonian format
        const match = dateString.match(/^(\d+)\.\s*([A-Za-zäöüõÄÖÜÕ]+)$/);
        if (match) {
          const day = parseInt(match[1]);
          const monthName = match[2];
          const monthIndex = ESTONIAN_MONTHS.findIndex(m => 
            m.toLowerCase() === monthName.toLowerCase()
          );
          
          if (monthIndex !== -1) {
            const currentYear = new Date().getFullYear();
            actualDate = new Date(currentYear, monthIndex, day);
            console.log('Parsed date:', actualDate);
          } else {
            throw new Error('Invalid month name');
          }
        } else {
          throw new Error('Invalid Estonian date format');
        }
      } catch (parseError) {
        console.log('Failed to parse Estonian date, trying as regular date:', parseError);
        actualDate = new Date(dateString);
      }
      
      // Normalize to YYYY-MM-DD for comparison
      const normalizedDate = Utilities.formatDate(actualDate, TIMEZONE, 'yyyy-MM-dd');
      console.log('Normalized Date for comparison:', normalizedDate);
      
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName('Attendance') || spreadsheet.insertSheet('Attendance');
      
      let existingData = [];
      let headers = [];
      if (sheet.getLastRow() > 0) {
        existingData = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
        headers = existingData[0] || [];
      }
      
      // If sheet is empty, create initial structure
      if (headers.length === 0) {
        headers = ['Student Name'];
        existingData = [headers];
      }
      
      // Find existing column by comparing normalized dates
      let dateColumnIndex = -1;
      for (let i = 1; i < headers.length; i++) {
        const headerValue = headers[i];
        if (headerValue) {
          try {
            let headerDate;
            
            // Check if it's already in Estonian format
            const estonianMatch = String(headerValue).match(/^(\d+)\.\s*([A-Za-zäöüõÄÖÜÕ]+)$/);
            if (estonianMatch) {
              const day = parseInt(estonianMatch[1]);
              const monthName = estonianMatch[2];
              const monthIndex = ESTONIAN_MONTHS.findIndex(m => 
                m.toLowerCase() === monthName.toLowerCase()
              );
              if (monthIndex !== -1) {
                const currentYear = new Date().getFullYear();
                headerDate = new Date(currentYear, monthIndex, day);
              }
            } else {
              // Try parsing as regular date
              headerDate = new Date(headerValue);
            }
            
            if (headerDate && !isNaN(headerDate.getTime())) {
              const normalizedHeaderDate = Utilities.formatDate(headerDate, TIMEZONE, 'yyyy-MM-dd');
              if (normalizedHeaderDate === normalizedDate) {
                dateColumnIndex = i;
                console.log('Found existing column at index:', i, 'with header:', headerValue);
                break;
              }
            }
          } catch (err) {
            console.log(`Could not parse header '${headerValue}' as a date. Skipping.`);
          }
        }
      }
      
      console.log('Date column index:', dateColumnIndex);
      
      // Add new column if not found
      if (dateColumnIndex === -1) {
        headers.push(dateString); // Use Estonian format for display
        dateColumnIndex = headers.length - 1;
        console.log('Added new column for:', dateString);
      }
      
      // The rest of your function (updating student rows, writing data, creating stats)
      // can remain exactly the same. Just ensure it uses the final `headers` and `existingData` arrays.

      // --- PASTE THE REST OF YOUR doGet FUNCTION LOGIC HERE ---
      // (Mapping student rows, adding new students, updating attendance, etc.)
      // It will work correctly with the properly identified dateColumnIndex.
      
      // Example of the rest of the logic
      let studentRows = {};
      for (let i = 1; i < existingData.length; i++) {
        if (existingData[i][0]) { studentRows[existingData[i][0]] = i; }
      }
      
      // Add new students if they don't exist
      allStudents.forEach(student => {
          if (!studentRows.hasOwnProperty(student.name)) {
              const newRow = [student.name];
              // Fill with empty values for all columns (including the new date column)
              for (let i = 1; i < headers.length; i++) { 
                  newRow.push(''); 
              }
              existingData.push(newRow);
              studentRows[student.name] = existingData.length - 1;
              console.log('Added new student:', student.name);
          }
      });
      
      // Update attendance for existing students
      allStudents.forEach(student => {
          const rowIndex = studentRows[student.name];
          if (rowIndex !== undefined) {
              // Ensure the row has enough columns for the date column
              while (existingData[rowIndex].length <= dateColumnIndex) { 
                  existingData[rowIndex].push(''); 
              }
              if (student.present) { 
                  existingData[rowIndex][dateColumnIndex] = 'X'; 
                  console.log('Marked', student.name, 'as present for', normalizedDate);
              }
          }
      });
      
      // CRITICAL: Ensure ALL rows have exactly the same number of columns
      const maxColumns = headers.length;
      for (let i = 0; i < existingData.length; i++) {
          while (existingData[i].length < maxColumns) {
              existingData[i].push('');
          }
          // Trim if somehow we have too many columns
          if (existingData[i].length > maxColumns) {
              existingData[i] = existingData[i].slice(0, maxColumns);
          }
      }
      
      console.log('Final data structure:', existingData.length, 'rows,', maxColumns, 'columns');
      console.log('Headers:', headers);
      
      // Write all data back to sheet
      if (existingData.length > 0) {
          sheet.getRange(1, 1, existingData.length, maxColumns).setValues(existingData);
          console.log('Successfully wrote data to sheet');
      }
      createComprehensiveStats(spreadsheet, headers, existingData, normalizedDate);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Attendance recorded successfully.'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput('API running.').setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    console.error('Error:', error.toString(), 'Stack:', error.stack);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ... (No changes are needed for the other functions: createComprehensiveStats, getAttendanceRating, formatStatsSheet, doPost, doOptions) ...

function createComprehensiveStats(spreadsheet, headers, data, currentDate) {
  try {
    console.log('Creating comprehensive stats...');
    console.log('Headers:', headers);
    console.log('Data length:', data.length);
    
    // Find or create statistics sheet
    let statsSheet = spreadsheet.getSheetByName('Statistics');
    if (!statsSheet) {
      statsSheet = spreadsheet.insertSheet('Statistics');
      console.log('Created new Statistics sheet');
    } else {
      console.log('Found existing Statistics sheet');
    }
    
    // Clear existing stats
    statsSheet.clear();
    console.log('Cleared existing stats');
    
    // Calculate attendance for each student
    const studentStats = [];
    const dateColumns = headers.slice(1); // Skip Student Name column
    
    console.log('Date columns:', dateColumns);
    
    for (let i = 1; i < data.length; i++) {
      const studentName = data[i][0];
      
      console.log('Processing student:', studentName);
      
      if (studentName) {
        let presentCount = 0;
        let totalSessions = dateColumns.length; // Total number of training days
        
        // Count attendance for all dates
        for (let j = 1; j < data[i].length; j++) {
          if (data[i][j] === 'X') {
            presentCount++;
            console.log('Found X for student', studentName, 'at column', j);
          } else if (data[i][j] === '') {
            // Skip empty cells (future dates)
          } else {
            console.log('Found non-X for student', studentName, 'at column', j, 'value:', data[i][j]);
          }
        }
        
        const attendancePercent = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;
        
        console.log('Student stats:', studentName, 'Present:', presentCount, 'Total:', totalSessions, 'Percent:', attendancePercent);
        
        studentStats.push({
          name: studentName,
          presentCount: presentCount,
          totalSessions: totalSessions,
          attendancePercent: attendancePercent
        });
      }
    }
    
    console.log('Calculated stats for', studentStats.length, 'students');
    
    // Create comprehensive statistics
    const statsData = [
      ['PÕHILIK KOHALOLEKU STATISTIKA', '', '', '']
    ];
    
    // Add individual student statistics
    statsData.push(['Õpilase nimi', 'Kohalolekud', 'Kokku treeninguid', 'Kohaloleku %']);
    
    studentStats.forEach(student => {
      statsData.push([
        student.name,
        student.presentCount,
        student.totalSessions,
        student.attendancePercent + '%'
      ]);
    });
    
    // Add overall statistics
    const totalStudents = studentStats.length;
    const totalPresent = studentStats.reduce((sum, s) => sum + s.presentCount, 0);
    const totalSessions = studentStats.reduce((sum, s) => sum + s.totalSessions, 0);
    const overallAttendance = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;
    
    console.log('Overall stats:', 'Students:', totalStudents, 'Present:', totalPresent, 'Sessions:', totalSessions, 'Percent:', overallAttendance);
    
    statsData.push(['', '', '', '']);
    statsData.push(['ÜLDINE STATISTIKA', '', '', '']);
    statsData.push(['Õpilaste arv', totalStudents, '', '']);
    statsData.push(['Kokku kohalolekud', totalPresent, '', '']);
    statsData.push(['Kokku treeninguid', totalSessions, '', '']);
    statsData.push(['Üldine kohaloleku %', overallAttendance + '%', '', '']);
    
    // Add session dates with normalized format
    statsData.push(['', '', '', '']);
    statsData.push(['TREENINGU KUUPÄEVAD', '', '', '']);
    dateColumns.forEach((date, index) => {
      // Convert any date format to Estonian format
      let formattedDate;
      try {
        if (String(date).match(/^(\d+)\.\s*([A-Za-zäöüõÄÖÜÕ]+)$/)) {
          // Already in Estonian format
          formattedDate = date;
        } else {
          // Convert from other formats to Estonian
          const dateObj = new Date(date);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = formatDateToEstonian(date);
          } else {
            formattedDate = date; // Keep original if parsing fails
          }
        }
      } catch (e) {
        console.log('Error formatting date:', date, e);
        formattedDate = date;
      }
      
      statsData.push([`Treening ${index + 1}`, formattedDate, '', '']);
    });
    
    console.log('Prepared stats data with', statsData.length, 'rows');
    
    // Ensure all rows have the same number of columns
    const maxColumns = 4;
    const normalizedStatsData = statsData.map(row => {
      const normalizedRow = [...row];
      while (normalizedRow.length < maxColumns) {
        normalizedRow.push('');
      }
      return normalizedRow.slice(0, maxColumns);
    });
    
    console.log('Normalized data:', normalizedStatsData.length, 'rows,', maxColumns, 'columns');
    
    // Write all data
    if (normalizedStatsData.length > 0) {
      statsSheet.getRange(1, 1, normalizedStatsData.length, maxColumns).setValues(normalizedStatsData);
      console.log('Wrote stats data to sheet');
    }
    
    // Format the sheet
    formatStatsSheet(statsSheet, normalizedStatsData.length);
    
    console.log('Successfully created comprehensive statistics');
  } catch (error) {
    console.error('Error creating statistics:', error);
    console.error('Error stack:', error.stack);
  }
}

function formatStatsSheet(sheet, dataLength) {
  try {
    // Format main headers
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setFontSize(14);
    sheet.getRange(2, 1, 1, 4).setFontWeight('bold');
    
    // Format overall statistics (approximate position)
    const overallStart = Math.max(1, dataLength - 10);
    sheet.getRange(overallStart, 1, 1, 4).setFontWeight('bold');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 4);
    
    console.log('Formatted stats sheet');
  } catch (error) {
    console.error('Error formatting stats sheet:', error);
  }
}

function doPost(e) {
  // Keep POST for backward compatibility, but redirect to GET
  return doGet(e);
}

function doOptions(e) {
  // Handle preflight OPTIONS request
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
} 