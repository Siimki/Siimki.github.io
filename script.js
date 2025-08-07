// Sample student data with Estonian names
let students = [
    { name: "Mari Tamm" },
    { name: "Jaan Kask" },
    { name: "Liisa Saar" },
    { name: "Andres Põder" },
    { name: "Kati Lepik" },
    { name: "Mart Võsa" },
    { name: "Eva Kivi" },
    { name: "Peeter Mänd" },
    { name: "Anna Kuusik" },
    { name: "Tõnu Oja" },
    { name: "Helena Lind" },
    { name: "Raivo Koppel" },
    { name: "Kadri Rand" },
    { name: "Urmas Sild" },
    { name: "Tiina Kask" }
];

class AttendanceTracker {
    constructor() {
        this.students = students.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredStudents = [...this.students];
        this.presentStudents = new Set();
        this.initializeElements();
        this.setupEventListeners();
        this.renderStudents();
        this.updateStats();
    }

    initializeElements() {
        this.studentsList = document.getElementById('studentsList');
        this.submitBtn = document.getElementById('submitBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Modal elements
        this.addStudentBtn = document.getElementById('addStudentBtn');
        this.addStudentModal = document.getElementById('addStudentModal');
        this.closeModal = document.getElementById('closeModal');
        this.cancelAdd = document.getElementById('cancelAdd');
        this.confirmAdd = document.getElementById('confirmAdd');
        this.newStudentName = document.getElementById('newStudentName');
    }

    setupEventListeners() {
        this.submitBtn.addEventListener('click', () => this.submitAttendance());
        
        // Modal events
        this.addStudentBtn.addEventListener('click', () => this.showAddStudentModal());
        this.closeModal.addEventListener('click', () => this.hideAddStudentModal());
        this.cancelAdd.addEventListener('click', () => this.hideAddStudentModal());
        this.confirmAdd.addEventListener('click', () => this.addNewStudent());
        
        // Close modal when clicking outside
        this.addStudentModal.addEventListener('click', (e) => {
            if (e.target === this.addStudentModal) {
                this.hideAddStudentModal();
            }
        });
    }

    showAddStudentModal() {
        this.addStudentModal.classList.add('active');
        this.newStudentName.focus();
    }

    hideAddStudentModal() {
        this.addStudentModal.classList.remove('active');
        this.newStudentName.value = '';
    }

    addNewStudent() {
        const name = this.newStudentName.value.trim();
        
        if (!name) {
            alert('Palun sisesta uue õpilase nimi');
            return;
        }
        
        // Add new student
        const newStudent = { name };
        this.students.push(newStudent);
        
        // Re-sort students alphabetically
        this.students.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredStudents = [...this.students];
        
        // Update display
        this.renderStudents();
        this.hideAddStudentModal();
        
        // Show success message
        this.showMessage('Õpilane lisatud edukalt!', 'success');
    }

    removeStudent(studentName) {
        if (confirm('Kas oled kindel, et soovid selle õpilase eemaldada?')) {
            this.students = this.students.filter(s => s.name !== studentName);
            this.filteredStudents = this.filteredStudents.filter(s => s.name !== studentName);
            this.presentStudents.delete(studentName);
            
            this.renderStudents();
            this.updateStats();
            
            this.showMessage('Õpilane eemaldatud edukalt!', 'success');
        }
    }

    renderStudents() {
        this.studentsList.innerHTML = '';
        
        this.filteredStudents.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.className = 'student-item';
            
            const isPresent = this.presentStudents.has(student.name);
            
            if (isPresent) {
                studentItem.classList.add('selected');
            }
            
            studentItem.innerHTML = `
                <input 
                    type="checkbox" 
                    class="student-checkbox" 
                    id="student-${student.name}"
                    ${isPresent ? 'checked' : ''}
                    data-student-name="${student.name}"
                >
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                </div>
                <button class="remove-student" data-student-name="${student.name}">&times;</button>
            `;
            
            // Make the checkbox clickable
            const checkbox = studentItem.querySelector('.student-checkbox');
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the student info click
                const newState = checkbox.checked;
                this.toggleStudent(student.name, newState);
                
                if (newState) {
                    studentItem.classList.add('selected');
                } else {
                    studentItem.classList.remove('selected');
                }
            });
            
            // Make the entire student item clickable
            studentItem.addEventListener('click', (e) => {
                // Don't trigger if clicking on checkbox or remove button
                if (e.target.classList.contains('student-checkbox') || 
                    e.target.classList.contains('remove-student')) {
                    return;
                }
                
                const newState = !this.presentStudents.has(student.name);
                this.toggleStudent(student.name, newState);
                
                if (newState) {
                    studentItem.classList.add('selected');
                } else {
                    studentItem.classList.remove('selected');
                }
                
                checkbox.checked = newState;
            });
            
            // Remove student button
            const removeBtn = studentItem.querySelector('.remove-student');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the student selection
                this.removeStudent(student.name);
            });
            
            this.studentsList.appendChild(studentItem);
        });
    }

    toggleStudent(studentName, isPresent) {
        if (isPresent) {
            this.presentStudents.add(studentName);
        } else {
            this.presentStudents.delete(studentName);
        }
        this.updateStats();
        this.updateSubmitButton();
    }

    updateStats() {
        // Remove stats update since we removed the stats section
        // Just update the submit button
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        this.submitBtn.disabled = this.presentStudents.size === 0;
    }

    async submitAttendance() {
        if (this.presentStudents.size === 0) return;

        this.showLoading(true);
        
        try {
            // Format date in Estonian format
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth();
            const estonianMonths = [
                'Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni',
                'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'
            ];
            const estonianDate = `${day}. ${estonianMonths[month]}`;
            
            const attendanceData = {
                date: estonianDate,
                presentStudents: Array.from(this.presentStudents),
                allStudents: this.students.map(student => ({
                    name: student.name,
                    present: this.presentStudents.has(student.name)
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
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSl1nz4CKkNsToj5PCC51e4jlDQ1xtZalqLgyB5hQWzCA5gLMmTdX7Z0szgwsi7F1fng/exec';
        
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
        this.showMessage('✅ Attendance submitted successfully!', 'success');
    }

    showErrorMessage() {
        this.showMessage('❌ Error submitting attendance. Please try again.', 'error');
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        message.textContent = text;
        
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