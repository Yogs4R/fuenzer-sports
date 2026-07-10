export const en = {
  navbar: {
    home: "Home",
    standings: "Standings",
    history: "History",
    signIn: "Sign In",
    signUp: "Sign Up",
  },
  notifications: {
    title: "Changelog & Updates",
    empty: "No new notifications",
    updates: [
      {
        date: "July 6, 2026",
        title: "Vite & Tailwind CSS v4 Migration",
        description: "Successfully migrated to React 18, Vite 8, and Tailwind CSS v4. Configured strict dark mode visual system."
      },
      {
        date: "July 5, 2026",
        title: "Monte Carlo Engine Initial Design",
        description: "Implemented basic simulations using Python and FastAPI backend, optimized using NumPy."
      }
    ]
  },
  pages: {
    history: {
      title: "History",
      subtitle: "Access your past tournament simulations and chat sessions here. All your historical data is saved locally for quick access.",
      empty: "No simulation history available yet. Try running a tournament simulation!"
    },
    standings: {
      title: "Standings",
      subtitle: "Explore tournament group stages and standings simulated by Monte Carlo AI.",
      soon: "soon",
      best3rdTitle: "Best 3rd Place Standings",
      best3rdDesc: "The top 8 third-place teams qualify for the knockout stage (marked in green)."
    },
    terms: {
      title: "Terms & Conditions",
      lastUpdated: "Last updated: July 7, 2026",
      p1: "Welcome to Fuenzer Sports. By accessing and using sports.fuenzer.web.id, you accept and agree to be bound by the terms and provisions of this agreement.",
      h1: "1. Use License & Intellectual Property",
      p2: "Fuenzer Sports grants you a temporary, personal license to run Monte Carlo sports simulations for analysis and entertainment purposes. All analytical outputs, simulation logic models, and visual designs remain the property of Fuenzer Sports.",
      h2: "2. Simulation Disclaimer",
      p3: "All tournament predictions, standings probabilities, and simulated match outcomes are calculated using randomized statistical modeling (Monte Carlo method). Fuenzer Sports does not guarantee 100% predictive accuracy. Outputs should NOT be used as financial, betting, or investment advice.",
      h3: "3. API Usage & Analytics",
      p4: "You agree not to exploit, spam, scrape, or perform denial-of-service attacks on our backend FastAPI endpoints. Rate limiting policies are enforced on guest and member profiles. By using our service and accepting cookies, you also agree to the collection of anonymized usage data via Google Analytics to help us improve the platform."
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: July 7, 2026",
      p1: "At Fuenzer Sports (accessible from sports.fuenzer.web.id), we prioritize the privacy of our users. This Privacy Policy documents the types of information we collect and record, and how we use it.",
      h1: "1. Local Storage & Guest First Architecture",
      p2Part1: "Our application is designed with a ",
      guestFirst: "Guest-First",
      p2Part2: " architecture. This means that all of your match simulation inputs, preferences, and workspace settings are saved locally on your device's ",
      p2Part3: ". No personal identification data or search query logs are uploaded or stored on our servers unless you explicitly sign up for a user account.",
      h2: "2. Cookies & Analytics",
      p3: "Like any other website, Fuenzer Sports uses session cookies if you choose to authenticate (Sign In). These cookies are only used to manage your login session and secure your custom workspace. We also use Google Analytics to understand how you interact with our application to improve your experience, but this is only active if you explicitly grant cookie consent. We do not use third-party advertising cookies.",
      h3: "3. Policy Updates",
      p4: "We reserve the right to modify this Privacy Policy at any time. Any changes will be updated on this page with an updated modification date."
    }
  },
  components: {
    hero: {
      title: "Ask Anything. Simulate Everything.",
      subtitle: "Powered by advanced Monte Carlo algorithms for the ultimate sports predictions.",
      placeholder: "Simulate World Cup 2026 Group A matches...",
      model: "Model",
      mode: "Mode",
      style: "Style"
    },
    belowTheFold: {
      supportedBy: "Supported & Powered by",
      watchDemo: "Watch Platform Demo",
      stats: {
        iterations: "Monte Carlo Iterations",
        teams: "Teams Simulated",
        accuracyRate: "Engine Accuracy",
        accuracy: "AI Prediction Speed",
        accuracyValue: "Instant"
      },
      currentStandings: {
        title: "Current Standings",
        subtitle: "Live simulations from top global tournaments.",
        viewAll: "View All"
      },
      features: {
        title: "Limitless Capabilities",
        subtitle: "Explore advanced features that give you the power to predict, analyze, and simulate the sports world with high accuracy.",
        aiTitle: "AI-Powered Analytics",
        aiDesc: "Our AI models process millions of historical and real-time data points to uncover hidden patterns that determine match outcomes.",
        liveTitle: "Live Simulation",
        liveDesc: "Run \"What-if\" scenario simulations in seconds. Change formations, injure players, or alter weather, and see the impact instantly.",
        chartsTitle: "Interactive Charts",
        chartsDesc: "Visualize complex data through easy-to-understand charts and heat maps, giving you deep tactical insights in every corner of the pitch."
      },
      whyChooseUs: {
        title: "Why Fuenzer Sports?",
        desc: "Our simulation stack is built on AMD Cloud utilizing high-performance MI300X accelerators. In tandem with Google Gemma 4 and Fireworks AI inference frameworks, we perform thousands of complex Monte Carlo outcomes in milliseconds.",
        feat1: "Vectorized NumPy Engine",
        feat2: "Real-time API Integration",
        feat3: "Strict FIFA Rules Engine",
        nextGenTitle: "Next-Gen Simulation Power",
        nextGenDesc: "Optimized for maximum computational throughput, our vectorized Monte Carlo engine performs thousands of complex match simulations in milliseconds, leaving competitors in the dust."
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Have questions? We have answers."
      },
      cta: {
        title: "Ready to See the Future?",
        subtitle: "Join thousands of analysts and fans who have harnessed the power of AI for sports predictions.",
        button: "Start Simulation Now"
      }
    },
    footer: {
      description: "The leading sports intelligence platform. Simulating match outcomes with modern AI computational power to provide limitless insights.",
      navTitle: "Navigation",
      legalTitle: "Legal",
      contactTitle: "Contact",
      githubRepo: "GitHub Repo",
      allRightsReserved: "All rights reserved.",
      version: "Version",
      serverStatus: "Server Status:",
      online: "Online"
    },
    playground: {
      leftPanel: {
        placeholder: "Ask anything about sports...",
        untitled: "Untitled Simulation",
        rename: "Rename",
        clearChat: "Clear Chat",
        copied: "Copied!",
        copyResponse: "Copy response",
        selectEngine: "Select AI Engine",
        promptStyle: "Prompt Style",
        readyToExplore: "Ready to explore?",
        readyDesc: "Ask a follow-up question or tweak the scenario to see how the simulation responds.",
        you: "You",
        ai: "Fuenzer AI",
        voiceInput: "Voice Input"
      },
      rightPanel: {
        groupStageComplete: "Group Stage is completed! Use 'From Scratch' mode to resimulate groups, or switch to the Knockout Bracket to simulate the rest of the tournament.",
        runningSim: "Running Monte Carlo Simulations...",
        playSim: "Play Simulation",
        simBracket: "Simulating Bracket...",
        simKnockout: "Simulate Knockout",
        hideMetrics: "Hide Metrics",
        showMetrics: "Show Metrics",
        sort: "Sort:",
        defaultSort: "Default (Group)",
        highest1st: "Highest 1st Place",
        lowest1st: "Lowest 1st Place",
        highestAdv: "Highest Advance",
        lowestAdv: "Lowest Advance",
        searchTeam: "Search team...",
        filter: "Filter",
        showGroups: "Show Groups",
        clearAll: "Clear All",
        selectAll: "Select All",
        probOverview: "Probability Overview",
        loadingStadium: "Loading stadium data...",
        noGroupsMatch: "No groups match the selected filters.",
        groupStandings: "Group Standings",
        knockoutBracket: "Knockout Bracket",
        preTournament: "Pre-Tournament",
        liveProgression: "Live Progression",
        matchday: "Matchday",
        shareSim: "Share",
        shareVia: "Share via...",
        copyImage: "Copy Image",
        downloadPng: "Download PNG",
        copyText: "Copy Text Summary",
        shareSuccess: "Copied to clipboard!"
      },
      bracket: {
        winProb: "WIN PROBABILITIES",
        thirdPlace: "3rd Place Match",
        hypothetical: "Simulation results are purely hypothetical and based on Monte Carlo calculations.",
        noData: "No bracket data available.",
        runSimulation: "Run a 'From Scratch' group stage simulation first.",
        showMetrics: "Show Metrics",
        hideMetrics: "Hide Metrics"
      },
      processing: {
        step1: "Ingesting latest squad data...",
        step2: "Running 10,000 Monte Carlo iterations...",
        step3: "Calculating match probabilities...",
        step4: "Generating AI commentary...",
        viewThoughtProcess: "View thought process",
        complete: "Processing Complete",
        processing: "Processing"
      }
    }
  }
};

