// Sample student data with Estonian names
const students = [
    { id: "ST001", name: "Mari Tamm" },
    { id: "ST002", name: "Jaan Kask" },
    { id: "ST003", name: "Liisa Saar" },
    { id: "ST004", name: "Andres Põder" },
    { id: "ST005", name: "Kati Lepik" },
    { id: "ST006", name: "Mart Võsa" },
    { id: "ST007", name: "Eva Kivi" },
    { id: "ST008", name: "Peeter Mänd" },
    { id: "ST009", name: "Anna Kuusik" },
    { id: "ST010", name: "Tõnu Oja" },
    { id: "ST011", name: "Helena Lind" },
    { id: "ST012", name: "Raivo Koppel" },
    { id: "ST013", name: "Kadri Rand" },
    { id: "ST014", name: "Urmas Sild" },
    { id: "ST015", name: "Tiina Kask" }
];

class AttendanceTracker {
    constructor() {
        this.students = students;
        this.filteredStudents = [...students];
        this.presentStudents = new Set();
        this.initializeElements();
        this.setupEventListeners();
        this.updateDate();
        this.renderStudents();
        this.updateStats();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.studentsList = document.getElementById('studentsList');
        this.totalStudentsEl = document.getElementById('totalStudents');
        this.presentStudentsEl = document.getElementById('presentStudents');
        this.attendancePercentEl = document.getElementById('attendancePercent');
        this.absentStudentsEl = document.getElementById('absentStudents');
        this.submitBtn = document.getElementById('submitBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterStudents());
        this.submitBtn.addEventListener('click', () => this.submitAttendance());
        this.selectAllBtn.addEventListener('click', () => this.selectAllStudents());
        this.clearAllBtn.addEventListener('click', () => this.clearAllStudents());
    }

    updateDate() {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    }

    filterStudents() {
        const searchTerm = this.searchInput.value.toLowerCase();
        this.filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm)
        );
        this.renderStudents();
    }

    renderStudents() {
        this.studentsList.innerHTML = '';
        
        this.filteredStudents.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.className = 'student-item';
            
            const isPresent = this.presentStudents.has(student.id);
            
            studentItem.innerHTML = `
                <input 
                    type="checkbox" 
                    class="student-checkbox" 
                    id="student-${student.id}"
                    ${isPresent ? 'checked' : ''}
                    data-student-id="${student.id}"
                >
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">${student.id}</div>
                </div>
            `;
            
            const checkbox = studentItem.querySelector('.student-checkbox');
            checkbox.addEventListener('change', (e) => {
                this.toggleStudent(student.id, e.target.checked);
            });
            
            this.studentsList.appendChild(studentItem);
        });
    }

    toggleStudent(studentId, isPresent) {
        if (isPresent) {
            this.presentStudents.add(studentId);
        } else {
            this.presentStudents.delete(studentId);
        }
        this.updateStats();
        this.updateSubmitButton();
    }

    selectAllStudents() {
        this.filteredStudents.forEach(student => {
            this.presentStudents.add(student.id);
        });
        this.renderStudents();
        this.updateStats();
        this.updateSubmitButton();
    }

    clearAllStudents() {
        this.presentStudents.clear();
        this.renderStudents();
        this.updateStats();
        this.updateSubmitButton();
    }

    updateStats() {
        const totalStudents = this.students.length;
        const presentCount = this.presentStudents.size;
        const absentCount = totalStudents - presentCount;
        const attendancePercent = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
        
        this.totalStudentsEl.textContent = totalStudents;
        this.presentStudentsEl.textContent = presentCount;
        this.attendancePercentEl.textContent = attendancePercent + '%';
        this.absentStudentsEl.textContent = absentCount;
        
        // Update colors based on attendance percentage
        this.updateAttendanceColor(attendancePercent);
    }

    updateAttendanceColor(percentage) {
        const attendanceEl = this.attendancePercentEl;
        
        // Remove existing color classes
        attendanceEl.classList.remove('high-attendance', 'medium-attendance', 'low-attendance');
        
        // Add appropriate color class
        if (percentage >= 80) {
            attendanceEl.classList.add('high-attendance');
        } else if (percentage >= 60) {
            attendanceEl.classList.add('medium-attendance');
        } else {
            attendanceEl.classList.add('low-attendance');
        }
    }

    updateSubmitButton() {
        this.submitBtn.disabled = this.presentStudents.size === 0;
    }

    async submitAttendance() {
        if (this.presentStudents.size === 0) return;

        this.showLoading(true);
        
        try {
            const attendanceData = {
                date: new Date().toISOString().split('T')[0],
                presentStudents: Array.from(this.presentStudents),
                allStudents: this.students.map(student => ({
                    id: student.id,
                    name: student.name,
                    present: this.presentStudents.has(student.id)
                }))
            };

            // Google Sheets API call
            const response = await this.submitToGoogleSheets(attendanceData);
            
            if (response.success) {
                this.showSuccessMessage();
                this.presentStudents.clear();
                this.renderStudents();
                this.updateStats();
                this.updateSubmitButton();
            } else {
                throw new Error(response.error || 'Unknown error');
            }
            
        } catch (error) {
            console.error('Error submitting attendance:', error);
            this.showErrorMessage();
        } finally {
            this.showLoading(false);
        }
    }

    async submitToGoogleSheets(data) {
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyP8vzgYBK65Eyg4EdpMVtqSrstinpnYXoostRi1txYkr7ka8AyQLSDXKYQEpOf_0eXUg/exec';
        
        try {
            // Convert data to URL parameters
            const params = new URLSearchParams();
            params.append('date', data.date);
            params.append('presentStudents', JSON.stringify(data.presentStudents));
            params.append('allStudents', JSON.stringify(data.allStudents));
            
            console.log('Sending data:', data);
            console.log('URL parameters:', params.toString());
            
            const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`, {
                method: 'GET'
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            const result = await response.text();
            console.log('Response body:', result);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, body: ${result}`);
            }

            const jsonResult = JSON.parse(result);
            console.log('Parsed response:', jsonResult);
            return jsonResult;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('active');
        } else {
            this.loadingOverlay.classList.remove('active');
        }
    }

    showSuccessMessage() {
        // Create a temporary success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        message.textContent = '✅ Attendance submitted successfully!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }

    showErrorMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        message.textContent = '❌ Error submitting attendance. Please try again.';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceTracker();
}); 