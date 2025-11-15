// REPLACE THE ENTIRE SCRIPT.JS FILE WITH THIS CODE
// This version uses in-memory storage instead of localStorage

// Global variables for in-memory storage
let users = [];
let currentUser = null;
let feedback = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Elements
    const homeBtn = document.getElementById('homeBtn');
    const analyzeQuestionsBtn = document.getElementById('analyzeQuestionsBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const startAnalysisBtn = document.getElementById('startAnalysisBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const backFromAnalysisBtn = document.getElementById('backFromAnalysisBtn');
    const backFromHistoryBtn = document.getElementById('backFromHistoryBtn');
    const backFromFeedbackBtn = document.getElementById('backFromFeedbackBtn');
    
    // Section Elements
    const sections = document.querySelectorAll('.section');
    const welcomeSection = document.getElementById('welcome');
    const bloomInfoSection = document.getElementById('bloomInfo');
    const questionAnalysisSection = document.getElementById('questionAnalysis');
    const userHistorySection = document.getElementById('userHistory');
    const feedbackSection = document.getElementById('feedbackSection');
    
    // Modal Elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Form Elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const questionInput = document.getElementById('questionInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearQuestionBtn = document.getElementById('clearQuestionBtn');
    const exampleItems = document.querySelectorAll('.example-item');
    const analysisResult = document.getElementById('analysisResult');
    const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');
    
    // History Elements
    const historyList = document.querySelector('.history-list');
    const noHistory = document.querySelector('.no-history');
    const filterLevel = document.getElementById('filterLevel');
    const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');
    
    // Feedback Elements
    const starRating = document.querySelectorAll('.star-rating i');
    const feedbackText = document.getElementById('feedbackText');
    const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
    const feedbackSuccess = document.getElementById('feedbackSuccess');
    
    // Search Elements
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchHistory';
    searchInput.placeholder = 'Search your questions...';
    searchInput.className = 'search-input';
    
    // Add search input to history filters
    const historyFilters = document.querySelector('.history-filters');
    if (historyFilters) {
        historyFilters.insertBefore(searchInput, filterLevel);
    }
    
    // Bloom's Taxonomy Information
    const bloomLevels = document.querySelectorAll('.bloom-level');
    const levelDetails = document.querySelectorAll('.level-details');
    
    // User state
    let userRating = 0;
    let currentAnalysis = null;
    
    // Initialize app
    function initializeApp() {
        updateAuthUI(false);
        console.log('App initialized');
    }
    
    // Navigation Functions
    function showSection(sectionToShow) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        sectionToShow.classList.add('active');
    }
    
    // Event Listeners for Navigation
    homeBtn.addEventListener('click', () => showSection(welcomeSection));
    learnMoreBtn.addEventListener('click', () => showSection(bloomInfoSection));
    startAnalysisBtn.addEventListener('click', () => {
        if (currentUser) {
            showSection(questionAnalysisSection);
        } else {
            openModal(loginModal);
        }
    });
    backToHomeBtn.addEventListener('click', () => showSection(welcomeSection));
    backFromAnalysisBtn.addEventListener('click', () => showSection(welcomeSection));
    backFromHistoryBtn.addEventListener('click', () => showSection(welcomeSection));
    backFromFeedbackBtn.addEventListener('click', () => showSection(welcomeSection));
    
    // Auth UI Update
    function updateAuthUI(isLoggedIn) {
        if (isLoggedIn) {
            loginBtn.classList.add('hidden');
            registerBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            
            // Add history and feedback buttons to nav
            if (!document.getElementById('historyBtn')) {
                const historyBtn = document.createElement('button');
                historyBtn.id = 'historyBtn';
                historyBtn.className = 'nav-btn';
                historyBtn.innerHTML = '<i class="fas fa-history"></i> History';
                historyBtn.addEventListener('click', () => {
                    loadUserHistory();
                    showSection(userHistorySection);
                });
                
                const feedbackBtn = document.createElement('button');
                feedbackBtn.id = 'feedbackBtn';
                feedbackBtn.className = 'nav-btn';
                feedbackBtn.innerHTML = '<i class="fas fa-comment"></i> Feedback';
                feedbackBtn.addEventListener('click', () => showSection(feedbackSection));
                
                const nav = document.querySelector('nav');
                nav.insertBefore(historyBtn, document.querySelector('.auth-buttons'));
                nav.insertBefore(feedbackBtn, document.querySelector('.auth-buttons'));
            }
        } else {
            loginBtn.classList.remove('hidden');
            registerBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            
            // Remove history and feedback buttons from nav
            const historyBtn = document.getElementById('historyBtn');
            const feedbackBtn = document.getElementById('feedbackBtn');
            if (historyBtn) historyBtn.remove();
            if (feedbackBtn) feedbackBtn.remove();
        }
    }
    
    // Authentication Functions
    loginBtn.addEventListener('click', () => {
        console.log('Login button clicked');
        openModal(loginModal);
    });
    
    registerBtn.addEventListener('click', () => {
        console.log('Register button clicked');
        openModal(registerModal);
    });
    
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateAuthUI(false);
        showSection(welcomeSection);
        alert('Logged out successfully!');
    });
    
    function openModal(modal) {
        console.log('Opening modal:', modal.id);
        modal.style.display = 'flex';
    }
    
    function closeModal(modal) {
        console.log('Closing modal:', modal.id);
        modal.style.display = 'none';
    }
    
    // Close modal events
    closeModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });
    
    // Form Handling - LOGIN
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        console.log('Login attempt:', email);
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {id: user.id, name: user.name, email: user.email};
            updateAuthUI(true);
            closeModal(loginModal);
            showSection(welcomeSection);
            loadUserHistory();
            alert(`Welcome back, ${user.name}!`);
            
            // Clear form
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
    
    // Form Handling - REGISTER
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Register form submitted');
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
        
        console.log('Registration attempt:', email);
        
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('Email already in use. Please use a different email or login.');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            history: []
        };
        
        users.push(newUser);
        console.log('User registered:', newUser);
        
        // Login the new user immediately
        currentUser = {id: newUser.id, name: newUser.name, email: newUser.email};
        updateAuthUI(true);
        closeModal(registerModal);
        showSection(welcomeSection);
        alert(`Welcome ${name}! Your account has been created successfully.`);
        
        // Clear form
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerConfirmPassword').value = '';
    });
    
    // Bloom's Taxonomy Interaction
    bloomLevels.forEach(level => {
        level.addEventListener('click', () => {
            const levelNum = level.getAttribute('data-level');
            const targetDetail = document.getElementById(`level${levelNum}`);
            
            // Highlight selected level
            levelDetails.forEach(detail => detail.classList.remove('active-detail'));
            if (targetDetail) {
                targetDetail.classList.add('active-detail');
                // Scroll to selected detail
                targetDetail.scrollIntoView({behavior: 'smooth'});
            }
        });
    });
    
    // Question Analysis Functions
    exampleItems.forEach(item => {
        item.addEventListener('click', () => {
            questionInput.value = item.getAttribute('data-question');
        });
    });
    
    clearQuestionBtn.addEventListener('click', () => {
        questionInput.value = '';
        analysisResult.classList.add('hidden');
    });
    
    analyzeBtn.addEventListener('click', () => {
        const question = questionInput.value.trim();
        if (!question) {
            alert('Please enter a question to analyze');
            return;
        }
        
        // Analysis logic - simple keyword matching
        const keywords = {
            remembering: ['list', 'define', 'tell', 'describe', 'identify', 'show', 'label', 'collect', 'examine', 'tabulate', 'quote', 'name', 'who', 'when', 'where', 'recall', 'recognize', 'memorize', 'repeat'],
            understanding: ['summarize', 'describe', 'interpret', 'contrast', 'predict', 'associate', 'distinguish', 'estimate', 'differentiate', 'discuss', 'extend', 'explain', 'rephrase', 'translate', 'compare', 'paraphrase'],
            applying: ['apply', 'use', 'demonstrate', 'calculate', 'complete', 'illustrate', 'show', 'solve', 'modify', 'relate', 'change', 'classify', 'experiment', 'discover', 'implement'],
            analyzing: ['analyze', 'separate', 'order', 'explain', 'connect', 'classify', 'arrange', 'divide', 'compare', 'select', 'infer', 'break down', 'discriminate', 'distinguish', 'examine', 'contrast'],
            evaluating: ['evaluate', 'assess', 'decide', 'rank', 'grade', 'test', 'measure', 'recommend', 'convince', 'select', 'judge', 'explain', 'discriminate', 'support', 'conclude', 'compare', 'critique'],
            creating: ['create', 'invent', 'compose', 'predict', 'plan', 'construct', 'design', 'imagine', 'propose', 'devise', 'formulate', 'develop', 'generate', 'build', 'produce']
        };
        
        const questionLower = question.toLowerCase();
        let matchedLevel = 1; // Default to remembering
        let highestMatches = 0;
        
        Object.entries(keywords).forEach(([level, words], index) => {
            const matches = words.filter(word => questionLower.includes(word)).length;
            if (matches > highestMatches) {
                highestMatches = matches;
                matchedLevel = index + 1;
            }
        });
        
        // Display analysis result
        displayAnalysisResult(matchedLevel, question);
    });
    
    function getLevelInfo(level) {
        const levels = [
            {
                name: "Remembering",
                description: "Recall facts and basic concepts.",
                icon: "fas fa-memory",
                color: "#f8d7da",
                verbs: ["Define", "List", "Recall", "Memorize", "Repeat", "State", "Name", "Identify", "Show", "Label"]
            },
            {
                name: "Understanding",
                description: "Explain ideas or concepts.",
                icon: "fas fa-book",
                color: "#fff3cd",
                verbs: ["Classify", "Describe", "Explain", "Identify", "Summarize", "Compare", "Discuss", "Interpret", "Paraphrase", "Translate"]
            },
            {
                name: "Applying",
                description: "Use information in new situations.",
                icon: "fas fa-tools",
                color: "#d4edda",
                verbs: ["Apply", "Demonstrate", "Illustrate", "Operate", "Solve", "Use", "Implement", "Execute", "Practice", "Compute"]
            },
            {
                name: "Analyzing",
                description: "Draw connections among ideas.",
                icon: "fas fa-microscope",
                color: "#d1ecf1",
                verbs: ["Analyze", "Differentiate", "Examine", "Test", "Compare", "Contrast", "Categorize", "Distinguish", "Question", "Deconstruct"]
            },
            {
                name: "Evaluating",
                description: "Justify a stand or decision.",
                icon: "fas fa-balance-scale",
                color: "#e2e3e5",
                verbs: ["Appraise", "Critique", "Evaluate", "Judge", "Support", "Value", "Defend", "Justify", "Argue", "Assess"]
            },
            {
                name: "Creating",
                description: "Produce new or original work.",
                icon: "fas fa-lightbulb",
                color: "#cce5ff",
                verbs: ["Create", "Design", "Develop", "Formulate", "Produce", "Compose", "Generate", "Plan", "Construct", "Invent"]
            }
        ];
        return levels[level - 1];
    }
    
    function displayAnalysisResult(level, question) {
        const levelInfo = getLevelInfo(level);
        const resultLevelElement = analysisResult.querySelector('.result-level');
        const resultExplanationElement = analysisResult.querySelector('.result-explanation');
        const verbTagsElement = analysisResult.querySelector('.verb-tags');
        
        resultLevelElement.innerHTML = `<span class="level-badge" style="background-color:${levelInfo.color}; color:#333;">Level ${level}: ${levelInfo.name}</span>`;
        resultExplanationElement.innerHTML = `<p><i class="${levelInfo.icon}"></i> This question requires students to ${levelInfo.description.toLowerCase()}</p>`;
        
        verbTagsElement.innerHTML = '';
        levelInfo.verbs.forEach(verb => {
            const tagElement = document.createElement('span');
            tagElement.className = 'verb-tag';
            tagElement.textContent = verb;
            verbTagsElement.appendChild(tagElement);
        });
        
        analysisResult.classList.remove('hidden');
        
        // Store current analysis for saving
        currentAnalysis = {
            question: question,
            level: level,
            timestamp: new Date().toISOString()
        };
    }
    
    // Save Analysis to History
    saveAnalysisBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please log in to save your analysis');
            openModal(loginModal);
            return;
        }
        
        if (!currentAnalysis) {
            alert('No analysis to save');
            return;
        }
        
        // Find user and add analysis to history
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            if (!user.history) {
                user.history = [];
            }
            user.history.push(currentAnalysis);
            alert('Analysis saved to your history');
        } else {
            alert('User not found');
        }
    });
    
    // History Functions
    function loadUserHistory() {
        if (!currentUser) return;
        
        const user = users.find(u => u.id === currentUser.id);
        if (!user || !user.history || user.history.length === 0) {
            historyList.innerHTML = '';
            noHistory.classList.remove('hidden');
            return;
        }
        
        noHistory.classList.add('hidden');
        displayHistoryItems(user.history);
    }
    
    function displayHistoryItems(historyItems) {
        // Apply filters
        const levelFilter = filterLevel.value;
        const searchQuery = searchInput.value.toLowerCase();
        
        let filteredItems = historyItems;
        
        if (levelFilter !== 'all') {
            filteredItems = filteredItems.filter(item => item.level === parseInt(levelFilter));
        }
        
        if (searchQuery) {
            filteredItems = filteredItems.filter(item => 
                item.question.toLowerCase().includes(searchQuery)
            );
        }
        
        historyList.innerHTML = '';
        
        filteredItems.forEach((item, index) => {
            const levelInfo = getLevelInfo(item.level);
            const date = new Date(item.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.borderLeft = `5px solid ${levelInfo.color}`;
            historyItem.innerHTML = `
                <div class="question">${item.question}</div>
                <div class="timestamp">${formattedDate}</div>
                <span class="level-badge" style="background-color:${levelInfo.color}; color:#333;">
                    Level ${item.level}: ${levelInfo.name}
                </span>
                <button class="delete-btn" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = parseInt(e.currentTarget.getAttribute('data-index'));
                deleteHistoryItem(itemIndex);
            });
        });
    }
    
    function deleteHistoryItem(index) {
        if (!currentUser) return;
        
        const user = users.find(u => u.id === currentUser.id);
        if (user && user.history) {
            user.history.splice(index, 1);
            loadUserHistory();
        }
    }
    
    // Event listeners for history
    filterLevel.addEventListener('change', loadUserHistory);
    searchInput.addEventListener('input', loadUserHistory);
    
    clearAllHistoryBtn.addEventListener('click', () => {
        openModal(confirmationModal);
    });
    
    confirmYesBtn.addEventListener('click', () => {
        if (!currentUser) return;
        
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            user.history = [];
            closeModal(confirmationModal);
            loadUserHistory();
        }
    });
    
    confirmNoBtn.addEventListener('click', () => {
        closeModal(confirmationModal);
    });
    
    // Analyze Questions button in nav
    analyzeQuestionsBtn.addEventListener('click', () => {
        if (currentUser) {
            showSection(questionAnalysisSection);
        } else {
            openModal(loginModal);
        }
    });
    
    // Feedback Functions
    starRating.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            userRating = rating;
            
            // Update UI
            starRating.forEach((s, i) => {
                if (i < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });
    
    submitFeedbackBtn.addEventListener('click', () => {
        const feedbackComment = feedbackText.value.trim();
        
        if (userRating === 0) {
            alert('Please select a rating');
            return;
        }
        
        // Save feedback
        feedback.push({
            rating: userRating,
            comment: feedbackComment,
            userId: currentUser ? currentUser.id : 'anonymous',
            timestamp: new Date().toISOString()
        });
        
        // Show success message
        feedbackSuccess.classList.remove('hidden');
        feedbackText.value = '';
        userRating = 0;
        starRating.forEach(s => s.className = 'far fa-star');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            feedbackSuccess.classList.add('hidden');
        }, 3000);
    });
    
    // Initialize app
    initializeApp();
    console.log('App fully loaded');
});