// Google Apps Script for Google Sheets Integration
// Deploy this as a web app in Google Apps Script

// Replace with your specific Google Sheet ID
const SPREADSHEET_ID = '1oVQu0gQvn87ls365KRspN_GO4G-IEKXTcJJWFA3OVLE';

function doGet(e) {
  try {
    // Log all parameters for debugging
    console.log('Received parameters:', e.parameter);
    
    // Check if this is an attendance submission
    if (e.parameter.date && e.parameter.allStudents) {
      console.log('Processing attendance submission...');
      
      // Parse the incoming data from URL parameters
      const date = e.parameter.date;
      const allStudents = JSON.parse(e.parameter.allStudents);
      
      console.log('Date:', date);
      console.log('Students:', allStudents);
      
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName('Attendance') || spreadsheet.insertSheet('Attendance');
      
      console.log('Sheet name:', sheet.getName());
      
      // Get existing data
      let existingData = [];
      let headers = [];
      let studentRows = {};
      
      if (sheet.getLastRow() > 0 && sheet.getLastColumn() > 0) {
        existingData = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
        headers = existingData[0] || [];
        console.log('Existing headers:', headers);
        
        // Map student IDs to their row numbers
        for (let i = 1; i < existingData.length; i++) {
          if (existingData[i][0]) { // Student ID in first column
            studentRows[existingData[i][0]] = i;
          }
        }
      }
      
      // If sheet is empty, create initial structure
      if (headers.length === 0) {
        headers = ['Student ID', 'Student Name'];
        existingData = [headers];
      }
      
      // Check if date column exists, if not add it
      let dateColumnIndex = headers.indexOf(date);
      if (dateColumnIndex === -1) {
        headers.push(date);
        dateColumnIndex = headers.length - 1;
        console.log('Added new date column:', date, 'at index:', dateColumnIndex);
        
        // Add empty cells for existing rows
        for (let i = 1; i < existingData.length; i++) {
          while (existingData[i].length < headers.length) {
            existingData[i].push('');
          }
        }
      }
      
      // Add new students if they don't exist
      let newStudentsAdded = false;
      allStudents.forEach(student => {
        if (!studentRows.hasOwnProperty(student.id)) {
          // Add new student row
          const newRow = [student.id, student.name];
          // Fill with empty values for existing date columns
          for (let i = 2; i < headers.length; i++) {
            newRow.push('');
          }
          existingData.push(newRow);
          studentRows[student.id] = existingData.length - 1;
          newStudentsAdded = true;
          console.log('Added new student row:', student.id, student.name);
        }
      });
      
      // Update attendance for existing students
      allStudents.forEach(student => {
        const rowIndex = studentRows[student.id];
        if (rowIndex !== undefined) {
          // Ensure the row has enough columns
          while (existingData[rowIndex].length <= dateColumnIndex) {
            existingData[rowIndex].push('');
          }
          existingData[rowIndex][dateColumnIndex] = student.present ? 'X' : '';
          console.log('Updated student', student.id, 'for date', date, 'Value:', student.present ? 'X' : '');
        }
      });
      
      // Write all data back to sheet
      if (existingData.length > 0) {
        sheet.getRange(1, 1, existingData.length, headers.length).setValues(existingData);
        console.log('Wrote data to sheet:', existingData.length, 'rows,', headers.length, 'columns');
      }
      
      // Create comprehensive statistics with attendance counts
      createComprehensiveStats(spreadsheet, headers, existingData, date);
      
      // Return success response
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Attendance recorded successfully',
          debug: {
            date: date,
            studentsCount: allStudents.length,
            presentCount: allStudents.filter(s => s.present).length,
            totalDates: headers.length - 2, // Subtract Student ID and Name columns
            totalStudents: existingData.length - 1 // Subtract header row
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default response for simple GET requests
    return ContentService
      .createTextOutput('Attendance Tracker API is running')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Error processing attendance:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

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
    const dateColumns = headers.slice(2); // Skip Student ID and Name columns
    
    console.log('Date columns:', dateColumns);
    
    for (let i = 1; i < data.length; i++) {
      const studentId = data[i][0];
      const studentName = data[i][1];
      
      console.log('Processing student:', studentId, studentName);
      
      if (studentId && studentName) {
        let presentCount = 0;
        let totalSessions = 0;
        
        // Count attendance for all dates
        for (let j = 2; j < data[i].length; j++) {
          if (data[i][j] === 'X') {
            presentCount++;
            totalSessions++;
            console.log('Found X for student', studentId, 'at column', j);
          } else if (data[i][j] === '') {
            // Skip empty cells (future dates)
          } else {
            totalSessions++;
            console.log('Found non-X for student', studentId, 'at column', j, 'value:', data[i][j]);
          }
        }
        
        const attendancePercent = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;
        
        console.log('Student stats:', studentId, 'Present:', presentCount, 'Total:', totalSessions, 'Percent:', attendancePercent);
        
        studentStats.push({
          id: studentId,
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
      ['COMPREHENSIVE ATTENDANCE STATISTICS', '', '', '', '', '']
    ];
    
    // Add individual student statistics
    statsData.push(['Student ID', 'Student Name', 'Present Sessions', 'Total Sessions', 'Attendance %', 'Rating']);
    
    studentStats.forEach(student => {
      statsData.push([
        student.id,
        student.name,
        student.presentCount,
        student.totalSessions,
        student.attendancePercent + '%',
        getAttendanceRating(student.attendancePercent)
      ]);
    });
    
    // Add overall statistics
    const totalStudents = studentStats.length;
    const totalPresent = studentStats.reduce((sum, s) => sum + s.presentCount, 0);
    const totalSessions = studentStats.reduce((sum, s) => sum + s.totalSessions, 0);
    const overallAttendance = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;
    
    console.log('Overall stats:', 'Students:', totalStudents, 'Present:', totalPresent, 'Sessions:', totalSessions, 'Percent:', overallAttendance);
    
    statsData.push(['', '', '', '', '', '']);
    statsData.push(['OVERALL STATISTICS', '', '', '', '', '']);
    statsData.push(['Total Students', totalStudents, '', '', '', '']);
    statsData.push(['Total Present Sessions', totalPresent, '', '', '', '']);
    statsData.push(['Total Sessions', totalSessions, '', '', '', '']);
    statsData.push(['Overall Attendance %', overallAttendance + '%', '', '', '', '']);
    statsData.push(['Overall Rating', getAttendanceRating(overallAttendance), '', '', '', '']);
    
    // Add session dates
    statsData.push(['', '', '', '', '', '']);
    statsData.push(['SESSION DATES', '', '', '', '', '']);
    dateColumns.forEach((date, index) => {
      statsData.push([`Session ${index + 1}`, date, '', '', '', '']);
    });
    
    console.log('Prepared stats data with', statsData.length, 'rows');
    
    // Ensure all rows have the same number of columns
    const maxColumns = 6;
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

function getAttendanceRating(percentage) {
  if (percentage >= 90) return 'Excellent (90%+)';
  if (percentage >= 80) return 'Very Good (80-89%)';
  if (percentage >= 70) return 'Good (70-79%)';
  if (percentage >= 60) return 'Fair (60-69%)';
  if (percentage >= 50) return 'Poor (50-59%)';
  return 'Very Poor (<50%)';
}

function formatStatsSheet(sheet, dataLength) {
  try {
    // Format main headers
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setFontSize(14);
    sheet.getRange(2, 1, 1, 6).setFontWeight('bold');
    
    // Format overall statistics (approximate position)
    const overallStart = Math.max(1, dataLength - 10);
    sheet.getRange(overallStart, 1, 1, 6).setFontWeight('bold');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 6);
    
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