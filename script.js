// Sample student data with Estonian names
let students = [
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
        this.submitBtn = document.getElementById('submitBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Modal elements
        this.addStudentBtn = document.getElementById('addStudentBtn');
        this.addStudentModal = document.getElementById('addStudentModal');
        this.closeModal = document.getElementById('closeModal');
        this.cancelAdd = document.getElementById('cancelAdd');
        this.confirmAdd = document.getElementById('confirmAdd');
        this.newStudentName = document.getElementById('newStudentName');
        this.newStudentId = document.getElementById('newStudentId');
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterStudents());
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
        this.newStudentId.value = '';
    }

    addNewStudent() {
        const name = this.newStudentName.value.trim();
        const id = this.newStudentId.value.trim();
        
        if (!name || !id) {
            alert('Please enter both name and ID');
            return;
        }
        
        // Check if ID already exists
        if (this.students.some(s => s.id === id)) {
            alert('Student ID already exists');
            return;
        }
        
        // Add new student
        const newStudent = { id, name };
        this.students.push(newStudent);
        this.filteredStudents = [...this.students];
        
        // Update display
        this.renderStudents();
        this.hideAddStudentModal();
        
        // Show success message
        this.showMessage('Student added successfully!', 'success');
    }

    removeStudent(studentId) {
        if (confirm('Are you sure you want to remove this student?')) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.filteredStudents = this.filteredStudents.filter(s => s.id !== studentId);
            this.presentStudents.delete(studentId);
            
            this.renderStudents();
            this.updateStats();
            
            this.showMessage('Student removed successfully!', 'success');
        }
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
            
            if (isPresent) {
                studentItem.classList.add('selected');
            }
            
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
                <button class="remove-student" data-student-id="${student.id}">&times;</button>
            `;
            
            // Make the whole student item clickable
            const studentInfo = studentItem.querySelector('.student-info');
            studentInfo.addEventListener('click', () => {
                const newState = !this.presentStudents.has(student.id);
                this.toggleStudent(student.id, newState);
                
                if (newState) {
                    studentItem.classList.add('selected');
                } else {
                    studentItem.classList.remove('selected');
                }
                
                const checkbox = studentItem.querySelector('.student-checkbox');
                checkbox.checked = newState;
            });
            
            // Remove student button
            const removeBtn = studentItem.querySelector('.remove-student');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the student selection
                this.removeStudent(student.id);
            });
            
            // Add long-press delete for mobile
            this.addLongPressDelete(studentItem, student.id);
            
            this.studentsList.appendChild(studentItem);
        });
    }

    addLongPressDelete(element, studentId) {
        let pressTimer;
        let isLongPress = false;
        
        const startPress = (e) => {
            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                this.showLongPressMenu(studentId, e);
            }, 500); // 500ms for long press
        };
        
        const endPress = () => {
            clearTimeout(pressTimer);
        };
        
        const cancelPress = () => {
            clearTimeout(pressTimer);
        };
        
        // Touch events for mobile
        element.addEventListener('touchstart', startPress, { passive: true });
        element.addEventListener('touchend', endPress);
        element.addEventListener('touchcancel', cancelPress);
        
        // Mouse events for desktop
        element.addEventListener('mousedown', startPress);
        element.addEventListener('mouseup', endPress);
        element.addEventListener('mouseleave', cancelPress);
    }

    showLongPressMenu(studentId, event) {
        // Prevent default behavior
        event.preventDefault();
        
        // Create a simple menu
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            top: ${event.touches ? event.touches[0].clientY : event.clientY}px;
            left: ${event.touches ? event.touches[0].clientX : event.clientX}px;
            background: var(--neutral-white);
            border: 2px solid var(--club-orange);
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            font-size: 0.9rem;
        `;
        
        menu.innerHTML = `
            <div style="color: var(--neutral-dark); margin-bottom: 8px; font-weight: 600;">Delete Student?</div>
            <div style="display: flex; gap: 8px;">
                <button id="confirm-delete" style="
                    background: var(--error-red);
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                ">Delete</button>
                <button id="cancel-delete" style="
                    background: var(--neutral-light);
                    color: var(--neutral-dark);
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                ">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Handle menu actions
        menu.querySelector('#confirm-delete').addEventListener('click', () => {
            this.removeStudent(studentId);
            document.body.removeChild(menu);
        });
        
        menu.querySelector('#cancel-delete').addEventListener('click', () => {
            document.body.removeChild(menu);
        });
        
        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                document.body.removeChild(menu);
                document.removeEventListener('click', closeMenu);
                document.removeEventListener('touchstart', closeMenu);
            }
        };
        
        // Delay adding event listeners to prevent immediate closure
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
            document.addEventListener('touchstart', closeMenu);
        }, 100);
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
        // Remove stats update since we removed the stats section
        // Just update the submit button
        this.updateSubmitButton();
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
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJRrsiKX5O5CfTFI08OLrctvUZm0UtW-6CZb9xJx9qCO1nwx7STOQcC31ogMpb1TwP3g/exec';
        
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