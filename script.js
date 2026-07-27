// ============================================
// Alumni & Seminar Dashboard — Enhanced v3
// Live Updates | Duplicate Detection | Smart UI
// ============================================

const CONFIG = {
    DEBOUNCE_MS: 150,
    STALE_THRESHOLD_MS: 300000,A
    AUTO_REFRESH_INTERVAL_MS: 60000,
    LIVE_INDICATOR_DURATION_MS: 2000,
    JSONP_TIMEOUT_MS: 90000,
    JSONP_LATE_RESPONSE_GRACE_MS: 120000,
    FETCH_TIMEOUT_MS: 15000,
    DATA_FETCH_TIMEOUT_MS: 45000,
    DEFAULT_CONFIG_URL: 'https://script.google.com/macros/s/AKfycbx91abcBythExsxaG45d4KDSLbfLO4kFTsEoA7z8RTwPYq20FOEyC2cCr7I-YDC9Sa5/exec'
    
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MODULES = {
'alumni-info': {
    title: 'Alumni Information Sheet Form',
    subtitle: 'Alumni registration form responses',
    icon: 'fa-user',
    dataKey: 'alumniInfo',
    endpointKey: 'alumni-info',
    filters: ['All'],
    defaultSort: { column: 'fullName', direction: 'asc' },
    columns: [
        { key: 'timestamp',       label: 'Timestamp',              sortable: true, format: 'customDate', filterable: true, filterType: 'month' },
        { key: 'fullName',        label: 'Full Name',              sortable: true, computed: true, filterable: true, filterType: 'newBadge' },
        { key: 'email',           label: 'Email Address',          sortable: true, uppercase: false },
        { key: 'sexAtBirth',      label: 'Sex Assigned at Birth',  sortable: true, filterable: true },
        { key: 'genderIdentity',  label: 'Gender Identity',        sortable: true, filterable: true },
        { key: 'isPwd',           label: 'PWD Status',             sortable: true, filterable: true },
        { key: 'pwdType',         label: 'PWD Type',               sortable: true, filterable: true },
        { key: 'isIp',            label: 'IP Member',              sortable: true, filterable: true },
        { key: 'ipAffiliation',   label: 'IP Affiliation',         sortable: true, filterable: true },
        { key: 'civilStatus',     label: 'Civil Status',           sortable: true, filterable: true },
        { key: 'citizenship',     label: 'Citizenship',            sortable: true, filterable: true },
        { key: 'birthdate',       label: 'Birthdate',              sortable: true, format: 'birthdateWithAge', filterable: true, filterType: 'month' },
        { key: 'telephone',       label: 'Telephone / Mobile',     sortable: true },
        { key: 'facebook',        label: 'Facebook Account',       sortable: true },
        { key: 'homeAddress',     label: 'Home Address',           sortable: true, validateAddress: true },
        { key: 'firstGenCollege', label: 'First Gen College',      sortable: true, filterable: true },
        { key: 'degree',          label: 'Degree Completed at RSU', sortable: true, filterable: true },
        { key: 'yearGraduated',   label: 'Year Graduated',          sortable: true, filterable: true },
        { key: 'campus',          label: 'Campus',                  sortable: true, filterable: true },
        { key: 'position',        label: 'Position',                sortable: true, filterable: true },
        { key: 'employer',        label: 'Employer',                sortable: true, filterable: true },
        { key: '__rowNum',        label: 'Sheet Row',               sortable: false, computed: true, rowNumber: true }
    ]
},
    'nsrp-registration': {
        title: 'NSRP Registration Form',
        subtitle: 'NSRP form responses',
        icon: 'fa-id-card',
        dataKey: 'nsrp',
        endpointKey: 'nsrp-registration',
        filters: ['All'],
        defaultSort: { column: 'fullName', direction: 'asc' },
        columns: [
            { key: 'timestamp', label: 'Timestamp', sortable: true, format: 'customDate' },
            { key: 'fullName', label: 'Full Name', sortable: true, computed: true, filterable: true, filterType: 'newBadge' },
            { key: 'email', label: 'E-mail Address', sortable: true, uppercase: false },
            { key: 'address', label: 'Address', sortable: true, computed: true },
            { key: 'school', label: 'School Graduated', sortable: true, filterable: true },
            { key: 'course', label: 'Course', sortable: true, filterable: true, dependsOn: 'school' },
            { key: 'yearGraduated', label: 'Year Graduated', sortable: true, filterable: true },
            { key: '__rowNum', label: 'Sheet Row', sortable: false, computed: true, rowNumber: true }
        ]
    },
    'graduate-employability': {
        title: 'Graduate Employability Survey',
        subtitle: 'Graduate Employability form responses',
        icon: 'fa-briefcase',
        dataKey: 'graduateEmployability',
        endpointKey: 'graduate-employability',
        filters: ['All'],
        defaultSort: { column: 'fullName', direction: 'asc' },
        columns: [
            { key: 'timestamp',         label: 'Timestamp',                    sortable: true, format: 'customDate', filterable: true, filterType: 'month' },
            { key: 'fullName',          label: 'Full Name',                    sortable: true, computed: true, filterable: true, filterType: 'newBadge' },
            { key: 'email',             label: 'Email',                        sortable: true, uppercase: false },
            { key: 'birthdate',         label: 'Bdate',                        sortable: true, format: 'birthdateWithAge', filterable: true, filterType: 'month' },
            { key: 'civilStatus',       label: 'Civil',                        sortable: true, filterable: true },
            { key: 'sexAtBirth',        label: 'Sex',                          sortable: true, filterable: true },
            { key: 'genderIdentity',    label: 'Gender',                       sortable: true, filterable: true },
            { key: 'mobile',            label: 'Contact',                      sortable: true },
            { key: 'facebook',          label: 'FB',                           sortable: true, uppercase: false },
            { key: 'address',           label: 'Address',                      sortable: true, computed: true, validateAddress: true },
            { key: 'pwdType',           label: 'Disability',                   sortable: true, filterable: true },
            { key: 'ipAffiliation',     label: 'Affiliation',                  sortable: true, filterable: true },
            { key: 'degree',            label: 'Course',                       sortable: true, filterable: true },
            { key: 'campusCollege',     label: 'Campus/College',               sortable: true, filterable: true },
            { key: 'yearGraduated',     label: 'Batch',                        sortable: true, filterable: true },
            { key: 'firstGenCollege',   label: '1st Gen',                      sortable: true, filterable: true },
            { key: 'furtherStudyLevel', label: 'further study',                sortable: true, filterable: true },
            { key: 'furtherProgram',    label: 'Program',                      sortable: true, filterable: true },
            { key: 'furtherSchool',     label: 'School',                       sortable: true, filterable: true },
            { key: 'furtherLocation',   label: 'School Location',              sortable: true, filterable: true },
            { key: 'lookingForJob',     label: 'Job Ready?',                   sortable: true, filterable: true },
            { key: 'position',          label: 'Position',                     sortable: true, filterable: true },
            { key: 'employer',          label: 'Employer',                     sortable: true, filterable: true },
            { key: 'employerLocation',  label: 'Organization / Employer',      sortable: true, filterable: true },
            { key: 'industry',          label: 'Industry / Line of Business',  sortable: true, filterable: true },
            { key: 'inBusiness',        label: 'Business',                     sortable: true, filterable: true },
            { key: 'businessName',      label: 'Company Name',                 sortable: true, filterable: true },
            { key: 'businessRole',      label: 'Role',                         sortable: true, filterable: true },
            { key: 'businessType',      label: 'Business Type',                sortable: true, filterable: true },
            { key: 'businessLocation',  label: 'Company Address',              sortable: true, filterable: true },
            { key: '__rowNum',          label: 'Sheet Row',                    sortable: false, computed: true, rowNumber: true }
        ]
    },
    'jops-evaluation': {
        title: 'JOPS Evaluation',
        subtitle: 'Job Orientation and Placement Seminar evaluation responses',
        icon: 'fa-clipboard-check',
        dataKey: 'jopsEvaluation',
        endpointKey: 'jops-evaluation',
        filters: ['All'],
        defaultSort: { column: 'fullName', direction: 'asc' },
        columns: [
            { key: 'timestamp', label: 'Timestamp', sortable: true, format: 'customDate' },
            { key: 'fullName', label: 'Full Name', sortable: true, computed: true, filterable: true, filterType: 'newBadge' },
            { key: 'email', label: 'Email Address', sortable: true, uppercase: false },
            { key: 'college', label: 'College/Campus', sortable: true, filterable: true },
            { key: 'degree', label: 'Degree & Specialization', sortable: true, filterable: true, dependsOn: 'college' },
            { key: '__rowNum', label: 'Sheet Row', sortable: false, computed: true, rowNumber: true }
        ]
    },
    'legs-participation': {
        title: 'LEGS Attendance',
        subtitle: 'Labor Education attendance form responses',
        icon: 'fa-graduation-cap',
        dataKey: 'legsParticipation',
        endpointKey: 'legs-participation',
        filters: ['All', 'Green Checks'],
        defaultSort: { column: 'fullName', direction: 'asc' },
        columns: [
            { key: 'schedule', label: 'Webinar Schedule', sortable: true, filterable: true },
            { key: 'timestamp', label: 'Timestamp', sortable: true, format: 'customDate' },
            { key: 'fullName', label: 'Full Name', sortable: true, computed: true, filterable: true, filterType: 'newBadge' },
            { key: 'email', label: 'Email Address', sortable: true, uppercase: false },
            { key: 'degree', label: 'Degree & Specialization', sortable: true, filterable: true, dependsOn: 'campus' },
            { key: 'campus', label: 'Campus', sortable: true, filterable: true },
            { key: '__rowNum', label: 'Sheet Row', sortable: false, computed: true, rowNumber: true }
        ]
    },
    'legs-evaluation': {
        title: 'LEGS Evaluation',
        subtitle: 'Labor Education webinar evaluation responses',
        icon: 'fa-chalkboard-user',
        dataKey: 'legsEvaluation',
        endpointKey: 'legs-evaluation',
        filters: ['All'],
        defaultSort: { column: 'fullName', direction: 'asc' },
        columns: [
            { key: 'timestamp', label: 'Timestamp', sortable: true, format: 'customDate' },
            { key: 'fullName', label: 'Full Name', sortable: true, computed: false, filterable: true, filterType: 'newBadge' },
            { key: 'email', label: 'Email Address', sortable: true, uppercase: false },
            { key: 'college', label: 'College/Campus', sortable: true, filterable: true },
            { key: 'degree', label: 'Degree & Specialization', sortable: true, filterable: true, dependsOn: 'college' },
            { key: '__rowNum', label: 'Sheet Row', sortable: false, computed: true, rowNumber: true }
        ]
    }
};

const DROPDOWN_OPTIONS = {
    webinar: ['Attended', 'Please Verify your record at CARES Office', 'Missing', ''],
    legsEvaluation: ['Answered', 'Missing', 'No Record', '']
};

const STATUS_COLORS = {
    'complete': 'green', 'approved': 'green', 'verified': 'green', 'attended': 'green', 'answered': 'green',
    'incomplete': 'red', 'disapproved': 'red', 'mismatch': 'red', 'missing': 'red', 'no record': 'red',
    'pending': 'orange', 'please verify your record at cares office': 'red', '': 'gray'
};

class DashboardApp {
    constructor() {
        this.currentPage = 'alumni-info';
        this.currentFilter = 'all';
        this.currentSearch = '';
        // Remembers the page the user was viewing before a search began.
        // The memory is stored per module so clearing a search can safely
        // return to the correct page without affecting another table.
        this.searchPageMemory = {};
        this.currentSort = { column: null, direction: 'asc' };
        this.columnFilters = {};
        this.pagination = { page: 1, perPage: 20 };
        this.data = {
            alumniInfo: [], nsrp: [], graduateEmployability: [], jopsEvaluation: [], legsParticipation: [], legsEvaluation: []
        };
        this.settings = {
            darkMode: false,
            rowsPerPage: 20,
            visibleColumns: {},
            columnOrder: {},
            showDuplicates: false,
            editMode: false
        };
        this.editAuthorized = false;
        this.selectedEditRow = null;
        this.isSavingEdits = false;
        this.pendingEdits = {};
        this.originalRowSnapshots = {};
        // Keeps the record search isolated from browser/password-manager autofill
        // while the editor authorization dialog is open. Without this guard,
        // Chrome can incorrectly place the saved login name (for example,
        // "AdminTon") inside the table search field and hide every row.
        this._editAuthSearchSnapshot = null;
        this._editAuthSearchGuardUntil = 0;
        this._editAuthSearchRestoreTimers = [];
        this.draggedColumn = null;
        this._emptyStateResizeObserver = null;
        this.EDITABLE_KEYS = ['email','telephone','facebook','homeAddress','degree','yearGraduated','campus','position','employer'];
        this.endpoints = {};
        this.endpointsReady = null;
        this.lastFetch = {};
        this.loadingModules = new Set();
        // Tracks user-triggered single-table refreshes so the dashboard can show
        // a cute loader inside the table without replacing the sidebar/topbar.
        this.tableRefreshModules = new Set();
        this.searchDebounce = null;
        this.mobileSearchOpen = false;
        this.autoRefreshInterval = null;
        this.autoRefreshEnabled = false;
        this.previousData = {};
        this.duplicateNames = new Set();
        this.isSpeaking = false;
        this.speechNames = [];
        this.currentSpeakIndex = -1;
        this.currentUtterance = null;
        this.speechContext = null;
        this.speakTimeout = null;
        this.isOffline = false;
        this.offlineRetryCount = 0;
        this.offlineCheckInterval = null;

        // Continuous loader state. The visible percentage always advances one
        // whole number at a time and has a minimum viewing duration so a fast
        // backend response does not make the growth animation flash by.
        this._loadingBackendReady = false;
        this._loadingStartedAt = 0;
        this._loadingMinDuration = 900;
        this._loadingAutoTimer = null;
        this._loadingMilestone = 0;
        this._loadingCustomMessageUntil = 0;
        this._offlineTransitionInProgress = false;
        this._loadingInterruptedByOffline = false;

        this.encodedRecords = new Set();
        this.legacyEncodedRecords = new Set();
        this.encodingStatuses = {};
        this.encodingStatusSaving = new Set();
        this.activeEncodePopup = null;
        this._encodePopupOutsideHandler = null;
        this._encodePopupKeyHandler = null;
        this.init();
    }

    init() {
        this.syncViewportHeight();
        this.loadSettings();
        this.loadEndpointsFromStorage();
        this.loadLastFetch();
        this.loadColumnFilters();
        this.loadEncodedRecords();
        this.bindEvents();
        this.initSearchClear();
        this.ensureEditRuntimeStyles();

        // Load the shared endpoint configuration before the first data request.
        // Previously, the dashboard started fetching with stale local endpoints
        // and replaced them only after the request had already failed.
        this.endpointsReady = this.loadEndpointsGlobal();
        this.checkLogin();

        this.applySidebarCollapse();
        this.syncResponsiveUI();
        this.initOfflineDetection();
    }

    syncViewportHeight() {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${Math.round(viewportHeight)}px`);
    }

    ensureEditRuntimeStyles() {
        if (document.getElementById('edit-runtime-styles')) return;
        const style = document.createElement('style');
        style.id = 'edit-runtime-styles';
        style.textContent = `
            .edit-selected-row::after {
                content: "Editing this row • click another row to continue" !important;
                background: #d97706 !important;
            }
            .edit-pending-row:not(.edit-selected-row) {
                background: linear-gradient(90deg, rgba(5,150,105,.10), rgba(5,150,105,.025)) !important;
                box-shadow: inset 4px 0 0 #059669;
            }
            [data-theme="dark"] .edit-pending-row:not(.edit-selected-row) {
                background: linear-gradient(90deg, rgba(16,185,129,.16), rgba(16,185,129,.04)) !important;
            }
            .footer-save-action:disabled {
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    async checkLogin() {
        const session = sessionStorage.getItem('dashboard_session');
        if (session === 'authenticated') {
            // Cover the dashboard before removing the login layer. This prevents
            // the empty/black table from flashing while Google Apps Script runs.
            this.showLoading(true, {
                progress: 6,
                title: 'Restoring your dashboard',
                message: 'Checking your saved session…'
            });
            this.hideLogin();
            this.navigateTo('alumni-info');

            this.setLoadingProgress(16, 'Loading shared data-source settings…');
            await this.ensureEndpointsReady();
            this.setLoadingProgress(28, 'Connected. Preparing Google Sheets records…');
            await this.fetchAllDataOnInit();
        }
    }

    async ensureEndpointsReady() {
        if (!this.endpointsReady) {
            this.endpointsReady = this.loadEndpointsGlobal();
        }

        // Saved endpoints are safe to use immediately. Refresh the shared map in
        // the background instead of blocking the first visible table.
        const hasCachedEndpoints = Object.values(MODULES).some(mod =>
            !!this.endpoints[mod.endpointKey]
        );
        if (hasCachedEndpoints) {
            Promise.resolve(this.endpointsReady).catch(() => false);
            return true;
        }

        try {
            await this.endpointsReady;
            return true;
        } catch (error) {
            // loadEndpointsGlobal already reports its own warning.
            return false;
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value;
        const errorEl = document.getElementById('login-error');
        const card = document.querySelector('.login-card');
        if (user === 'AdminTon' && pass === '4CaresCheqList') {
            errorEl.textContent = '';
            sessionStorage.setItem('dashboard_session', 'authenticated');
            card.style.animation = 'loginSlideOut 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards';
            setTimeout(async () => {
                // Show the full-screen loader first, then remove the login card.
                // The loader stays above the app until every configured module
                // has either loaded or returned an error.
                this.showLoading(true, {
                    progress: 6,
                    title: 'Welcome to CARES',
                    message: 'Starting your management dashboard…'
                });
                this.hideLogin();
                this.navigateTo('alumni-info');

                this.setLoadingProgress(16, 'Loading shared data-source settings…');
                await this.ensureEndpointsReady();
                this.setLoadingProgress(28, 'Connected. Preparing Google Sheets records…');
                await this.fetchAllDataOnInit();
            }, 500);
        } else {
            errorEl.textContent = 'Invalid username or password';
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'shake 0.4s ease';
        }
    }

    hideLogin() {
        const overlay = document.getElementById('login-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.style.display = 'none', 600);
        }
    }

    togglePassword() {
        const input = document.getElementById('login-pass');
        const icon = document.getElementById('eye-icon');
        if (!input || !icon) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    loadSettings() {
        const dark = localStorage.getItem('dashboard_dark_mode');
        if (dark !== null) this.toggleDarkMode(dark === '1', true);
        const rows = localStorage.getItem('dashboard_rows_per_page');
        if (rows) {
            this.settings.rowsPerPage = parseInt(rows, 10);
            this.pagination.perPage = this.settings.rowsPerPage;
        }
        const cols = localStorage.getItem('dashboard_visible_columns');
        if (cols) this.settings.visibleColumns = JSON.parse(cols);
        const savedColumnOrder = localStorage.getItem('dashboard_column_order');
        if (savedColumnOrder) {
            try {
                this.settings.columnOrder = JSON.parse(savedColumnOrder) || {};
            } catch (error) {
                this.settings.columnOrder = {};
            }
        }
        // FIX: Force the sheet-row column visible — old cached settings may have hidden it
        Object.keys(MODULES).forEach(page => {
            if (!this.settings.visibleColumns[page]) this.settings.visibleColumns[page] = {};
            this.settings.visibleColumns[page]['__rowNum'] = true;
            this.normalizeColumnOrder(page);
        });
        this.saveSettings();
        // Remove the retired Table View preference from older dashboard versions.
        localStorage.removeItem('dashboard_table_density');
        const showDups = localStorage.getItem('dashboard_show_duplicates');
        if (showDups !== null) this.settings.showDuplicates = showDups === '1';
        const collapsed = localStorage.getItem('dashboard_sidebar_collapsed');
        this.settings.sidebarCollapsed = collapsed === '1';
    }

    saveSettings() {
        localStorage.setItem('dashboard_rows_per_page', this.settings.rowsPerPage);
        localStorage.setItem('dashboard_visible_columns', JSON.stringify(this.settings.visibleColumns));
        localStorage.setItem('dashboard_column_order', JSON.stringify(this.settings.columnOrder));
        localStorage.setItem('dashboard_show_duplicates', this.settings.showDuplicates ? '1' : '0');
                localStorage.setItem('dashboard_sidebar_collapsed', this.settings.sidebarCollapsed ? '1' : '0');
    }

    isTemporaryAppsScriptRedirect(value) {
        try {
            const parsed = new URL(String(value || '').trim());
            return parsed.hostname === 'script.googleusercontent.com' &&
                parsed.pathname.includes('/macros/echo');
        } catch (error) {
            return false;
        }
    }

    normalizeEndpointUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';

        try {
            const parsed = new URL(raw);
            if (!['http:', 'https:'].includes(parsed.protocol)) return '';

            // script.googleusercontent.com/macros/echo URLs are temporary redirect
            // targets. They contain an expiring user_content_key and eventually
            // return 404. Only the original script.google.com/macros/s/.../exec
            // deployment URL should be stored.
            if (this.isTemporaryAppsScriptRedirect(raw)) return '';

            if (parsed.hostname === 'script.google.com' &&
                parsed.pathname.includes('/macros/s/')) {
                ['action', 'sheet', 'module', 'callback', '_cb'].forEach(key => {
                    parsed.searchParams.delete(key);
                });
                parsed.hash = '';
            }

            return parsed.toString();
        } catch (error) {
            return '';
        }
    }

    sanitizeEndpointMap(source) {
        const clean = {};
        if (!source || typeof source !== 'object') return clean;

        Object.values(MODULES).forEach(mod => {
            const normalized = this.normalizeEndpointUrl(source[mod.endpointKey]);
            if (normalized) clean[mod.endpointKey] = normalized;
        });
        return clean;
    }

    loadEndpointsFromStorage() {
        const ep = localStorage.getItem('dashboard_endpoints');
        if (!ep) return;

        try {
            const parsed = JSON.parse(ep);
            const clean = this.sanitizeEndpointMap(parsed);
            this.endpoints = { ...this.endpoints, ...clean };

            // Migrate old saved redirect URLs out of localStorage so they cannot
            // keep causing 404 errors on every page load.
            if (JSON.stringify(parsed) !== JSON.stringify(clean)) {
                localStorage.setItem('dashboard_endpoints', JSON.stringify(clean));
            }
        } catch (error) {
            console.warn('Saved endpoints could not be read:', error);
        }
    }

    saveEndpointsToStorage() {
        this.endpoints = this.sanitizeEndpointMap(this.endpoints);
        localStorage.setItem('dashboard_endpoints', JSON.stringify(this.endpoints));
    }

    resolveConfigEndpointUrl() {
        const stored = localStorage.getItem('dashboard_config_endpoint');
        const candidate = stored || CONFIG.DEFAULT_CONFIG_URL || '';
        const normalized = this.normalizeEndpointUrl(candidate);

        // Do not keep an invalid or temporary googleusercontent redirect as the
        // global configuration endpoint.
        if (stored && !normalized) {
            localStorage.removeItem('dashboard_config_endpoint');
        }

        return normalized;
    }


    isGoogleAppsScriptExecUrl(value) {
        try {
            const parsed = new URL(String(value || ''));
            return parsed.hostname === 'script.google.com' &&
                parsed.pathname.includes('/macros/s/') &&
                /\/exec\/?$/.test(parsed.pathname);
        } catch (error) {
            return false;
        }
    }


    async requestConfigJson(configUrl, params) {
        // Google Apps Script Web Apps redirect GET requests to a
        // googleusercontent URL that frequently fails CORS when called by
        // fetch() from localhost. The Config deployment already supports
        // callback-wrapped JSON, so JSONP is the reliable primary transport.
        if (this.isGoogleAppsScriptExecUrl(configUrl)) {
            return this.jsonpRequest(configUrl, params || {}, {
                timeoutMs: CONFIG.JSONP_TIMEOUT_MS,
                label: 'global endpoint configuration'
            });
        }

        const url = new URL(configUrl);
        Object.entries(params || {}).forEach(([key, value]) => {
            url.searchParams.set(key, value == null ? '' : String(value));
        });
        url.searchParams.set('_cb', `${Date.now()}_${Math.floor(Math.random() * 100000)}`);

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(url.toString(), {
                cache: 'no-store',
                redirect: 'follow',
                method: 'GET',
                signal: controller.signal
            });
            const responseText = await response.text();
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            try {
                return JSON.parse(responseText.replace(/^\uFEFF/, '').trim());
            } catch (error) {
                throw new Error('Global Config service returned non-JSON content');
            }
        } catch (error) {
            const isNetworkFailure = error?.name === 'AbortError' ||
                error instanceof TypeError ||
                /failed to fetch|networkerror|load failed/i.test(error?.message || '');

            if (isNetworkFailure) {
                return this.jsonpRequest(configUrl, params || {}, {
                    timeoutMs: CONFIG.JSONP_TIMEOUT_MS,
                    label: 'global endpoint configuration'
                });
            }
            throw error;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    applyGlobalEndpointMap(source) {
        if (!source || typeof source !== 'object') return;

        // The Config service always returns every supported key. Apply empty
        // values too, so a URL cleared in the shared sheet cannot survive as a
        // stale browser-only endpoint.
        Object.values(MODULES).forEach(mod => {
            const raw = Object.prototype.hasOwnProperty.call(source, mod.endpointKey)
                ? source[mod.endpointKey]
                : '';
            const normalized = this.normalizeEndpointUrl(raw);

            if (normalized) this.endpoints[mod.endpointKey] = normalized;
            else delete this.endpoints[mod.endpointKey];
        });

        this.saveEndpointsToStorage();
    }

    async loadEndpointsGlobal() {
        const configUrl = this.resolveConfigEndpointUrl();
        if (!configUrl) return false;

        try {
            const data = await this.requestConfigJson(configUrl, {
                action: 'getEndpoints'
            });

            if (!data.success || !data.endpoints) {
                throw new Error(data.message || 'Global endpoint service returned an unsuccessful response');
            }

            this.applyGlobalEndpointMap(data.endpoints);
            console.log('Global endpoints loaded:', this.endpoints);
            return true;
        } catch (err) {
            console.warn('Global load failed:', err);
            return false;
        }
    }

    async saveEndpointsGlobal() {
        const configUrl = this.resolveConfigEndpointUrl();
        if (!configUrl) {
            return { success: false, skipped: true, message: 'No global Config endpoint is available.' };
        }

        const parameterMap = {
            'alumni-info': 'ep-alumni',
            'nsrp-registration': 'ep-nsrp',
            'graduate-employability': 'ep-graduate-employability',
            'jops-evaluation': 'ep-jops',
            'legs-participation': 'ep-legs-part',
            'legs-evaluation': 'ep-legs-eval'
        };

        try {
            const requestParameters = { action: 'saveEndpoints' };

            // Send every module, including empty values. The Apps Script can
            // therefore distinguish "clear this URL" from "parameter omitted".
            Object.values(MODULES).forEach(mod => {
                const parameter = parameterMap[mod.endpointKey];
                if (!parameter) return;
                requestParameters[parameter] = this.endpoints[mod.endpointKey] || '';
            });

            const result = await this.requestConfigJson(configUrl, requestParameters);

            if (!result.success) {
                throw new Error(result.message || 'Global save was rejected');
            }

            // Use the server's read-back result as verification of what was
            // actually written to the Config sheet.
            if (result.endpoints) this.applyGlobalEndpointMap(result.endpoints);
            console.log('Global endpoints saved successfully:', result.endpoints || this.endpoints);
            return { success: true, endpoints: result.endpoints || { ...this.endpoints } };
        } catch (err) {
            console.warn('Global save failed:', err);
            return { success: false, skipped: false, message: err.message || String(err) };
        }
    }

    normalizeEncodingStatus(value) {
        const normalized = String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ');

        if (normalized === 'encoded') return 'Encoded';
        if (normalized === 'not encoded') return 'Not Encoded';
        return '';
    }

    normalizeEncodingName(value) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    applyGlobalEncodingStatuses(source) {
        const nextStatuses = {};

        Object.keys(MODULES).forEach(page => {
            const pageMap = new Map();
            const entries = source && Array.isArray(source[page]) ? source[page] : [];

            entries.forEach(entry => {
                if (!entry || typeof entry !== 'object') return;

                const status = this.normalizeEncodingStatus(entry.status);
                if (!status) return;

                const recordKey = String(entry.recordKey || '').trim();
                const nameKey = this.normalizeEncodingName(entry.name);

                if (recordKey) {
                    pageMap.set(`id:${recordKey}`, status);
                } else if (nameKey) {
                    // Name matching is only a compatibility fallback for older
                    // two-column sheets that do not yet contain Record Key.
                    pageMap.set(`name:${nameKey}`, status);
                }
            });

            nextStatuses[page] = pageMap;
        });

        this.encodingStatuses = nextStatuses;
    }

    async loadEncodingStatusesGlobal(showWarning = false) {
        const configUrl = this.resolveConfigEndpointUrl();
        if (!configUrl) return false;

        try {
            const data = await this.requestConfigJson(configUrl, {
                action: 'getEncodingStatuses'
            });

            if (!data.success || !data.statuses) {
                throw new Error(data.message || 'Encoding status service returned an unsuccessful response');
            }

            this.applyGlobalEncodingStatuses(data.statuses);
            return true;
        } catch (error) {
            console.warn('Encoding statuses could not be loaded:', error);
            if (showWarning) {
                this.showToast('Could not load shared Encoded statuses — local status will be used', 'warning');
            }
            return false;
        }
    }

    getEncodingStatus(record, page = this.currentPage) {
        if (!record || !MODULES[page]) return '';

        const pageMap = this.encodingStatuses[page];
        const recordId = this.getEncodedKey(record);
        const nameKey = this.normalizeEncodingName(this.getFullName(record));

        if (pageMap instanceof Map) {
            const byId = recordId ? pageMap.get(`id:${recordId}`) : '';
            if (byId) return byId;

            const byName = nameKey ? pageMap.get(`name:${nameKey}`) : '';
            if (byName) return byName;
        }

        // Local storage remains only as an offline/backward-compatible fallback.
        // Shared sheet data above is authoritative when available.
        const scopedId = this.getScopedEncodedId(page, recordId);
        if (
            (scopedId && this.encodedRecords.has(scopedId)) ||
            (recordId && this.legacyEncodedRecords.has(recordId))
        ) {
            return 'Encoded';
        }

        return '';
    }

    setEncodingStatusInMemory(page, recordId, name, status) {
        if (!MODULES[page]) return;

        if (!(this.encodingStatuses[page] instanceof Map)) {
            this.encodingStatuses[page] = new Map();
        }

        const pageMap = this.encodingStatuses[page];
        const normalizedStatus = this.normalizeEncodingStatus(status);
        const nameKey = this.normalizeEncodingName(name);

        if (recordId) {
            pageMap.set(`id:${recordId}`, normalizedStatus);
        } else if (nameKey) {
            pageMap.set(`name:${nameKey}`, normalizedStatus);
        }

        if (normalizedStatus === 'Encoded') {
            this.saveEncodedRecords(recordId, page);
        } else {
            this.removeEncodedRecord(recordId, page);
        }
    }

    async saveEncodingStatusGlobal(recordId, status, page = this.currentPage) {
        const mod = MODULES[page];
        if (!mod) throw new Error('Unknown module.');

        const normalizedStatus = this.normalizeEncodingStatus(status);
        if (!normalizedStatus) throw new Error('Choose Encoded or Not Encoded.');

        const records = this.data[mod.dataKey] || [];
        const record = records.find(item => this.getEncodedKey(item) === recordId);
        if (!record) throw new Error('The selected record could not be found.');

        const name = this.getFullName(record);
        if (!name) throw new Error('The selected record has no name.');

        const configUrl = this.resolveConfigEndpointUrl();
        if (!configUrl) throw new Error('No shared Config Web App URL is available.');

        const savingKey = `${page}::${recordId}`;
        if (this.encodingStatusSaving.has(savingKey)) return false;
        this.encodingStatusSaving.add(savingKey);

        try {
            const result = await this.requestConfigJson(configUrl, {
                action: 'saveEncodingStatus',
                module: page,
                recordKey: recordId,
                name,
                status: normalizedStatus
            });

            if (!result.success) {
                throw new Error(result.message || 'The encoding status was not saved.');
            }

            this.setEncodingStatusInMemory(page, recordId, name, normalizedStatus);
            return true;
        } finally {
            this.encodingStatusSaving.delete(savingKey);
        }
    }

    async refreshModule(page = this.currentPage, showToast = true) {
        if (!MODULES[page] || this.tableRefreshModules.has(page)) return false;

        this.stopSpeaking();
        this.tableRefreshModules.add(page);
        if (page === this.currentPage) this.renderPage();

        try {
            const [, dataResult] = await Promise.all([
                this.loadEncodingStatusesGlobal(false).catch(() => false),
                this.fetchModuleData(page, showToast)
            ]);
            return dataResult;
        } finally {
            this.tableRefreshModules.delete(page);
            if (page === this.currentPage) this.renderPage();
        }
    }

    loadLastFetch() {
        const lf = localStorage.getItem('dashboard_last_fetch');
        if (lf) this.lastFetch = JSON.parse(lf);
    }

    saveLastFetch() {
        localStorage.setItem('dashboard_last_fetch', JSON.stringify(this.lastFetch));
    }

    loadColumnFilters() {
        const cf = localStorage.getItem('dashboard_column_filters');
        if (cf) this.columnFilters = JSON.parse(cf);
    }

    saveColumnFilters() {
        localStorage.setItem('dashboard_column_filters', JSON.stringify(this.columnFilters));
    }

    hasEndpoint(page) {
        return !!this.endpoints[MODULES[page].endpointKey];
    }

    toggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        const btn = document.getElementById('auto-refresh-btn');
        const indicator = document.getElementById('live-indicator');
        const label = btn ? btn.querySelector('span') : null;
        if (this.autoRefreshEnabled) {
            if (btn) btn.classList.add('active');
            if (label) label.textContent = 'Auto: On';
            if (indicator) indicator.classList.remove('hidden');
            this.startAutoRefresh();
            this.showToast('Auto-refresh enabled (1 min)', 'info');
        } else {
            if (btn) btn.classList.remove('active');
            if (label) label.textContent = 'Auto: Off';
            if (indicator) indicator.classList.add('hidden');
            this.stopAutoRefresh();
            this.showToast('Auto-refresh disabled', 'info');
        }
    }

    startAutoRefresh() {
        if (this.autoRefreshInterval) clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = setInterval(() => {
            this.fetchAllDataSilent();
        }, CONFIG.AUTO_REFRESH_INTERVAL_MS);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    async fetchAllDataSilent() {
        // Never refresh underneath an active edit or save operation. Doing so can
        // replace the row DOM while the user is interacting with it and can make
        // the table appear to reload continuously.
        if (this.settings.editMode || this.isSavingEdits) return;

        const pages = Object.keys(MODULES).filter(p => this.hasEndpoint(p));
        if (pages.length === 0) return;
        this.previousData = JSON.parse(JSON.stringify(this.data));
        await this.loadEncodingStatusesGlobal(false);
        await Promise.all(pages.map(p => this.fetchModuleData(p, false, true)));
        this.detectNewRecords();
        this.updateDashboardCounts();
        this.renderPage();
    }

    detectNewRecords() {
        const mod = MODULES[this.currentPage];
        const currentRecords = this.data[mod.dataKey] || [];
        const previousRecords = this.previousData[mod.dataKey] || [];
        if (currentRecords.length > previousRecords.length) {
            const newCount = currentRecords.length - previousRecords.length;
            this.showToast(`${newCount} new record(s) detected`, 'success');
            const previousIds = new Set(previousRecords.map(r => r.id || JSON.stringify(r)));
            currentRecords.forEach(r => {
                const key = r.id || JSON.stringify(r);
                if (!previousIds.has(key)) {
                    r._isNew = true;
                }
            });
            setTimeout(() => {
                currentRecords.forEach(r => delete r._isNew);
            }, 3000);
        }
    }

    findDuplicates(records) {
        const nameMap = new Map();
        records.forEach(r => {
            const name = this.getDuplicateNameKey(r);
            if (name && name !== ',' && name !== ' , ') {
                if (!nameMap.has(name)) {
                    nameMap.set(name, []);
                }
                nameMap.get(name).push(r);
            }
        });
        const duplicates = new Map();
        nameMap.forEach((records, name) => {
            if (records.length > 1) {
                duplicates.set(name, records);
            }
        });
        return duplicates;
    }

    updateDuplicateNames(records) {
        this.duplicateNames.clear();
        const duplicates = this.findDuplicates(records);
        duplicates.forEach((recs, name) => {
            this.duplicateNames.add(name);
        });
        return duplicates;
    }

    toggleDuplicateHighlight() {
        this.settings.showDuplicates = !this.settings.showDuplicates;
        this.saveSettings();
        // Duplicate control has been moved to the sidebar Settings submenu.
        // We still support the old header icon if present, and additionally
        // toggle the sidebar-side icon's active state for visual feedback.
        const icon = document.getElementById('duplicate-icon');
        const btn = icon && icon.closest ? icon.closest('.glass-btn') : null;
        const sidebarIcon = document.getElementById('duplicate-icon-sidebar');
        const sidebarBtn = sidebarIcon ? sidebarIcon.closest('.settings-item') : null;
        if (this.settings.showDuplicates) {
            if (btn) btn.classList.add('active');
            if (sidebarBtn) sidebarBtn.classList.add('active');
            this.pagination.page = 1;
            const mod = MODULES[this.currentPage];
            const records = this.data[mod.dataKey] || [];
            const duplicates = this.findDuplicates(records);
            if (duplicates.size === 0) {
                this.showToast('No duplicate rows found in this module', 'warning');
            } else {
                let dupRowCount = 0;
                duplicates.forEach(recs => { dupRowCount += recs.length; });
                this.showToast(`Showing ${dupRowCount} duplicated row(s) across ${duplicates.size} name group(s)`, 'info');
            }
        } else {
            if (btn) btn.classList.remove('active');
            if (sidebarBtn) sidebarBtn.classList.remove('active');
            this.pagination.page = 1;
            this.showToast('Duplicate filter cleared — showing all rows', 'info');
        }
        this.renderPage();
    }

    openDuplicateModal() {
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        const duplicates = this.findDuplicates(records);
        if (duplicates.size === 0) {
            this.showToast('No duplicates found', 'info');
            return;
        }
        const body = document.getElementById('duplicate-modal-body');
        let html = '<div class="duplicate-list">';
        duplicates.forEach((recs, name) => {
            html += `
                <div class="duplicate-group">
                    <div class="duplicate-group-header">
                        <i class="fas fa-clone"></i>
                        <span>${this.escapeHtml(name)} (${recs.length} records)</span>
                    </div>
                    <div class="duplicate-group-records">
                        ${recs.map(r => `
                            <div class="duplicate-record-item">
                                ${r.email ? this.escapeHtml(r.email) : 'No email'}
                                ${r.timestamp ? '— ' + this.formatCustomDate(r.timestamp) : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        body.innerHTML = html;
        this.openModal('duplicate-modal');
    }

    playBeep() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
            setTimeout(() => ctx.close(), 300);
        } catch (e) {
            console.warn('Beep failed:', e);
        }
    }

    advancePageForSpeech() {
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        const filtered = this.filterRecords(records, this.currentPage);
        const totalPages = Math.ceil(filtered.length / this.pagination.perPage);
        if (this.pagination.page >= totalPages) {
            this.playBeep();
            this.stopSpeaking();
            this.showToast('Finished reading all names', 'success');
            return;
        }
        this.pagination.page++;
        this.renderPage();
        window.scrollTo(0, 0);
        if (this.speechContext) this.speechContext.pageNum = this.pagination.page;
        const sorted = this.sortRecords(filtered, this.currentPage);
        const paginated = this.getPaginatedRecords(sorted);
        this.speechNames = paginated.records.map(r => this.getFullName(r)).filter(n => n && n !== ',' && n !== ' , ');
        this.currentSpeakIndex = 0;
        if (this.speechNames.length === 0) {
            this.speakTimeout = setTimeout(() => this.advancePageForSpeech(), 500);
            return;
        }
        this.speakTimeout = setTimeout(() => this.speakNext(), 1500);
    }

    getFilipinoVoice() {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;
        const filVoice = voices.find(v => 
            v.lang === 'fil-PH' || v.lang === 'tl-PH' || 
            v.lang === 'fil' || v.lang === 'tl'
        );
        if (filVoice) return filVoice;
        const partialMatch = voices.find(v => 
            /philippines|tagalog|filipino|fil/i.test(v.lang + ' ' + v.name)
        );
        if (partialMatch) return partialMatch;
        return voices.find(v => /filipino|tagalog/i.test(v.name)) || null;
    }

    async startSpeakingNames() {
        if (!window.speechSynthesis) {
            this.showToast('Text-to-speech not supported in this browser', 'error');
            return;
        }
        this.stopSpeaking();
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        const filtered = this.filterRecords(records, this.currentPage);
        const sorted = this.sortRecords(filtered, this.currentPage);
        const paginated = this.getPaginatedRecords(sorted);
        this.speechNames = paginated.records.map(r => this.getFullName(r)).filter(n => n && n !== ',' && n !== ' , ');
        if (this.speechNames.length === 0) {
            this.showToast('No names to read on this page', 'warning');
            return;
        }
        if (window.speechSynthesis.getVoices().length === 0) {
            await new Promise(resolve => {
                const handler = () => { window.speechSynthesis.removeEventListener('voiceschanged', handler); resolve(); };
                window.speechSynthesis.addEventListener('voiceschanged', handler);
                setTimeout(resolve, 1000);
            });
        }
        const chosenVoice = this.getFilipinoVoice();
        if (chosenVoice) {
            this.showToast(`Using Filipino voice: ${chosenVoice.name}`, 'info');
        } else {
            this.showToast('No Filipino voice found — using default accent', 'warning');
        }
        this.isSpeaking = true;
        this.currentSpeakIndex = 0;
        this.speechContext = {
            page: this.currentPage,
            filter: this.currentFilter,
            search: this.currentSearch,
            sortColumn: this.currentSort.column,
            sortDir: this.currentSort.direction,
            pageNum: this.pagination.page,
            columnFiltersHash: JSON.stringify(this.columnFilters[this.currentPage] || {})
        };
        this.renderPage();
        this.speakNext();
    }

    speakNext() {
        if (!this.isSpeaking) return;
        if (this.currentSpeakIndex >= this.speechNames.length) {
            this.advancePageForSpeech();
            return;
        }
        if (this.isSpeechContextChanged()) {
            this.stopSpeaking();
            this.showToast('Reading stopped — view changed', 'info');
            return;
        }
        const name = this.speechNames[this.currentSpeakIndex];
        this.updateSpeakingHighlight();
        const utterance = new SpeechSynthesisUtterance(name);
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.lang = 'fil-PH';
        const filVoice = this.getFilipinoVoice();
        if (filVoice) utterance.voice = filVoice;
        utterance.onend = () => {
            this.currentSpeakIndex++;
            this.speakTimeout = setTimeout(() => this.speakNext(), 3000);
        };
        utterance.onerror = (e) => {
            if (e.error !== 'canceled' && e.error !== 'interrupted') {
                console.warn('Speech error:', e.error);
            }
            this.currentSpeakIndex++;
            this.speakTimeout = setTimeout(() => this.speakNext(), 3000);
        };
        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    }

    updateSpeakingHighlight() {
        document.querySelectorAll('.speaking-row').forEach(el => el.classList.remove('speaking-row'));
        document.querySelectorAll('.speaking-card').forEach(el => el.classList.remove('speaking-card'));
        const row = document.querySelector(`tr[data-speak-index="${this.currentSpeakIndex}"]`);
        if (row) {
            row.classList.add('speaking-row');
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const card = document.querySelector(`.record-card[data-speak-index="${this.currentSpeakIndex}"]`);
        if (card) {
            card.classList.add('speaking-card');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    stopSpeaking() {
        if (!this.isSpeaking && !window.speechSynthesis) return;
        this.isSpeaking = false;
        this.speechNames = [];
        this.currentSpeakIndex = -1;
        this.speechContext = null;
        this.currentUtterance = null;
        if (this.speakTimeout) {
            clearTimeout(this.speakTimeout);
            this.speakTimeout = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        document.querySelectorAll('.speaking-row').forEach(el => el.classList.remove('speaking-row'));
        document.querySelectorAll('.speaking-card').forEach(el => el.classList.remove('speaking-card'));
        this.renderPage();
    }

    isSpeechContextChanged() {
        if (!this.speechContext) return true;
        return this.speechContext.page !== this.currentPage ||
               this.speechContext.filter !== this.currentFilter ||
               this.speechContext.search !== this.currentSearch ||
               this.speechContext.sortColumn !== this.currentSort.column ||
               this.speechContext.sortDir !== this.currentSort.direction ||
               this.speechContext.pageNum !== this.pagination.page ||
               this.speechContext.columnFiltersHash !== JSON.stringify(this.columnFilters[this.currentPage] || {});
    }

    exportDuplicates() {
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        const duplicates = this.findDuplicates(records);
        if (duplicates.size === 0) return;
        const exportData = [];
        duplicates.forEach((recs, name) => {
            recs.forEach(r => {
                exportData.push({
                    'Duplicate Name': name,
                    'Email': r.email || '',
                    'Timestamp': r.timestamp ? this.formatCustomDate(r.timestamp) : '',
                    'Module': mod.title
                });
            });
        });
        const headers = Object.keys(exportData[0]);
        const csv = [headers.join(',')];
        exportData.forEach(row => {
            csv.push(headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','));
        });
        const blob = new Blob(['\uFEFF' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `duplicates-${this.currentPage}-${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.showToast('Duplicates exported successfully');
    }

    async fetchAllDataOnInit() {
        const pages = Object.keys(MODULES).filter(p => this.hasEndpoint(p));

        if (!this.isLoadingVisible()) {
            this.showLoading(true, {
                progress: 8,
                minimumDuration: 700,
                title: 'Preparing your dashboard',
                message: 'Connecting to Google Apps Script…'
            });
        }

        if (pages.length === 0) {
            this.setLoadingProgress(92, 'No data source is configured. Opening the dashboard…');
            this.updateDashboardCounts();
            this.renderPage();
            this.showLoading(false, { message: 'Dashboard ready' });
            return;
        }

        // Restore the original all-modules startup behavior: keep the loading
        // screen visible until every configured module and the shared encoding
        // status have completed. No partially loaded table is displayed.
        this.setLoadingProgress(
            Math.max(this._loadingProgress || 0, 30),
            'Checking shared encoding status…'
        );
        await this.loadEncodingStatusesGlobal(false).catch(error => {
            console.warn('Encoding status could not be loaded during startup:', error);
            return false;
        });

        const progressStart = Math.max(this._loadingProgress || 0, 38);
        const progressSpan = 54;
        let completed = 0;

        await Promise.all(pages.map(async (page) => {
            const result = await this.fetchModuleData(page, false, true);
            completed += 1;
            const moduleTitle = MODULES[page]?.title || 'data source';
            const nextProgress = progressStart + (completed / pages.length) * progressSpan;
            this.setLoadingProgress(
                nextProgress,
                `Loaded ${completed} of ${pages.length}: ${moduleTitle}`
            );
            return result;
        }));

        this.setLoadingProgress(95, 'Building the tables, filters, and record counts…');
        this.updateDashboardCounts();
        this.renderPage();

        // Give the browser one paint frame to finish the table before closing
        // the full-screen loading layer.
        await new Promise(resolve => requestAnimationFrame(() => resolve()));
        this.showLoading(false, { message: 'Dashboard ready' });
    }

    getDataRequestCandidates(page, mod) {
        const aliases = {
            'alumni-info': ['alumniInfo', 'alumni-info', 'alumni', 'New_Alumni'],
            'nsrp-registration': ['nsrp', 'nsrp-registration'],
            'graduate-employability': ['graduateEmployability', 'graduate-employability'],
            'jops-evaluation': ['jopsEvaluation', 'jops-evaluation'],
            'legs-participation': ['legsParticipation', 'legs-participation'],
            'legs-evaluation': ['legsEvaluation', 'legs-evaluation']
        };

        const seen = new Set();
        const candidates = [];
        const addSheet = (sheet) => {
            const value = String(sheet || '').trim();
            if (!value || seen.has(value)) return;
            seen.add(value);
            candidates.push({ action: 'getData', sheet: value });
        };

        addSheet(mod.dataKey);
        (aliases[page] || []).forEach(addSheet);

        // Dedicated/legacy endpoints often need only action=getData.
        candidates.push({ action: 'getData' });
        return candidates;
    }

    async requestEndpointJson(endpoint, params, mod) {
        // Use the same fetch-first transport as the previously working script.
        // Most module Web Apps return plain JSON and do not wrap the response in
        // a callback, so forcing JSONP makes the browser execute JSON as script
        // and produces "JSONP script load failed".
        const requestUrl = new URL(endpoint);
        Object.entries(params || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                requestUrl.searchParams.set(key, value);
            }
        });
        requestUrl.searchParams.set('_cb', `${Date.now()}_${Math.floor(Math.random() * 100000)}`);

        const controller = new AbortController();
        const timeoutMs = this.isGoogleAppsScriptExecUrl(endpoint)
            ? CONFIG.DATA_FETCH_TIMEOUT_MS
            : CONFIG.FETCH_TIMEOUT_MS;
        const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(requestUrl.toString(), {
                cache: 'no-store',
                redirect: 'follow',
                method: 'GET',
                signal: controller.signal
            });
            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} from ${mod.title}`);
            }

            const cleaned = responseText
                .replace(/^\uFEFF/, '')
                .replace(/^\)\]\}'\s*/, '')
                .trim();
            if (!cleaned || /^<!doctype html|^<html/i.test(cleaned)) {
                throw new Error(`Non-JSON response from ${mod.title}. Check that the Web App is deployed for Anyone and uses the /exec URL.`);
            }

            try {
                return JSON.parse(cleaned);
            } catch (error) {
                throw new Error(`Invalid JSON response from ${mod.title}`);
            }
        } catch (error) {
            const isNetworkFailure = error?.name === 'AbortError' ||
                error instanceof TypeError ||
                /failed to fetch|networkerror|load failed/i.test(error?.message || '');

            // Keep JSONP only as a compatibility fallback. It is not the primary
            // transport because several module deployments return plain JSON.
            if (isNetworkFailure) {
                try {
                    return await this.jsonpRequest(endpoint, params || {}, {
                        timeoutMs: CONFIG.JSONP_TIMEOUT_MS,
                        label: mod?.title || 'table data'
                    });
                } catch (jsonpError) {
                    const cause = error?.name === 'AbortError'
                        ? `Fetch timed out after ${Math.round(timeoutMs / 1000)} seconds`
                        : 'Fetch was blocked by the network or browser';
                    throw new Error(`${cause} for ${mod.title}; JSONP is not supported or also failed`);
                }
            }
            throw error;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    normalizeEndpointPayload(result, mod) {
        if (Array.isArray(result)) {
            return { success: true, data: result };
        }
        if (!result || typeof result !== 'object') {
            return { success: false, message: `Empty or unsupported response from ${mod.title}` };
        }
        if (result.success === false) return result;

        const payloads = [
            result.data,
            result.records,
            result[mod.dataKey],
            result.payload && result.payload.data
        ];
        const records = payloads.find(Array.isArray);

        if (records) return { ...result, success: true, data: records };
        if (result.success === true) return { ...result, data: [] };

        return {
            success: false,
            message: result.message || `No record array was found in the response from ${mod.title}`
        };
    }

    async fetchModuleData(page, showToast = true, silent = false) {
        const mod = MODULES[page];
        if (!mod) return false;

        const rawEndpoint = this.endpoints[mod.endpointKey];
        const endpoint = this.normalizeEndpointUrl(rawEndpoint);
        if (!endpoint) {
            delete this.endpoints[mod.endpointKey];
            this.saveEndpointsToStorage();
            if (showToast) {
                this.showToast(`Invalid endpoint for ${mod.title}. Use the original Google Apps Script /exec URL.`, 'error');
            }
            return false;
        }
        this.endpoints[mod.endpointKey] = endpoint;

        const previousRecords = Array.isArray(this.data[mod.dataKey])
            ? this.data[mod.dataKey]
            : [];

        this.loadingModules.add(page);
        if (!silent) this.renderPage();

        try {
            const candidates = this.getDataRequestCandidates(page, mod);
            let selected = null;
            let firstSuccessfulEmpty = null;
            const failures = [];

            for (const params of candidates) {
                try {
                    const rawResult = await this.requestEndpointJson(endpoint, params, mod);
                    const result = this.normalizeEndpointPayload(rawResult, mod);
                    if (!result.success) {
                        failures.push(result.message || 'Unsuccessful response');
                        continue;
                    }

                    const records = Array.isArray(result.data) ? result.data : [];
                    const candidateResult = { result, records, params };

                    if (records.length > 0) {
                        selected = candidateResult;
                        break;
                    }

                    // Keep a valid empty response as a fallback, but continue
                    // trying aliases. A failed alias must never invalidate this
                    // already-successful response.
                    if (!firstSuccessfulEmpty) firstSuccessfulEmpty = candidateResult;
                } catch (candidateError) {
                    failures.push(candidateError.message || String(candidateError));
                }
            }

            selected = selected || firstSuccessfulEmpty;
            if (!selected) {
                throw new Error(failures[0] || `Unable to load ${mod.title}`);
            }

            this.data[mod.dataKey] = selected.records;
            this.lastFetch[page] = Date.now();
            this.saveLastFetch();

            if (showToast) {
                if (selected.records.length === 0) {
                    this.showToast(`${mod.title} ready — no records returned`, 'info');
                } else {
                    this.showToast(`${mod.title} refreshed — ${selected.records.length} records`, 'success');
                }
            }
            return true;
        } catch (err) {
            // Do not erase records that are already on screen when a refresh or
            // temporary Google redirect fails.
            this.data[mod.dataKey] = previousRecords;
            console.error(`Fetch error [${page}]:`, err);
            if (showToast) {
                const suffix = previousRecords.length > 0 ? ' — showing existing records' : '';
                this.showToast(`Failed to load ${mod.title}${suffix}`, 'error');
            }
            return false;
        } finally {
            this.loadingModules.delete(page);
            if (!silent) this.renderPage();
        }
    }

    async refreshData() {
        this.stopSpeaking();
        const pages = Object.keys(MODULES).filter(p => this.hasEndpoint(p));
        if (pages.length === 0) {
            this.showToast('No data sources configured', 'error');
            return;
        }

        this.showLoading(true, {
            progress: 8,
            title: 'Refreshing records',
            message: 'Requesting the latest Google Sheets data…'
        });

        let completed = 0;
        await Promise.all(pages.map(async (page) => {
            const result = await this.fetchModuleData(page, false);
            completed += 1;
            const moduleTitle = MODULES[page]?.title || 'data source';
            this.setLoadingProgress(
                18 + (completed / pages.length) * 74,
                `Refreshed ${completed} of ${pages.length}: ${moduleTitle}`
            );
            return result;
        }));

        this.setLoadingProgress(96, 'Updating record counts and the current table…');
        this.updateDashboardCounts();
        this.renderPage();
        this.showToast('All modules refreshed', 'success');
        this.showLoading(false, { message: 'Refresh complete' });
    }

    updateDashboardCounts() {
        const counts = {
            'alumni-info': this.data.alumniInfo.length,
            'nsrp-registration': this.data.nsrp.length,
            'graduate-employability': this.data.graduateEmployability.length,
            'jops-evaluation': this.data.jopsEvaluation.length,
            'legs-participation': this.data.legsParticipation.length,
            'legs-evaluation': this.data.legsEvaluation.length
        };
        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setText('dash-alumni-count', counts['alumni-info']);
        setText('dash-nsrp-count',   counts['nsrp-registration']);
        setText('dash-ge-count',     counts['graduate-employability']);
        setText('dash-jops-count',   counts['jops-evaluation']);
        setText('dash-legs-count',   counts['legs-participation'] + counts['legs-evaluation']);
        Object.keys(MODULES).forEach(page => {
            const badge = document.getElementById(`nav-badge-${page}`);
            if (badge) badge.textContent = counts[page];
        });

        // Update active state on mini cards for collapsed sidebar
        document.querySelectorAll('.dashboard-mini-card').forEach(card => {
            const navPage = card.dataset.nav;
            card.classList.toggle('active', navPage === this.currentPage);
        });
    }

    navigateTo(page) {
        this.stopSpeaking();
        this.closeColumnMenus();
        this.currentPage = page;
        this.currentFilter = 'all';
        const mod = MODULES[page];
        this.currentSort = mod.defaultSort ? { ...mod.defaultSort } : { column: null, direction: 'asc' };
        this.pagination.page = 1;
        if (this.currentSearch && !Number.isInteger(this.searchPageMemory[page])) {
            this.searchPageMemory[page] = 1;
        }
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        document.getElementById('breadcrumb-current').textContent = mod.title;
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('mobile-overlay').classList.add('hidden');
        this.renderPage();
        this.updateDashboardCounts();
        window.scrollTo(0, 0);
    }

    renderPage() {
        const content = document.getElementById('page-content');
        const html = this.renderModuleTable(this.currentPage);
        content.innerHTML = `<section class="module-table-layout" aria-label="${this.escapeHtml(MODULES[this.currentPage].title)} records">${html}</section>`;
        this.bindTableEmptyStateSticky();
        this.updateLastUpdated();
        this.syncSettingsActions();
    }

    renderModuleDashboard(page) {
        const mod = MODULES[page];
        const records = this.data[mod.dataKey] || [];
        const filtered = this.filterRecords(records, page);
        const duplicates = this.findDuplicates(records);
        const dupCount = duplicates.size;
        let cards = '';
        cards += `
            <div class="dashboard-card primary">
                <div class="dashboard-card-header">
                    <div class="dashboard-card-icon"><i class="fas fa-database"></i></div>
                </div>
                <div class="dashboard-card-value">${records.length}</div>
                <div class="dashboard-card-label">Total Records</div>
                <div class="dashboard-card-footer">
                    <i class="fas fa-filter"></i> ${filtered.length} filtered
                </div>
            </div>
        `;
        if (dupCount > 0) {
            cards += `
                <div class="dashboard-card warning" onclick="app.openDuplicateModal()">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-clone"></i></div>
                        <div class="dashboard-card-trend trend-down"><i class="fas fa-exclamation-triangle"></i></div>
                    </div>
                    <div class="dashboard-card-value">${dupCount}</div>
                    <div class="dashboard-card-label">Duplicate Names</div>
                    <div class="dashboard-card-footer">
                        <i class="fas fa-eye"></i> Click to view details
                    </div>
                </div>
            `;
        }
        if (page === 'alumni-info') {
            const uniqueDegrees = new Set(records.map(r => r.degree).filter(Boolean)).size;
            const uniqueCampuses = new Set(records.map(r => r.campus).filter(Boolean)).size;
            cards += `
                <div class="dashboard-card info">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-graduation-cap"></i></div>
                    </div>
                    <div class="dashboard-card-value">${uniqueDegrees}</div>
                    <div class="dashboard-card-label">Unique Degrees</div>
                </div>
                <div class="dashboard-card success">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-building"></i></div>
                    </div>
                    <div class="dashboard-card-value">${uniqueCampuses}</div>
                    <div class="dashboard-card-label">Campuses</div>
                </div>
            `;
        } else if (page === 'nsrp-registration') {
            const uniqueSchools = new Set(records.map(r => r.school).filter(Boolean)).size;
            const uniqueCourses = new Set(records.map(r => r.course).filter(Boolean)).size;
            cards += `
                <div class="dashboard-card info">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-school"></i></div>
                    </div>
                    <div class="dashboard-card-value">${uniqueSchools}</div>
                    <div class="dashboard-card-label">Schools</div>
                </div>
                <div class="dashboard-card success">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-book"></i></div>
                    </div>
                    <div class="dashboard-card-value">${uniqueCourses}</div>
                    <div class="dashboard-card-label">Courses</div>
                </div>
            `;
        } else if (page === 'graduate-employability') {
            const employed = records.filter(r => (r.position || '').trim() || (r.employer || '').trim()).length;
            const inBiz = records.filter(r => /yes/i.test(String(r.inBusiness || ''))).length;
            const uniqueDegreesGE = new Set(records.map(r => r.degree).filter(Boolean)).size;
            cards += `
                <div class="dashboard-card success">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-briefcase"></i></div>
                    </div>
                    <div class="dashboard-card-value">${employed}</div>
                    <div class="dashboard-card-label">Employed</div>
                </div>
                <div class="dashboard-card info">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-store"></i></div>
                    </div>
                    <div class="dashboard-card-value">${inBiz}</div>
                    <div class="dashboard-card-label">In Business</div>
                </div>
                <div class="dashboard-card info">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-graduation-cap"></i></div>
                    </div>
                    <div class="dashboard-card-value">${uniqueDegreesGE}</div>
                    <div class="dashboard-card-label">Unique Degrees</div>
                </div>
            `;
        } else if (page === 'legs-evaluation') {
            const complete = records.filter(r => r.status === 'Complete').length;
            const incomplete = records.filter(r => r.status === 'Incomplete').length;
            cards += `
                <div class="dashboard-card success">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-check-circle"></i></div>
                    </div>
                    <div class="dashboard-card-value">${complete}</div>
                    <div class="dashboard-card-label">Complete</div>
                </div>
                <div class="dashboard-card danger">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon"><i class="fas fa-times-circle"></i></div>
                    </div>
                    <div class="dashboard-card-value">${incomplete}</div>
                    <div class="dashboard-card-label">Incomplete</div>
                </div>
            `;
        }
        return `<div class="module-dashboard">${cards}</div>`;
    }

    renderModuleTable(page) {
        const mod = MODULES[page];
        const records = this.data[mod.dataKey] || [];
        if (this.tableRefreshModules.has(page)) {
            return this.renderTableRefreshState(mod, page);
        }
        if (this.loadingModules.has(page)) {
            return this.renderSkeletonTable(mod, page);
        }
        if (!this.hasEndpoint(page) && records.length === 0) {
            return this.renderSetupEmptyState(page);
        }
        const filtered = this.filterRecords(records, page);
        this.updateDuplicateNames(filtered);
        const duplicates = this.findDuplicates(filtered);
        const dupCount = duplicates.size;
        const sorted = this.sortRecords(filtered, page);
        const paginated = this.getPaginatedRecords(sorted);
        const renderedColumns = this.getOrderedColumns(page); // Keep every column in the DOM while honoring the user's saved front-end order.
        const startIndex = (this.pagination.page - 1) * this.settings.rowsPerPage;
        let rowsHtml = '';
        paginated.records.forEach((r, index) => {
            const isDuplicate = this.settings.showDuplicates && this.duplicateNames.has(this.getDuplicateNameKey(r));
            const isNew = r._isNew;
            const isMatched = this.isScheduleMatch(r, page);
            const isSpeaking = this.isSpeaking && this.currentSpeakIndex === index;
            const recId = this.getEncodedKey(r);
            const isSelected = this.settings.editMode && this.selectedEditRow === recId;
            const pendingSummary = this.getPendingRowSummary(recId);
            const hasPendingChanges = pendingSummary.changedFields > 0;
            const rowClass = [];
            if (isDuplicate) rowClass.push('duplicate-row');
            if (isNew) rowClass.push('new-record');
            if (isMatched) rowClass.push('schedule-matched');
            if (isSpeaking) rowClass.push('speaking-row');
            if (this.settings.editMode) rowClass.push('edit-mode-row');
            if (hasPendingChanges) rowClass.push('edit-pending-row');
            if (isSelected) rowClass.push('edit-selected-row');
            // Double-click-to-save has been REMOVED. Editing Mode is now
            // controlled entirely by the unified Edit↔Save button — rows
            // are simply selected/edited on single click, and all pending
            // changes stay in memory until the user presses Save.
            const editAttrs = this.settings.editMode
                ? ` data-row-id="${this.escapeHtml(recId)}" onclick="app.handleEditRowClick(event, '${this.escapeHtml(recId)}')"`
                : '';
            const pendingAttrs = hasPendingChanges
                ? ` data-pending-fields="${pendingSummary.changedFields}" title="${pendingSummary.changedFields} unsaved field change${pendingSummary.changedFields === 1 ? '' : 's'} in this row"`
                : '';
            rowsHtml += `<tr class="${rowClass.join(' ')}" data-speak-index="${index}"${editAttrs}${pendingAttrs}>`;
            renderedColumns.forEach(col => {
                const hiddenClass = this.isColumnVisible(page, col.key) ? '' : ' column-hidden';
                const columnAttr = ` data-column-key="${this.escapeHtml(col.key)}"`;
                if (col.key === '__rowNum') {
                    const sheetRowNum = this.getSheetRowNumber(r, startIndex + index + 1);
                    const pendingBadge = hasPendingChanges
                        ? `<span aria-label="${pendingSummary.changedFields} unsaved changes" title="${pendingSummary.changedFields} unsaved field change${pendingSummary.changedFields === 1 ? '' : 's'}" style="display:inline-flex;align-items:center;gap:3px;margin-left:6px;padding:2px 6px;border-radius:999px;background:#dcfce7;color:#047857;font-size:10px;font-weight:800;white-space:nowrap;"><i class="fas fa-pen" aria-hidden="true"></i>${pendingSummary.changedFields}</span>`
                        : '';
                    rowsHtml += `<td class="row-num-cell${hiddenClass}"${columnAttr} title="Google Sheet row number">${sheetRowNum}${pendingBadge}</td>`;
                } else {
                    const cellEditable = isSelected && this.EDITABLE_KEYS.includes(col.key);
                    const cellClass = `${cellEditable ? 'editable-cell' : ''}${hiddenClass}`.trim();
                    rowsHtml += `<td${cellClass ? ` class="${cellClass}"` : ''}${columnAttr}>${this.renderCell(r, col, page, isMatched, isSelected)}</td>`;
                }
            });
            rowsHtml += `</tr>`;
        });
        let cardsHtml = '';
        paginated.records.forEach((r, index) => {
            const isMatched = this.isScheduleMatch(r, page);
            cardsHtml += this.renderRecordCard(r, page, renderedColumns, isMatched, index);
        });
        const activeFilterChips = this.renderActiveFilterChips(page);
        const duplicateBanner = dupCount > 0 ? this.renderDuplicateBanner(dupCount) : '';
        return duplicateBanner +
            activeFilterChips +
            (rowsHtml ? this.renderTableWrapper(renderedColumns, rowsHtml, page) : this.renderNoResultsTable(renderedColumns, page, records.length)) +
            `<div class="cards-view">${cardsHtml || this.renderNoResultsContent(page, records.length, true)}</div>` +
            this.renderPagination(paginated.total, this.pagination.page, this.pagination.perPage, page);
    }

    renderDuplicateBanner(count) {
        // Duplicate notification is now rendered inline next to pagination-info.
        // Kept as a no-op for backward compatibility.
        return '';
    }

    renderDuplicateInlineBadge(count) {
        if (!count || count <= 0) return '';
        return `
            <span class="duplicate-inline-badge" title="${count} duplicate name(s) detected in this module">
                <span class="duplicate-inline-icon"><i class="fas fa-clone"></i></span>
                <span class="duplicate-inline-text"><span>${count}</span> duplicate name(s) detected in this module</span>
            </span>
        `;
    }

    renderSkeletonTable(mod, page = this.currentPage) {
        const orderedColumns = this.getOrderedColumns(page);
        let rows = '';
        for (let i = 0; i < 5; i++) {
            rows += `<tr>`;
            orderedColumns.forEach(col => {
                rows += `<td data-column-key="${this.escapeHtml(col.key)}"><div class="skeleton skeleton-text"></div></td>`;
            });
            rows += `</tr>`;
        }
        return `<div class="table-section"><div class="table-wrapper"><table class="data-table"><thead><tr>${orderedColumns.map(c => `<th data-column-key="${this.escapeHtml(c.key)}">${c.label}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
    }


    renderTableRefreshState(mod, page) {
        const columns = this.getOrderedColumns(page);
        const loadingRow = `
            <tr class="table-refresh-row" aria-hidden="true">
                <td colspan="${Math.max(1, columns.length)}"><span class="table-refresh-spacer"></span></td>
            </tr>
        `;
        const loadingOverlay = `
            <div class="table-refresh-overlay" role="status" aria-live="polite" aria-label="Refreshing table records">
                <div class="table-refresh-state">
                    <div class="table-refresh-scene" aria-hidden="true">
                        <span class="table-refresh-halo"></span>
                        <span class="table-refresh-spark refresh-spark-one"></span>
                        <span class="table-refresh-spark refresh-spark-two"></span>
                        <span class="table-refresh-spark refresh-spark-three"></span>
                        <div class="table-refresh-folder">
                            <span class="refresh-folder-tab"></span>
                            <span class="refresh-folder-eye refresh-folder-eye-left"></span>
                            <span class="refresh-folder-eye refresh-folder-eye-right"></span>
                            <span class="refresh-folder-smile"></span>
                        </div>
                        <span class="table-refresh-paper refresh-paper-one"><i class="fas fa-user"></i></span>
                        <span class="table-refresh-paper refresh-paper-two"><i class="fas fa-check"></i></span>
                        <span class="table-refresh-paper refresh-paper-three"><i class="fas fa-graduation-cap"></i></span>
                        <span class="table-refresh-orbit"><i class="fas fa-arrows-rotate"></i></span>
                    </div>
                    <h3>Refreshing ${this.escapeHtml(mod.title)}</h3>
                    <p>Gathering the latest responses and arranging the records for you.</p>
                    <div class="table-refresh-dots" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        const records = this.data[mod.dataKey] || [];
        const compatibleTotal = this.filterRecords(records, page).length;
        return this.renderActiveFilterChips(page) +
            this.renderTableWrapper(columns, loadingRow, page, 'table-section-refreshing', loadingOverlay) +
            this.renderPagination(compatibleTotal, this.pagination.page, this.pagination.perPage, page);
    }

    renderSetupEmptyState(page) {
        const mod = MODULES[page];
        return `
            <div class="empty-state empty-state-setup">
                <i class="fas fa-plug"></i>
                <h3>Connect Data Source</h3>
                <p>No endpoint is configured for <strong>${mod.title}</strong>. Paste your Google Apps Script Web App URL in Data Sources to begin.</p>
                <div class="empty-state-action">
                    <button class="btn btn-primary" onclick="app.openSettingsModal()"><i class="fas fa-gear"></i> Open Data Sources</button>
                </div>
            </div>
        `;
    }

    renderEmptyState(message) {
        return `<div class="empty-state"><i class="fas fa-inbox"></i><p>${message}</p></div>`;
    }

    hasActiveTableFilters(page = this.currentPage) {
        const pageFilters = this.columnFilters[page] || {};
        const hasColumnFilters = Object.values(pageFilters).some(values => Array.isArray(values) && values.length > 0);
        return hasColumnFilters || this.currentFilter !== 'all' || !!this.settings.showDuplicates;
    }

    renderNoResultsTable(columns, page, sourceRecordCount = 0) {
        const emptyRow = `
            <tr class="table-empty-row" aria-hidden="true">
                <td colspan="${Math.max(1, columns.length)}"><span class="table-empty-spacer"></span></td>
            </tr>
        `;
        const emptyOverlay = `
            <div class="table-empty-overlay">
                ${this.renderNoResultsContent(page, sourceRecordCount, false)}
            </div>
        `;
        return this.renderTableWrapper(columns, emptyRow, page, 'table-section-empty', emptyOverlay);
    }

    renderNoResultsContent(page, sourceRecordCount = 0, compact = false) {
        const hasSearch = !!this.currentSearch;
        const hasFilters = this.hasActiveTableFilters(page);
        const isFilteredEmpty = sourceRecordCount > 0 && (hasSearch || hasFilters);
        const query = this.escapeHtml(this.currentSearch);

        const title = isFilteredEmpty ? 'No matching records found' : 'No records available yet';
        let description = 'This table does not have any available records yet. New responses will appear here once data becomes available.';
        if (isFilteredEmpty && hasSearch) {
            description = `We couldn’t find anything for <strong>“${query}”</strong>${hasFilters ? ' with the current filters' : ''}. Try another keyword or clear the active filters.`;
        } else if (isFilteredEmpty) {
            description = 'No records match the active filters. Try adjusting or clearing the current filter selections.';
        }

        let actions = '';
        if (hasSearch || hasFilters) {
            actions = `<div class="table-empty-actions">`;
            if (hasSearch) {
                actions += `<button type="button" class="table-empty-btn table-empty-btn-primary" onclick="app.clearSearch()"><i class="fas fa-xmark"></i><span>Clear search</span></button>`;
            }
            if (hasFilters) {
                actions += `<button type="button" class="table-empty-btn table-empty-btn-secondary" onclick="app.resetNoResultsFilters('${this.escapeHtml(page)}')"><i class="fas fa-rotate-left"></i><span>Reset filters</span></button>`;
            }
            actions += `</div>`;
        }

        const tip = isFilteredEmpty
            ? '<span><strong>Tip:</strong> Check the spelling or search using a name, email, course, batch, or address.</span>'
            : '<span><strong>Tip:</strong> Refresh the table after new form responses have been submitted.</span>';

        return `
            <div class="table-empty-state${compact ? ' table-empty-state-compact' : ''}" role="status" aria-live="polite">
                <div class="table-empty-illustration" aria-hidden="true">
                    <span class="table-empty-halo"></span>
                    <span class="table-empty-spark table-empty-spark-one"></span>
                    <span class="table-empty-spark table-empty-spark-two"></span>
                    <span class="table-empty-leaf table-empty-leaf-left"></span>
                    <span class="table-empty-leaf table-empty-leaf-right"></span>
                    <svg viewBox="0 0 180 150" focusable="false">
                        <path class="empty-svg-paper-back" d="M53 30h57a10 10 0 0 1 10 10v70a10 10 0 0 1-10 10H53a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10Z"/>
                        <path class="empty-svg-paper" d="M66 19h58a10 10 0 0 1 10 10v72a10 10 0 0 1-10 10H66a10 10 0 0 1-10-10V29a10 10 0 0 1 10-10Z"/>
                        <path class="empty-svg-clip" d="M80 18v-4a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8v4"/>
                        <circle class="empty-svg-face-eye" cx="84" cy="63" r="3.5"/>
                        <circle class="empty-svg-face-eye" cx="109" cy="63" r="3.5"/>
                        <path class="empty-svg-smile" d="M87 78c6 6 14 6 20 0"/>
                        <path class="empty-svg-line" d="M77 92h29"/>
                        <g class="empty-svg-search">
                            <circle cx="125" cy="91" r="25"/>
                            <path d="m143 109 22 22"/>
                        </g>
                    </svg>
                    <span class="table-empty-bubble">Hmm… nothing here!</span>
                </div>
                <h3>${title}</h3>
                <p>${description}</p>
                ${actions}
                <div class="table-empty-tip"><i class="fas fa-lightbulb"></i>${tip}</div>
            </div>
        `;
    }

    resetNoResultsFilters(page = this.currentPage) {
        this.stopSpeaking();
        if (this.columnFilters[page]) delete this.columnFilters[page];
        this.currentFilter = 'all';
        this.settings.showDuplicates = false;
        this.saveColumnFilters();
        this.saveSettings();
        this.pagination.page = 1;
        this.renderPage();
        this.showToast('Filters reset', 'info');
    }

    renderStatsCards(stats, page, dupCount = 0) {
        let cards = '';
        cards += this.renderStatCard('Total Records', stats.total, 'total');
        if (page === 'legs-evaluation') {
            cards += this.renderStatCard('Complete', stats.complete, 'complete');
            cards += this.renderStatCard('Incomplete', stats.incomplete, 'incomplete');
        }
        if (dupCount > 0) {
            cards += this.renderStatCard('Duplicates', dupCount, 'duplicate');
        }
        return `<div class="cards-grid">${cards}</div>`;
    }

    renderStatCard(label, value, type) {
        return `<div class="summary-card ${type}"><div class="card-label">${label}</div><div class="card-value">${value}</div></div>`;
    }

    renderFilterTabs(page) {
        const tabs = MODULES[page].filters || ['All'];
        let html = `<div class="filter-tabs">`;
        tabs.forEach(tab => {
            const active = this.currentFilter === tab.toLowerCase() ? 'active' : '';
            html += `<button class="filter-tab ${active}" onclick="app.setFilter('${tab.toLowerCase()}')">${tab}</button>`;
        });
        html += `</div>`;
        return html;
    }

    renderTableWrapper(columns, rowsHtml, page, sectionClass = '', overlayHtml = '') {
        let headerHtml = `<thead><tr>`;
        columns.forEach(col => {
            const sortClass = col.sortable ? 'sortable' : '';
            const sortDir = this.currentSort.column === col.key ? this.currentSort.direction : '';
            const sortOnclick = col.sortable ? `onclick="app.sortBy('${col.key}')"` : '';
            let filterIcon = '';
            const hasActiveFilter = this.columnFilters[page] && this.columnFilters[page][col.key] && this.columnFilters[page][col.key].length > 0;
            if (col.filterable) {
                const filterActiveClass = hasActiveFilter ? 'filter-active' : '';
                filterIcon = ` <span class="header-filter-icon ${filterActiveClass}" onclick="event.stopPropagation(); app.openHeaderFilterDropdown(event, '${page}', '${col.key}')" title="Filter ${col.label}"><i class="fas fa-filter"></i></span>`;
            }
                        const hiddenClass = this.isColumnVisible(page, col.key) ? '' : ' column-hidden';
            headerHtml += `<th class="${sortClass} ${sortDir}${hiddenClass}" data-column-key="${this.escapeHtml(col.key)}" ${sortOnclick}>${col.label}${filterIcon}</th>`;
        });
        headerHtml += `</tr></thead>`;
        const extraClass = sectionClass ? ` ${sectionClass}` : '';
        const stickyAttr = overlayHtml ? ' data-empty-sticky="true"' : '';
        return `<div class="table-section${extraClass}"><div class="table-wrapper"${stickyAttr}><table class="data-table">${headerHtml}<tbody>${rowsHtml}</tbody></table>${overlayHtml}</div></div>`;
    }

    renderPagination(total, current, perPage, page = this.currentPage) {
        perPage = perPage || this.settings.rowsPerPage;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (current > 3) pages.push('...');
            const start = Math.max(2, current - 1);
            const end = Math.min(totalPages - 1, current + 1);
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }
            if (current < totalPages - 2) pages.push('...');
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        let html = `<div class="pagination">
            <div class="ui-mascot bottom-mascot" aria-hidden="true" title="Alumni journey buddy">
                <span class="bottom-cap"><i></i></span>
                <span class="bottom-face"><i></i><i></i><b></b></span>
                <span class="bottom-scroll"></span>
            </div>`;
        const dupCount = this.duplicateNames ? this.duplicateNames.size : 0;
        const dupBadge = this.renderDuplicateInlineBadge(dupCount);
        html += `<div class="pagination-info-wrap"><span class="pagination-info">Showing ${Math.min((current - 1) * perPage + 1, total)}–${Math.min(current * perPage, total)} of ${total}</span>${dupBadge}</div>`;
        html += `<div class="pagination-controls">`;
        html += this.renderPaginationTableActions(page);
        html += `<span class="pagination-actions-divider" aria-hidden="true"></span>`;
        html += `<button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="app.changePage(${current - 1})" title="Previous page" aria-label="Previous page"><i class="fas fa-chevron-left"></i></button>`;
        pages.forEach(p => {
            if (p === '...') {
                html += `<span class="page-btn dots" disabled>…</span>`;
            } else {
                html += `<button class="page-btn ${p === current ? 'active' : ''}" onclick="app.changePage(${p})">${p}</button>`;
            }
        });
        html += `<button class="page-btn" ${current === totalPages ? 'disabled' : ''} onclick="app.changePage(${current + 1})"><i class="fas fa-chevron-right"></i></button>`;
        const speakBtnClass = this.isSpeaking ? 'speak-btn speaking' : 'speak-btn';
        const speakIcon = this.isSpeaking ? 'fa-stop' : 'fa-volume-high';
        const speakTitle = this.isSpeaking ? 'Stop reading names' : 'Read names aloud (auto-paging)';
        const speakAction = this.isSpeaking ? 'app.stopSpeaking()' : 'app.startSpeakingNames()';
        html += `<div class="speak-divider"></div><button class="page-btn ${speakBtnClass}" onclick="${speakAction}" title="${speakTitle}"><i class="fas ${speakIcon}"></i></button>`;
        html += `</div></div>`;
        return html;
    }

    renderPaginationTableActions(page) {
        const mod = MODULES[page];
        if (!mod) return '';

        const orderedColumns = this.getOrderedColumns(page);
        const pendingCounts = this.countPendingChangedRows();
        const saveDisabled = pendingCounts.changedRows === 0 ? ' disabled aria-disabled="true"' : '';
        const saveTitle = pendingCounts.changedRows === 0
            ? 'No pending changes yet'
            : `Save ${pendingCounts.changedFields} change${pendingCounts.changedFields === 1 ? '' : 's'} across ${pendingCounts.changedRows} row${pendingCounts.changedRows === 1 ? '' : 's'}`;
        const saveBadge = pendingCounts.changedRows > 0
            ? `<span aria-hidden="true" style="position:absolute;top:-5px;right:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#059669;color:#fff;border:2px solid var(--bg-card);font-size:10px;font-weight:800;line-height:13px;text-align:center;">${pendingCounts.changedRows}</span>`
            : '';
        const editActions = this.settings.editMode
            ? `<button type="button" class="footer-table-action footer-save-action" style="position:relative;${pendingCounts.changedRows === 0 ? 'opacity:.5;cursor:not-allowed;' : ''}" onclick="app.openSaveConfirmModal()" title="${saveTitle}" aria-label="${saveTitle}"${saveDisabled}><i class="fas fa-save"></i>${saveBadge}</button>
               <button type="button" class="footer-table-action active" onclick="app.toggleEditMode()" title="Cancel edit mode and discard pending changes" aria-label="Cancel edit mode and discard pending changes"><i class="fas fa-xmark"></i></button>`
            : `<button type="button" class="footer-table-action" onclick="app.toggleEditMode()" title="Edit records" aria-label="Edit records"><i class="fas fa-pen-to-square"></i></button>`;

        return `<div class="pagination-table-actions" aria-label="Table actions">
            ${editActions}
            <button type="button" class="footer-table-action" onclick="app.refreshModule('${page}')" title="Refresh ${this.escapeHtml(mod.title)}" aria-label="Refresh current table" id="refresh-btn-${page}"><i class="fas fa-rotate"></i></button>

            <div class="column-reorder pagination-column-reorder">
                <button type="button" class="footer-table-action column-reorder-button" id="column-reorder-btn-${page}" onclick="app.toggleColumnReorderMenu(event)" title="Rearrange column order" aria-label="Rearrange column order" aria-expanded="false" aria-controls="column-reorder-menu-${page}"><i class="fas fa-arrow-right-arrow-left"></i></button>
                <div class="column-reorder-menu" id="column-reorder-menu-${page}" onclick="event.stopPropagation()" role="menu" aria-label="Rearrange columns">
                    <div class="column-reorder-header">
                        <span><i class="fas fa-grip-vertical"></i> Column order</span>
                        <small>Drag or use arrows</small>
                    </div>
                    <div class="column-reorder-list" id="column-reorder-list-${page}">
                        ${this.renderColumnReorderItems(page)}
                    </div>
                    <button type="button" class="column-reorder-reset" onclick="app.resetColumnOrder('${page}', event)"><i class="fas fa-rotate-left"></i><span>Restore default order</span></button>
                </div>
            </div>

            <div class="column-toggle pagination-column-toggle">
                <button type="button" class="footer-table-action column-toggle-button" id="column-toggle-btn-${page}" onclick="app.toggleColumnMenu(event)" title="Choose visible columns" aria-label="Choose visible columns" aria-expanded="false" aria-controls="column-menu-${page}"><i class="fas fa-columns"></i></button>
                <div class="column-toggle-menu" id="column-menu-${page}" onclick="event.stopPropagation()" role="menu" aria-label="Visible columns">
                    ${orderedColumns.map(c => `
                        <label class="column-toggle-item" data-column-key="${this.escapeHtml(c.key)}">
                            <input type="checkbox" ${this.isColumnVisible(page, c.key) ? 'checked' : ''} onchange="app.toggleColumn('${page}', '${c.key}', this.checked, event)">
                            ${c.label}
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    renderColumnReorderItems(page) {
        const columns = this.getOrderedColumns(page);
        return columns.map((col, index) => `
            <div class="column-reorder-item" draggable="true" data-column-key="${this.escapeHtml(col.key)}"
                 ondragstart="app.handleColumnDragStart(event, '${page}', '${this.escapeHtml(col.key)}')"
                 ondragover="app.handleColumnDragOver(event, '${page}', '${this.escapeHtml(col.key)}')"
                 ondragleave="app.handleColumnDragLeave(event)"
                 ondrop="app.handleColumnDrop(event, '${page}', '${this.escapeHtml(col.key)}')"
                 ondragend="app.handleColumnDragEnd(event)">
                <span class="column-reorder-handle" title="Drag column"><i class="fas fa-grip-vertical"></i></span>
                <span class="column-reorder-number">${index + 1}</span>
                <span class="column-reorder-label">${this.escapeHtml(col.label)}</span>
                <span class="column-reorder-controls">
                    <button type="button" ${index === 0 ? 'disabled' : ''} onclick="app.moveColumn('${page}', '${this.escapeHtml(col.key)}', -1, event)" title="Move ${this.escapeHtml(col.label)} left"><i class="fas fa-chevron-up"></i></button>
                    <button type="button" ${index === columns.length - 1 ? 'disabled' : ''} onclick="app.moveColumn('${page}', '${this.escapeHtml(col.key)}', 1, event)" title="Move ${this.escapeHtml(col.label)} right"><i class="fas fa-chevron-down"></i></button>
                </span>
            </div>
        `).join('');
    }


    renderYesNoIndicator(value) {
        const normalized = typeof value === 'boolean'
            ? (value ? 'yes' : 'no')
            : String(value ?? '').trim().toLowerCase();

        if (normalized === 'yes') {
            return '<span class="yes-no-cell"><span class="yes-no-indicator yes-value" title="Yes" aria-label="Yes"><i class="fas fa-check" aria-hidden="true"></i><span class="sr-only">Yes</span></span></span>';
        }
        if (normalized === 'no') {
            return '<span class="yes-no-cell"><span class="yes-no-indicator no-value" title="No" aria-label="No"><i class="fas fa-xmark" aria-hidden="true"></i><span class="sr-only">No</span></span></span>';
        }
        return '';
    }

    renderRecordCard(r, page, visibleColumns, isMatched, index) {
        const isDuplicate = this.settings.showDuplicates && this.duplicateNames.has(this.getDuplicateNameKey(r));
        const isSpeaking = this.isSpeaking && this.currentSpeakIndex === index;
        const startIndex = (this.pagination.page - 1) * this.settings.rowsPerPage;
        let cardClass = '';
        if (isDuplicate) cardClass += ' duplicate-card';
        if (isMatched) cardClass += ' schedule-matched';
        if (isSpeaking) cardClass += ' speaking-card';
        let rows = '';
        visibleColumns.forEach(col => {
            if (col.key === '__rowNum') {
                const sheetRowNum = this.getSheetRowNumber(r, startIndex + index + 1);
                const hiddenClass = this.isColumnVisible(page, col.key) ? '' : ' column-hidden';
                rows += `<div class="record-card-row${hiddenClass}" data-column-key="${this.escapeHtml(col.key)}"><span class="record-card-label">Sheet Row #</span><span class="record-card-value"><strong>${sheetRowNum}</strong></span></div>`;
                return;
            }
            let rawValue = col.computed ? this.formatRow(r, col.key, page) : r[col.key];
            if (col.format === 'customDate' && rawValue) {
                rawValue = this.formatCustomDate(rawValue);
            }
            if (col.format === 'birthdateWithAge' && rawValue) {
                rawValue = this.formatBirthdateWithAge(rawValue);
            }
            let miniBadge = '';
            if (page === 'legs-participation' && col.key === 'fullName') {
                if (isMatched) {
                    miniBadge = ' <span class="mini-check" title="Date & time match schedule"><i class="fas fa-check"></i></span>';
                } else {
                    miniBadge = ' <span class="mini-x" title="Date or time does not match schedule"><i class="fas fa-times"></i></span>';
                }
            }

            // NEW: Floating "New" sticker on names in card view (persistent until dismissed)
            let newSticker = '';
            if (col.key === 'fullName' && !this.isEncoded(r, page)) {
                newSticker = this.getNewSticker(r, page);
            }

            const yesNoIndicator = col.key === 'fullName' ? '' : this.renderYesNoIndicator(rawValue);
            const textValue = col.key === 'fullName'
                ? this.renderNameWithBoldSurname(rawValue, false)
                : (yesNoIndicator || this.highlightSearch(rawValue));
            const value = textValue + miniBadge + newSticker;
            const hiddenClass = this.isColumnVisible(page, col.key) ? '' : ' column-hidden';
            rows += `<div class="record-card-row${hiddenClass}" data-column-key="${this.escapeHtml(col.key)}"><span class="record-card-label">${col.label}</span><span class="record-card-value">${value}</span></div>`;
        });
        return `<div class="record-card${cardClass}" data-speak-index="${index}"><div class="record-card-body">${rows}</div></div>`;
    }

    renderCell(r, col, page, isMatched, isSelected) {
        const recId = this.getEncodedKey(r);
        const isEditableField = this.EDITABLE_KEYS.includes(col.key);
        const hasPendingValue = isEditableField && this.hasPendingEditValue(recId, col.key);
        const pendingValue = hasPendingValue
            ? this.getPendingEditValue(recId, col.key, '')
            : undefined;
        const pendingChanged = hasPendingValue && this.isPendingFieldChanged(recId, col.key);

        // Render editable input for the selected row. The value is read from
        // pendingEdits first, so returning to a previously edited row restores
        // exactly what the user typed instead of reverting to the sheet value.
        if (isSelected && isEditableField) {
            const originalValue = col.computed ? this.formatRow(r, col.key, page) : (r[col.key] || '');
            const val = hasPendingValue ? pendingValue : originalValue;
            const safeVal = this.escapeHtml(String(val == null ? '' : val));
            const inputType = col.key === 'email' ? 'email' : 'text';
            const emailAttrs = col.key === 'email'
                ? ' inputmode="email" autocomplete="email" spellcheck="false"'
                : ' autocomplete="off"';
            const dirtyAttrs = pendingChanged
                ? ' data-dirty="true" title="Unsaved change" style="border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.16);"'
                : '';
            return `<input type="${inputType}" class="inline-edit-input" data-field="${col.key}" data-row-id="${this.escapeHtml(recId)}" value="${safeVal}"${emailAttrs}${dirtyAttrs} onclick="event.stopPropagation()" oninput="app.trackEditChange('${this.escapeHtml(recId)}', '${col.key}', this.value, this)">`;
        }

        // A non-selected edited row stays readable with its pending value.
        // This is intentionally display-only; the backend is updated only when
        // the user presses the Save button.
        let rawValue = hasPendingValue
            ? pendingValue
            : (col.computed ? this.formatRow(r, col.key, page) : r[col.key]);

        if (col.format === 'customDate' && rawValue) {
            rawValue = this.formatCustomDate(rawValue);
        }

        if (col.format === 'birthdateWithAge' && rawValue) {
            rawValue = this.formatBirthdateWithAge(rawValue);
        }

        let miniBadge = '';
        if (page === 'legs-participation' && col.key === 'fullName') {
            if (isMatched) {
                miniBadge = ' <span class="mini-check" title="Date & time match schedule"><i class="fas fa-check"></i></span>';
            } else {
                miniBadge = ' <span class="mini-x" title="Date or time does not match schedule"><i class="fas fa-times"></i></span>';
            }
        }

        let dupBadge = '';
        if (col.key === 'fullName' && this.settings.showDuplicates) {
            const name = this.getDuplicateNameKey(r);
            if (this.duplicateNames.has(name)) {
                dupBadge = ' <span class="duplicate-badge"><i class="fas fa-clone"></i> Duplicate</span>';
            }
        }

        // NEW: Floating "New" sticker on names (persistent until dismissed via popup)
        let newSticker = '';
        if (col.key === 'fullName' && !this.isEncoded(r, page)) {
            newSticker = this.getNewSticker(r, page);
        }

        const yesNoIndicator = col.key === 'fullName' ? '' : this.renderYesNoIndicator(rawValue);
        const textValue = col.key === 'fullName'
            ? this.renderNameWithBoldSurname(rawValue, col.uppercase !== false)
            : (yesNoIndicator || this.highlightSearch(rawValue));

        // Apply uppercase for non-email columns, except exact Yes/No values,
        // which are represented by accessible check and X indicators.
        let displayValue = textValue;
        if (!yesNoIndicator && col.key !== 'fullName' && col.uppercase !== false && col.key !== 'email') {
            displayValue = this.highlightSearch(String(rawValue || '').toUpperCase());
        }

        const value = displayValue + miniBadge + dupBadge + newSticker;

        if (page === 'legs-evaluation') {
            if (col.key === 'webinar') return this.renderSelect(rawValue, DROPDOWN_OPTIONS.webinar, 'webinar', r.id, 'app.updateLegsField');
            if (col.key === 'evaluation') return this.renderSelect(rawValue, DROPDOWN_OPTIONS.legsEvaluation, 'evaluation', r.id, 'app.updateLegsField');
            if (col.key === 'date') {
                return `<input type="date" class="table-input" value="${this.escapeHtml(rawValue)}" onchange="app.updateLegsField('${r.id}', 'date', this.value)">`;
            }
            if (col.key === 'status') return this.renderBadge(rawValue);
        }

        let finalValue = value;
        if (col.validateAddress && rawValue && !this.isValidAddressFormat(rawValue)) {
            finalValue = `<span class="invalid-address" title="Invalid address format. Use at least three comma-separated parts. Spaces and dashes are allowed, with one optional trailing comma.">${value}</span>`;
        }

        return pendingChanged
            ? this.renderPendingEditDisplay(finalValue, rawValue)
            : finalValue;
    }

    // ============================================
    // ADDRESS VALIDATION
    // ============================================
    isValidAddressFormat(address) {
        if (!address || typeof address !== 'string') return false;

        let normalized = address.trim();
        if (!normalized || normalized.startsWith(',')) return false;

        // Permit exactly one optional trailing comma. A second trailing comma
        // remains in the value and is rejected as an empty address part.
        if (normalized.endsWith(',')) {
            normalized = normalized.slice(0, -1).trimEnd();
        }
        if (!normalized || normalized.endsWith(',')) return false;

        const parts = normalized.split(',');
        if (parts.length < 3) return false;

        // Each comma-separated part must contain words/numbers only, while
        // allowing normal spaces and Unicode dash characters inside the part.
        // Empty parts, repeated commas and leading/trailing dashes are rejected.
        const partPattern = /^[\p{L}\p{N}]+(?:[ \p{Pd}]+[\p{L}\p{N}]+)*$/u;
        return parts.every(part => {
            const value = part.trim();
            return value.length > 0 && partPattern.test(value);
        });
    }

    // ============================================
    // BIRTHDATE WITH AGE FORMATTING
    // ============================================
    formatBirthdateWithAge(dateInput) {
        if (!dateInput) return '';
        let date;
        if (dateInput instanceof Date) {
            date = dateInput;
        } else if (typeof dateInput === 'string') {
            date = new Date(dateInput);
            if (isNaN(date.getTime())) {
                const parts = dateInput.split(/[/\-]/);
                if (parts.length === 3) {
                    date = new Date(parts[2], parts[0] - 1, parts[1]);
                    if (isNaN(date.getTime())) {
                        date = new Date(parts[2], parts[1] - 1, parts[0]);
                    }
                }
            }
        }
        if (!date || isNaN(date.getTime())) return String(dateInput);
        const monthName = MONTH_NAMES[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        // Calculate age
        const today = new Date();
        let age = today.getFullYear() - year;
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            age--;
        }
        return `${monthName} ${day}, ${year},(${age})`;
    }

    // ============================================
    // MONTH FILTER HELPERS
    // ============================================
    getMonthFromValue(value, colKey) {
        if (!value) return '';
        const str = String(value).trim();
        if (colKey === 'birthdate') {
            const match = str.match(/^([A-Za-z]+)/);
            if (match) return match[1];
            const d = new Date(str);
            if (!isNaN(d.getTime())) return MONTH_NAMES[d.getMonth()];
        }
        if (colKey === 'timestamp') {
            const d = new Date(str);
            if (!isNaN(d.getTime())) return MONTH_NAMES[d.getMonth()];
            const parts = str.split(/[/\-]/);
            if (parts.length >= 2) {
                const monthNum = parseInt(parts[0], 10);
                if (monthNum >= 1 && monthNum <= 12) return MONTH_NAMES[monthNum - 1];
            }
        }
        return '';
    }

    getUniqueMonthValues(records, colKey) {
        const months = new Set();
        records.forEach(r => {
            const val = colKey === 'birthdate' ? r.birthdate : r.timestamp;
            const month = this.getMonthFromValue(val, colKey);
            if (month) months.add(month);
        });
        return [...months].sort((a, b) => MONTH_NAMES.indexOf(a) - MONTH_NAMES.indexOf(b));
    }

    toggleFullscreenTable() {
        const doc = document;
        const app = document.querySelector('.app-container');
        if (!app) return;

        const isNativeFullscreen = !!(
            doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement
        );
        const isCssFullscreen = app.classList.contains('table-fullscreen');

        // Apply the fullscreen layout before requesting native fullscreen. This
        // guarantees that the icon-only sidebar rail is already visible when the
        // browser moves the application into its fullscreen top layer.
        if (!isNativeFullscreen && !isCssFullscreen) {
            this.enterCssFullscreen(true);

            // Request fullscreen for the whole document instead of only the table
            // application node. This keeps the complete dashboard surface — most
            // importantly the icon-only sidebar rail — inside the browser's
            // fullscreen top layer on Chrome, Edge and Firefox.
            const fullscreenTarget = document.documentElement;

            try {
                let request = null;
                if (fullscreenTarget.requestFullscreen) request = fullscreenTarget.requestFullscreen();
                else if (fullscreenTarget.webkitRequestFullscreen) request = fullscreenTarget.webkitRequestFullscreen();
                else if (fullscreenTarget.mozRequestFullScreen) request = fullscreenTarget.mozRequestFullScreen();
                else if (fullscreenTarget.msRequestFullscreen) request = fullscreenTarget.msRequestFullscreen();

                if (request && typeof request.catch === 'function') {
                    request.catch(error => {
                        // Keep the CSS fullscreen fallback active when the browser
                        // denies the native request.
                        console.warn('Native fullscreen denied; using dashboard fullscreen instead:', error);
                    });
                }
            } catch (error) {
                console.warn('Native fullscreen unavailable; using dashboard fullscreen instead:', error);
            }
            return;
        }

        if (isNativeFullscreen) {
            if (doc.exitFullscreen) doc.exitFullscreen();
            else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
            else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
            else if (doc.msExitFullscreen) doc.msExitFullscreen();
            return;
        }

        this.exitCssFullscreen();
    }

    enterCssFullscreen(showToast = true) {
        const app = document.querySelector('.app-container');
        if (!app) return;

        app.classList.add('table-fullscreen', 'fullscreen-icon-rail');
        const sidebar = app.querySelector('.sidebar');
        const mainContent = app.querySelector('.main-content');

        if (sidebar) {
            // Preserve the exact pre-fullscreen inline style so it can be restored
            // without affecting the user's normal expanded/collapsed preference.
            if (this._fullscreenSidebarStyle === undefined) {
                this._fullscreenSidebarStyle = sidebar.getAttribute('style');
            }
            sidebar.classList.add('fullscreen-rail-visible');
            sidebar.setAttribute('aria-hidden', 'false');

            // Critical inline safeguards override old cached CSS rules that may
            // still hide or translate the sidebar during native fullscreen.
            const railWidth = '74px';
            sidebar.style.setProperty('display', 'flex', 'important');
            sidebar.style.setProperty('visibility', 'visible', 'important');
            sidebar.style.setProperty('opacity', '1', 'important');
            sidebar.style.setProperty('transform', 'none', 'important');
            sidebar.style.setProperty('position', 'fixed', 'important');
            sidebar.style.setProperty('left', '0', 'important');
            sidebar.style.setProperty('right', 'auto', 'important');
            sidebar.style.setProperty('top', '0', 'important');
            sidebar.style.setProperty('bottom', '0', 'important');
            sidebar.style.setProperty('width', railWidth, 'important');
            sidebar.style.setProperty('min-width', railWidth, 'important');
            sidebar.style.setProperty('max-width', railWidth, 'important');
            sidebar.style.setProperty('height', '100dvh', 'important');
            sidebar.style.setProperty('z-index', '2147483000', 'important');
        }

        if (mainContent) {
            if (this._fullscreenMainStyle === undefined) {
                this._fullscreenMainStyle = mainContent.getAttribute('style');
            }
            mainContent.style.setProperty('margin-left', '74px', 'important');
            mainContent.style.setProperty('width', 'calc(100vw - 74px)', 'important');
            mainContent.style.setProperty('max-width', 'calc(100vw - 74px)', 'important');
            mainContent.style.setProperty('min-width', '0', 'important');
        }

        const icon = document.getElementById('fullscreen-icon');
        const btn = icon ? icon.closest('button') : null;
        if (icon) icon.className = 'fas fa-compress';
        if (btn) btn.title = 'Exit dashboard fullscreen (Esc)';
        document.documentElement.classList.add('dashboard-fullscreen-active');
        document.body.style.overflow = 'hidden';

        if (showToast) this.showToast('Dashboard fullscreen active', 'info');
        this.syncSettingsActions();
    }

    exitCssFullscreen() {
        const app = document.querySelector('.app-container');
        if (!app) return;

        app.classList.remove('table-fullscreen', 'fullscreen-icon-rail');
        const sidebar = app.querySelector('.sidebar');
        const mainContent = app.querySelector('.main-content');
        if (sidebar) {
            sidebar.classList.remove('fullscreen-rail-visible');
            sidebar.removeAttribute('aria-hidden');
            if (this._fullscreenSidebarStyle == null) sidebar.removeAttribute('style');
            else sidebar.setAttribute('style', this._fullscreenSidebarStyle);
            this._fullscreenSidebarStyle = undefined;
        }
        if (mainContent) {
            if (this._fullscreenMainStyle == null) mainContent.removeAttribute('style');
            else mainContent.setAttribute('style', this._fullscreenMainStyle);
            this._fullscreenMainStyle = undefined;
        }

        const icon = document.getElementById('fullscreen-icon');
        const btn = icon ? icon.closest('button') : null;
        if (icon) icon.className = 'fas fa-expand';
        if (btn) btn.title = 'Fullscreen dashboard (Esc to exit)';
        document.documentElement.classList.remove('dashboard-fullscreen-active');
        document.body.style.overflow = '';
        this.syncSettingsActions();
    }

    handleFullscreenChange() {
        const doc = document;
        const isFullscreen = !!(
            doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement
        );

        if (isFullscreen) this.enterCssFullscreen(false);
        else this.exitCssFullscreen();
    }

    exitFullscreenTable() {
        const doc = document;
        const isNativeFullscreen = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
        if (isNativeFullscreen) {
            if (doc.exitFullscreen) doc.exitFullscreen();
            else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
            else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
            else if (doc.msExitFullscreen) doc.msExitFullscreen();
        }
        this.exitCssFullscreen();
    }

    formatCustomDate(dateInput) {
        if (!dateInput) return '';
        let date;
        if (dateInput instanceof Date) {
            date = dateInput;
        } else if (typeof dateInput === 'string') {
            date = new Date(dateInput);
            if (isNaN(date.getTime())) {
                const parts = dateInput.split(/[/\-]/);
                if (parts.length === 3) {
                    date = new Date(parts[2], parts[0] - 1, parts[1]);
                }
            }
        }
        if (!date || isNaN(date.getTime())) return String(dateInput);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const monthName = MONTH_NAMES[date.getMonth()];
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${month}/${day}/${year}(${monthName})${hours}:${minutes}${ampm}`;
    }

    extractDateKey(dateInput) {
        if (!dateInput) return '';
        if (dateInput instanceof Date) {
            return (dateInput.getMonth() + 1) + '/' + dateInput.getDate() + '/' + dateInput.getFullYear();
        }
        const str = String(dateInput).trim();
        const usMatch = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (usMatch) return parseInt(usMatch[1], 10) + '/' + parseInt(usMatch[2], 10) + '/' + usMatch[3];
        const isoMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) return parseInt(isoMatch[2], 10) + '/' + parseInt(isoMatch[3], 10) + '/' + isoMatch[1];
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
            return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
        }
        return '';
    }

    extractScheduleDateKey(scheduleStr) {
        if (!scheduleStr) return '';
        const str = String(scheduleStr);
        const m = str.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
        if (m) {
            const names = ['january','february','march','april','may','june',
                           'july','august','september','october','november','december'];
            const idx = names.indexOf(m[1].toLowerCase());
            if (idx >= 0) return (idx + 1) + '/' + m[2] + '/' + m[3];
        }
        const usMatch = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (usMatch) return parseInt(usMatch[1], 10) + '/' + parseInt(usMatch[2], 10) + '/' + usMatch[3];
        return '';
    }

    isScheduleMatch(r, page) {
        if (page !== 'legs-participation') return false;
        const dateOk = this.isDateMatch(r.timestamp, r.schedule);
        const timeOk = this.isTimeInRange(r.timestamp, r.schedule);
        return dateOk && timeOk;
    }

    isDateMatch(timestamp, schedule) {
        const ts = this.extractDateKey(timestamp);
        const sc = this.extractScheduleDateKey(schedule);
        return ts && sc && ts === sc;
    }

    isTimeInRange(timestamp, schedule) {
        if (!timestamp || !schedule) return false;
        const schedMatch = String(schedule).match(
            /(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)\s*-\s*(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)/i
        );
        if (!schedMatch) return false;
        const sH   = parseInt(schedMatch[1], 10);
        const sM   = parseInt(schedMatch[2], 10);
        const sAmpm = schedMatch[3].toLowerCase().replace(/\./g, '');
        const eH   = parseInt(schedMatch[4], 10);
        const eM   = parseInt(schedMatch[5], 10);
        const eAmpm = schedMatch[6].toLowerCase().replace(/\./g, '');
        const schedStart = this.toMinutes(sH, sM, sAmpm);
        const schedEnd   = this.toMinutes(eH, eM, eAmpm);
        const tsMinutes = this.extractTimestampMinutes(timestamp);
        if (tsMinutes === null) return false;
        const graceBefore = 15;
        const graceAfter  = 30;
        return tsMinutes >= (schedStart - graceBefore) && tsMinutes <= (schedEnd + graceAfter);
    }

    extractTimestampMinutes(timestamp) {
        if (!timestamp) return null;
        const tsStr = String(timestamp).trim();
        const match12 = tsStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
        if (match12) {
            return this.toMinutes(parseInt(match12[1], 10), parseInt(match12[2], 10), match12[3].toLowerCase());
        }
        let d = null;
        if (timestamp instanceof Date) {
            d = timestamp;
        } else if (typeof timestamp === 'string' && (timestamp.includes('/') || timestamp.includes('-') || timestamp.includes(','))) {
            d = new Date(timestamp);
        }
        if (d && !isNaN(d.getTime())) {
            return d.getHours() * 60 + d.getMinutes();
        }
        const match24Full = tsStr.match(/\b(\d{1,2}):(\d{2}):(\d{2})\b/);
        if (match24Full) {
            return parseInt(match24Full[1], 10) * 60 + parseInt(match24Full[2], 10);
        }
        const match24Short = tsStr.match(/\b(\d{1,2}):(\d{2})\b/);
        if (match24Short) {
            const h = parseInt(match24Short[1], 10);
            if (h >= 0 && h <= 23) return h * 60 + parseInt(match24Short[2], 10);
        }
        return null;
    }

    toMinutes(h, m, ampm) {
        let hour = parseInt(h, 10) % 12;
        if (ampm && ampm.charAt(0) === 'p') hour += 12;
        return hour * 60 + parseInt(m, 10);
    }

    formatRow(r, key, page) {
        if (key === 'fullName') return this.getFullName(r);
        if (key === 'address') return this.getAddress(r);
        if (key === '__rowNum') return this.getSheetRowNumber(r, '');
        return r[key];
    }

    getFullName(r) {
        if (r.fullName && typeof r.fullName === 'string' && r.fullName.trim() !== '' && r.fullName !== ',') {
            return r.fullName;
        }
        const last = (r.lastName || r.surname || '').toUpperCase();
        const first = (r.firstName || '').trim();
        const middle = (r.middleName || '').trim();
        const suffix = (r.suffix || '').trim();
        // Format: LASTNAME, First Name Suffix Middle Name
        const right = [first, suffix, middle].filter(Boolean).join(' ');
        if (last && right) return `${last}, ${right}`;
        return last || right;
    }

    getAddress(r) {
        // Prefer server-composed address if present; otherwise compose from parts.
        if (r.address && typeof r.address === 'string' && r.address.trim()) return r.address;
        const parts = [r.barangay, r.municipality, r.province].filter(Boolean);
        return parts.join(', ');
    }

    getDuplicateNameKey(r) {
        const name = this.getFullName(r);
        if (!name || typeof name !== 'string') return '';
        return name
            .replace(/\s+N\/A\s*$/i, '')
            .replace(/\s+NA\s*$/i, '')
            .replace(/\s+N\.A\.\s*$/i, '')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .trim();
    }

    renderSelect(value, options, field, id, onChange) {
        const extraClass = this.getSelectClass(value);
        let html = `<select class="table-input table-select ${extraClass}" onchange="${onChange}('${id}', '${field}', this.value)">`;
        options.forEach(opt => {
            const selected = opt === value ? 'selected' : '';
            html += `<option value="${this.escapeHtml(opt)}" ${selected}>${opt || '—'}</option>`;
        });
        html += `</select>`;
        return html;
    }

    renderBadge(value) {
        if (!value || value === '—') return `<span class="badge badge-gray">—</span>`;
        const color = this.getStatusColor(value);
        return `<span class="badge badge-${color}">${this.escapeHtml(value)}</span>`;
    }

    getSelectClass(value) {
        const color = this.getStatusColor(value);
        return color ? `select-${color}` : '';
    }

    getStatusColor(status) {
        if (!status) return 'gray';
        const key = String(status).toLowerCase().trim();
        return STATUS_COLORS[key] || 'gray';
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    highlightSearch(text) {
        if (!this.currentSearch || !text) return this.escapeHtml(text);
        const search = this.currentSearch.toLowerCase();
        const str = String(text);
        const regex = new RegExp(`(${this.escapeRegex(search)})`, 'gi');
        const parts = str.split(regex);
        return parts.map((part, i) => {
            if (i % 2 === 1) return `<mark class="search-highlight">${this.escapeHtml(part)}</mark>`;
            return this.escapeHtml(part);
        }).join('');
    }

    renderNameWithBoldSurname(value, uppercase = true) {
        let text = String(value || '').trim();
        if (!text) return '';

        if (uppercase) text = text.toUpperCase();

        const commaIndex = text.indexOf(',');
        if (commaIndex > 0) {
            const surname = text.slice(0, commaIndex).trim();
            const remainder = text.slice(commaIndex);
            return `<strong class="name-surname">${this.highlightSearch(surname)}</strong>${this.highlightSearch(remainder)}`;
        }

        // Fallback for names without a comma: bold the final word. Comma-formatted
        // records remain the preferred and most accurate surname format.
        const match = text.match(/^(.*?)(\S+)$/);
        if (!match) return this.highlightSearch(text);
        const prefix = match[1] || '';
        const surname = match[2] || '';
        return `${this.highlightSearch(prefix)}<strong class="name-surname">${this.highlightSearch(surname)}</strong>`;
    }

    normalizeColumnOrder(page) {
        const mod = MODULES[page];
        if (!mod) return [];

        if (!this.settings.columnOrder || typeof this.settings.columnOrder !== 'object') {
            this.settings.columnOrder = {};
        }

        const defaultKeys = mod.columns.map(col => col.key);
        const saved = Array.isArray(this.settings.columnOrder[page])
            ? this.settings.columnOrder[page]
            : [];
        const valid = [];
        saved.forEach(key => {
            if (defaultKeys.includes(key) && !valid.includes(key)) valid.push(key);
        });
        defaultKeys.forEach(key => {
            if (!valid.includes(key)) valid.push(key);
        });
        this.settings.columnOrder[page] = valid;
        return valid;
    }

    getOrderedColumns(page = this.currentPage) {
        const mod = MODULES[page];
        if (!mod) return [];
        const order = this.normalizeColumnOrder(page);
        const byKey = new Map(mod.columns.map(col => [col.key, col]));
        return order.map(key => byKey.get(key)).filter(Boolean);
    }

    isColumnVisible(page, key) {
        const pageSettings = this.settings.visibleColumns[page];
        if (!pageSettings) return true;
        return pageSettings[key] !== false;
    }

    captureTableViewport(anchorRowId = null) {
        const wrapper = document.querySelector('#page-content .table-wrapper');
        const state = {
            scrollTop: wrapper ? wrapper.scrollTop : 0,
            scrollLeft: wrapper ? wrapper.scrollLeft : 0,
            windowX: window.scrollX || 0,
            windowY: window.scrollY || 0,
            anchorRowId,
            anchorOffsetTop: null
        };

        if (wrapper && anchorRowId) {
            const row = Array.from(wrapper.querySelectorAll('tr[data-row-id]'))
                .find(item => item.dataset.rowId === anchorRowId);
            if (row) {
                state.anchorOffsetTop = row.getBoundingClientRect().top - wrapper.getBoundingClientRect().top;
            }
        }
        return state;
    }

    restoreTableViewport(state) {
        if (!state) return;
        requestAnimationFrame(() => {
            const wrapper = document.querySelector('#page-content .table-wrapper');
            if (wrapper) {
                wrapper.scrollLeft = state.scrollLeft;
                wrapper.scrollTop = state.scrollTop;

                if (state.anchorRowId && state.anchorOffsetTop !== null) {
                    const row = Array.from(wrapper.querySelectorAll('tr[data-row-id]'))
                        .find(item => item.dataset.rowId === state.anchorRowId);
                    if (row) {
                        const nextOffset = row.getBoundingClientRect().top - wrapper.getBoundingClientRect().top;
                        wrapper.scrollTop += nextOffset - state.anchorOffsetTop;
                    }
                }
            }
            window.scrollTo(state.windowX, state.windowY);
        });
    }

    renderPagePreservingTablePosition(anchorRowId = null) {
        const viewport = this.captureTableViewport(anchorRowId);
        this.renderPage();
        this.restoreTableViewport(viewport);
    }

    // ============================================
    // INLINE EDITING STATE HELPERS
    // ============================================
    hasPendingEditValue(recId, field) {
        const rowEdits = (this.pendingEdits || {})[recId];
        return !!rowEdits && Object.prototype.hasOwnProperty.call(rowEdits, field);
    }

    getPendingEditValue(recId, field, fallback = '') {
        return this.hasPendingEditValue(recId, field)
            ? this.pendingEdits[recId][field]
            : fallback;
    }

    isPendingFieldChanged(recId, field) {
        if (!this.hasPendingEditValue(recId, field)) return false;
        const snapshots = this.originalRowSnapshots || {};
        const originalRow = snapshots[recId] || {};
        const oldVal = Object.prototype.hasOwnProperty.call(originalRow, field)
            ? originalRow[field]
            : '';
        const newVal = this.pendingEdits[recId][field];
        return String(oldVal == null ? '' : oldVal) !== String(newVal == null ? '' : newVal);
    }

    getPendingRowSummary(recId) {
        const rowEdits = (this.pendingEdits || {})[recId] || {};
        const changedKeys = Object.keys(rowEdits).filter(field => this.isPendingFieldChanged(recId, field));
        return {
            changedFields: changedKeys.length,
            changedKeys
        };
    }

    renderPendingEditDisplay(renderedValue, rawValue) {
        const visibleValue = renderedValue || `<span style="font-style:italic;color:var(--text-muted);">(cleared)</span>`;
        return `<span style="display:inline-flex;align-items:center;gap:6px;max-width:100%;">
            <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;">${visibleValue}</span>
            <span title="Unsaved edit" aria-label="Unsaved edit" style="display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;padding:2px 6px;border-radius:999px;background:#dcfce7;color:#047857;border:1px solid #86efac;font-size:10px;font-weight:800;line-height:1.2;text-transform:none;letter-spacing:0;"><i class="fas fa-pen" aria-hidden="true"></i>Edited</span>
        </span>`;
    }

    updateEditActionState() {
        const saveBtn = document.querySelector('.footer-save-action');
        if (!saveBtn) return;
        const { changedRows, changedFields } = this.countPendingChangedRows();
        saveBtn.disabled = changedRows === 0;
        saveBtn.setAttribute('aria-disabled', changedRows === 0 ? 'true' : 'false');
        saveBtn.title = changedRows === 0
            ? 'No pending changes yet'
            : `Save ${changedFields} change${changedFields === 1 ? '' : 's'} across ${changedRows} row${changedRows === 1 ? '' : 's'}`;
        saveBtn.style.opacity = changedRows === 0 ? '0.5' : '1';
        saveBtn.style.cursor = changedRows === 0 ? 'not-allowed' : 'pointer';
        saveBtn.innerHTML = changedRows > 0
            ? `<i class="fas fa-save"></i><span aria-hidden="true" style="position:absolute;top:-5px;right:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#059669;color:#fff;border:2px solid var(--bg-card);font-size:10px;font-weight:800;line-height:13px;text-align:center;">${changedRows}</span>`
            : '<i class="fas fa-save"></i>';
        saveBtn.style.position = 'relative';
    }

    // ============================================
    // INLINE EDITING (Feature: Edit Mode + Password Gate)
    // ============================================
    toggleEditMode() {
        if (this.isSavingEdits) return;
        if (this.settings.editMode) {
            // Turning OFF — revert any pending edits back to their originals
            this.revertAllPendingEdits();
            this.settings.editMode = false;
            this.selectedEditRow = null;
            this.pendingEdits = {};
            this.originalRowSnapshots = {};
            this.showToast('Edit mode disabled — pending changes discarded', 'info');
            this.renderPagePreservingTablePosition();
            return;
        }
        // Turning ON — require password
        if (this.editAuthorized) {
            this.settings.editMode = true;
            this.pendingEdits = this.pendingEdits || {};
            this.originalRowSnapshots = this.originalRowSnapshots || {};
            this.showToast('Edit mode enabled — click a row to edit, then click Save Changes', 'success');
            this.renderPagePreservingTablePosition();
            return;
        }
        this.promptEditPassword();
    }

    captureEditAuthSearchState() {
        this._editAuthSearchRestoreTimers.forEach(timer => window.clearTimeout(timer));
        this._editAuthSearchRestoreTimers = [];
        window.clearTimeout(this.searchDebounce);

        const input = document.getElementById('global-search');
        // currentSearch is the authoritative applied filter. Using it instead
        // of a possibly autofilled DOM value prevents a credential manager from
        // becoming the source of truth for the table search.
        const stableValue = String(this.currentSearch || '');
        this._editAuthSearchSnapshot = {
            page: this.currentPage,
            currentSearch: stableValue,
            inputValue: stableValue,
            paginationPage: this.pagination.page
        };
        this._editAuthSearchGuardUntil = Date.now() + 3500;

        if (input && input.value !== stableValue) input.value = stableValue;
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.classList.toggle('visible', !!stableValue);
    }

    isEditAuthSearchGuardActive() {
        return !!document.getElementById('edit-password-modal') ||
            (!!this._editAuthSearchSnapshot && Date.now() < this._editAuthSearchGuardUntil);
    }

    restoreEditAuthSearchState(renderIfChanged = false) {
        const snapshot = this._editAuthSearchSnapshot;
        if (!snapshot) return false;
        window.clearTimeout(this.searchDebounce);

        const samePage = this.currentPage === snapshot.page;
        const filterChanged = samePage && this.currentSearch !== snapshot.currentSearch;
        this.currentSearch = snapshot.currentSearch;
        if (samePage) this.pagination.page = snapshot.paginationPage;

        const input = document.getElementById('global-search');
        if (input && input.value !== snapshot.inputValue) input.value = snapshot.inputValue;
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.classList.toggle('visible', !!snapshot.inputValue);

        if (filterChanged && renderIfChanged) {
            this.renderPagePreservingTablePosition(this.selectedEditRow);
        }
        return filterChanged;
    }

    releaseEditAuthSearchGuard() {
        // Password managers sometimes write their autofill value a few frames
        // after the modal closes, so restore the search more than once.
        this.restoreEditAuthSearchState(true);
        this._editAuthSearchRestoreTimers.forEach(timer => window.clearTimeout(timer));
        this._editAuthSearchRestoreTimers = [0, 80, 240, 650].map(delay =>
            window.setTimeout(() => this.restoreEditAuthSearchState(true), delay)
        );
        this._editAuthSearchRestoreTimers.push(window.setTimeout(() => {
            this.restoreEditAuthSearchState(true);
            this._editAuthSearchSnapshot = null;
            this._editAuthSearchGuardUntil = 0;
            this._editAuthSearchRestoreTimers = [];
        }, 900));
    }

    promptEditPassword() {
        // Freeze the applied table search before a password field enters the DOM.
        // This prevents browser credential autofill from replacing it with the
        // dashboard login name and producing a false "No matching records" view.
        this.captureEditAuthSearchState();

        // Build password modal on the fly
        let existing = document.getElementById('edit-password-modal');
        if (existing) existing.remove();
        const modal = document.createElement('div');
        modal.id = 'edit-password-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="app.closeEditPasswordModal()"></div>
            <div class="modal-content glass-panel modal-small">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Editor Authorization</h3>
                    <button class="modal-close" onclick="app.closeEditPasswordModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p class="modal-desc">Enter the editor password to unlock inline editing for this session.</p>
                    <input type="text" name="username" value="CARES Editor" autocomplete="username" tabindex="-1" aria-hidden="true" style="position:fixed;left:-10000px;top:auto;width:1px;height:1px;opacity:0;pointer-events:none;">
                    <div class="form-group">
                        <label for="edit-password-input"><i class="fas fa-key"></i> Password</label>
                        <input type="password" id="edit-password-input" name="cares-editor-passcode" class="form-input" placeholder="Enter editor password" autocomplete="new-password" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true" readonly>
                    </div>
                    <div id="edit-password-error" style="color:var(--red-text);font-size:0.8rem;margin-top:0.5rem;min-height:1rem;"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="app.closeEditPasswordModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="app.submitEditPassword()"><i class="fas fa-unlock"></i> Unlock</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        const input = document.getElementById('edit-password-input');
        if (input) {
            setTimeout(() => {
                input.readOnly = false;
                input.focus({ preventScroll: true });
                this.restoreEditAuthSearchState(true);
            }, 80);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); this.submitEditPassword(); }
                if (e.key === 'Escape') { e.preventDefault(); this.closeEditPasswordModal(); }
            });
        }
    }

    submitEditPassword() {
        const input = document.getElementById('edit-password-input');
        const err = document.getElementById('edit-password-error');
        if (!input) return;
        if (input.value === 'EdiTon29') {
            this.editAuthorized = true;
            this.settings.editMode = true;
            this.pendingEdits = this.pendingEdits || {};
            this.originalRowSnapshots = this.originalRowSnapshots || {};
            this.closeEditPasswordModal();
            this.showToast('Edit mode unlocked — click a row to edit, then click Save Changes', 'success');
            this.renderPagePreservingTablePosition();
        } else {
            if (err) err.textContent = 'Incorrect password. Please try again.';
            input.value = '';
            input.focus();
        }
    }

    closeEditPasswordModal() {
        const modal = document.getElementById('edit-password-modal');
        if (modal) modal.remove();
        document.body.style.overflow = '';
        this.releaseEditAuthSearchGuard();
    }

    handleEditRowClick(event, recId) {
        if (this.isSavingEdits || !this.settings.editMode) return;
        // Ignore clicks on inputs / links / buttons
        if (event.target.closest('input, select, textarea, button, a, .new-sticker, .encode-popup')) return;
        if (this.selectedEditRow === recId) return; // already selected
        // NOTE: We no longer discard the previously selected row's pending edits —
        // all pending edits across rows are kept in memory and committed together
        // when the user clicks "Save Changes".
        this.selectedEditRow = recId;
        this.pendingEdits = this.pendingEdits || {};
        this.originalRowSnapshots = this.originalRowSnapshots || {};
        if (!this.pendingEdits[recId]) this.pendingEdits[recId] = {};
        // Snapshot the original row values the first time this row is selected,
        // so we can revert on "No" / Cancel.
        if (!this.originalRowSnapshots[recId]) {
            this.originalRowSnapshots[recId] = this.snapshotEditableFields(recId);
        }
        this.renderPagePreservingTablePosition(recId);
    }

    // Kept for backward compatibility — double-click now simply opens the
    // Save Changes confirmation modal instead of saving directly.
    async handleEditRowDblClick(event, recId) {
        if (!this.settings.editMode) return;
        if (event.target.closest('input, select, textarea, button, a')) return;
        event.preventDefault();
        this.openSaveConfirmModal();
    }

    trackEditChange(recId, field, value, sourceInput = null) {
        if (this.isSavingEdits || !this.settings.editMode) return;
        this.pendingEdits = this.pendingEdits || {};
        this.originalRowSnapshots = this.originalRowSnapshots || {};
        if (!this.pendingEdits[recId]) this.pendingEdits[recId] = {};
        // Ensure we have an original snapshot so we can revert on "No".
        if (!this.originalRowSnapshots[recId]) {
            this.originalRowSnapshots[recId] = this.snapshotEditableFields(recId);
        }

        const original = this.originalRowSnapshots[recId] || {};
        const oldVal = String(original[field] == null ? '' : original[field]);
        const newVal = String(value == null ? '' : value);
        const changed = oldVal !== newVal;

        if (changed) {
            this.pendingEdits[recId][field] = value;
        } else {
            delete this.pendingEdits[recId][field];
            if (Object.keys(this.pendingEdits[recId]).length === 0) {
                delete this.pendingEdits[recId];
            }
        }

        if (sourceInput) {
            sourceInput.dataset.dirty = changed ? 'true' : 'false';
            sourceInput.title = changed ? 'Unsaved change' : '';
            sourceInput.style.borderColor = changed ? '#059669' : '';
            sourceInput.style.boxShadow = changed ? '0 0 0 3px rgba(5,150,105,.16)' : '';
        }
        this.updateEditActionState();
    }

    // ============================================
    // Helpers: sheet row number, snapshots & reverts
    // ============================================

    // Returns the ABSOLUTE Google Sheet row number for a record.
    // Backend attaches id="row_<n>" where <n> is the 1-based sheet row
    // (header row included). We parse that here. Falls back to the
    // frontend positional index only when no id is present.
    getSheetRowNumber(r, fallbackPositional) {
        if (!r) return fallbackPositional;
        // Preferred: explicit id from the backend ("row_<n>").
        if (r.id) {
            const m = String(r.id).match(/^row_(\d+)$/);
            if (m) return parseInt(m[1], 10);
        }
        // Backend aliases — any of these means "this is the true sheet row".
        if (typeof r.sheetRow === 'number' && r.sheetRow > 0) return r.sheetRow;
        if (typeof r.rowNumber === 'number' && r.rowNumber > 0) return r.rowNumber;
        // Numeric-looking string aliases (some transports stringify numbers).
        const asNum = (v) => {
            const n = parseInt(v, 10);
            return (!isNaN(n) && n > 0) ? n : null;
        };
        const cand = asNum(r.sheetRow) || asNum(r.rowNumber);
        if (cand) return cand;
        // Last resort — the positional index in the CURRENT sorted/filtered
        // view. This is what was incorrectly showing 242 for row 2, and it
        // only fires when the backend didn't send an id/sheetRow (i.e. the
        // Apps Script deployment is out of date). Re-deploy Code.gs to fix.
        return fallbackPositional;
    }

    // Take a shallow snapshot of just the editable fields for a given record
    // so we can restore them if the user picks "No" in the confirmation modal.
    snapshotEditableFields(recId) {
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        const record = records.find(r => this.getEncodedKey(r) === recId);
        if (!record) return {};
        const snap = {};
        this.EDITABLE_KEYS.forEach(k => {
            snap[k] = record[k];
        });
        return snap;
    }

    // Restore every row that has a snapshot back to its original values.
    // Used by "No" in the confirmation modal AND by Cancel Edit.
    revertAllPendingEdits() {
        const snapshots = this.originalRowSnapshots || {};
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        Object.keys(snapshots).forEach(recId => {
            const record = records.find(r => this.getEncodedKey(r) === recId);
            if (!record) return;
            Object.keys(snapshots[recId]).forEach(k => {
                record[k] = snapshots[recId][k];
            });
        });
    }

    // Count how many rows have unsaved changes vs their originals.
    countPendingChangedRows() {
        const pending = this.pendingEdits || {};
        const snapshots = this.originalRowSnapshots || {};
        let changedRows = 0;
        let changedFields = 0;
        Object.keys(pending).forEach(recId => {
            const edits = pending[recId] || {};
            const original = snapshots[recId] || {};
            let rowHasChange = false;
            Object.keys(edits).forEach(k => {
                const oldVal = String(original[k] == null ? '' : original[k]);
                const newVal = String(edits[k] == null ? '' : edits[k]);
                if (oldVal !== newVal) { rowHasChange = true; changedFields++; }
            });
            if (rowHasChange) changedRows++;
        });
        return { changedRows, changedFields };
    }

    // ============================================
    // Save Changes Confirmation Modal (Yes / No)
    // ============================================
    openSaveConfirmModal() {
        if (this.isSavingEdits || !this.settings.editMode) return;
        const { changedRows, changedFields } = this.countPendingChangedRows();
        if (changedRows === 0) {
            this.showToast('No pending changes to save', 'info');
            return;
        }
        // Remove any stale copy first
        const existing = document.getElementById('save-confirm-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'save-confirm-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="app.closeSaveConfirmModal()"></div>
            <div class="modal-content glass-panel modal-small">
                <div class="modal-header">
                    <h3><i class="fas fa-floppy-disk"></i> Save Changes?</h3>
                    <button class="modal-close" onclick="app.closeSaveConfirmModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p class="modal-desc">You have <strong>${changedFields}</strong> pending change${changedFields === 1 ? '' : 's'} across <strong>${changedRows}</strong> row${changedRows === 1 ? '' : 's'}.<br>Do you want to save these changes to the Google Sheet?</p>
                    <div class="save-confirm-options">
                        <label class="save-confirm-radio">
                            <input type="radio" name="save-confirm-choice" value="yes" checked>
                            <span class="save-confirm-radio-body">
                                <span class="save-confirm-radio-title"><i class="fas fa-check-circle" style="color:var(--green-text);"></i> Yes</span>
                                <span class="save-confirm-radio-desc">Save all changes to Google Sheet</span>
                            </span>
                        </label>
                        <label class="save-confirm-radio">
                            <input type="radio" name="save-confirm-choice" value="no">
                            <span class="save-confirm-radio-body">
                                <span class="save-confirm-radio-title"><i class="fas fa-rotate-left" style="color:var(--red-text);"></i> No</span>
                                <span class="save-confirm-radio-desc">Discard changes and restore original data</span>
                            </span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="app.closeSaveConfirmModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="app.confirmSaveChanges()"><i class="fas fa-check"></i> Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    closeSaveConfirmModal() {
        const modal = document.getElementById('save-confirm-modal');
        if (modal) modal.remove();
        document.body.style.overflow = '';
    }

    async confirmSaveChanges() {
        if (this.isSavingEdits) return;
        const chosen = document.querySelector('input[name="save-confirm-choice"]:checked');
        const choice = chosen ? chosen.value : 'yes';
        this.closeSaveConfirmModal();

        if (choice === 'no') {
            // Restore originals and clear all pending state
            this.revertAllPendingEdits();
            this.pendingEdits = {};
            this.originalRowSnapshots = {};
            this.selectedEditRow = null;
            this.settings.editMode = false;
            this.showToast('Changes discarded — original data restored', 'info');
            this.renderPage();
            return;
        }

        // choice === 'yes' — commit every row that actually changed
        await this.saveAllPendingEdits();
    }

    // Batch-commit every row that has a real diff vs its original snapshot.
    async saveAllPendingEdits() {
        if (this.isSavingEdits) return;

        const pending = this.pendingEdits || {};
        const snapshots = this.originalRowSnapshots || {};
        const recIds = Object.keys(pending);
        if (recIds.length === 0) {
            this.settings.editMode = false;
            this.selectedEditRow = null;
            this.showToast('No pending changes to save', 'info');
            this.renderPage();
            return;
        }

        const pageBeingSaved = this.currentPage;
        const mod = MODULES[pageBeingSaved];
        const url = this.endpoints[mod.endpointKey];
        const records = this.data[mod.dataKey] || [];

        // Build the per-row diff list
        const jobs = [];
        recIds.forEach(recId => {
            const record = records.find(r => this.getEncodedKey(r) === recId);
            if (!record) return;
            const edits = pending[recId] || {};
            const original = snapshots[recId] || {};
            const diff = {};
            Object.keys(edits).forEach(k => {
                const oldVal = String(original[k] == null ? '' : original[k]);
                const newVal = String(edits[k] == null ? '' : edits[k]);
                if (oldVal !== newVal) diff[k] = newVal;
            });
            if (Object.keys(diff).length > 0) {
                                jobs.push({
                    recId,
                    record,
                    diff,
                    lookupEmail: String(original.email == null ? (record.email || '') : original.email),
                    sheetRow: this.getSheetRowNumber(record, null)
                });
            }
        });

        if (jobs.length === 0) {
            this.pendingEdits = {};
            this.originalRowSnapshots = {};
            this.selectedEditRow = null;
            this.settings.editMode = false;
            this.showToast('No effective changes to save', 'info');
            this.renderPage();
            return;
        }

        // Lock the save flow and immediately restore the normal, non-edit table.
        // This removes every row-level edit click handler before the request starts,
        // preventing stale row clicks from repeatedly re-rendering the table.
        this.isSavingEdits = true;

        // Optimistically apply diffs to the in-memory records
        jobs.forEach(({ record, diff }) => Object.assign(record, diff));
        this.settings.editMode = false;
        this.selectedEditRow = null;
        this.renderPage();

        if (!url) {
            this.pendingEdits = {};
            this.originalRowSnapshots = {};
            this.isSavingEdits = false;
            this.showToast('No endpoint configured — changes kept locally only', 'warning');
            return;
        }

        this.showToast(`Saving ${jobs.length} row${jobs.length === 1 ? '' : 's'} to Google Sheet…`, 'info');

        // ------------------------------------------------------------------
        // BATCH SAVE — send ALL dirty rows in a single request.
        //
        // Spec §8 requires us to "batch updates into a single request when
        // saving" to avoid gratuitous fetches / CORS surface area. We do that
        // by encoding the whole set of jobs as one JSON payload under the
        // `updates` query param and hitting the new `updateRows` action on
        // the Apps Script side. The existing single-row `updateRow` action is
        // kept intact for backwards compatibility.
        //
        // We keep the same CORS-safe transport we already trust for saves:
        // JSONP first, plain GET fetch as a fallback. No preflight, no new
        // request patterns, same Web App /exec endpoint.
        // ------------------------------------------------------------------
        const payload = jobs.map(job => ({
            rowId:     job.record.id || '',
            sheetRow:  job.sheetRow || '',
            // Use the original email only as a lookup fallback. The new email,
            // when edited, remains inside fields.email and is written afterward.
            email:     job.lookupEmail || '',
            timestamp: job.record.timestamp || '',
            fields:    job.diff
        }));

        // Two transports, in this order:
        //   1. POST text/plain  — a CORS "simple request" (no preflight),
        //      unlimited body size. This is the ONLY reliable transport
        //      for large batches because Apps Script /exec caps URLs at
        //      ~8 KB and silently returns an HTML error page above that.
        //   2. JSONP fallback   — used only for tiny single-row saves if
        //      the POST somehow fails (network-level, not HTTP-level).
        // ------------------------------------------------------------------
        const updatesJson = JSON.stringify(payload);
        const bodyObj = {
            action:  'updateRows',
            sheet:   mod.dataKey,
            updates: updatesJson
        };

        let result;
        try {
            // Primary: POST text/plain (simple request, no preflight,
            // no URL length cap). Apps Script's doPost will parse this.
            const postRes = await fetch(url + '?_cb=' + Date.now(), {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                // IMPORTANT: text/plain keeps this a CORS "simple request".
                // Using application/json here would trigger a preflight
                // that Apps Script /exec does not answer.
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(bodyObj)
            });
            const text = await postRes.text();
            try {
                result = JSON.parse(text);
            } catch (parseErr) {
                // Server returned HTML (auth wall / deployment problem).
                throw new Error('Server returned non-JSON response. ' +
                    'Re-deploy the Apps Script as a NEW version and make sure ' +
                    '"Who has access" is set to Anyone. Preview: ' +
                    text.substring(0, 120));
            }
        } catch (postErr) {
            console.warn('POST batch save failed, falling back to JSONP:', postErr);
            // Fallback: JSONP — only works for small batches that fit in
            // a URL. For big batches this will fail loudly and the user
            // gets an accurate error message from postErr above.
            try {
                const params = new URLSearchParams();
                params.set('action', 'updateRows');
                params.set('sheet', mod.dataKey);
                params.set('updates', updatesJson);
                result = await this.jsonpRequest(url, params);
            } catch (jsonpErr) {
                console.error('Batch save request failed on both transports:', jsonpErr);
                result = {
                    success: false,
                    message: (postErr && postErr.message) || (jsonpErr && jsonpErr.message) || 'network error'
                };
            }
        }

        // Server-side, updateRows also gracefully falls back to a per-row
        // pass if the deployment hasn't been re-published with the batch
        // handler yet. In that case the response is a graceful degradation
        // with per-row results so we can still report accurate counts here.
        let okCount = 0;
        let failCount = 0;
        const failedRows = [];
        if (result && Array.isArray(result.results)) {
            result.results.forEach((r, i) => {
                if (r && r.success) okCount++;
                else { failCount++; failedRows.push((jobs[i] && jobs[i].record && jobs[i].record.id) || (jobs[i] && jobs[i].recId)); }
            });
        } else if (result && result.success) {
            // Old server responds with { success: true } — assume all ok.
            okCount = jobs.length;
        } else {
            failCount = jobs.length;
            jobs.forEach(j => failedRows.push((j.record && j.record.id) || j.recId));
        }

        // Clear pending state regardless — optimistic UI already reflects reality,
        // and a refetch below will overwrite it with authoritative values.
        this.pendingEdits = {};
        this.originalRowSnapshots = {};

        if (failCount === 0) {
            this.showToast(`All ${okCount} row${okCount === 1 ? '' : 's'} saved to Google Sheet`, 'success');
        } else if (okCount === 0) {
            this.showToast(`Save failed for all ${failCount} row${failCount === 1 ? '' : 's'}${result && result.message ? ' — ' + result.message : ''}`, 'error');
        } else {
            this.showToast(`Saved ${okCount}, failed ${failCount}. Failed rows: ${failedRows.join(', ')}`, 'warning');
        }

        // Refresh exactly once and wait for it to finish. A short controlled
        // delay gives Google Sheets time to expose the saved values, while still
        // avoiding the detached timeout that previously caused stale re-renders.
        try {
            await new Promise(resolve => window.setTimeout(resolve, 600));
            await this.fetchModuleData(pageBeingSaved, false, true);
        } finally {
            this.isSavingEdits = false;
            this.updateDashboardCounts();

            // Only repaint the page that was saved. If the user navigated
            // elsewhere while saving, leave the new page untouched.
            if (this.currentPage === pageBeingSaved) {
                this.renderPage();
            }
        }
    }

    // JSONP fallback — bypasses CORS entirely by loading the Apps Script
    // response as a <script>. Server must wrap output in the callback name
    // (Code.gs `sendResponse` already does this when ?callback=... is present).
    jsonpRequest(url, params, options = {}) {
        return new Promise((resolve, reject) => {
            const timeoutMs = Number(options.timeoutMs) > 0
                ? Number(options.timeoutMs)
                : CONFIG.JSONP_TIMEOUT_MS;
            const graceMs = Number(options.graceMs) > 0
                ? Number(options.graceMs)
                : CONFIG.JSONP_LATE_RESPONSE_GRACE_MS;
            const label = String(options.label || 'request');
            const cbName = '__jsonp_cb_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
            const script = document.createElement('script');
            let settled = false;
            let timer = null;
            let callbackCleanupTimer = null;

            const removeScript = () => {
                if (script.parentNode) script.parentNode.removeChild(script);
            };

            // Apps Script can finish after the client-side timeout. Keep a
            // harmless callback temporarily so a late response cannot throw
            // "<callback> is not defined" in the browser console.
            const keepLateResponseSink = () => {
                window[cbName] = () => {};
                callbackCleanupTimer = window.setTimeout(() => {
                    try { delete window[cbName]; } catch (error) { window[cbName] = undefined; }
                    removeScript();
                }, graceMs);
            };

            const finish = (kind, value) => {
                if (settled) return;
                settled = true;
                if (timer) window.clearTimeout(timer);

                if (kind === 'resolve') {
                    try { delete window[cbName]; } catch (error) { window[cbName] = undefined; }
                    removeScript();
                    resolve(value);
                    return;
                }

                keepLateResponseSink();
                reject(value);
            };

            window[cbName] = (data) => finish('resolve', data);

            timer = window.setTimeout(() => {
                finish('reject', new Error(`JSONP request timed out while loading ${label}`));
            }, timeoutMs);

            try {
                const requestUrl = new URL(url, window.location.href);
                Object.entries(params || {}).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        requestUrl.searchParams.set(key, String(value));
                    }
                });
                requestUrl.searchParams.set('callback', cbName);
                requestUrl.searchParams.set('_cb', `${Date.now()}_${Math.floor(Math.random() * 100000)}`);

                script.async = true;
                script.src = requestUrl.toString();
                script.onerror = () => {
                    finish('reject', new Error(`JSONP script load failed while loading ${label}`));
                };
                document.head.appendChild(script);
            } catch (error) {
                if (callbackCleanupTimer) window.clearTimeout(callbackCleanupTimer);
                finish('reject', error);
            }
        });
    }

    toggleColumn(page, key, visible, event) {
        if (event) event.stopPropagation();
        if (!this.settings.visibleColumns[page]) this.settings.visibleColumns[page] = {};
        this.settings.visibleColumns[page][key] = visible;
        this.saveSettings();

        // Do not call renderPage() here. A full render used to reset the table,
        // close the column chooser, and move the horizontal/vertical scroll.
        // Every column now stays in the DOM and is hidden or shown instantly.
        if (page === this.currentPage) {
            const content = document.getElementById('page-content');
            if (content) {
                content.querySelectorAll(`[data-column-key="${key}"]`).forEach(el => {
                    el.classList.toggle('column-hidden', !visible);
                });
            }
        }
    }

    closeColumnMenus() {
        document.querySelectorAll('.column-toggle-menu, .column-reorder-menu').forEach(menu => menu.classList.remove('open'));
        document.querySelectorAll('.column-toggle-button, .column-reorder-button').forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
        });
        this.draggedColumn = null;
        document.querySelectorAll('.column-reorder-item').forEach(item => {
            item.classList.remove('dragging', 'drag-over-before', 'drag-over-after');
        });
    }

    toggleColumnMenu(event) {
        event.stopPropagation();
        const menu = document.getElementById(`column-menu-${this.currentPage}`);
        const button = document.getElementById(`column-toggle-btn-${this.currentPage}`);
        if (!menu) return;

        const wasOpen = menu.classList.contains('open');
        this.closeColumnMenus();

        if (!wasOpen) {
            menu.classList.add('open');
            if (button) {
                button.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        }
    }

    toggleColumnReorderMenu(event) {
        event.stopPropagation();
        const page = this.currentPage;
        const menu = document.getElementById(`column-reorder-menu-${page}`);
        const button = document.getElementById(`column-reorder-btn-${page}`);
        if (!menu) return;

        const wasOpen = menu.classList.contains('open');
        this.closeColumnMenus();

        if (!wasOpen) {
            this.refreshColumnReorderMenu(page);
            menu.classList.add('open');
            if (button) {
                button.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        }
    }

    refreshColumnReorderMenu(page) {
        const list = document.getElementById(`column-reorder-list-${page}`);
        if (list) list.innerHTML = this.renderColumnReorderItems(page);

        const visibilityMenu = document.getElementById(`column-menu-${page}`);
        if (visibilityMenu) {
            const orderedKeys = this.normalizeColumnOrder(page);
            orderedKeys.forEach(key => {
                const item = visibilityMenu.querySelector(`[data-column-key="${key}"]`);
                if (item) visibilityMenu.appendChild(item);
            });
        }
    }

    moveColumn(page, key, direction, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const order = [...this.normalizeColumnOrder(page)];
        const currentIndex = order.indexOf(key);
        const nextIndex = currentIndex + Number(direction);
        if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) return;

        [order[currentIndex], order[nextIndex]] = [order[nextIndex], order[currentIndex]];
        this.settings.columnOrder[page] = order;
        this.saveSettings();
        this.applyColumnOrderToDom(page);
        this.refreshColumnReorderMenu(page);
    }

    resetColumnOrder(page, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const mod = MODULES[page];
        if (!mod) return;

        this.settings.columnOrder[page] = mod.columns.map(col => col.key);
        this.saveSettings();
        this.applyColumnOrderToDom(page);
        this.refreshColumnReorderMenu(page);
        this.showToast('Default column order restored', 'info');
    }

    handleColumnDragStart(event, page, key) {
        this.draggedColumn = { page, key };
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', key);
        }
        requestAnimationFrame(() => event.currentTarget?.classList.add('dragging'));
    }

    handleColumnDragOver(event, page, targetKey) {
        if (!this.draggedColumn || this.draggedColumn.page !== page || this.draggedColumn.key === targetKey) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

        document.querySelectorAll(`#column-reorder-list-${page} .column-reorder-item`).forEach(item => {
            item.classList.remove('drag-over-before', 'drag-over-after');
        });

        const item = event.currentTarget;
        const rect = item.getBoundingClientRect();
        const placeAfter = event.clientY > rect.top + rect.height / 2;
        item.classList.add(placeAfter ? 'drag-over-after' : 'drag-over-before');
    }

    handleColumnDragLeave(event) {
        event.currentTarget?.classList.remove('drag-over-before', 'drag-over-after');
    }

    handleColumnDrop(event, page, targetKey) {
        event.preventDefault();
        event.stopPropagation();

        const sourceKey = this.draggedColumn?.page === page ? this.draggedColumn.key : '';
        if (!sourceKey || sourceKey === targetKey) {
            this.handleColumnDragEnd(event);
            return;
        }

        const targetItem = event.currentTarget;
        const rect = targetItem.getBoundingClientRect();
        const placeAfter = event.clientY > rect.top + rect.height / 2;
        const order = [...this.normalizeColumnOrder(page)];
        const sourceIndex = order.indexOf(sourceKey);
        if (sourceIndex < 0) return;

        order.splice(sourceIndex, 1);
        let targetIndex = order.indexOf(targetKey);
        if (targetIndex < 0) return;
        if (placeAfter) targetIndex += 1;
        order.splice(targetIndex, 0, sourceKey);

        this.settings.columnOrder[page] = order;
        this.saveSettings();
        this.applyColumnOrderToDom(page);
        this.refreshColumnReorderMenu(page);
        this.handleColumnDragEnd(event);
    }

    handleColumnDragEnd() {
        this.draggedColumn = null;
        document.querySelectorAll('.column-reorder-item').forEach(item => {
            item.classList.remove('dragging', 'drag-over-before', 'drag-over-after');
        });
    }

    applyColumnOrderToDom(page) {
        if (page !== this.currentPage) return;
        const order = this.normalizeColumnOrder(page);
        const content = document.getElementById('page-content');
        if (!content) return;

        content.querySelectorAll('.data-table tr').forEach(row => {
            order.forEach(key => {
                const cell = row.querySelector(`:scope > [data-column-key="${key}"]`);
                if (cell) row.appendChild(cell);
            });
        });

        content.querySelectorAll('.record-card-body').forEach(body => {
            order.forEach(key => {
                const item = body.querySelector(`:scope > [data-column-key="${key}"]`);
                if (item) body.appendChild(item);
            });
        });
    }

    bindTableEmptyStateSticky() {
        if (this._emptyStateResizeObserver) {
            this._emptyStateResizeObserver.disconnect();
            this._emptyStateResizeObserver = null;
        }

        const wrappers = document.querySelectorAll('#page-content .table-wrapper[data-empty-sticky="true"]');
        if (!wrappers.length) return;

        const syncWrapper = wrapper => {
            const overlay = wrapper.querySelector(':scope > .table-empty-overlay, :scope > .table-refresh-overlay');
            if (!overlay) return;
            const header = wrapper.querySelector('.data-table thead');
            const headerHeight = Math.round(header?.getBoundingClientRect().height || 56);
            overlay.style.setProperty('--empty-scroll-left', `${wrapper.scrollLeft}px`);
            overlay.style.setProperty('--empty-scroll-top', `${wrapper.scrollTop}px`);
            overlay.style.setProperty('--empty-visible-width', `${wrapper.clientWidth}px`);
            overlay.style.setProperty('--empty-header-height', `${headerHeight}px`);
            overlay.style.setProperty('--empty-visible-height', `${Math.max(260, wrapper.clientHeight - headerHeight)}px`);
        };

        wrappers.forEach(wrapper => {
            const sync = () => syncWrapper(wrapper);
            wrapper.addEventListener('scroll', sync, { passive: true });
            sync();
        });

        if ('ResizeObserver' in window) {
            this._emptyStateResizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => syncWrapper(entry.target));
            });
            wrappers.forEach(wrapper => this._emptyStateResizeObserver.observe(wrapper));
        }
    }


    renderFreshnessBadge(page) {
        const last = this.lastFetch[page];
        if (!last) return `<span class="freshness-badge never"><i class="fas fa-clock"></i> Never updated</span>`;
        const diff = Date.now() - last;
        const stale = diff > CONFIG.STALE_THRESHOLD_MS;
        const text = this.getFreshnessText(diff);
        return `<span class="freshness-badge ${stale ? 'stale' : 'fresh'}"><i class="fas fa-clock"></i> ${text}</span>`;
    }

    getFreshnessText(diffMs) {
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    }

    renderActiveFilterChips(page) {
        const pageFilters = this.columnFilters[page];
        if (!pageFilters || Object.keys(pageFilters).length === 0) return '';
        const mod = MODULES[page];
        let chipsHtml = '';
        Object.keys(pageFilters).forEach(colKey => {
            const allowedValues = pageFilters[colKey];
            if (!allowedValues || allowedValues.length === 0) return;
            const col = mod.columns.find(c => c.key === colKey);
            if (!col) return;
            let chipLabel = '';
            if (allowedValues.length === 1) {
                chipLabel = `${col.label} : ${allowedValues[0]}`;
            } else {
                chipLabel = `${col.label} : Multiple Values`;
            }
            chipsHtml += `
                <span class="filter-chip" onclick="app.openHeaderFilterDropdown(event, '${page}', '${col.key}')">
                    ${this.escapeHtml(chipLabel)}
                    <i class="fas fa-times chip-remove" onclick="event.stopPropagation(); app.clearColumnFilter('${page}', '${col.key}')"></i>
                </span>
            `;
        });
        if (!chipsHtml) return '';
        return `
            <div class="active-filters-bar">
                <span class="filters-label"><i class="fas fa-filter"></i> Filters</span>
                ${chipsHtml}
                <button class="clear-all-btn" onclick="app.clearAllFilters('${page}')">Clear All</button>
            </div>
        `;
    }

    clearAllFilters(page) {
        this.stopSpeaking();
        if (this.columnFilters[page]) {
            delete this.columnFilters[page];
        }
        this.saveColumnFilters();
        this.pagination.page = 1;
        this.renderPage();
        this.showToast('All filters cleared', 'info');
    }

    getColumnFilterValue(record, col, page) {
        if (!col) return '';

        if (col.filterType === 'newBadge') {
            return this.isEncoded(record, page) ? 'No NEW badge' : 'NEW badge';
        }

        if (col.filterType === 'month') {
            const rawValue = col.computed
                ? this.formatRow(record, col.key, page)
                : record[col.key];
            return this.getMonthFromValue(rawValue, col.key);
        }

        const rawValue = col.computed
            ? this.formatRow(record, col.key, page)
            : record[col.key];
        return String(rawValue || '').trim();
    }

    getSmartFilterOptions(page, col) {
        const mod = MODULES[page];
        const records = this.data[mod.dataKey] || [];
        const activeValues = (this.columnFilters[page] && this.columnFilters[page][col.key]) || [];

        // Faceted filtering: apply search, status/duplicate mode and every other
        // column filter, but temporarily ignore this column's own selection.
        // This keeps dropdown choices relevant without trapping the user.
        const candidateRecords = this.filterRecords(records, page, {
            excludeColumnKey: col.key
        });

        const counts = new Map();
        candidateRecords.forEach(record => {
            const value = this.getColumnFilterValue(record, col, page);
            if (!value) return;
            counts.set(value, (counts.get(value) || 0) + 1);
        });

        let values = [...counts.keys()];
        if (col.filterType === 'month') {
            values.sort((a, b) => {
                const aIndex = MONTH_NAMES.indexOf(a);
                const bIndex = MONTH_NAMES.indexOf(b);
                if (aIndex === -1 && bIndex === -1) return a.localeCompare(b, undefined, { numeric: true });
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });
        } else if (col.filterType === 'newBadge') {
            const badgeOrder = ['NEW badge', 'No NEW badge'];
            values.sort((a, b) => badgeOrder.indexOf(a) - badgeOrder.indexOf(b));
        } else {
            values.sort((a, b) => a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: 'base'
            }));
        }

        // Keep selected values visible even when another filter currently makes
        // their count zero, so the user can always uncheck them.
        activeValues.forEach(value => {
            if (!values.includes(value)) values.push(value);
        });

        return values.map(value => ({
            value,
            count: counts.get(value) || 0,
            active: activeValues.includes(value)
        }));
    }

    openHeaderFilterDropdown(event, page, colKey) {
        event.stopPropagation();
        document.querySelectorAll('.header-filter-dropdown').forEach(d => d.remove());
        const mod = MODULES[page];
        const col = mod.columns.find(c => c.key === colKey);
        if (!col || !col.filterable) return;

        const options = this.getSmartFilterOptions(page, col);
        let optionsHtml = '';

        options.forEach(option => {
            const checked = option.active ? 'checked' : '';
            const zeroClass = option.count === 0 ? ' filter-option-zero' : '';
            optionsHtml += `
                <label class="filter-dropdown-option${zeroClass}">
                    <input type="checkbox"
                           data-filter-value="${encodeURIComponent(option.value)}"
                           ${checked}
                           onchange="app.toggleFilterValueFromOption(this, '${page}', '${colKey}')">
                    <span class="filter-option-text">${this.escapeHtml(option.value)}</span>
                    <span class="filter-option-count" title="${option.count} compatible record(s)">${option.count}</span>
                </label>
            `;
        });

        if (!optionsHtml) {
            optionsHtml = `
                <div class="filter-dropdown-empty">
                    <i class="fas fa-wand-magic-sparkles"></i>
                    <span>No compatible values are available under the current search and filters.</span>
                </div>
            `;
        }

        const activeCount = options.filter(option => option.active).length;
        const dropdownHtml = `
            <div class="header-filter-dropdown smart-filter-dropdown" id="header-filter-dd-${page}-${colKey}">
                <div class="header-filter-dropdown-header">
                    <div class="smart-filter-heading">
                        <span><i class="fas fa-filter"></i> ${this.escapeHtml(col.label)}</span>
                        <small>Choices update from the currently compatible records.</small>
                    </div>
                    <button class="btn-clear" onclick="event.stopPropagation(); app.clearColumnFilter('${page}', '${colKey}')">Clear${activeCount ? ` (${activeCount})` : ''}</button>
                </div>
                <div class="header-filter-dropdown-body">
                    ${optionsHtml}
                </div>
                <div class="header-filter-dropdown-footer">
                    <span class="smart-filter-note"><i class="fas fa-link"></i> Works together with the other filters</span>
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); document.querySelectorAll('.header-filter-dropdown').forEach(d => d.remove())">Close</button>
                </div>
            </div>
        `;

        const target = event.target.closest('.header-filter-icon') || event.target.closest('.filter-chip');
        if (target) {
            const rect = target.getBoundingClientRect();
            const container = document.createElement('div');
            container.innerHTML = dropdownHtml;
            const dropdown = container.firstElementChild;
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 4) + 'px';
            dropdown.style.left = rect.left + 'px';
            dropdown.style.minWidth = '270px';
            dropdown.style.maxWidth = '360px';
            dropdown.style.maxHeight = '390px';
            dropdown.style.zIndex = '2147483646';
            dropdown.classList.toggle('fullscreen-filter-overlay', !!(
                document.fullscreenElement || document.webkitFullscreenElement ||
                document.mozFullScreenElement || document.msFullscreenElement ||
                document.documentElement.classList.contains('dashboard-fullscreen-active')
            ));

            // Keep the dropdown inside the active fullscreen tree. Browsers hide
            // overlays that are appended outside a non-document fullscreen root.
            const fullscreenRoot = document.fullscreenElement ||
                document.webkitFullscreenElement || document.mozFullScreenElement ||
                document.msFullscreenElement;
            const overlayHost = fullscreenRoot &&
                fullscreenRoot !== document.documentElement &&
                fullscreenRoot !== document.body
                    ? fullscreenRoot
                    : document.body;
            overlayHost.appendChild(dropdown);

            const ddRect = dropdown.getBoundingClientRect();
            if (ddRect.right > window.innerWidth) {
                dropdown.style.left = (window.innerWidth - ddRect.width - 10) + 'px';
            }
            if (ddRect.bottom > window.innerHeight) {
                dropdown.style.top = Math.max(10, rect.top - ddRect.height - 4) + 'px';
            }

            const closeHandler = (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeHandler), 0);
        }
    }

    toggleFilterValueFromOption(input, page, colKey) {
        if (!input) return;
        this.toggleFilterValue(page, colKey, decodeURIComponent(input.dataset.filterValue || ''), input.checked);
    }

    toggleFilterValue(page, colKey, value, checked) {
        this.stopSpeaking();
        if (!this.columnFilters[page]) this.columnFilters[page] = {};
        if (!this.columnFilters[page][colKey]) this.columnFilters[page][colKey] = [];
        const arr = this.columnFilters[page][colKey];
        const idx = arr.indexOf(value);
        if (checked && idx === -1) arr.push(value);
        if (!checked && idx > -1) arr.splice(idx, 1);
        if (arr.length === 0) delete this.columnFilters[page][colKey];
        this.saveColumnFilters();
        this.pagination.page = 1;
        this.renderPage();
    }

    clearColumnFilter(page, colKey) {
        this.stopSpeaking();
        if (this.columnFilters[page]) delete this.columnFilters[page][colKey];
        this.saveColumnFilters();
        this.pagination.page = 1;
        this.renderPage();
    }

    filterRecords(records, page, options = {}) {
        const excludeColumnKey = options.excludeColumnKey || null;
        let filtered = [...records];

        // When duplicate toggle is ON, show ONLY duplicate rows.
        if (this.settings.showDuplicates) {
            const duplicates = this.findDuplicates(records);
            const dupKeys = new Set(duplicates.keys());
            filtered = filtered.filter(r => dupKeys.has(this.getDuplicateNameKey(r)));
        }

        if (this.currentFilter !== 'all') {
            if (page === 'legs-participation' && this.currentFilter === 'green checks') {
                filtered = filtered.filter(r => this.isScheduleMatch(r, page));
            } else {
                filtered = filtered.filter(r => (r.status || '').toLowerCase() === this.currentFilter);
            }
        }

        const pageFilters = this.columnFilters[page];
        if (pageFilters) {
            Object.keys(pageFilters).forEach(colKey => {
                if (colKey === excludeColumnKey) return;

                const allowedValues = pageFilters[colKey];
                if (!allowedValues || allowedValues.length === 0) return;

                const col = MODULES[page].columns.find(c => c.key === colKey);
                if (!col) return;

                filtered = filtered.filter(record => {
                    const value = this.getColumnFilterValue(record, col, page);
                    return allowedValues.includes(value);
                });
            });
        }

        if (this.currentSearch) {
            const search = this.currentSearch.toLowerCase();
            const mod = MODULES[page];
            filtered = filtered.filter(r => {
                return mod.columns.some(col => {
                    let val = col.computed ? this.formatRow(r, col.key, page) : r[col.key];
                    if (col.format === 'birthdateWithAge' && val) {
                        val = this.formatBirthdateWithAge(val);
                    }
                    return String(val).toLowerCase().includes(search);
                });
            });
        }

        return filtered;
    }

    sortRecords(records, page) {
        // If sorting by timestamp, sort by date descending (latest first) — ignore alphabetical
        if (this.currentSort.column === 'timestamp') {
            return records.sort((a, b) => {
                const dateA = this.parseDateForSort(a.timestamp);
                const dateB = this.parseDateForSort(b.timestamp);
                // Descending order (latest first) when timestamp sort is active
                return dateB - dateA;
            });
        }

        // Default: sort by fullName ascending first, then by current sort column
        return records.sort((a, b) => {
            const nameA = (a.fullName || this.getFullName(a)).toLowerCase();
            const nameB = (b.fullName || this.getFullName(b)).toLowerCase();
            const nameCompare = nameA.localeCompare(nameB);
            if (nameCompare !== 0) return nameCompare;

            if (this.currentSort.column && this.currentSort.column !== 'fullName') {
                const col = MODULES[page].columns.find(c => c.key === this.currentSort.column);
                if (col) {
                    let valA = col.computed ? this.formatRow(a, col.key, page) : a[col.key];
                    let valB = col.computed ? this.formatRow(b, col.key, page) : b[col.key];
                    valA = String(valA || '').toLowerCase();
                    valB = String(valB || '').toLowerCase();
                    if (valA < valB) return this.currentSort.direction === 'asc' ? -1 : 1;
                    if (valA > valB) return this.currentSort.direction === 'asc' ? 1 : -1;
                }
            }
            return 0;
        });
    }

    getPaginatedRecords(records) {
        const perPage = this.settings.rowsPerPage;
        const total = records.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));

        // Keep the current/restored page valid when records are added, deleted,
        // filtered or refreshed while the user is away from page 1.
        this.pagination.page = Math.min(Math.max(1, Number(this.pagination.page) || 1), totalPages);

        const start = (this.pagination.page - 1) * perPage;
        const end = start + perPage;
        return { records: records.slice(start, end), total, start: total ? start + 1 : 0, end: Math.min(end, total) };
    }

    calculateStats(records, page) {
        const stats = { total: records.length };
        if (page === 'legs-evaluation') {
            stats.complete = records.filter(r => r.status === 'Complete').length;
            stats.incomplete = records.filter(r => r.status === 'Incomplete').length;
        }
        return stats;
    }

    updateLegsField(id, field, value) {
        const record = this.data.legsEvaluation.find(r => r.id === id);
        if (!record) return;
        record[field] = value;
        record.status = this.computeLegsStatus(record);
        this.renderPage();
        this.showToast(`Updated ${this.getFullName(record)}`);
    }

    computeLegsStatus(r) {
        const req = [r.webinar, r.date, r.evaluation];
        const hasAll = req.every(v => v && String(v).trim() !== '' && !['no record', 'missing', 'please verify your record at cares office'].includes(String(v).toLowerCase()));
        return hasAll ? 'Complete' : 'Incomplete';
    }

    exportCurrentModule() {
        const page = this.currentPage;
        const mod = MODULES[page];
        const records = this.data[mod.dataKey] || [];
        let filtered = this.filterRecords(records, page);
        filtered = this.sortRecords(filtered, page);
        const visibleColumns = mod.columns.filter(c => this.isColumnVisible(page, c.key));
        const exportData = filtered.map((r, idx) => {
            const obj = {};
            visibleColumns.forEach(col => {
                if (col.key === '__rowNum') {
                    obj[col.label] = this.getSheetRowNumber(r, idx + 1);
                    return;
                }
                let val = col.computed ? this.formatRow(r, col.key, page) : r[col.key];
                if (col.format === 'customDate' && val) val = this.formatCustomDate(val);
                if (col.format === 'birthdateWithAge' && val) val = this.formatBirthdateWithAge(val);
                obj[col.label] = val;
            });
            return obj;
        });
        if (!exportData.length) {
            this.showToast('No data to export', 'error');
            return;
        }
        const headers = Object.keys(exportData[0]);
        const csv = [headers.join(',')];
        exportData.forEach(row => {
            csv.push(headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','));
        });
        const blob = new Blob(['\uFEFF' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${page}-${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.showToast('CSV exported successfully');
    }

    setFilter(filter) {
        this.stopSpeaking();
        this.currentFilter = filter;
        this.pagination.page = 1;
        this.renderPage();
    }

    sortBy(column) {
        this.stopSpeaking();
        if (this.currentSort.column === column) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.column = column;
            this.currentSort.direction = 'asc';
        }
        this.renderPage();
    }

    changePage(page) {
        this.stopSpeaking();
        this.pagination.page = page;
        this.renderPage();
        window.scrollTo(0, 0);
    }

    handleSearch(value) {
        const searchInput = document.getElementById('global-search');
        const modalOpen = !!document.getElementById('edit-password-modal');
        const userIsActivelySearching = !modalOpen && searchInput && document.activeElement === searchInput;
        if (this.isEditAuthSearchGuardActive() && !userIsActivelySearching) {
            this.restoreEditAuthSearchState(true);
            return;
        }

        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.classList.toggle('visible', !!value);
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
            this.applySearchValue(value);
        }, CONFIG.DEBOUNCE_MS);
    }

    applySearchValue(value) {
        this.stopSpeaking();
        const nextSearch = (value || '').trim();
        const hadSearch = !!this.currentSearch;
        const hasSearch = !!nextSearch;

        if (!hadSearch && hasSearch) {
            this.searchPageMemory[this.currentPage] = this.pagination.page;
        }

        this.currentSearch = nextSearch;
        if (hasSearch) {
            this.pagination.page = 1;
        } else if (hadSearch) {
            this.pagination.page = this.searchPageMemory[this.currentPage] || 1;
            delete this.searchPageMemory[this.currentPage];
        }

        this.renderPage();
    }

    isMobileCardLayout() {
        return !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    }

    toggleMobileSearch(forceOpen) {
        const header = document.querySelector('.top-header');
        const toggle = document.getElementById('mobile-search-toggle');
        const icon = document.getElementById('mobile-search-toggle-icon');
        const input = document.getElementById('global-search');
        const breadcrumb = document.getElementById('breadcrumb');
        if (!header || !toggle || !input) return;

        const wasOpen = header.classList.contains('mobile-search-active');
        const nextOpen = typeof forceOpen === 'boolean'
            ? forceOpen
            : !wasOpen;

        this.mobileSearchOpen = nextOpen;
        header.classList.toggle('mobile-search-active', nextOpen);
        toggle.classList.toggle('is-active', nextOpen);
        toggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', nextOpen ? 'Close search' : 'Open search');
        toggle.title = nextOpen ? 'Close search' : 'Search records';
        if (breadcrumb) breadcrumb.setAttribute('aria-hidden', nextOpen ? 'true' : 'false');
        if (icon) icon.className = nextOpen ? 'fas fa-xmark' : 'fas fa-magnifying-glass';

        if (nextOpen) {
            requestAnimationFrame(() => {
                window.setTimeout(() => {
                    try { input.focus({ preventScroll: true }); }
                    catch (error) { input.focus(); }
                    const caret = input.value.length;
                    if (typeof input.setSelectionRange === 'function') {
                        input.setSelectionRange(caret, caret);
                    }
                }, 180);
            });
        } else {
            input.blur();
            if (wasOpen && this.isMobileCardLayout()) {
                try { toggle.focus({ preventScroll: true }); }
                catch (error) { toggle.focus(); }
            }
        }
    }

    syncResponsiveUI() {
        this.applySidebarCollapse();
        if (!this.isMobileCardLayout()) {
            this.toggleMobileSearch(false);
        }
    }

    triggerSearch() {
        const input = document.getElementById('global-search');
        if (!input) return;
        const value = input.value.trim();
        this.applySearchValue(value);
        const mod = MODULES[this.currentPage];
        const records = this.data[mod.dataKey] || [];
        const filtered = this.filterRecords(records, this.currentPage);
        if (value) {
            this.showToast(`${filtered.length} match(es) for "${value}"`, 'info');
        } else {
            this.showToast(`Showing all ${records.length} records`, 'info');
        }
    }

    clearSearch() {
        const input = document.getElementById('global-search');
        const btn = document.getElementById('search-clear-btn');
        if (input) input.value = '';
        if (btn) btn.classList.remove('visible');
        this.applySearchValue('');
        if (input) {
            try { input.focus({ preventScroll: true }); }
            catch (error) { input.focus(); }
        }
    }

    toggleDarkMode(enabled, skipSave) {
        if (typeof enabled === 'undefined') enabled = !this.settings.darkMode;
        this.settings.darkMode = enabled;
        document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.className = enabled ? 'fas fa-sun' : 'fas fa-moon';
        const sidebarIcon = document.getElementById('theme-icon-sidebar');
        if (sidebarIcon) sidebarIcon.className = enabled ? 'fas fa-sun' : 'fas fa-moon';
        const sidebarBtn = sidebarIcon ? sidebarIcon.closest('.settings-item') : null;
        if (sidebarBtn) {
            sidebarBtn.classList.toggle('active', enabled);
            const label = sidebarBtn.querySelector('span');
            if (label) label.textContent = enabled ? 'Light Mode' : 'Dark Mode';
        }
        if (!skipSave) {
            localStorage.setItem('dashboard_dark_mode', enabled ? '1' : '0');
            this.showToast(enabled ? 'Dark mode enabled' : 'Light mode enabled');
        }
    }

    openSettingsModal() {
        const container = document.getElementById('endpoint-inputs');
        const configEp = localStorage.getItem('dashboard_config_endpoint') || CONFIG.DEFAULT_CONFIG_URL || '';
        let html = `
            <div class="form-group">
                <label><i class="fas fa-globe"></i> Global Config Endpoint (optional)</label>
                <input type="url" class="form-input" id="ep-config" placeholder="https://script.google.com/..." value="${this.escapeHtml(configEp)}">
                <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.35rem;">If set, endpoints are saved globally and shared across devices.</p>
            </div>
            <hr style="border:0;border-top:1px solid var(--border-light);margin:1rem 0;">
        `;
        Object.values(MODULES).forEach(mod => {
            const current = this.endpoints[mod.endpointKey] || '';
            html += `
                <div class="form-group">
                    <label>${mod.title}</label>
                    <input type="url" class="form-input" id="ep-${mod.endpointKey}" placeholder="https://script.google.com/..." value="${this.escapeHtml(current)}">
                </div>
            `;
        });
        container.innerHTML = html;
        this.openModal('settings-modal');
    }

    async saveEndpoints() {
        const configInput = document.getElementById('ep-config');
        if (configInput) {
            const configVal = configInput.value.trim();
            if (configVal) {
                const normalizedConfig = this.normalizeEndpointUrl(configVal);
                if (!normalizedConfig) {
                    this.showToast('Invalid Global Config endpoint. Paste the original Google Apps Script /exec URL.', 'error');
                    configInput.focus();
                    return;
                }
                localStorage.setItem('dashboard_config_endpoint', normalizedConfig);
            } else {
                // Clearing the field restores CONFIG.DEFAULT_CONFIG_URL, when one
                // is defined, instead of retaining a hidden stale custom URL.
                localStorage.removeItem('dashboard_config_endpoint');
            }
        }

        const rejected = [];
        Object.values(MODULES).forEach(mod => {
            const input = document.getElementById(`ep-${mod.endpointKey}`);
            const val = input ? input.value.trim() : '';
            const normalized = this.normalizeEndpointUrl(val);
            if (normalized) {
                this.endpoints[mod.endpointKey] = normalized;
            } else {
                delete this.endpoints[mod.endpointKey];
                if (val) rejected.push(mod.title);
            }
        });

        if (rejected.length > 0) {
            this.showToast(`Invalid endpoint removed: ${rejected.join(', ')}. Use the original /exec URL.`, 'warning');
        }

        // Keep a local fallback first, then persist and verify the same values in
        // the shared Config sheet before fetching module data.
        this.saveEndpointsToStorage();
        const globalResult = await this.saveEndpointsGlobal();
        this.closeModal('settings-modal');

        if (globalResult.success) {
            this.showToast('Data sources saved to the shared Config sheet');
        } else if (globalResult.skipped) {
            this.showToast('Data sources saved in this browser only — no Global Config endpoint is set', 'warning');
        } else {
            this.showToast(`Saved in this browser, but shared Config save failed: ${globalResult.message}`, 'warning');
        }

        await this.fetchAllDataOnInit();
    }

    openModal(id) {
        document.getElementById(id).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
        document.body.style.overflow = '';
    }

    isLoadingVisible() {
        const el = document.getElementById('loading-overlay');
        return Boolean(el && !el.classList.contains('hidden'));
    }

    clearLoadingTimers() {
        (this._loadingTimers || []).forEach(timer => clearTimeout(timer));
        this._loadingTimers = [];
    }

    queueLoadingTimer(callback, delay) {
        this._loadingTimers = this._loadingTimers || [];
        const timer = setTimeout(callback, delay);
        this._loadingTimers.push(timer);
        return timer;
    }

    getLoadingStage(progress) {
        if (progress < 12) return 'seed';
        if (progress < 32) return 'sprout';
        if (progress < 62) return 'sapling';
        if (progress < 88) return 'tree';
        return 'ripe';
    }

    loadingRange(value, start, end) {
        if (end <= start) return value >= end ? 1 : 0;
        return Math.max(0, Math.min(1, (value - start) / (end - start)));
    }

    renderTreeGrowth(progress) {
        const el = document.getElementById('loading-overlay');
        if (!el) return;

        const value = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
        const range = (start, end) => this.loadingRange(value, start, end);
        const scene = document.getElementById('growth-scene');
        if (!scene) return;

        const groundShadow = scene.querySelector('.tree-ground-shadow');
        const soil = scene.querySelector('.tree-soil');
        const seedStage = scene.querySelector('.seed-stage');
        const sproutStage = scene.querySelector('.sprout-stage');
        const sproutStem = scene.querySelector('.sprout-stem');
        const sproutLeaves = [...scene.querySelectorAll('.sprout-leaf')];
        const treeStage = scene.querySelector('.tree-stage');
        const branches = [...scene.querySelectorAll('.tree-branch')];
        const canopyStage = scene.querySelector('.canopy-stage');
        const canopyLeaves = [...scene.querySelectorAll('.canopy-leaf')];
        const canopyHighlight = scene.querySelector('.canopy-highlight');
        const appleStage = scene.querySelector('.apple-stage');
        const apples = [...scene.querySelectorAll('.apple')];

        const groundGrowth = range(0, 100);
        if (groundShadow) {
            groundShadow.style.transform = `scaleX(${(0.34 + groundGrowth * 0.66).toFixed(3)})`;
            groundShadow.style.opacity = String(0.45 + groundGrowth * 0.55);
        }
        if (soil) {
            soil.style.transform = `scaleX(${(0.48 + groundGrowth * 0.52).toFixed(3)})`;
        }

        const seedFade = 1 - range(9, 24);
        if (seedStage) {
            seedStage.style.opacity = String(seedFade);
            seedStage.style.transform = `scale(${(0.72 + seedFade * 0.28).toFixed(3)}) translateY(${((1 - seedFade) * 6).toFixed(1)}px)`;
        }

        const sproutGrowth = range(5, 31);
        const sproutFade = 1 - range(31, 46);
        if (sproutStage) {
            sproutStage.style.opacity = String(Math.min(1, range(4, 10)) * sproutFade);
            sproutStage.style.transform = `scale(${(0.18 + sproutGrowth * 0.82).toFixed(3)})`;
        }
        if (sproutStem) {
            sproutStem.style.strokeDashoffset = String(48 * (1 - sproutGrowth));
        }
        sproutLeaves.forEach((leaf, index) => {
            const leafGrowth = range(11 + index * 4, 25 + index * 4);
            leaf.style.animation = 'none';
            leaf.style.opacity = String(leafGrowth);
            leaf.style.transform = `scale(${Math.max(0.08, leafGrowth).toFixed(3)}) rotate(${index === 0 ? -3 + leafGrowth * 3 : 3 - leafGrowth * 3}deg)`;
        });

        const trunkGrowth = range(22, 70);
        if (treeStage) {
            treeStage.style.opacity = String(range(18, 29));
            treeStage.style.transform = `scaleY(${(0.12 + trunkGrowth * 0.88).toFixed(3)}) scaleX(${(0.70 + trunkGrowth * 0.30).toFixed(3)})`;
        }
        const branchStarts = [34, 42, 50, 58];
        branches.forEach((branch, index) => {
            const branchGrowth = range(branchStarts[index] || 42, (branchStarts[index] || 42) + 16);
            branch.style.opacity = String(branchGrowth);
            const direction = branch.classList.contains('branch-left-lower') || branch.classList.contains('branch-left-upper') ? -2 : 2;
            branch.style.transform = `scale(${Math.max(0.05, branchGrowth).toFixed(3)}) rotate(${direction}deg)`;
        });

        if (canopyStage) {
            canopyStage.style.opacity = String(range(40, 54));
            canopyStage.style.transform = 'scale(1) translateY(0)';
        }
        const leafStarts = [43, 48, 52, 57, 61, 66, 70];
        canopyLeaves.forEach((leaf, index) => {
            const leafGrowth = range(leafStarts[index] || 48, (leafStarts[index] || 48) + 20);
            leaf.style.animation = 'none';
            leaf.style.opacity = String(leafGrowth);
            leaf.style.transform = `scale(${Math.max(0.04, leafGrowth).toFixed(3)})`;
        });
        if (canopyHighlight) {
            canopyHighlight.style.opacity = String(range(66, 88) * 0.9);
        }

        if (appleStage) {
            appleStage.style.opacity = String(range(84, 94));
            appleStage.style.transform = 'scale(1)';
        }
        const appleStarts = [84, 87, 90, 92, 94];
        apples.forEach((apple, index) => {
            const appleGrowth = range(appleStarts[index] || 88, (appleStarts[index] || 88) + 6);
            apple.style.opacity = String(appleGrowth);
            apple.style.transform = `scale(${Math.max(0.05, appleGrowth).toFixed(3)})`;
        });
    }

    getLoadingNarration(progress) {
        if (progress < 10) return 'Planting a secure dashboard session…';
        if (progress < 25) return 'Growing a connection to the shared data source…';
        if (progress < 45) return 'Building the first data branches…';
        if (progress < 65) return 'Growing the dashboard record structure…';
        if (progress < 82) return 'Filling the tree with synchronized records…';
        if (progress < 94) return 'Checking tables, filters, and record counts…';
        if (progress < 100) return 'Finishing the last dashboard checks…';
        return 'All records are ready.';
    }

    renderLoadingProgress(progress) {
        const el = document.getElementById('loading-overlay');
        if (!el) return;

        const value = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
        const bar = document.getElementById('loading-bar');
        const progressEl = document.getElementById('loading-progress');
        const percent = document.getElementById('loading-percent');
        const status = document.getElementById('loading-status');

        this._displayedLoadingProgress = value;
        el.dataset.stage = this.getLoadingStage(value);
        el.style.setProperty('--loading-progress', String(value / 100));

        if (bar) bar.style.width = `${value}%`;
        if (progressEl) progressEl.setAttribute('aria-valuenow', String(value));
        if (percent) percent.textContent = `${value}%`;
        if (status && Date.now() >= (this._loadingCustomMessageUntil || 0)) {
            status.textContent = this.getLoadingNarration(value);
        }

        this.renderTreeGrowth(value);
    }

    cancelLoadingProgressAnimation() {
        if (this._loadingProgressFrame) {
            cancelAnimationFrame(this._loadingProgressFrame);
            this._loadingProgressFrame = null;
        }
        if (this._loadingAutoTimer) {
            clearTimeout(this._loadingAutoTimer);
            this._loadingAutoTimer = null;
        }
    }

    resetLoadingProgress(progress = 0) {
        this.cancelLoadingProgressAnimation();
        const value = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
        this._loadingProgress = value;
        this._loadingTargetProgress = value;
        this._displayedLoadingProgress = value;
        this.renderLoadingProgress(value);
    }

    getNextLoadingDelay(current) {
        const elapsed = Math.max(0, performance.now() - (this._loadingStartedAt || performance.now()));

        if (this._loadingBackendReady) {
            const remainingSteps = Math.max(1, 100 - current);
            const minimumTimeLeft = Math.max(0, (this._loadingMinDuration || 0) - elapsed);
            // Respect the minimum animation duration but never become sluggish
            // once the backend has finished.
            return Math.max(18, Math.ceil(minimumTimeLeft / remainingSteps));
        }

        // The progress remains alive while Apps Script is working. It gradually
        // slows near 99 so normal requests have enough time to finish without a
        // frozen-looking bar or skipped percentages.
        if (current < 60) return 28;
        if (current < 80) return 42;
        if (current < 92) return 70;
        if (current < 97) return 120;
        if (current < 99) return 240;
        return 360;
    }

    startLoadingProgressAnimation() {
        if (this._loadingAutoTimer || !this.isLoadingVisible()) return;

        const runToken = this._loadingRunToken;
        const tick = () => {
            this._loadingAutoTimer = null;
            if (runToken !== this._loadingRunToken) return;
            if (!this.isLoadingVisible() || this.isOffline || this._offlineTransitionInProgress) return;

            const current = Number.isFinite(this._displayedLoadingProgress)
                ? this._displayedLoadingProgress
                : 0;

            if (current >= 100) return;

            if (current < 99 || this._loadingBackendReady) {
                // Exactly one whole number per timer tick: 1, 2, 3, and so on.
                this.renderLoadingProgress(current + 1);
                document.getElementById('loading-overlay')?.classList.remove('waiting-for-backend');
            } else {
                // A very slow backend can outlast the 1–99 sequence. Keep the
                // tree, leaves, and progress track moving instead of presenting
                // a dead screen, then continue to 100 as soon as data is ready.
                document.getElementById('loading-overlay')?.classList.add('waiting-for-backend');
                const status = document.getElementById('loading-status');
                if (status) status.textContent = 'Still synchronizing records…';
            }

            const nextCurrent = Number.isFinite(this._displayedLoadingProgress)
                ? this._displayedLoadingProgress
                : current;
            this._loadingAutoTimer = setTimeout(tick, this.getNextLoadingDelay(nextCurrent));
        };

        this._loadingAutoTimer = setTimeout(tick, this.getNextLoadingDelay(this._displayedLoadingProgress || 0));
    }

    setLoadingProgress(progress, message = '') {
        const el = document.getElementById('loading-overlay');
        if (!el) return;

        const requested = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
        this._loadingMilestone = Math.max(this._loadingMilestone || 0, requested);
        this._loadingProgress = Math.max(this._loadingProgress || 0, requested);

        const status = document.getElementById('loading-status');
        if (status && message) {
            status.textContent = message;
            this._loadingCustomMessageUntil = Date.now() + 1900;
        }

        // Backend milestones update the message, not the visible number. The
        // number is controlled by the continuous one-percent timer so it never
        // jumps from, for example, 16% directly to 50%.
        this.startLoadingProgressAnimation();
    }

    waitForLoadingProgress(target = 100, runToken = this._loadingRunToken) {
        const wanted = Math.max(0, Math.min(100, Math.round(Number(target) || 0)));

        return new Promise(resolve => {
            const check = () => {
                if (runToken !== this._loadingRunToken) {
                    resolve(false);
                    return;
                }
                if ((this._displayedLoadingProgress || 0) >= wanted) {
                    resolve(true);
                    return;
                }
                requestAnimationFrame(check);
            };
            check();
        });
    }

    hideLoadingImmediately() {
        const el = document.getElementById('loading-overlay');
        this.clearLoadingTimers();
        this.cancelLoadingProgressAnimation();
        if (el) {
            el.classList.add('hidden');
            el.classList.remove(
                'is-finishing',
                'apples-falling',
                'is-closing',
                'waiting-for-backend',
                'connection-lost'
            );
        }
        document.body.classList.remove('dashboard-loading');
    }

    showLoading(show, options = {}) {
        const el = document.getElementById('loading-overlay');
        if (!el) return;

        const title = document.getElementById('loading-title');
        const status = document.getElementById('loading-status');
        const tip = document.getElementById('loading-tip');
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (show) {
            const wasHidden = el.classList.contains('hidden');
            this.clearLoadingTimers();
            this.cancelLoadingProgressAnimation();
            this._loadingRunToken = (this._loadingRunToken || 0) + 1;
            this._loadingBackendReady = false;
            this._loadingMilestone = 0;
            this._loadingCustomMessageUntil = 0;
            this._loadingStartedAt = performance.now();
            const isRefresh = /refresh/i.test(options.title || '');
            this._loadingMinDuration = Number.isFinite(options.minimumDuration)
                ? Math.max(0, options.minimumDuration)
                : (isRefresh ? 650 : 900);

            el.classList.remove(
                'hidden',
                'is-finishing',
                'apples-falling',
                'is-closing',
                'waiting-for-backend',
                'connection-lost'
            );
            document.body.classList.add('dashboard-loading');

            if (wasHidden || !Number.isFinite(this._displayedLoadingProgress)) {
                this.resetLoadingProgress(0);
            } else {
                this.resetLoadingProgress(0);
            }

            if (title && options.title) title.textContent = options.title;
            if (tip) tip.textContent = options.tip || 'The tree grows continuously with every percentage.';

            this.setLoadingProgress(
                options.progress ?? 0,
                options.message || 'Connecting to Google Apps Script…'
            );
            this.startLoadingProgressAnimation();
            return;
        }

        if (this.isOffline || this._offlineTransitionInProgress) return;

        const runToken = this._loadingRunToken;
        this._loadingBackendReady = true;
        if (status) {
            status.textContent = options.finalizingMessage || 'Finalizing dashboard…';
            this._loadingCustomMessageUntil = Date.now() + 500;
        }
        this.startLoadingProgressAnimation();

        this.waitForLoadingProgress(100, runToken).then(reachedTarget => {
            if (!reachedTarget || runToken !== this._loadingRunToken) return;
            if (this.isOffline || this._offlineTransitionInProgress) return;

            if (title) title.textContent = options.title || 'Dashboard ready';
            if (status) status.textContent = options.message || 'All records are ready.';
            if (tip) tip.textContent = 'Opening your dashboard…';
            el.classList.remove('waiting-for-backend');
            el.classList.add('is-finishing');

            if (reducedMotion) {
                this.queueLoadingTimer(() => {
                    if (runToken !== this._loadingRunToken) return;
                    el.classList.add('is-closing');
                }, 80);
                this.queueLoadingTimer(() => {
                    if (runToken !== this._loadingRunToken) return;
                    this.hideLoadingImmediately();
                }, 320);
                return;
            }

            this.queueLoadingTimer(() => {
                if (runToken !== this._loadingRunToken) return;
                el.classList.add('apples-falling');
            }, 100);

            this.queueLoadingTimer(() => {
                if (runToken !== this._loadingRunToken) return;
                el.classList.add('is-closing');
            }, 420);

            this.queueLoadingTimer(() => {
                if (runToken !== this._loadingRunToken) return;
                this.hideLoadingImmediately();
            }, 680);
        });
    }

    playOfflineTreeFall() {
        if (this._offlineTransitionInProgress) return;

        const el = document.getElementById('loading-overlay');
        if (!el) {
            this.showOfflineModalNow();
            return;
        }

        this._offlineTransitionInProgress = true;
        this._loadingInterruptedByOffline = true;

        if (!this.isLoadingVisible()) {
            this.showLoading(true, {
                progress: 0,
                minimumDuration: 0,
                title: 'Connection interrupted',
                message: 'The dashboard lost its internet connection…'
            });
        }

        this.cancelLoadingProgressAnimation();
        this.clearLoadingTimers();
        this.renderLoadingProgress(Math.max(72, this._displayedLoadingProgress || 0));

        const title = document.getElementById('loading-title');
        const status = document.getElementById('loading-status');
        if (title) title.textContent = 'Connection interrupted';
        if (status) status.textContent = 'The data tree lost its connection…';
        el.classList.remove('waiting-for-backend', 'is-finishing', 'apples-falling', 'is-closing');
        el.classList.add('connection-lost');
        document.body.classList.add('dashboard-loading');

        const transitionToken = this._loadingRunToken;
        this.queueLoadingTimer(() => {
            if (transitionToken !== this._loadingRunToken) return;

            // A momentary connection drop may recover before the fall ends.
            if (navigator.onLine) {
                el.classList.remove('connection-lost');
                this._offlineTransitionInProgress = false;
                this.isOffline = false;
                this._loadingBackendReady = false;
                this.startLoadingProgressAnimation();
                return;
            }

            this.hideLoadingImmediately();
            this._offlineTransitionInProgress = false;
            this.showOfflineModalNow();
        }, 1350);
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-circle-xmark';
        if (type === 'warning') icon = 'fa-triangle-exclamation';
        if (type === 'info') icon = 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${this.escapeHtml(message)}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('hidden');
    }

    updateLastUpdated() {
        // The redesigned sidebar intentionally omits the old Updated/time row.
        const target = document.getElementById('last-updated');
        if (!target) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        target.textContent = `Updated ${timeStr}`;
    }

    initSearchClear() {
        const input = document.getElementById('global-search');
        const btn = document.getElementById('search-clear-btn');
        if (input) {
            // Explicitly identify this as a record filter rather than a login
            // username field so password managers do not target it.
            input.setAttribute('name', 'cares-record-search');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('data-lpignore', 'true');
            input.setAttribute('data-1p-ignore', 'true');
            input.setAttribute('aria-autocomplete', 'none');
        }
        if (input && this.currentSearch) {
            input.value = this.currentSearch;
        }
        if (input && btn && input.value) btn.classList.add('visible');
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const header = document.querySelector('.top-header');
                if (header && header.classList.contains('mobile-search-active')) {
                    e.preventDefault();
                    this.toggleMobileSearch(false);
                    return;
                }
                ['settings-modal', 'shortcuts-modal', 'duplicate-modal'].forEach(id => this.closeModal(id));
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('mobile-overlay').classList.add('hidden');
                document.querySelectorAll('.column-toggle-menu, .filter-dropdown').forEach(m => m.classList.remove('open'));
                this.setSettingsMenuOpen(false);
                this.exitFullscreenTable();
            }
            if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                this.openModal('shortcuts-modal');
            }
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                if (this.isMobileCardLayout()) this.toggleMobileSearch(true);
                else document.getElementById('global-search')?.focus();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshModule(this.currentPage);
            }
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDuplicateHighlight();
            }
            if (e.key === 'ArrowLeft' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                if (this.pagination.page > 1) this.changePage(this.pagination.page - 1);
            }
            if (e.key === 'ArrowRight' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                this.changePage(this.pagination.page + 1);
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.column-toggle') && !e.target.closest('.column-reorder') && !e.target.closest('.column-filter-item')) {
                this.closeColumnMenus();
                document.querySelectorAll('.filter-dropdown').forEach(m => m.classList.remove('open'));
            }

            const settingsMenu = document.getElementById('settings-menu');
            if (settingsMenu && !settingsMenu.contains(e.target)) {
                this.setSettingsMenuOpen(false);
            } else if (e.target.closest('.settings-item')) {
                // Keep the footer compact after a setting has been selected.
                this.setSettingsMenuOpen(false);
            }
        });

        const searchInput = document.getElementById('global-search');
        const searchClear = document.getElementById('search-clear-btn');
        if (searchInput && searchClear) {
            searchInput.addEventListener('input', () => {
                if (searchInput.value) {
                    searchClear.classList.add('visible');
                } else {
                    searchClear.classList.remove('visible');
                }
            });
        }

        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());

        let responsiveFrame = null;
        const syncViewport = () => {
            this.syncViewportHeight();
            if (responsiveFrame) cancelAnimationFrame(responsiveFrame);
            responsiveFrame = requestAnimationFrame(() => {
                responsiveFrame = null;
                this.syncResponsiveUI();
            });
        };
        window.addEventListener('resize', syncViewport, { passive: true });
        window.addEventListener('orientationchange', syncViewport, { passive: true });
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', syncViewport, { passive: true });
        }
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());

        // Sidebar collapse gestures are intentionally disabled in this layout.
    }
    
        // ============================================
    // OFFLINE DETECTION
    // ============================================

    initOfflineDetection() {
        // Check immediately on load.
        this.checkConnection();

        window.addEventListener('online', () => {
            const shouldReload = this._loadingInterruptedByOffline &&
                sessionStorage.getItem('dashboard_session') === 'authenticated';

            this.isOffline = false;
            this.offlineRetryCount = 0;
            this._loadingInterruptedByOffline = false;

            if (this._offlineTransitionInProgress) {
                this._offlineTransitionInProgress = false;
                this.hideLoadingImmediately();
            }

            this.closeOfflineModal();
            this.showToast('Internet connection restored', 'success');

            // Requests interrupted by the outage are loaded again after the
            // connection returns so the table is not left with partial data.
            if (shouldReload) {
                setTimeout(() => this.refreshData(), 250);
            }
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
            this.openOfflineModal();
        });

        // Periodic check every 5 seconds while offline.
        this.offlineCheckInterval = setInterval(() => {
            if (this.isOffline) this.checkConnection();
        }, 5000);
    }

    checkConnection() {
        if (!navigator.onLine) {
            this.isOffline = true;
            this.openOfflineModal();
            return false;
        }
        return true;
    }

    openOfflineModal() {
        const modal = document.getElementById('offline-modal');
        if (modal && !modal.classList.contains('hidden')) {
            this.showOfflineModalNow();
            return;
        }

        // Let the connected tree visibly collapse before the conventional
        // no-internet message appears.
        this.playOfflineTreeFall();
    }

    showOfflineModalNow() {
        const modal = document.getElementById('offline-modal');
        const retryCount = document.getElementById('offline-retry-count');
        const retryBtn = document.getElementById('offline-retry-btn');
        if (!modal) return;

        if (retryCount) {
            retryCount.textContent = this.offlineRetryCount > 0
                ? `Retry attempt ${this.offlineRetryCount}`
                : '';
        }

        if (retryBtn) {
            retryBtn.innerHTML = '<i class="fas fa-rotate"></i> Retry';
            retryBtn.disabled = false;
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeOfflineModal() {
        const modal = document.getElementById('offline-modal');
        if (modal) {
            modal.classList.add('hidden');
            if (!document.body.classList.contains('dashboard-loading')) {
                document.body.style.overflow = '';
            }
        }
    }

    async retryConnection() {
        this.offlineRetryCount++;
        const retryBtn = document.getElementById('offline-retry-btn');
        const retryCount = document.getElementById('offline-retry-count');

        if (retryBtn) {
            retryBtn.innerHTML = '<i class="fas fa-rotate fa-spin"></i> Checking...';
            retryBtn.disabled = true;
        }

        if (retryCount) {
            retryCount.textContent = `Retry attempt ${this.offlineRetryCount}...`;
        }

        // Wait a moment then check
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (navigator.onLine) {
            // Double-check with a fetch to a reliable endpoint
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);
                await fetch('https://www.google.com/favicon.ico', {
                    mode: 'no-cors',
                    cache: 'no-store',
                    signal: controller.signal
                });
                clearTimeout(timeout);
            } catch (e) {
                // fetch failed but navigator says online — trust navigator
            }

            this.isOffline = false;
            this.offlineRetryCount = 0;
            this._loadingInterruptedByOffline = false;
            this.closeOfflineModal();
            this.showToast('Internet connection restored', 'success');

            // Reload every configured source because the outage may have
            // interrupted more than the currently visible module.
            if (sessionStorage.getItem('dashboard_session') === 'authenticated') {
                this.refreshData();
            }
        } else {
            // Still offline — keep modal open and update button
            if (retryBtn) {
                retryBtn.innerHTML = '<i class="fas fa-rotate"></i> Retry';
                retryBtn.disabled = false;
            }
            if (retryCount) {
                retryCount.textContent = `Retry attempt ${this.offlineRetryCount} — still offline`;
            }
            // Modal stays open, will auto-check again in 5 seconds
        }
    }

        parseDateForSort(dateInput) {
        if (!dateInput) return 0;
        if (dateInput instanceof Date) return dateInput.getTime();
        if (typeof dateInput === 'string') {
            // Try standard Date parse first
            let d = new Date(dateInput);
            if (!isNaN(d.getTime())) return d.getTime();
            // Try MM/DD/YYYY format
            const parts = dateInput.split(/[/\-]/);
            if (parts.length === 3) {
                d = new Date(parts[2], parts[0] - 1, parts[1]);
                if (!isNaN(d.getTime())) return d.getTime();
            }
        }
        return 0;
    }

        isNewRecord(timestamp) {
        // Manual-review mode: banner is always eligible (no time-based expiry).
        // Dismissal is controlled entirely by the encoded-records set / popup.
        return !!timestamp;
    }

        getNewSticker(record, page = this.currentPage) {
        // Backward-compat: accept either a record object or a raw timestamp string.
        let r = record;
        let timestamp;
        if (record && typeof record === 'object') {
            timestamp = record.timestamp;
        } else {
            timestamp = record;
            r = null;
        }
        if (!this.isNewRecord(timestamp)) return '';

        const recordDate = this.parseDateForSort(timestamp);
        let title = 'Click to update encoding status';
        if (recordDate) {
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - recordDate) / (1000 * 60 * 60 * 24));
            const ago = diffDays === 0 ? 'today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            title = `Added ${ago} — click to update encoding status`;
        }

        const recordId = r ? this.getEncodedKey(r) : '';
        const safeId = this.escapeHtml(recordId);
        const safePage = this.escapeHtml(page);

        // The ID and module are read from data attributes. This avoids injecting
        // record values directly into inline JavaScript.
        return ` <span class="new-sticker" role="button" tabindex="0" aria-label="Update encoding status" aria-haspopup="dialog" data-encode-id="${safeId}" data-encode-page="${safePage}" title="${title}" onclick="app.showEncodePopup(event)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.showEncodePopup(event);}"><i class="fas fa-star"></i> New</span>`;
    }

    // ============================================
    // Manual-review "New" banner: shared status + local fallback
    // ============================================

    getEncodedKey(r) {
        if (!r) return '';
        if (r.id) return String(r.id);

        // Fallback: deterministic email + timestamp hash, stable across browsers.
        const seed = `${(r.email || '').trim().toLowerCase()}|${r.timestamp || ''}`;
        return `h_${this.hashString(seed)}`;
    }

    hashString(str) {
        let h = 5381;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) + h) + str.charCodeAt(i);
            h = h & 0xffffffff;
        }
        return (h >>> 0).toString(36);
    }

    getScopedEncodedId(page, recordId) {
        const safePage = String(page || '').trim();
        const safeRecordId = String(recordId || '').trim();
        if (!safePage || !safeRecordId) return '';
        return `${safePage}::${safeRecordId}`;
    }

    loadEncodedRecords() {
        this.encodedRecords = new Set();
        this.legacyEncodedRecords = new Set();

        try {
            const prefix = 'dashboard_encoded_';
            for (let i = 0; i < localStorage.length; i++) {
                const storageKey = localStorage.key(i);
                if (
                    !storageKey ||
                    storageKey.indexOf(prefix) !== 0 ||
                    localStorage.getItem(storageKey) !== '1'
                ) {
                    continue;
                }

                const savedId = storageKey.slice(prefix.length);
                if (savedId.includes('::')) {
                    this.encodedRecords.add(savedId);
                } else {
                    // Older versions saved an unscoped record ID. Retain it as
                    // a fallback so existing browser markings are not lost.
                    this.legacyEncodedRecords.add(savedId);
                }
            }
        } catch (error) {
            console.warn('loadEncodedRecords failed', error);
        }
    }

    saveEncodedRecords(recordId, page = this.currentPage) {
        const scopedId = this.getScopedEncodedId(page, recordId);
        if (!scopedId) return;

        try {
            localStorage.setItem(`dashboard_encoded_${scopedId}`, '1');
        } catch (error) {
            console.warn('saveEncodedRecords failed', error);
        }

        this.encodedRecords.add(scopedId);
    }

    removeEncodedRecord(recordId, page = this.currentPage) {
        const scopedId = this.getScopedEncodedId(page, recordId);
        if (!scopedId) return;

        try {
            localStorage.removeItem(`dashboard_encoded_${scopedId}`);
        } catch (error) {
            console.warn('removeEncodedRecord failed', error);
        }

        this.encodedRecords.delete(scopedId);
    }

    isEncoded(record, page = this.currentPage) {
        return this.getEncodingStatus(record, page) === 'Encoded';
    }

    showEncodePopup(event, suppliedRecordId, suppliedPage) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Toggle off any existing popup first.
        this.closeEncodePopup();

        const anchor = (event && event.currentTarget) ||
            (suppliedRecordId
                ? document.querySelector(`[data-encode-id="${CSS.escape(String(suppliedRecordId))}"]`)
                : null);
        if (!anchor) return;

        const recordId = String(
            suppliedRecordId ||
            anchor.dataset.encodeId ||
            ''
        ).trim();
        const page = String(
            suppliedPage ||
            anchor.dataset.encodePage ||
            this.currentPage
        ).trim();

        if (!recordId || !MODULES[page]) return;

        const mod = MODULES[page];
        const records = this.data[mod.dataKey] || [];
        const record = records.find(item => this.getEncodedKey(item) === recordId);
        if (!record) {
            this.showToast('The selected record could not be found', 'error');
            return;
        }

        const currentStatus = this.getEncodingStatus(record, page);
        const encodedChecked = currentStatus === 'Encoded' ? 'checked' : '';
        const notEncodedChecked = currentStatus === 'Not Encoded' ? 'checked' : '';

        const popup = document.createElement('div');
        popup.className = 'encode-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'false');
        popup.setAttribute('aria-label', 'Update encoding status');
        popup.dataset.encodeId = recordId;
        popup.dataset.encodePage = page;
        popup.innerHTML = `
            <div class="encode-popup-arrow" aria-hidden="true"></div>
            <div class="encode-popup-title">Encoding Status</div>
            <form class="encode-popup-form" onsubmit="return false;">
                <label class="encode-popup-option">
                    <input type="radio" name="encode-choice-${this.escapeHtml(recordId)}" value="encoded" aria-label="Encoded" ${encodedChecked}>
                    <span class="encode-popup-option-label">
                        <i class="fas fa-check-circle"></i> Encoded
                    </span>
                </label>
                <label class="encode-popup-option">
                    <input type="radio" name="encode-choice-${this.escapeHtml(recordId)}" value="not-encoded" aria-label="Not Encoded" ${notEncodedChecked}>
                    <span class="encode-popup-option-label">
                        <i class="fas fa-circle-xmark"></i> Not Encoded
                    </span>
                </label>
            </form>
        `;

        popup.addEventListener('click', (popupEvent) => popupEvent.stopPropagation());
        popup.addEventListener('mousedown', (popupEvent) => popupEvent.stopPropagation());

        document.body.appendChild(popup);
        const rect = anchor.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const margin = 8;
        let left = rect.left + (rect.width / 2) - (popupRect.width / 2);
        left = Math.max(margin, Math.min(left, window.innerWidth - popupRect.width - margin));
        let top = rect.top - popupRect.height - 10;
        popup.classList.add('above');

        if (top < margin) {
            top = rect.bottom + 10;
            popup.classList.remove('above');
            popup.classList.add('below');
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;

        const arrow = popup.querySelector('.encode-popup-arrow');
        if (arrow) {
            const arrowLeft = (rect.left + rect.width / 2) - left;
            arrow.style.left = `${Math.max(12, Math.min(arrowLeft, popupRect.width - 12))}px`;
        }

        requestAnimationFrame(() => popup.classList.add('show'));

        const titleElement = popup.querySelector('.encode-popup-title');
        const radios = Array.from(popup.querySelectorAll('input[type="radio"]'));

        radios.forEach(radio => {
            radio.addEventListener('change', async (changeEvent) => {
                changeEvent.stopPropagation();
                if (!radio.checked) return;

                const selectedStatus = radio.value === 'encoded'
                    ? 'Encoded'
                    : 'Not Encoded';

                radios.forEach(item => {
                    item.disabled = true;
                });
                if (titleElement) titleElement.textContent = 'Saving...';

                try {
                    await this.saveEncodingStatusGlobal(recordId, selectedStatus, page);
                    this.closeEncodePopup();

                    if (selectedStatus === 'Encoded') {
                        this.showToast('Marked as Encoded and saved to the shared sheet', 'success');
                    } else {
                        this.showToast('Marked as Not Encoded — the NEW label remains visible', 'info');
                    }

                    if (this.currentPage === page) {
                        this.renderPage();
                    }
                } catch (error) {
                    console.error('Encoding status save failed:', error);

                    radios.forEach(item => {
                        item.disabled = false;
                        item.checked =
                            (item.value === 'encoded' && currentStatus === 'Encoded') ||
                            (item.value === 'not-encoded' && currentStatus === 'Not Encoded');
                    });

                    if (titleElement) titleElement.textContent = 'Encoding Status';
                    this.showToast(
                        `Could not save status${error && error.message ? ' — ' + error.message : ''}`,
                        'error'
                    );
                }
            });
        });

        const preferredRadio = popup.querySelector('input:checked') || radios[0];
        if (preferredRadio) preferredRadio.focus();

        this._encodePopupOutsideHandler = (outsideEvent) => {
            if (!popup.contains(outsideEvent.target) && outsideEvent.target !== anchor) {
                this.closeEncodePopup();
            }
        };

        this._encodePopupKeyHandler = (keyEvent) => {
            if (keyEvent.key === 'Escape') {
                keyEvent.stopPropagation();
                this.closeEncodePopup();
                if (anchor && typeof anchor.focus === 'function') anchor.focus();
            }
        };

        setTimeout(() => {
            document.addEventListener('mousedown', this._encodePopupOutsideHandler, true);
            document.addEventListener('keydown', this._encodePopupKeyHandler, true);
        }, 0);

        this.activeEncodePopup = popup;
    }

    closeEncodePopup() {
        if (this._encodePopupOutsideHandler) {
            document.removeEventListener('mousedown', this._encodePopupOutsideHandler, true);
            this._encodePopupOutsideHandler = null;
        }
        if (this._encodePopupKeyHandler) {
            document.removeEventListener('keydown', this._encodePopupKeyHandler, true);
            this._encodePopupKeyHandler = null;
        }
        if (this.activeEncodePopup) {
            const popup = this.activeEncodePopup;
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
            }, 180);
            this.activeEncodePopup = null;
        }
    }


        toggleSidebarCollapse() {
        // On mobile, the logo-icon acts as the open/close toggle for the slide-in sidebar.
        // On desktop, it collapses/expands the sidebar rail.
        if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
            this.toggleSidebar();
            return;
        }
        this.settings.sidebarCollapsed = !this.settings.sidebarCollapsed;
        this.saveSettings();
        this.applySidebarCollapse();
    }

    applySidebarCollapse() {
        const appContainer = document.querySelector('.app-container');
        const toggle = document.getElementById('sidebar-rail-toggle');
        const icon = document.getElementById('sidebar-rail-icon');
        if (!appContainer) return;

        const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        const collapsed = !isMobile && !!this.settings.sidebarCollapsed;
        appContainer.classList.toggle('sidebar-collapsed', collapsed);

        if (toggle) {
            toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
            toggle.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
        }
        if (icon) icon.className = collapsed ? 'fas fa-arrow-right' : 'fas fa-arrow-left';
    }

    syncSettingsActions() {

        const doc = document;
        const appContainer = document.querySelector('.app-container');
        const isFullscreen = !!(
            doc.fullscreenElement || doc.webkitFullscreenElement ||
            doc.mozFullScreenElement || doc.msFullscreenElement ||
            (appContainer && appContainer.classList.contains('table-fullscreen'))
        );
        const fullscreenIcon = document.getElementById('fullscreen-icon');
        const fullscreenLabel = document.getElementById('settings-fullscreen-label');
        const fullscreenButton = document.getElementById('settings-fullscreen-btn');
        if (fullscreenIcon) fullscreenIcon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        if (fullscreenLabel) fullscreenLabel.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Dashboard';
        if (fullscreenButton) fullscreenButton.title = isFullscreen ? 'Exit dashboard fullscreen' : 'Open the complete dashboard in fullscreen';

        const filterButton = document.getElementById('settings-module-filter-btn');
        const filterLabel = document.getElementById('settings-module-filter-label');
        const extraFilters = (MODULES[this.currentPage]?.filters || []).filter(name => name.toLowerCase() !== 'all');
        if (filterButton) {
            const hasExtraFilter = extraFilters.length > 0;
            filterButton.classList.toggle('hidden', !hasExtraFilter);
            if (hasExtraFilter) {
                const filterName = extraFilters[0];
                const active = this.currentFilter === filterName.toLowerCase();
                filterButton.classList.toggle('active', active);
                filterButton.setAttribute('aria-pressed', active ? 'true' : 'false');
                if (filterLabel) filterLabel.textContent = active ? `Show All Records` : `${filterName} Only`;
            }
        }
    }

    toggleSecondaryModuleFilter() {
        const extraFilters = (MODULES[this.currentPage]?.filters || []).filter(name => name.toLowerCase() !== 'all');
        if (!extraFilters.length) return;
        const filter = extraFilters[0].toLowerCase();
        this.setFilter(this.currentFilter === filter ? 'all' : filter);
    }

    // ============================================
    // SETTINGS SUBMENU (sidebar footer)
    // ============================================
    toggleSettingsMenu() {
        const menu = document.getElementById('settings-menu');
        if (!menu) return;
        const willOpen = !menu.classList.contains('open');
        this.setSettingsMenuOpen(willOpen);
    }

    setSettingsMenuOpen(open) {
        const menu = document.getElementById('settings-menu');
        const toggleBtn = document.getElementById('settings-toggle-btn');
        const chevron = document.getElementById('settings-chevron');
        const appContainer = document.querySelector('.app-container');
        if (!menu) return;

        menu.classList.toggle('open', !!open);

        // In a collapsed or fullscreen icon rail, the submenu becomes a floating
        // panel beside the settings icon instead of being hidden inside 74px.
        const railMode = !!(appContainer && (
            appContainer.classList.contains('sidebar-collapsed') ||
            appContainer.classList.contains('table-fullscreen') ||
            appContainer.classList.contains('fullscreen-icon-rail') ||
            document.documentElement.classList.contains('dashboard-fullscreen-active')
        ));
        if (appContainer) {
            appContainer.classList.toggle('rail-settings-open', !!open && railMode);
        }

        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggleBtn.classList.toggle('active', !!open);
        }
        if (chevron) {
            chevron.classList.toggle('fa-chevron-up', !!open);
            chevron.classList.toggle('fa-chevron-down', !open);
        }
    }
}

let app = null;

if (window.location.protocol === 'file:') {
    document.documentElement.classList.add('local-file-origin');
    console.info('CARES dashboard paused: use START_DASHBOARD.bat so the page runs from http://127.0.0.1:5500.');
} else {
    app = new DashboardApp();
}
