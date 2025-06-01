/**
 * Analyses Financières Détaillées Q1-Q3 2025
 * Interactive financial dashboard for 8 tech companies
 * Comprehensive analytics platform with advanced features
 */

class TechGiantsAnalyticsDashboard {
    constructor() {
        this.currentTab = 'overview';
        this.presentationMode = false;
        this.currentTooltip = null;
        this.searchData = this.buildSearchIndex();
        this.animationQueue = [];
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupSearch();
        this.setupMetricInteractions();
        this.setupTooltips();
        this.setupExport();
        this.setupPresentationMode();
        this.setupKeyboardNavigation();
        this.setupResponsiveHandlers();
        this.setupAnimations();
        this.setupAccessibility();
        this.loadInitialData();
        this.logAppStart();
    }

    buildSearchIndex() {
        return {
            companies: [
                { name: 'Microsoft', tab: 'microsoft', keywords: ['azure', 'cloud', 'ia', 'office', 'teams'] },
                { name: 'Amazon', tab: 'amazon', keywords: ['aws', 'prime', 'alexa', 'retail', 'logistics'] },
                { name: 'QuantumScape', tab: 'quantumscape', keywords: ['batteries', 'solid-state', 'cobra', 'automotive'] },
                { name: 'Meta', tab: 'meta', keywords: ['facebook', 'instagram', 'ia', 'metaverse', 'reality'] },
                { name: 'Uber', tab: 'uber', keywords: ['ride-hailing', 'autonomous', 'waymo', 'mobility'] },
                { name: 'Fluence', tab: 'fluence', keywords: ['energy', 'storage', 'batteries', 'smartstack'] },
                { name: 'Sweetgreen', tab: 'sweetgreen', keywords: ['restaurant', 'infinite kitchen', 'food'] },
                { name: 'Alphabet', tab: 'alphabet', keywords: ['google', 'search', 'cloud', 'ai overviews'] }
            ],
            metrics: [
                { term: 'revenue', companies: ['microsoft', 'amazon', 'meta', 'uber', 'fluence', 'sweetgreen', 'alphabet'] },
                { term: 'croissance', companies: ['microsoft', 'amazon', 'meta', 'uber', 'sweetgreen', 'alphabet'] },
                { term: 'marge', companies: ['microsoft', 'amazon', 'meta', 'sweetgreen'] },
                { term: 'cash flow', companies: ['microsoft', 'uber'] },
                { term: 'capex', companies: ['microsoft', 'amazon', 'meta', 'alphabet'] },
                { term: 'ia', companies: ['microsoft', 'amazon', 'meta', 'alphabet'] },
                { term: 'cloud', companies: ['microsoft', 'amazon', 'alphabet'] }
            ]
        };
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const contentPanels = document.querySelectorAll('.content-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons, contentPanels);
            });

            button.addEventListener('mouseenter', this.handleTabHover.bind(this));
            button.addEventListener('mouseleave', this.handleTabLeave.bind(this));
        });

        // Handle overview card clicks
        const overviewCards = document.querySelectorAll('.overview-card');
        overviewCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const companyClass = Array.from(card.classList).find(cls => cls.includes('-themed'));
                if (companyClass) {
                    const company = companyClass.replace('-themed', '');
                    const targetTab = this.getTabFromCompany(company);
                    if (targetTab) {
                        this.switchTab(targetTab, tabButtons, contentPanels);
                    }
                }
            });
        });
    }

    getTabFromCompany(company) {
        const mapping = {
            'microsoft': 'microsoft',
            'amazon': 'amazon',
            'quantumscape': 'quantumscape',
            'meta': 'meta',
            'uber': 'uber',
            'fluence': 'fluence',
            'sweetgreen': 'sweetgreen',
            'alphabet': 'alphabet'
        };
        return mapping[company];
    }

    switchTab(targetTab, tabButtons, contentPanels) {
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        contentPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });

        // Add active class to target button and panel
        const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetPanel = document.getElementById(`${targetTab}-panel`);

        if (targetButton && targetPanel) {
            targetButton.classList.add('active');
            targetButton.setAttribute('aria-selected', 'true');
            
            targetPanel.classList.add('active');
            targetPanel.setAttribute('aria-hidden', 'false');
            
            this.currentTab = targetTab;
            
            // Trigger entrance animations for the new panel
            this.animateTabContent(targetPanel);
            
            // Setup specific interactions based on tab
            this.setupTabSpecificInteractions(targetTab);
            
            // Log analytics
            this.logTabInteraction(targetTab);
            
            // Update URL hash
            window.location.hash = targetTab;
        }
    }

    handleTabHover(event) {
        const button = event.currentTarget;
        
        if (!button.classList.contains('active')) {
            button.style.transform = 'translateY(-2px) scale(1.02)';
            button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }
    }

    handleTabLeave(event) {
        const button = event.currentTarget;
        
        if (!button.classList.contains('active')) {
            button.style.transform = '';
            button.style.boxShadow = '';
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
        }
    }

    handleSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        
        if (query.length >= 2) {
            this.debounce(() => {
                this.performSearch(query);
            }, 300);
        } else {
            this.clearSearchHighlights();
        }
    }

    performSearch(query) {
        this.clearSearchHighlights();
        
        if (!query) return;

        const results = this.searchInContent(query);
        
        if (results.length > 0) {
            this.highlightSearchResults(results);
            this.showSearchSuggestions(results);
        } else {
            this.showNoResults();
        }
        
        this.logSearchInteraction(query, results.length);
    }

    searchInContent(query) {
        const results = [];
        
        // Search in company data
        this.searchData.companies.forEach(company => {
            if (company.name.toLowerCase().includes(query) || 
                company.keywords.some(keyword => keyword.includes(query))) {
                results.push({
                    type: 'company',
                    company: company.tab,
                    match: company.name,
                    relevance: 10
                });
            }
        });

        // Search in metrics
        this.searchData.metrics.forEach(metric => {
            if (metric.term.includes(query)) {
                metric.companies.forEach(company => {
                    results.push({
                        type: 'metric',
                        company: company,
                        match: metric.term,
                        relevance: 8
                    });
                });
            }
        });

        // Search in text content
        const textElements = document.querySelectorAll('.metric-label, .metric-value, .innovation-content h4, .risk-title');
        textElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                const company = this.getCompanyFromElement(element);
                results.push({
                    type: 'content',
                    company: company,
                    element: element,
                    match: element.textContent,
                    relevance: 5
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    getCompanyFromElement(element) {
        const panel = element.closest('.content-panel');
        if (panel) {
            const id = panel.id;
            return id.replace('-panel', '');
        }
        return 'overview';
    }

    highlightSearchResults(results) {
        results.forEach(result => {
            if (result.element) {
                this.highlightText(result.element, result.match);
            }
        });
    }

    highlightText(element, searchTerm) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="search-highlight">$1</span>');
        element.innerHTML = highlightedText;
    }

    clearSearchHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    showSearchSuggestions(results) {
        // Group results by company
        const companySuggestions = {};
        results.forEach(result => {
            if (!companySuggestions[result.company]) {
                companySuggestions[result.company] = [];
            }
            companySuggestions[result.company].push(result);
        });

        // Show suggestions for top companies
        const topCompanies = Object.keys(companySuggestions).slice(0, 3);
        if (topCompanies.length > 0) {
            this.showSearchTooltip(topCompanies);
        }
    }

    showSearchTooltip(companies) {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'search-suggestions';
        tooltip.innerHTML = `
            <div class="suggestions-header">Suggestions:</div>
            ${companies.map(company => `
                <div class="suggestion-item" data-company="${company}">
                    ${this.getCompanyDisplayName(company)}
                </div>
            `).join('')}
        `;

        // Style the tooltip
        Object.assign(tooltip.style, {
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-base)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '1000',
            marginTop: '4px'
        });

        // Add click handlers
        tooltip.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const company = item.getAttribute('data-company');
                this.switchToCompany(company);
                this.hideSearchSuggestions();
            });
        });

        searchInput.parentElement.appendChild(tooltip);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideSearchSuggestions();
        }, 5000);
    }

    hideSearchSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }

    getCompanyDisplayName(company) {
        const mapping = {
            'microsoft': 'Microsoft Q3 2025',
            'amazon': 'Amazon Q1 2025',
            'quantumscape': 'QuantumScape Q1 2025',
            'meta': 'Meta Q1 2025',
            'uber': 'Uber Q1 2025',
            'fluence': 'Fluence Q2 2025',
            'sweetgreen': 'Sweetgreen Q1 2025',
            'alphabet': 'Alphabet Q1 2025'
        };
        return mapping[company] || company;
    }

    switchToCompany(company) {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const contentPanels = document.querySelectorAll('.content-panel');
        this.switchTab(company, tabButtons, contentPanels);
    }

    showNoResults() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.style.borderColor = 'var(--color-warning)';
            setTimeout(() => {
                searchInput.style.borderColor = '';
            }, 2000);
        }
    }

    setupMetricInteractions() {
        const metricCards = document.querySelectorAll('.metric-card, .overview-card');
        
        metricCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('mouseenter', this.handleMetricHover.bind(this));
            card.addEventListener('mouseleave', this.handleMetricLeave.bind(this));
            card.addEventListener('click', this.handleMetricClick.bind(this));
            card.addEventListener('keydown', this.handleMetricKeydown.bind(this));
        });

        // Setup innovation items interactions
        const innovationItems = document.querySelectorAll('.innovation-item, .risk-item');
        innovationItems.forEach(item => {
            item.addEventListener('mouseenter', this.handleInnovationHover.bind(this));
            item.addEventListener('mouseleave', this.handleInnovationLeave.bind(this));
        });
    }

    handleMetricHover(event) {
        const card = event.currentTarget;
        
        // Enhanced hover effect with company-specific styling
        card.style.transform = 'translateY(-4px) scale(1.02)';
        
        // Add company-specific glow
        const companyTheme = this.getCardCompanyTheme(card);
        this.applyCompanyGlow(card, companyTheme);

        // Show detailed tooltip if data-tooltip exists
        const tooltipText = card.getAttribute('data-tooltip');
        if (tooltipText) {
            this.showDetailedTooltip(card, tooltipText);
        }
        
        // Highlight related metrics
        this.highlightRelatedMetrics(card);
    }

    handleMetricLeave(event) {
        const card = event.currentTarget;
        
        // Reset transformations
        card.style.transform = '';
        card.style.boxShadow = '';
        
        // Hide tooltip
        this.hideTooltip();
        
        // Reset related metrics
        this.resetRelatedMetrics();
    }

    handleMetricClick(event) {
        const card = event.currentTarget;
        
        // Company-themed click animation
        const companyTheme = this.getCardCompanyTheme(card);
        this.applyClickAnimation(card, companyTheme);
        
        // Log interaction
        this.logMetricInteraction(card);
        
        // Highlight metric temporarily
        this.highlightMetricTemporarily(card);
        
        // Show detailed info if available
        this.showMetricDetails(card);
    }

    handleMetricKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleMetricClick(event);
        }
    }

    handleInnovationHover(event) {
        const item = event.currentTarget;
        
        item.style.transform = 'translateX(8px) scale(1.02)';
        
        if (item.classList.contains('risk-item')) {
            const riskLevel = item.classList.contains('high') ? 'high' : 
                            item.classList.contains('medium') ? 'medium' : 'low';
            this.applyRiskHover(item, riskLevel);
        } else {
            item.style.boxShadow = '0 4px 16px rgba(33, 128, 141, 0.2)';
        }
    }

    handleInnovationLeave(event) {
        const item = event.currentTarget;
        
        item.style.transform = '';
        item.style.boxShadow = '';
        item.style.borderLeftColor = '';
        item.style.borderLeftWidth = '';
    }

    getCardCompanyTheme(card) {
        const panel = card.closest('.content-panel');
        if (panel) {
            const id = panel.id;
            return id.replace('-panel', '');
        }
        
        // Check overview card themes
        const themes = ['microsoft', 'amazon', 'quantumscape', 'meta', 'uber', 'fluence', 'sweetgreen', 'alphabet'];
        for (const theme of themes) {
            if (card.classList.contains(`${theme}-themed`)) {
                return theme;
            }
        }
        
        return 'default';
    }

    applyCompanyGlow(card, theme) {
        const glowColors = {
            'microsoft': '0 8px 32px rgba(0, 120, 212, 0.25)',
            'amazon': '0 8px 32px rgba(255, 153, 0, 0.25)',
            'quantumscape': '0 8px 32px rgba(46, 204, 113, 0.25)',
            'meta': '0 8px 32px rgba(66, 103, 178, 0.25)',
            'uber': '0 8px 32px rgba(9, 9, 26, 0.25)',
            'fluence': '0 8px 32px rgba(0, 180, 216, 0.25)',
            'sweetgreen': '0 8px 32px rgba(0, 204, 102, 0.25)',
            'alphabet': '0 8px 32px rgba(66, 133, 244, 0.25)',
            'default': '0 8px 32px rgba(33, 128, 141, 0.25)'
        };
        
        card.style.boxShadow = glowColors[theme] || glowColors['default'];
    }

    applyClickAnimation(card, theme) {
        const animations = {
            'microsoft': 'microsoftPulse 0.6s ease-in-out',
            'amazon': 'amazonPulse 0.6s ease-in-out',
            'quantumscape': 'quantumscapePulse 0.6s ease-in-out',
            'meta': 'metaPulse 0.6s ease-in-out',
            'uber': 'uberPulse 0.6s ease-in-out',
            'fluence': 'fluencePulse 0.6s ease-in-out',
            'sweetgreen': 'sweetgreenPulse 0.6s ease-in-out',
            'alphabet': 'alphabetPulse 0.6s ease-in-out',
            'default': 'genericPulse 0.6s ease-in-out'
        };
        
        card.style.animation = animations[theme] || animations['default'];
        
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }

    applyRiskHover(item, level) {
        const colors = {
            'high': 'var(--color-error)',
            'medium': 'var(--color-warning)',
            'low': 'var(--color-info)'
        };
        
        item.style.borderLeftColor = colors[level];
        item.style.borderLeftWidth = '6px';
        item.style.boxShadow = `0 4px 16px ${colors[level]}33`;
    }

    setupTooltips() {
        // Enhanced tooltip system for detailed information
        this.tooltipData = {
            'microsoft': {
                'revenue': 'Croissance record de 13% YoY portée par Azure et l\'IA',
                'azure': 'Azure croît de 33% avec 16 points de contribution de l\'IA',
                'cloud': 'Microsoft Cloud atteint $42.4B avec des marges robustes',
                'cash': 'Génération de cash impactée par les investissements IA'
            },
            'amazon': {
                'revenue': 'Croissance solide de 9% avec AWS en moteur',
                'aws': 'AWS affiche des marges record de 39.5%',
                'prime': '170M de membres Prime (+14% YoY)',
                'advertising': 'Publicité en forte croissance de 19%'
            }
            // Add more tooltip data for other companies...
        };
    }

    showDetailedTooltip(element, text) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip show';
        tooltip.innerHTML = text;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 15;
        
        // Adjust if tooltip would go off-screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 15;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        this.currentTooltip = tooltip;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideTooltip();
        }, 5000);
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    highlightRelatedMetrics(activeCard) {
        const section = activeCard.closest('.content-panel') || activeCard.closest('.overview-grid');
        if (section) {
            const allMetrics = section.querySelectorAll('.metric-card, .overview-card');
            allMetrics.forEach(metric => {
                if (metric !== activeCard) {
                    metric.style.opacity = '0.6';
                    metric.style.filter = 'grayscale(30%)';
                }
            });
        }
    }

    resetRelatedMetrics() {
        const allMetrics = document.querySelectorAll('.metric-card, .overview-card');
        allMetrics.forEach(metric => {
            metric.style.opacity = '';
            metric.style.filter = '';
        });
    }

    highlightMetricTemporarily(card) {
        const theme = this.getCardCompanyTheme(card);
        const borderColors = {
            'microsoft': 'var(--microsoft-blue)',
            'amazon': 'var(--amazon-orange)',
            'quantumscape': 'var(--quantumscape-green)',
            'meta': 'var(--meta-blue)',
            'uber': 'var(--uber-black)',
            'fluence': 'var(--fluence-cyan)',
            'sweetgreen': 'var(--sweetgreen-green)',
            'alphabet': 'var(--alphabet-blue)',
            'default': 'var(--color-primary)'
        };
        
        const originalBorder = card.style.border;
        const originalOutline = card.style.outline;
        
        card.style.border = `3px solid ${borderColors[theme] || borderColors['default']}`;
        card.style.outline = `2px solid ${borderColors[theme] || borderColors['default']}66`;
        card.style.outlineOffset = '2px';
        
        setTimeout(() => {
            card.style.border = originalBorder;
            card.style.outline = originalOutline;
            card.style.outlineOffset = '';
        }, 2500);
    }

    showMetricDetails(card) {
        const value = card.querySelector('.metric-value, .metric-highlight')?.textContent;
        const label = card.querySelector('.metric-label, .card-header h3')?.textContent;
        
        if (value && label) {
            this.logDetailedMetricView(label, value);
        }
    }

    setupExport() {
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', this.exportToJSON.bind(this));
        }
    }

    exportToJSON() {
        const data = this.gatherApplicationData();
        const jsonString = JSON.stringify(data, null, 2);
        
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-giants-analysis-${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success feedback
        this.showExportSuccess();
        this.logExportAction();
    }

    gatherApplicationData() {
        const data = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            companies: {},
            overview: this.extractOverviewData(),
            metadata: {
                totalCompanies: 8,
                quarters: ['Q1 2025', 'Q2 2025', 'Q3 2025'],
                sectors: ['Technology', 'Cloud', 'E-commerce', 'Automotive', 'Energy', 'Food']
            }
        };

        // Extract data for each company
        const companies = ['microsoft', 'amazon', 'quantumscape', 'meta', 'uber', 'fluence', 'sweetgreen', 'alphabet'];
        companies.forEach(company => {
            data.companies[company] = this.extractCompanyData(company);
        });

        return data;
    }

    extractOverviewData() {
        const overviewCards = document.querySelectorAll('.overview-card');
        const overview = {};
        
        overviewCards.forEach(card => {
            const title = card.querySelector('.card-header h3')?.textContent;
            const performance = card.querySelector('.performance-indicator')?.textContent;
            const highlight = card.querySelector('.metric-highlight')?.textContent;
            const detail = card.querySelector('.metric-detail')?.textContent;
            
            if (title) {
                overview[title] = {
                    performance: performance,
                    revenue: highlight,
                    detail: detail
                };
            }
        });
        
        return overview;
    }

    extractCompanyData(company) {
        const panel = document.getElementById(`${company}-panel`);
        if (!panel) return null;

        const data = {
            name: panel.querySelector('h2')?.textContent,
            revenue: panel.querySelector('.revenue-highlight')?.textContent,
            tagline: panel.querySelector('.company-tagline')?.textContent,
            metrics: {},
            innovations: [],
            segments: {},
            risks: []
        };

        // Extract metrics
        const metricCards = panel.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            const value = card.querySelector('.metric-value')?.textContent;
            const label = card.querySelector('.metric-label')?.textContent;
            const detail = card.querySelector('.metric-detail')?.textContent;
            
            if (label && value) {
                data.metrics[label] = {
                    value: value,
                    detail: detail,
                    highlighted: card.classList.contains('highlight')
                };
            }
        });

        // Extract innovations
        const innovationItems = panel.querySelectorAll('.innovation-item');
        innovationItems.forEach(item => {
            const title = item.querySelector('h4')?.textContent;
            const description = item.querySelector('p')?.textContent;
            
            if (title) {
                data.innovations.push({
                    title: title,
                    description: description
                });
            }
        });

        // Extract segments
        const segmentCards = panel.querySelectorAll('.segment-card, .tech-card, .expansion-card');
        segmentCards.forEach(card => {
            const title = card.querySelector('h4, .tech-header, .expansion-header')?.textContent;
            const value = card.querySelector('.segment-value, .tech-value, .expansion-value')?.textContent;
            const details = card.querySelector('.segment-details, .tech-detail, .expansion-detail')?.textContent;
            
            if (title && value) {
                data.segments[title] = {
                    value: value,
                    details: details
                };
            }
        });

        // Extract risks
        const riskItems = panel.querySelectorAll('.risk-item');
        riskItems.forEach(item => {
            const level = item.querySelector('.risk-level')?.textContent;
            const title = item.querySelector('.risk-title')?.textContent;
            const description = item.querySelector('.risk-desc')?.textContent;
            
            if (title) {
                data.risks.push({
                    level: level,
                    title: title,
                    description: description
                });
            }
        });

        return data;
    }

    showExportSuccess() {
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = '✅ Exporté!';
            exportBtn.style.background = 'var(--color-success)';
            
            setTimeout(() => {
                exportBtn.textContent = originalText;
                exportBtn.style.background = '';
            }, 2000);
        }
    }

    setupPresentationMode() {
        const presentationBtn = document.getElementById('presentation-btn');
        if (presentationBtn) {
            presentationBtn.addEventListener('click', this.togglePresentationMode.bind(this));
        }

        // Escape key to exit presentation mode
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.presentationMode) {
                this.exitPresentationMode();
            }
        });
    }

    togglePresentationMode() {
        if (this.presentationMode) {
            this.exitPresentationMode();
        } else {
            this.enterPresentationMode();
        }
    }

    enterPresentationMode() {
        this.presentationMode = true;
        document.body.classList.add('presentation-mode');
        
        // Create presentation controls
        this.createPresentationControls();
        
        // Start presentation sequence
        this.startPresentationSequence();
        
        this.logPresentationStart();
    }

    exitPresentationMode() {
        this.presentationMode = false;
        document.body.classList.remove('presentation-mode');
        
        // Remove presentation controls
        const controls = document.querySelector('.presentation-controls');
        if (controls) {
            controls.remove();
        }
        
        // Stop presentation sequence
        this.stopPresentationSequence();
        
        this.logPresentationEnd();
    }

    createPresentationControls() {
        const controls = document.createElement('div');
        controls.className = 'presentation-controls';
        controls.innerHTML = `
            <button class="btn btn--secondary" id="prev-slide">← Précédent</button>
            <button class="btn btn--secondary" id="next-slide">Suivant →</button>
            <button class="btn btn--primary" id="exit-presentation">✕ Sortir</button>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        controls.querySelector('#prev-slide').addEventListener('click', this.previousSlide.bind(this));
        controls.querySelector('#next-slide').addEventListener('click', this.nextSlide.bind(this));
        controls.querySelector('#exit-presentation').addEventListener('click', this.exitPresentationMode.bind(this));
    }

    startPresentationSequence() {
        this.presentationSlides = ['overview', 'microsoft', 'amazon', 'quantumscape', 'meta', 'uber', 'fluence', 'sweetgreen', 'alphabet'];
        this.currentSlideIndex = 0;
        
        // Auto-advance slides every 10 seconds
        this.presentationInterval = setInterval(() => {
            this.nextSlide();
        }, 10000);
    }

    stopPresentationSequence() {
        if (this.presentationInterval) {
            clearInterval(this.presentationInterval);
            this.presentationInterval = null;
        }
    }

    nextSlide() {
        if (this.currentSlideIndex < this.presentationSlides.length - 1) {
            this.currentSlideIndex++;
        } else {
            this.currentSlideIndex = 0; // Loop back to start
        }
        this.showPresentationSlide();
    }

    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
        } else {
            this.currentSlideIndex = this.presentationSlides.length - 1; // Loop to end
        }
        this.showPresentationSlide();
    }

    showPresentationSlide() {
        const targetTab = this.presentationSlides[this.currentSlideIndex];
        const tabButtons = document.querySelectorAll('.nav-tab');
        const contentPanels = document.querySelectorAll('.content-panel');
        this.switchTab(targetTab, tabButtons, contentPanels);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('search-input')?.focus();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportToJSON();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.togglePresentationMode();
                        break;
                }
            }
            
            // Tab navigation without Ctrl
            if (!e.ctrlKey && !e.metaKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        if (this.presentationMode) {
                            e.preventDefault();
                            this.previousSlide();
                        }
                        break;
                    case 'ArrowRight':
                        if (this.presentationMode) {
                            e.preventDefault();
                            this.nextSlide();
                        }
                        break;
                }
            }
        });

        // Number keys for quick tab switching
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                const tabIndex = parseInt(e.key);
                const tabs = ['overview', 'microsoft', 'amazon', 'quantumscape', 'meta', 'uber', 'fluence', 'sweetgreen', 'alphabet'];
                if (tabs[tabIndex]) {
                    const tabButtons = document.querySelectorAll('.nav-tab');
                    const contentPanels = document.querySelectorAll('.content-panel');
                    this.switchTab(tabs[tabIndex], tabButtons, contentPanels);
                }
            }
        });
    }

    setupResponsiveHandlers() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        this.handleResize();
    }

    handleResize() {
        const width = window.innerWidth;
        
        if (width < 768) {
            document.body.classList.add('mobile-layout');
            this.optimizeForMobile();
        } else {
            document.body.classList.remove('mobile-layout');
        }
        
        // Hide tooltips on resize
        this.hideTooltip();
        this.hideSearchSuggestions();
    }

    optimizeForMobile() {
        // Adjust search container for mobile
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && window.innerWidth < 480) {
            searchContainer.style.flexDirection = 'column';
            searchContainer.style.width = '100%';
        }
        
        // Adjust navigation tabs for mobile
        const navigation = document.querySelector('.main-navigation');
        if (navigation && window.innerWidth < 768) {
            navigation.style.flexDirection = 'column';
        }
    }

    animateTabContent(panel) {
        const elements = panel.querySelectorAll('.section, .overview-card, .metric-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupTabSpecificInteractions(tab) {
        // Setup specific interactions based on the current tab
        switch (tab) {
            case 'overview':
                this.setupOverviewInteractions();
                break;
            case 'microsoft':
                this.setupMicrosoftInteractions();
                break;
            case 'amazon':
                this.setupAmazonInteractions();
                break;
            // Add specific interactions for other companies as needed
        }
    }

    setupOverviewInteractions() {
        // Add special hover effects for overview cards
        const overviewCards = document.querySelectorAll('.overview-card');
        overviewCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Dim other cards
                overviewCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.style.opacity = '0.7';
                        otherCard.style.transform = 'scale(0.98)';
                    }
                });
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset all cards
                overviewCards.forEach(otherCard => {
                    otherCard.style.opacity = '';
                    otherCard.style.transform = '';
                });
            });
        });
    }

    setupMicrosoftInteractions() {
        // Microsoft-specific interactions
        const azureMetrics = document.querySelectorAll('#microsoft-panel .metric-card');
        azureMetrics.forEach(card => {
            const label = card.querySelector('.metric-label')?.textContent;
            if (label && label.toLowerCase().includes('azure')) {
                card.style.borderLeft = '4px solid var(--microsoft-blue)';
            }
        });
    }

    setupAmazonInteractions() {
        // Amazon-specific interactions
        const awsMetrics = document.querySelectorAll('#amazon-panel .metric-card');
        awsMetrics.forEach(card => {
            const label = card.querySelector('.metric-label')?.textContent;
            if (label && label.toLowerCase().includes('aws')) {
                card.style.borderLeft = '4px solid var(--amazon-orange)';
            }
        });
    }

    setupAnimations() {
        // Add dynamic CSS animations
        if (!document.getElementById('dynamic-animations')) {
            const style = document.createElement('style');
            style.id = 'dynamic-animations';
            style.textContent = `
                @keyframes microsoftPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(0, 120, 212, 0.4); }
                }
                
                @keyframes amazonPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(255, 153, 0, 0.4); }
                }
                
                @keyframes quantumscapePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(46, 204, 113, 0.4); }
                }
                
                @keyframes metaPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(66, 103, 178, 0.4); }
                }
                
                @keyframes uberPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(9, 9, 26, 0.4); }
                }
                
                @keyframes fluencePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(0, 180, 216, 0.4); }
                }
                
                @keyframes sweetgreenPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(0, 204, 102, 0.4); }
                }
                
                @keyframes alphabetPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(66, 133, 244, 0.4); }
                }
                
                @keyframes genericPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(33, 128, 141, 0.4); }
                }
                
                .search-suggestions {
                    animation: slideInDown 0.3s ease-out;
                }
                
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .suggestion-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                
                .suggestion-item:hover {
                    background-color: var(--color-secondary-hover);
                }
                
                .suggestions-header {
                    padding: 8px 12px;
                    font-weight: 600;
                    color: var(--color-text-secondary);
                    border-bottom: 1px solid var(--color-border);
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupAccessibility() {
        // Enhanced accessibility features
        const tabsContainer = document.querySelector('.main-navigation');
        if (tabsContainer) {
            tabsContainer.setAttribute('role', 'tablist');
            tabsContainer.setAttribute('aria-label', 'Navigation principale de l\'analyse financière');
        }

        // Add ARIA labels to metric cards
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            const value = card.querySelector('.metric-value')?.textContent;
            const label = card.querySelector('.metric-label')?.textContent;
            if (value && label) {
                card.setAttribute('aria-label', `Métrique: ${value} ${label}`);
            }
        });

        // Add skip links
        this.addSkipLinks();
        
        // Announce tab changes to screen readers
        this.setupScreenReaderAnnouncements();
    }

    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Aller au contenu principal</a>
            <a href="#navigation" class="skip-link">Aller à la navigation</a>
        `;
        
        // Style skip links
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 10000;
            }
            
            .skip-link {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }
            
            .skip-link:focus {
                position: static;
                width: auto;
                height: auto;
                padding: 8px 16px;
                background: var(--color-primary);
                color: white;
                text-decoration: none;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-announcements';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    loadInitialData() {
        // Load from URL hash if present
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(`${hash}-panel`)) {
            const tabButtons = document.querySelectorAll('.nav-tab');
            const contentPanels = document.querySelectorAll('.content-panel');
            this.switchTab(hash, tabButtons, contentPanels);
        }
        
        // Initialize metric counters
        this.initializeCounters();
        
        // Show welcome message
        setTimeout(() => {
            this.showWelcomeTooltip();
        }, 1000);
    }

    initializeCounters() {
        // Animate metric values on page load
        const metricValues = document.querySelectorAll('.metric-value, .metric-highlight');
        metricValues.forEach(value => {
            const text = value.textContent;
            const number = parseFloat(text.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(number) && number > 0) {
                this.animateCounter(value, 0, number, text);
            }
        });
    }

    animateCounter(element, start, end, originalText) {
        const duration = 1500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end * easeOutQuart);
            
            // Update the text while preserving original formatting
            const formattedValue = originalText.replace(/[\d.-]+/, Math.round(current));
            element.textContent = formattedValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText;
            }
        };
        
        requestAnimationFrame(animate);
    }

    showWelcomeTooltip() {
        const firstTab = document.querySelector('.nav-tab[data-tab="overview"]');
        if (firstTab) {
            this.showDetailedTooltip(firstTab, 'Bienvenue dans l\'analyse financière détaillée des 8 Tech Giants. Utilisez Ctrl+K pour rechercher, Ctrl+P pour le mode présentation.');
        }
    }

    // Utility functions
    debounce(func, wait) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(func, wait);
    }

    // Logging and Analytics
    logAppStart() {
        console.log('🚀 Tech Giants Analytics Dashboard Started', {
            timestamp: new Date().toISOString(),
            companies: 8,
            features: ['Tab Navigation', 'Search', 'Export', 'Presentation Mode', 'Tooltips'],
            version: '1.0.0',
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    logTabInteraction(tabName) {
        console.log(`📊 Tab Navigation: ${tabName}`, {
            timestamp: new Date().toISOString(),
            previousTab: this.currentTab,
            newTab: tabName,
            device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        });
        
        this.announceToScreenReader(`Affiché: ${this.getCompanyDisplayName(tabName)}`);
    }

    logMetricInteraction(card) {
        const value = card.querySelector('.metric-value, .metric-highlight')?.textContent;
        const label = card.querySelector('.metric-label, .card-header h3')?.textContent;
        const company = this.getCardCompanyTheme(card);
        
        console.log('🎯 Metric Interaction', {
            timestamp: new Date().toISOString(),
            company: company,
            metric: { value, label },
            currentTab: this.currentTab
        });
    }

    logDetailedMetricView(label, value) {
        console.log('📈 Detailed Metric View', {
            timestamp: new Date().toISOString(),
            metric: label,
            value: value,
            company: this.currentTab
        });
    }

    logSearchInteraction(query, resultsCount) {
        console.log('🔍 Search Performed', {
            timestamp: new Date().toISOString(),
            query: query,
            resultsCount: resultsCount,
            currentTab: this.currentTab
        });
    }

    logExportAction() {
        console.log('📤 Data Export', {
            timestamp: new Date().toISOString(),
            format: 'JSON',
            companies: 8,
            currentTab: this.currentTab
        });
    }

    logPresentationStart() {
        console.log('🎯 Presentation Mode Started', {
            timestamp: new Date().toISOString(),
            slides: this.presentationSlides?.length || 0
        });
    }

    logPresentationEnd() {
        console.log('📊 Presentation Mode Ended', {
            timestamp: new Date().toISOString(),
            duration: this.presentationStartTime ? Date.now() - this.presentationStartTime : 0
        });
    }

    // Public API methods
    switchToOverview() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const contentPanels = document.querySelectorAll('.content-panel');
        this.switchTab('overview', tabButtons, contentPanels);
    }

    searchFor(query) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = query;
            this.performSearch(query);
        }
    }

    exportData() {
        return this.gatherApplicationData();
    }

    getApplicationStats() {
        return {
            currentTab: this.currentTab,
            presentationMode: this.presentationMode,
            totalMetrics: document.querySelectorAll('.metric-card').length,
            totalInnovations: document.querySelectorAll('.innovation-item').length,
            totalRisks: document.querySelectorAll('.risk-item').length
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TechGiantsAnalyticsDashboard();
    
    // Make app instance globally available
    window.techGiantsApp = app;
    
    // Setup global utilities and shortcuts
    window.techGiantsUtils = {
        // Navigation shortcuts
        showOverview: () => app.switchToOverview(),
        showMicrosoft: () => app.switchToCompany('microsoft'),
        showAmazon: () => app.switchToCompany('amazon'),
        showQuantumScape: () => app.switchToCompany('quantumscape'),
        showMeta: () => app.switchToCompany('meta'),
        showUber: () => app.switchToCompany('uber'),
        showFluence: () => app.switchToCompany('fluence'),
        showSweetgreen: () => app.switchToCompany('sweetgreen'),
        showAlphabet: () => app.switchToCompany('alphabet'),
        
        // Feature shortcuts
        search: (query) => app.searchFor(query),
        export: () => app.exportToJSON(),
        presentation: () => app.togglePresentationMode(),
        
        // Data access
        getData: () => app.exportData(),
        getStats: () => app.getApplicationStats(),
        
        // Utility functions
        print: () => window.print(),
        
        // Theme switching
        switchTheme: (theme) => {
            document.documentElement.setAttribute('data-color-scheme', theme);
            console.log(`🎨 Theme switched to: ${theme}`);
        },
        
        // Keyboard shortcuts help
        showHelp: () => {
            console.log('⌨️ Keyboard Shortcuts:', {
                'Ctrl/Cmd + K': 'Focus search',
                'Ctrl/Cmd + P': 'Toggle presentation mode',
                'Ctrl/Cmd + E': 'Export data',
                'Alt + 0-9': 'Switch to tab by number',
                'Arrow Keys': 'Navigate in presentation mode',
                'Escape': 'Exit presentation mode'
            });
        }
    };
    
    // Add header animation
    const header = document.querySelector('.app-header');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Performance monitoring
    const loadTime = performance.now();
    console.log(`⚡ Application loaded in ${Math.round(loadTime)}ms`);
    
    // Log paint timing if available
    if (performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
        });
    }
    
    // Service Worker registration for future enhancements
    if ('serviceWorker' in navigator) {
        console.log('💡 Service Worker support available for future offline functionality');
    }
    
    // Welcome message
    console.log('🎉 Welcome to Tech Giants Analytics Dashboard!');
    console.log('💡 Type techGiantsUtils.showHelp() for keyboard shortcuts');
    console.log('📊 Ready for financial analysis exploration');
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    const hash = window.location.hash.slice(1);
    if (hash && window.techGiantsApp) {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const contentPanels = document.querySelectorAll('.content-panel');
        window.techGiantsApp.switchTab(hash, tabButtons, contentPanels);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Application Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString()
    });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', {
        reason: event.reason,
        timestamp: new Date().toISOString()
    });
});