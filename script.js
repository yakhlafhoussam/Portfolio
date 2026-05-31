(function () {
    // DOM elements
    const outputContainer = document.getElementById('termOutputArea');
    const inputField = document.getElementById('gnomeTermInput');

    // Storage key for command history ONLY (no HTML output, no replay on refresh)
    const HISTORY_STORAGE_KEY = "gnome_terminal_cmd_history";
    let commandHistory = [];      // stores raw command strings for up/down navigation
    let historyIndex = -1;        // for up/down navigation

    // Flag to prevent re-adding same command multiple times
    let isRestoringHistory = false;

    // ---- COMMANDS DATABASE (with download-cv) ----
    const COMMANDS = {
        help: `
<span class="text-green">Available commands:</span>

  <span class="text-blue">about</span>                —  Biography & current focus
  <span class="text-blue">whoami</span>               —  Alias for about
  <span class="text-blue">skills</span>               —  Tech stack & toolchain
  <span class="text-blue">projects</span>             —  Featured project list
  <span class="text-blue">experience</span>           —  Journey & milestones
  <span class="text-blue">contact</span>              —  Email & profiles
  <span class="text-blue">ls</span>                   —  List available sections
  <span class="text-blue">open &lt;project&gt;</span>       —  Show project details
  <span class="text-blue">download-cv</span>          —  Download CV (HYK_CV.pdf)
  <span class="text-blue">clear</span>                —  Clear terminal screen
  <span class="text-blue">history</span>              —  Show command history (saved in localStorage)
  <span class="text-blue">save</span>                 —  Manual history save

<span class="text-dim">Examples: open debuggers , download-cv</span>`,

        about: `
<span class="text-green">[ about ] — Developer Profile</span>

<span class="text-blue">Name</span>        : Houssam YAKHLAF
<span class="text-blue">Role</span>        : Web FullStack Developer
<span class="text-blue">Location</span>    : Morocco
<span class="text-blue">Education</span>   : YouCode — Full Stack Development
<span class="text-blue">Status</span>      : Building production apps & learning daily

<span class="text-dim">Passionate about crafting scalable web platforms, automation,</span>`,

        whoami: `
<span class="text-green">whoami → Houssam YAKHLAF (HYK)</span>
<span class="text-dim">Web Full Stack Developer, YouCode student, open for collaboration.</span>`,

        skills: `
<span class="text-green">[ Tech Stack ]</span>

<span class="text-blue">Frontend</span>           : HTML5, CSS3, Tailwind, JavaScript (ES6+), VueJS, Angular
<span class="text-blue">Backend</span>            : PHP, Laravel, Spring Boot
<span class="text-blue">Database</span>           : Firebase, MySQL, PostgreSQL
<span class="text-blue">Tools</span>              : Git, GitHub, Docker, Postman, Linux, AWS, Vercel
<span class="text-blue">Methodologies</span>      : Agile (Scrum, Kanban), UML, CI/CD

<span class="text-dim">Always expanding the toolkit.</span>`,

        projects: `
<span class="text-green">[ Featured Projects ]</span>

  <span class="text-cyan">→</span> <span class="text-green">HYK</span>  — Origin of a Developer HYK

  <span class="text-cyan">→</span> <span class="text-green">DebuGGers</span>  — LMS platform (200+ videos, progress tracking, notes)

  <span class="text-cyan">→</span> <span class="text-green">BlackWave</span>  — Dark Web simulation & cybersecurity awareness platform

  <span class="text-cyan">→</span> <span class="text-green">PixelQuest</span> — Video game discovery platform with API integration

  <span class="text-cyan">→</span> <span class="text-green">EasyColoc</span>  — Housing and roommate management solution

  <span class="text-cyan">→</span> <span class="text-green">LocalPoint</span> — Location-based community Q&A platform

  <span class="text-cyan">→</span> <span class="text-green">EchoBlog</span>   — Content publishing and blogging platform

  <span class="text-cyan">→</span> <span class="text-green">Simplon</span>    — Educational and training management application

  <span class="text-cyan">→</span> <span class="text-green">WorkSphere</span> — Interactive workforce and office management system

  <span class="text-cyan">→</span> <span class="text-green">E-Dirham</span>   — Digital currency awareness and information platform

<span class="text-dim">Type 'open &lt;project-name&gt;' for full details.</span>`,

        experience: `
<span class="text-green">[ Experience Timeline ]</span>

<span class="text-blue">2025 · present</span>    → YOUCODE (UM6P), SAFI : Développeur Web Full Stack
<span class="text-blue">2024 · present</span>    → Université Cadi Ayyad, SAFI : Études Anglaises
<span class="text-blue">2023 · 2024</span>       → Lycée Mohamed Belhcen El Ouazzani, SAFI : BAC Sciences Physiques – Option Français

<span class="text-dim">Continuous learning and shipping real-world solutions.</span>`,

        contact: `
<span class="text-green">[ Contact ]</span>

<span class="text-blue">email</span>     : yakhlafhoussam@gmail.com
<span class="text-blue">github</span>    : github.com/yakhlafhoussam
<span class="text-blue">linkedin</span>  : linkedin.com/in/houssam-yakhlaf
<span class="text-blue">phone</span>     : +212 615-940605
<span class="text-blue">location</span>  : Morocco

<span class="text-dim">Available for collaboration & freelance projects.</span>`,

        ls: `<span class="text-green">about  whoami  skills  projects  experience  contact  download-cv  open  help  history</span>`,

        save: `<span class="text-green">[✓]</span> Command history saved to local storage (${commandHistory.length} commands).`,

        "download-cv": `<span class="text-green">⬇️ Downloading HYK_CV.pdf ...</span>`,

        history: function () {
            if (commandHistory.length === 0) {
                return `<span class="text-dim">No commands in history yet.</span>`;
            }
            let output = `<span class="text-green">Command history (most recent last):</span>\n`;
            commandHistory.forEach((cmd, idx) => {
                output += `  <span class="text-blue">${idx + 1}</span>  ${escapeHtml(cmd)}\n`;
            });
            return output;
        }
    };

    // Projects details
    const PROJECTS = {
        "hyk": `
<span class="text-green">[ HYK Story ] — Cinematic 3D Portfolio Experience</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : React, Three.js, React Three Fiber, Tailwind CSS
<span class="text-blue">Features</span>     : 3D environments, interactive camera, cinematic transitions, terminal OS, animated storytelling
<span class="text-blue">Purpose</span>      : Next-generation portfolio showcasing projects, skills, and developer journey through immersive experiences
<span class="text-blue">Status</span>       : Currently in development`,

        "debuggers": `
<span class="text-green">[ DebuGGers ] — Learning Management System</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : HTML, CSS, Tailwind, JavaScript
<span class="text-blue">Features</span>     : 200+ videos, progress tracking, notes system, search, subtitles
<span class="text-blue">Purpose</span>      : Full learning platform for structured programming education
<span class="text-blue">Status</span>       : Active development`,

        "blackwave": `
<span class="text-green">[ BlackWave ] — Dark Web Simulation Platform</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : Laravel, Blade, PostgreSQL
<span class="text-blue">Features</span>     : Dark UI experience, simulated hidden network navigation, cybersecurity awareness concepts
<span class="text-blue">Purpose</span>      : Educational simulation of dark web & security awareness
<span class="text-blue">Status</span>       : Done`,

        "pixelquest": `
<span class="text-green">[ PixelQuest ] — Game Discovery Platform</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : HTML, CSS, Tailwind, JavaScript, REST API
<span class="text-blue">Features</span>     : Game catalog browsing, filtering (genre/platform/popularity), favorites, local storage
<span class="text-blue">Purpose</span>      : Video game discovery and exploration platform
<span class="text-blue">Status</span>       : Done`,

        "easycoloc": `
<span class="text-green">[ EasyColoc ] — Housing Management Platform</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : Laravel, Blade, PostgreSQL
<span class="text-blue">Features</span>     : User roles, housing listings, tenant/owner interaction system
<span class="text-blue">Purpose</span>      : Roommate & housing coordination platform
<span class="text-blue">Status</span>       : Done`,

        "localpoint": `
<span class="text-green">[ LocalPoint ] — Community Q&A Platform</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : Laravel, Blade, PostgreSQL
<span class="text-blue">Features</span>     : Location-based questions, nearby user responses, profile system, interactions
<span class="text-blue">Purpose</span>      : Local community knowledge sharing platform
<span class="text-blue">Status</span>       : Done`,

        "echoblog": `
<span class="text-green">[ EchoBlog ] — Blogging Platform</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : PHP, MVC Architecture, MySQL
<span class="text-blue">Features</span>     : Post creation, content publishing, user interaction, blog management
<span class="text-blue">Purpose</span>      : Modern blogging & content sharing system
<span class="text-blue">Status</span>       : Done`,

        "simplon": `
<span class="text-green">[ Simplon ] — Training Management System</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : PHP, MVC Architecture, MySQL
<span class="text-blue">Features</span>     : Student management, training modules, learning tracking system
<span class="text-blue">Purpose</span>      : Educational training platform for learners
<span class="text-blue">Status</span>       : Done`,

        "worksphere": `
<span class="text-green">[ WorkSphere ] — Workforce Management System</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : HTML, CSS, Tailwind, JavaScript
<span class="text-blue">Features</span>     : Employee management, role system, real-time floor/zone interaction
<span class="text-blue">Purpose</span>      : Office & staff management visualization tool
<span class="text-blue">Status</span>       : Done`,

        "edirham": `
<span class="text-green">[ E-Dirham ] — Digital Currency Awareness Platform</span>
<span class="text-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="text-blue">Stack</span>        : HTML, CSS
<span class="text-blue">Features</span>     : Informational pages, UX design, educational content about digital currency
<span class="text-blue">Purpose</span>      : Educational platform explaining Morocco's e-Dirham initiative
<span class="text-blue">Status</span>       : Done`
    };

    // Function to download the existing HYK_CV.pdf file
    function downloadExistingCV() {
        const link = document.getElementById('cvDownloadLink');
        link.href = 'HYK_CV.pdf';
        link.click();
    }

    // ASCII intro - always shown on fresh page load (clean terminal)
    const BOOT_MESSAGE = `
<span class="text-green">    ██╗  ██╗██╗   ██╗██╗  ██╗   </span>
<span class="text-green">    ██║  ██║╚██╗ ██╔╝██║ ██╔╝   </span>
<span class="text-green">    ███████║ ╚████╔╝ █████╔╝    </span>
<span class="text-green">    ██╔══██║  ╚██╔╝  ██╔═██╗    </span>
<span class="text-green">    ██║  ██║   ██║   ██║  ██╗   </span>
<span class="text-green">    ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝   </span>
<span class="text-dim">┌─────────────────────────────────────────────────────┐</span>
<span class="text-green">  HOUSSAM YAKHLAF</span>  —  Full Stack Developer
<span class="text-dim">  JavaScript · Laravel · Vue · Spring Boot · Docker</span>
<span class="text-dim">  Location: Morocco  |  YouCode Student</span>
<span class="text-dim">└─────────────────────────────────────────────────────┘</span>
<span class="text-dim">───────────────────────────────────────────────────────</span>
Type <span class="text-green">help</span> to see commands. Use <span class="text-green">download-cv</span> to get HYK_CV.pdf
<span class="text-dim">───────────────────────────────────────────────────────</span>
<span class="text-dim">Command history is saved automatically. Use ↑/↓ to recall past commands.</span>
`;

    // Helper: escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Print to terminal (auto-scroll bottom)
    function printToTerminal(htmlContent, addNewlineBefore = false) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'output-line';
        if (addNewlineBefore && outputContainer.children.length > 0) {
            const br = document.createElement('div');
            br.innerHTML = '<br>';
            outputContainer.appendChild(br);
        }
        lineDiv.innerHTML = htmlContent;
        outputContainer.appendChild(lineDiv);
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }

    // print command line with GNOME style prompt
    function printCommandLine(userInput) {
        const escapedInput = escapeHtml(userInput);
        const promptSpan = `<span class="prompt-gnome"><span class="prompt-user-gnome">[houssam</span><span class="prompt-at-gnome">@</span><span class="prompt-host-gnome">HoussamYK</span><span class="prompt-path-gnome"> ~</span><span class="prompt-dollar-gnome">]$</span></span>`;
        const fullLine = `<div class="command-line">${promptSpan} ${escapedInput}</div>`;
        printToTerminal(fullLine);
    }

    // ----- COMMAND HISTORY SAVING (ONLY commands, NO replay on refresh) -----
    function saveCommandHistoryToLocal() {
        try {
            const historyData = {
                commands: commandHistory,
                version: "history_only_v3",
                timestamp: Date.now()
            };
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyData));
        } catch (e) {
            console.warn("Failed to save history:", e);
        }
    }

    // Load command history from localStorage (just for arrow key navigation, NOT for replaying in terminal)
    function loadCommandHistoryOnly() {
        const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            if (data.commands && Array.isArray(data.commands) && data.commands.length > 0) {
                commandHistory = [...data.commands];
                // History loaded silently - terminal remains fresh with only boot message
                return true;
            }
        } catch (e) {
            console.warn("Failed to load history:", e);
        }
        return false;
    }

    // Core execution logic
    function executeCommand(rawInput) {
        const trimmed = rawInput.trim();
        if (trimmed === "") return;

        // Add to history (avoid storing if it's the same as the last command? no, keep all)
        commandHistory.push(trimmed);
        // Keep history reasonable (limit 200 entries)
        if (commandHistory.length > 200) commandHistory.shift();
        historyIndex = -1;

        // Save to localStorage after each command
        saveCommandHistoryToLocal();

        // Print the command line to terminal
        printCommandLine(trimmed);

        // Parse command
        const parts = trimmed.toLowerCase().split(/\s+/);
        const cmd = parts[0];

        // Handle clear command
        if (cmd === 'clear') {
            outputContainer.innerHTML = '';
            return;
        }

        // Handle save command
        if (cmd === 'save') {
            printToTerminal(COMMANDS.save);
            return;
        }

        // Handle download-cv
        if (cmd === 'download-cv') {
            printToTerminal(COMMANDS["download-cv"]);
            setTimeout(() => {
                try {
                    downloadExistingCV();
                    printToTerminal(`<span class="text-green">✓ Download started: HYK_CV.pdf</span>`);
                } catch (err) {
                    printToTerminal(`<span class="text-red">✗ Error: Could not locate HYK_CV.pdf. Make sure the file exists in the same directory.</span>`);
                }
            }, 50);
            return;
        }

        // Handle open command
        if (cmd === 'open' && parts[1]) {
            const projKey = parts[1].toLowerCase();
            if (PROJECTS[projKey]) {
                printToTerminal(PROJECTS[projKey]);
                return;
            }
            printToTerminal(`<span class="text-red">error: project '${escapeHtml(parts[1])}' not found</span>\n<span class="text-dim">Available: hyk, debuggers, blackwave, pixelquest, easycoloc, localpoint, echoblog, simplon, worksphere, edirham</span>`);
            return;
        }

        // Handle history command
        if (cmd === 'history') {
            const historyOutput = COMMANDS.history();
            printToTerminal(historyOutput);
            return;
        }

        // Handle regular commands
        if (COMMANDS[cmd]) {
            // Check if it's a function or string
            if (typeof COMMANDS[cmd] === 'function') {
                printToTerminal(COMMANDS[cmd]());
            } else {
                printToTerminal(COMMANDS[cmd]);
            }
            return;
        }

        // Unknown command
        printToTerminal(`<span class="text-red">bash: ${escapeHtml(trimmed)}: command not found</span>\n<span class="text-dim">Type <span class="text-green">help</span> to list commands.</span>`);
    }

    // ---- HISTORY NAVIGATION (using saved history for up/down keys) ----
    function setupTerminalEvents() {
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = inputField.value;
                inputField.value = '';
                executeCommand(val);
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                // Navigate backwards through history (oldest to newest)
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    const indexInArray = commandHistory.length - 1 - historyIndex;
                    inputField.value = commandHistory[indexInArray];
                }
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    const indexInArray = commandHistory.length - 1 - historyIndex;
                    inputField.value = commandHistory[indexInArray];
                } else if (historyIndex === 0) {
                    historyIndex = -1;
                    inputField.value = '';
                }
            }
            else if (e.key === 'Tab') {
                e.preventDefault();
                const current = inputField.value.trim().toLowerCase();
                const allCommands = Object.keys(COMMANDS);
                const openCmds = Object.keys(PROJECTS).map(p => 'open ' + p);
                const suggestions = [...allCommands, ...openCmds, 'download-cv', 'history'];
                const match = suggestions.find(s => s.startsWith(current) && s !== current);
                if (match) inputField.value = match;
            }
        });

        // Click anywhere in terminal body focuses input
        document.querySelector('.terminal-body').addEventListener('click', (e) => {
            if (e.target !== inputField) inputField.focus();
        });
        inputField.focus();
    }

    // ---- INITIAL BOOT: clean terminal with only ASCII art, but load history for arrow keys ----
    function initTerminal() {
        setupTerminalEvents();

        // Always show fresh, clean terminal with boot message
        printToTerminal(BOOT_MESSAGE);

        // Load command history silently for arrow key navigation (no replay in terminal)
        const hasHistory = loadCommandHistoryOnly();

        if (hasHistory && commandHistory.length > 0) {
            // Show a subtle indicator that history is available (without cluttering the terminal)
            const historyNote = document.createElement('div');
            historyNote.className = 'output-line';
            historyNote.innerHTML = `<span class="text-dim">${commandHistory.length} past commands available (use ↑/↓)</span>`;
            outputContainer.appendChild(historyNote);
            outputContainer.scrollTop = outputContainer.scrollHeight;
        }

        // Ensure we start with a clean history index
        historyIndex = -1;
        inputField.focus();
    }

    // Start the terminal
    initTerminal();
})();