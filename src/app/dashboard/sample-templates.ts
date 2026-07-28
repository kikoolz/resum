import { ResumeValues } from "@/lib/validation";

export interface SampleTemplate {
  name: string;
  description: string;
  data: ResumeValues;
}

export const sampleTemplates: SampleTemplate[] = [
  // =========================================================================
  // 1. PROFESSIONAL — Matches professional.png (Jacob McLaren)
  //    Layout: single-column, centered name, section headings with HR
  //    Sections: Summary → Education → Work Experience → Technical Expertise
  // =========================================================================
  {
    name: "Professional",
    description: "Classic single-column layout for corporate roles",
    data: {
      title: "Professional Resume",
      layout: "single-column",
      templateName: "professional",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "serif",
      summary:
        "Organized computer and English literacy workshops for underprivileged children in South Asia, 2013 Student Scholarship Recipient, National Conference on Race and Ethnicity, 2007-2008",
      firstName: "Jacob",
      lastName: "McLaren",
      jobTitle: "",
      city: "Cambridge",
      country: "MA 02138",
      phone: "555-555-5555",
      email: "mclaren@gmail.com",
      skills: [
        "MS Excel",
        "PowerPoint",
        "Relational Databases",
        "Project Management",
        "Quantitative Analysis",
        "SQL",
        "Java",
      ],
      educations: [
        {
          school: "Harvard University, Extension School",
          degree: "Master of Liberal Arts",
          fieldOfStudy: "Information Management Systems",
          endDate: "2018-05-01",
          description:
            "• Dean's List Academic Achievement Award recipient\n• Relevant coursework: Trends in Enterprise Information Systems, Principles of Finance, Data mining and Forecast Management, Resource Planning and Allocation Management, Simulation for Managerial Decision Making",
          visible: true,
        },
        {
          school: "Rutgers, The State University of New Jersey",
          degree: "Bachelor of Arts",
          fieldOfStudy: "Computer Science with Mathematics minor",
          endDate: "2014-05-01",
          visible: true,
        },
      ],
      workExperiences: [
        {
          position: "Principal",
          company: "State Street Corporation",
          subheading: "Simulated Technology",
          startDate: "2011-09-01",
          endDate: "2013-07-01",
          location: "Boston, MA",
          description:
            "• Led 8 cross functional, geographically dispersed teams to support quality for the reporting system\n• Improved process efficiency 75% by standardizing end to end project management workflow\n• Reduced application testing time 30% by automating shorter testing phases for off cycle projects\n• Conducted industry research on third-party testing tools and prepared recommendations for maximum return on investment",
          visible: true,
        },
        {
          position: "Principal",
          company: "State Street Corporation",
          subheading: "Simulated Technology",
          startDate: "2011-09-01",
          endDate: "2013-07-01",
          location: "Boston, MA",
          description:
            "• Led 8 cross functional, geographically dispersed teams to support quality for the reporting system\n• Improved process efficiency 75% by standardizing end to end project management workflow\n• Reduced application testing time 30% by automating shorter testing phases for off cycle projects\n• Conducted industry research on third-party testing tools and prepared recommendations for maximum return on investment",
          visible: true,
        },
        {
          position: "Associate",
          company: "Fidelity Investments",
          subheading: "Interactive Technology",
          startDate: "2010-01-01",
          endDate: "2011-09-01",
          location: "Boston, MA",
          description:
            "• Implemented initiatives to reduce overall project time frames by involving quality team members early in the Software Development Life Cycle iterations\n• Developed a systematic approach to organize and document the requirements of the to-be-system\n• Provided leadership to off-shore tech teams via training and analyzing business requirements",
          visible: true,
        },
        {
          position: "Associate",
          company: "Fidelity Investments",
          subheading: "Interactive Technology",
          startDate: "2010-07-01",
          endDate: "2011-01-01",
          location: "Singapore",
          description:
            "• Built Command & Control System for Singapore Civil Defence Force using C# .NET WCF Services\n• Integrated proprietary software components with commercial off-the-shell software product",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "education",
        "experience",
        "skills",
      ],
    },
  },

  // =========================================================================
  // 2. CREATIVE — Matches creative.png (Sarah Watson)
  //    Layout: two-column, purple sidebar (left: name, photo, contact, skills
  //    bars, languages, favorite quote), right: summary, experience, education,
  //    interests
  // =========================================================================
  {
    name: "Creative",
    description: "Bold two-column layout with colorful sidebar",
    data: {
      title: "Creative Resume",
      layout: "two-column",
      templateName: "creative",
      colorHex: "#6B5B95",
      borderStyle: "circle",
      fontSize: 10,
      fontFamily: "serif",
      photoUrl: "/templates/blackwoman.png",
      summary:
        "Driven and enthusiastic Web Developer with a strong passion for creating exceptional web experiences. Experienced in manual testing, test automation, tracking tools, and A/B testing. Quick learner, team player, and effective communicator. Proficient in Continuous Delivery tools. Familiar with Java and JSP.",
      firstName: "Sarah",
      lastName: "Watson",
      jobTitle: "Web Developer",
      city: "New York",
      country: "USA",
      phone: "+123235245",
      email: "hello@watson.org",
      skills: [
        "JavaScript",
        "TypeScript",
        "HTML 5 and CSS 3",
        "React.js",
        "Next.js",
        "Storybook",
      ],
      workExperiences: [
        {
          position: "Web Developer",
          company: "Google Inc.",
          startDate: "2018-05-01",
          location: "Mountain View, California",
          description:
            "Developed responsive and user-friendly websites utilizing HTML, CSS, and JavaScript resulting in improved user engagement and a 30% increase in site traffic. Collaborated with design and marketing teams to implement visual and interactive elements, resulting in visually stunning and highly functional websites.",
          visible: true,
        },
        {
          position: "Web Developer",
          company: "Google Inc.",
          startDate: "2018-05-01",
          location: "Mountain View, California",
          description:
            "Developed responsive and user-friendly websites utilizing HTML, CSS, and JavaScript resulting in improved user engagement and a 30% increase in site traffic. Collaborated with design and marketing teams to implement visual and interactive elements, resulting in visually stunning and highly functional websites.",
          visible: true,
        },
        {
          position: "Web Developer",
          company: "Google Inc.",
          startDate: "2018-05-01",
          location: "Mountain View, California",
          description:
            "Developed responsive and user-friendly websites utilizing HTML, CSS, and JavaScript resulting in improved user engagement and a 30% increase in site traffic. Collaborated with design and marketing teams to implement visual and interactive elements, resulting in visually stunning and highly functional websites.",
          visible: true,
        },
        {
          position: "Junior Developer",
          company: "Wing Aviation LLC",
          startDate: "2016-09-01",
          endDate: "2018-04-01",
          location: "Mountain View, California",
          description:
            "Assisted in the development of front-end and back-end components for corporate websites, contributing to a 15% improvement in site usability. Collaborated with the development team to troubleshoot and resolve coding issues, resulting in a 10% reduction in application errors.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "San Francisco Bay University",
          degree: "Master of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2019-09-01",
          endDate: "2021-06-01",
          visible: true,
        },
        {
          school: "San Francisco Bay University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2014-09-01",
          endDate: "2018-06-01",
          visible: true,
        },
      ],
      interests: [
        { name: "Travelling", visible: true },
        { name: "Playing Guitar", visible: true },
      ],
      languages: [
        { language: "English", proficiency: "Fluent", visible: true },
        {
          language: "Spanish",
          proficiency: "Conversational",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
        "languages",
        "interests",
      ],
    },
  },

  // =========================================================================
  // 3. MODERN — Matches modern.png (Elio Giordano)
  //    Layout: two-column, photo+name header spanning top, left column:
  //    Education, Skills (categorized), Languages. Right column: Work
  //    Experience, Projects. Orange (#D97706) accent color.
  // =========================================================================
  {
    name: "Modern",
    description: "Clean two-column layout with photo header",
    data: {
      title: "Modern Resume",
      layout: "two-column",
      templateName: "modern",
      colorHex: "#D97706",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "serif",
      photoUrl: "/templates/whiteguy.jpg",
      summary: "",
      firstName: "Elio",
      lastName: "Giordano",
      jobTitle: "Full-Stack Web Developer",
      city: "Bologna",
      country: "Italy",
      phone: "+39 348 123 4567",
      email: "elio.giordano.dev@email.com",
      linkedin: "linkedin.com/in/elio-giordano-dev",
      website: "eliog.dev",
      skills: [
        "Java",
        "JavaScript",
        "TypeScript",
        "HTML5",
        "CSS3",
        "Spring Boot",
        "Thymeleaf",
        "React",
        "Node.js",
        "Express.js",
        "Object-Oriented Programming (OOP)",
        "Full-Stack Web Development",
        "Relational Databases",
        "Git",
        "Adobe Creative Suite",
      ],
      workExperiences: [
        {
          position: "Warehouse Associate",
          company: "Global Logistics Solutions",
          startDate: "2024-09-01",
          endDate: "2024-12-01",
          location: "Modena, Italy",
          description:
            "• Order Picking: Accurately and efficiently retrieved items from shelving systems to meet daily fulfillment targets.\n• Indirect Logistics: Handled support tasks including stock replenishment, workstation organization, and maintaining a clean warehouse environment.\n• Inventory Management: Utilized RFID devices and scanners for real-time tracking of warehouse inventory movements.\n• Safety and Quality: Consistently adhered to company safety regulations and quality assurance protocols.",
          visible: true,
        },
        {
          position: "Kitchen Assistant & Dishwasher",
          company: "Trattoria del Sole",
          startDate: "2024-03-01",
          endDate: "2024-08-01",
          location: "Bologna, Italy",
          description:
            "• Washed and sanitized dishes, glassware, and kitchen equipment.\n• Assisted chefs with preliminary food preparation tasks.\n• Maintained cleanliness and order in the kitchen and work areas.\n• Followed all hygiene and safety standards.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "CodeCrafters Academy",
          degree: "Full-Stack Web Development",
          startDate: "2025-01-01",
          endDate: "2025-08-01",
          location: "Remote",
          description:
            "• Completed an intensive 7-month program focused on full-stack web development and modern programming methodologies.\n• Acquired advanced skills in Java, Spring Boot, JavaScript, HTML, and CSS.\n• Developed practical projects to build complete web applications, following best practices and OOP principles.",
          visible: true,
        },
        {
          school: "Istituto Tecnico Galileo Ferraris",
          degree: "Diploma",
          fieldOfStudy: "Graphic Design and Communication",
          startDate: "2019-09-01",
          endDate: "2024-06-01",
          visible: true,
        },
      ],
      projects: [
        {
          title: "CineVerse Explorer",
          subtitle:
            "A full-stack application for discovering and rating cinematic content.",
          description:
            "• Developed a responsive web application with React and TypeScript for advanced movie searching, integrated with the CinemaData API.\n• Implemented a real-time search system with multiple dynamic filters (genre, rating, release year) for seamless navigation.\n• Optimized performance through efficient API calls with client-side caching and intelligent request handling using Axios.\n• Designed a modern user interface with Tailwind CSS, ensuring a consistent and accessible cross-device experience.",
          visible: true,
        },
        {
          title: "ConnectSphere Chat",
          subtitle:
            "A full-stack app enabling real-time messaging between registered users.",
          description:
            "• Engineered a bidirectional real-time messaging system using Socket.IO for instant communication.\n• Implemented secure authentication and session management with a Node.js backend and a MongoDB database.\n• Integrated global state management with Zustand for efficient synchronization between the UI and real-time data.\n• Developed a responsive and accessible user interface with DaisyUI, enhancing overall usability and user experience.",
          visible: true,
        },
      ],
      languages: [
        { language: "Italian", proficiency: "Native", visible: true },
        {
          language: "English",
          proficiency: "Professional Working Proficiency",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "education",
        "skills",
        "languages",
        "experience",
        "projects",
      ],
    },
  },

  // =========================================================================
  // 4. SIMPLE — Matches simple.png (Andrew O'Sullivan)
  //    Layout: split-date, dates in left margin column
  //    Sections: Profile → Professional Experience → Education → Skills (dot
  //    rating) → Languages → Awards → Favorite Quote
  // =========================================================================
  {
    name: "Simple",
    description: "Elegant split-date layout with left-margin dates",
    data: {
      title: "Simple Resume",
      layout: "split-date",
      templateName: "simple",
      colorHex: "#111827",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "serif",
      summary:
        "Experienced Product Manager with a proven track record in the development and management of products throughout their lifecycle. Passionate, creative, and results-oriented.",
      firstName: "Andrew",
      lastName: "O'Sullivan",
      jobTitle: "Product Manager",
      city: "Berlin",
      country: "Germany",
      phone: "+01 11111155",
      email: "andrew@sulli.com",
      linkedin: "andrewosulvian",
      skills: [
        "Product development and strategy",
        "Customer needs analysis and market research",
        "Data analysis",
        "Project management and team leadership",
        "Agile methods and Scrum",
        "Presentation and communication",
      ],
      workExperiences: [
        {
          position: "Product Manager",
          company: "Technite Gmbh",
          startDate: "2018-08-01",
          endDate: "2023-07-01",
          location: "Berlin, Germany",
          description:
            "• Led a cross-functional team of 10 people in the development of a new product line, resulting in a 20% increase in revenue\n• Conducted market analysis and competitive studies to identify new product opportunities and expand the product portfolio\n• Successfully launched two new products in the market, leading to a 15% increase in market share",
          visible: true,
        },
        {
          position: "Product Manager",
          company: "Technite Gmbh",
          startDate: "2018-08-01",
          endDate: "2023-07-01",
          location: "Berlin, Germany",
          description:
            "• Led a cross-functional team of 10 people in the development of a new product line, resulting in a 20% increase in revenue\n• Conducted market analysis and competitive studies to identify new product opportunities and expand the product portfolio\n• Successfully launched two new products in the market, leading to a 15% increase in market share",
          visible: true,
        },
        {
          position: "Product Specialist",
          company: "Solutions Inc",
          startDate: "2015-04-01",
          endDate: "2018-07-01",
          location: "Munich, Germany",
          description:
            "• Developed and implemented a product strategy for the European market, resulting in a 25% revenue growth\n• Conducted training sessions and presentations for customers and sales teams to enhance product knowledge",
          visible: true,
        },
      ],
      educations: [
        {
          school: "University",
          degree: "Master of Business Administration (MBA)",
          startDate: "2013-08-01",
          endDate: "2015-07-01",
          location: "Munic, Gemany",
          visible: true,
        },
        {
          school: "Technical University",
          degree: "Bachelor of Engineering",
          fieldOfStudy: "Information Technology",
          startDate: "2009-09-01",
          endDate: "2013-07-01",
          location: "Vienna, Austria",
          visible: true,
        },
      ],
      languages: [
        { language: "German", proficiency: "Native", visible: true },
        { language: "English", proficiency: "Fluent", visible: true },
        {
          language: "Spanish",
          proficiency: "Basic",
          visible: true,
        },
      ],
      awards: [
        {
          title: "Product Manager of the Year",
          issuer: "Delta Solutions",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
        "languages",
        "awards",
      ],
    },
  },

  // =========================================================================
  // 5. EUROPASS — EU-style two-column layout
  //    Layout: two-column, light blue sidebar (left: photo, name, contact,
  //    skills), right: summary, experience, education, languages.
  //    Blue/purple section headings with horizontal rules.
  // =========================================================================
  {
    name: "Europass",
    description: "EU-style two-column layout with blue accents",
    data: {
      title: "Europass Resume",
      layout: "two-column",
      templateName: "europass",
      colorHex: "#1a1a1a",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      photoUrl: "/templates/coloredguy-b.png",
      summary:
        "Experienced and reliable Driver with vast experience working in the transportation of goods and passengers. Adept in safe driving practices and traffic laws. Bringing forth a clean driving record as well as a career history full of satisfied customers and clients.",
      firstName: "Daryl",
      lastName: "Banks",
      jobTitle: "Senior Project Manager",
      city: "Berlin",
      country: "Germany",
      phone: "(+49) 30 9876543",
      email: "m.schleiermacher@email.com",
      linkedin: "linkedin.com/in/m-schleiermacher",
      skills: [
        "Hand-Eye Coordination",
        "Social Media Platforms",
        "Manual Dexterity",
        "Safe Driving Skills",
      ],
      workExperiences: [
        {
          position: "Senior Project Manager",
          company: "Siemens AG",
          startDate: "2019-09-01",
          location: "Berlin, Germany",
          description:
            "• Managing international engineering projects in the energy sector (budgets up to EUR 5M).\n• Coordinating cross-functional teams (20+ members) across Germany, France, and Poland.\n• Optimizing internal workflows, resulting in a 15% reduction in operational costs.",
          visible: true,
        },
        {
          position: "Senior Project Manager",
          company: "Siemens AG",
          startDate: "2019-09-01",
          location: "Berlin, Germany",
          description:
            "• Managing international engineering projects in the energy sector (budgets up to EUR 5M).\n• Coordinating cross-functional teams (20+ members) across Germany, France, and Poland.\n• Optimizing internal workflows, resulting in a 15% reduction in operational costs.",
          visible: true,
        },
        {
          position: "Operations Specialist",
          company: "Deutsche Bahn",
          startDate: "2014-08-01",
          endDate: "2019-08-01",
          location: "Berlin, Germany",
          description:
            "• Analysis and planning of complex logistical routes.\n• Implementation of a new digital cargo monitoring system.\n• Preparing efficiency reports and strategic presentations for senior management.",
          visible: true,
        },
      ],
      educations: [
        {
          degree: "Master of Science",
          fieldOfStudy: "Engineering Management",
          school: "Technical University of Berlin (TU Berlin)",
          startDate: "2012-09-01",
          endDate: "2014-06-01",
          location: "Berlin, Germany",
          visible: true,
        },
        {
          degree: "Bachelor of Engineering",
          fieldOfStudy: "Industrial Engineering",
          school: "Technical University of Munich (TUM)",
          startDate: "2009-09-01",
          endDate: "2012-07-01",
          location: "Munich, Germany",
          visible: true,
        },
      ],
      languages: [
        { language: "German", proficiency: "Native", visible: true },
        { language: "English", proficiency: "Fluent", visible: true },
        { language: "Spanish", proficiency: "Proficient", visible: true },
      ],
      sectionOrder: [
        "personal-info",
        "summary",
        "experience",
        "education",
        "skills",
        "languages",
      ],
    },
  },
  // =========================================================================
  // 6. EXECUTIVE — Two-column, blue-gray header on left, white body
  //    Left: header (name, title, contact), education, skills
  //    Right: summary, experience
  // =========================================================================
  {
    name: "Executive",
    description: "Two-column with blue-gray header and clean white body",
    data: {
      title: "Executive Resume",
      layout: "two-column",
      templateName: "executive",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Senior Analyst with 5+ years of experience in data analysis, business intelligence, and process optimization. Skilled in driving operational efficiency, forecasting, and leading data-driven strategies to support business decisions and improvements. Strong communicator focused on results.",
      firstName: "Samantha",
      lastName: "Williams",
      jobTitle: "Senior Sales Associate",
      city: "New York",
      country: "NY 10001",
      phone: "(555) 789-1234",
      email: "samantha.williams@example.com",
      skills: [
        "Project Management",
        "Data-driven Decision Making",
        "SQL & Excel",
        "Financial Analysis",
        "Business Intelligence tools",
        "Statistical Modeling",
      ],
      languages: [
        { language: "English", proficiency: "Native", visible: true },
        { language: "Spanish", proficiency: "Conversational", visible: true },
        { language: "French", proficiency: "Basic", visible: true },
      ],
      workExperiences: [
        {
          position: "Senior Analyst",
          company: "Loom & Lantern Co.",
          location: "New York, NY",
          startDate: "2021-07-01",
          description:
            "• Spearhead data analysis and reporting for key business functions, identifying trends and providing insights to improve company performance and profitability.\n• Conduct in-depth market analysis and competitive benchmarking to inform strategic decisions, resulting in a 15% increase in market share within one year.\n• Develop predictive models to forecast sales performance and customer behavior, contributing to more accurate budgeting and resource allocation.",
          visible: true,
        },
        {
          position: "Senior Analyst",
          company: "Loom & Lantern Co.",
          location: "New York, NY",
          startDate: "2021-07-01",
          description:
            "• Spearhead data analysis and reporting for key business functions, identifying trends and providing insights to improve company performance and profitability.\n• Conduct in-depth market analysis and competitive benchmarking to inform strategic decisions, resulting in a 15% increase in market share within one year.\n• Develop predictive models to forecast sales performance and customer behavior, contributing to more accurate budgeting and resource allocation.",
          visible: true,
        },
        {
          position: "Business Analyst",
          company: "Willow & Wren Ltd.",
          location: "New York, NY",
          startDate: "2017-08-01",
          endDate: "2021-05-01",
          description:
            "• Analyzed and interpreted large datasets to identify business opportunities and recommend process improvements, leading to a 20% reduction in operational costs.\n• Created detailed financial models and dashboards to track key performance indicators (KPIs), enabling data-driven decision-making across departments.\n• Worked closely with project managers to monitor progress on major initiatives, ensuring projects were delivered on time and within budget.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "New York University",
          degree: "Master of Science",
          fieldOfStudy: "Economics",
          location: "New York, NY",
          startDate: "2018-09-01",
          endDate: "2020-05-01",
          visible: true,
        },
        {
          school: "New York University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Economics",
          location: "New York, NY",
          startDate: "2013-09-01",
          endDate: "2017-05-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "summary",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 7. BLUSH — Two-column, pink blush gradient behind name, serif headings,
  //    pink star icons, pink bullets, light pink background
  // =========================================================================
  {
    name: "Blush",
    description: "Elegant two-column with pink accents and serif headings",
    data: {
      title: "Blush Resume",
      layout: "two-column",
      templateName: "blush",
      colorHex: "#1a1a1a",
      borderStyle: "circle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Creative and detail-oriented Web Designer with over 5 years of experience in designing and developing visually stunning, user-friendly websites. Adept at translating client needs into innovative web solutions that enhance user engagement and drive business growth.",
      firstName: "Olivia",
      lastName: "Wilson",
      jobTitle: "Web Designer",
      city: "Any City",
      country: "Anywhere, 123",
      phone: "+1 234-567-890",
      email: "hello@reallygreatsite.com",
      skills: [
        "Web Design",
        "Front-End Development",
        "UX/UI Design",
        "Graphic Design",
        "Responsive Design",
        "Problem-Solving",
      ],
      workExperiences: [
        {
          position: "Web Designer",
          company: "Zebra Creative Agency",
          location: "New York, NY",
          startDate: "2020-09-01",
          description:
            "• Designed and developed over 50 custom websites for clients in diverse industries, ensuring responsive design and optimal user experience.\n• Collaborated with clients to understand their brand vision, translating concepts into visually appealing and functional web designs.",
          visible: true,
        },

        {
          position: "Junior Web Designer",
          company: "The First Tech Startup ABC",
          location: "New York, NY",
          startDate: "2017-09-01",
          endDate: "2019-09-01",
          description:
            "• Assisted senior designers in creating website layouts, graphics, and interactive elements for startup projects.\n• Built wireframes and prototypes using tools like Sketch and Adobe XD, helping clients visualize final website designs.",
          visible: true,
        },

        {
          position: "Junior Web Designer",
          company: "The First Tech Startup ABC",
          location: "New York, NY",
          startDate: "2017-09-01",
          endDate: "2019-09-01",
          description:
            "• Assisted senior designers in creating website layouts, graphics, and interactive elements for startup projects.\n• Built wireframes and prototypes using tools like Sketch and Adobe XD, helping clients visualize final website designs.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "University of California, Los Angeles",
          degree: "Bachelor of Science",
          fieldOfStudy: "Web Design & Development",
          startDate: "2012-08-01",
          endDate: "2016-08-01",
          visible: true,
        },
        {
          school: "Lincoln High School, San Francisco",
          degree: "High School Diploma",
          startDate: "2012-06-01",
          endDate: "2015-08-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "experience",
        "profile",
        "skills",
        "education",
      ],
    },
  },
  // =========================================================================
  // 8. FRESH — Light yellow-green background, two-column header (name + details),
  //    single-column body with star icons on section headings
  // =========================================================================
  {
    name: "Fresh",
    description:
      "Clean single-column with green-tinted background and star accents",
    data: {
      title: "Fresh Resume",
      layout: "single-column",
      templateName: "fresh",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Innovative Programmer and Internet Entrepreneur striving to make the world a more unified and connected place. A creative thinker, adept in software development and working with various data structures.",
      firstName: "John",
      lastName: "Rambo",
      jobTitle: "Professional Model",
      city: "Any City",
      country: "Anywhere St., 123",
      phone: "+1 234-567-890",
      email: "hello@example.com",
      skills: ["Model", "Runway Walk", "Adaptability", "Posing & Movement"],
      workExperiences: [
        {
          position: "Runway Model",
          company: "Salford & Co.",
          location: "New York",
          startDate: "2015-09-01",
          description:
            "• Walked for renowned designers during New York Fashion Week, showcasing seasonal collections.\n• Collaborated closely with stylists and makeup artists to achieve the desired runway look, contributing to cohesive show presentations.",
          visible: true,
        },
        {
          position: "Runway Model",
          company: "Salford & Co.",
          location: "New York",
          startDate: "2013-09-01",
          description:
            "• Walked for renowned designers during New York Fashion Week, showcasing seasonal collections.\n• Collaborated closely with stylists and makeup artists to achieve the desired runway look, contributing to cohesive show presentations.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Fashion Institute of Technology, New York",
          degree: "Bachelor",
          fieldOfStudy: "Arts",
          startDate: "2013-08-01",
          endDate: "2017-08-01",
          description: "Working towards a Communications Degree.",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 9. CLASSIC — Two-column, gray sidebar, bordered name box, thick HRs
  //    Left: details, skills. Right: name box, summary, experience, education
  // =========================================================================
  {
    name: "Classic",
    description: "Traditional two-column with bordered name and thick rules",
    data: {
      title: "Classic Resume",
      layout: "two-column",
      templateName: "classic",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Experienced and self-motivated Sales Manager with five years of industry experience overseeing sales figures and new account developments. Bringing forth a proven track record of working collaboratively with sales teams to achieve goals, increase revenue gains, and advance the sales cycle of the company. A strong leader with the ability to increase sales and develop strategies to retain customers.",
      firstName: "Adam",
      lastName: "Roberts",
      jobTitle: "Sales Manager",
      city: "Boulder",
      country: "CO 80302",
      phone: "(720) 315-8237",
      email: "wes.turner@gmail.com",
      skills: [
        "Project Management Skills",
        "Business Development Strategies",
        "Industry Knowledge",
        "Interpersonal Communication Skills",
        "Innovative Problem Solving",
      ],
      workExperiences: [
        {
          position: "Sales Manager",
          company: "Winthrop and Lee",
          location: "Boulder",
          startDate: "2014-11-01",
          endDate: "2019-09-01",
          description:
            "• Helped to achieve a 25% increase in sales revenue over the course of 1 year.\n• Established sales goals by forecasting annual sales quotas and projecting expected sales volume for existing and new products.\n• Effectively monitored competition and appropriately adjusted costs based on supply and demand.",
          visible: true,
        },
        {
          position: "Sales Manager",
          company: "Lola & Co",
          location: "Denver",
          startDate: "2010-09-01",
          endDate: "2014-10-01",
          description:
            "• Created budgets and ensured that labor and material costs were decreased by 15%.\n• Generated financial reports on completed projects, including advantageous results.\n• Generated financial reports on completed projects, including advantageous results.\n• Developed financial statements, including cash flow charts and balance sheets.\n• Developed financial statements, including cash flow charts and balance sheets.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Colorado College",
          degree: "Bachelor of Marketing",
          location: "Colorado Springs",
          startDate: "2008-08-01",
          endDate: "2010-08-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 10. SLEEK — Two-column, narrow left sidebar, centered name with
  //     decorative lines, vertical divider, clean minimal design
  // =========================================================================
  {
    name: "Sleek",
    description: "Minimal two-column with centered name and decorative lines",
    data: {
      title: "Sleek Resume",
      layout: "two-column",
      templateName: "sleek",
      colorHex: "#1a1a1a",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Results-driven Digital Marketing Project Manager with over 9 years of experience leading end-to-end marketing and PR campaigns, optimizing budgets, and managing cross-functional teams of up to 70 people. Proven ability to drive project efficiency by reducing costs while maintaining high-quality outcomes.",
      firstName: "Mark",
      lastName: "Anderson",
      jobTitle: "Social Media Marketing Specialist",
      city: "Palo Alto",
      country: "CA 94304",
      phone: "(816) 555-0146",
      email: "mira@example.com",
      skills: [
        "Platform expertise",
        "Content creation",
        "Analytics",
        "Communication",
        "Strategic thinking",
      ],
      workExperiences: [
        {
          position: "Content marketing specialist",
          company: "Phoenix Int.",
          location: "New York",
          startDate: "2015-10-01",
          endDate: "2019-07-01",
          description:
            "• Developed and executed content marketing strategies that leveraged social media to drive traffic, engagement, and conversions.\n• Produced high-quality, engaging content for social media, email marketing, and the company's blog.\n• Collaborated with cross-functional teams to align content with overall marketing goals and brand voice.\n• Managed editorial calendars and ensured timely delivery of high-quality content across various channels.",
          visible: true,
        },
        {
          position: "Social media marketing specialist",
          company: "DigitalX",
          location: "New York",
          startDate: "2023-04-01",
          endDate: "2019-08-01",
          description:
            "• Developed and executed successful social media campaigns across multiple platforms to increase brand awareness and drive traffic to the company's website.\n• Managed and grew the company's social media accounts by creating engaging content, monitoring analytics, and implementing social media best practices.",
          visible: true,
        },
        {
          position: "Social media marketing specialist",
          company: "DigitalX",
          location: "New York",
          startDate: "2023-04-01",
          endDate: "2019-08-01",
          description:
            "• Developed and executed successful social media campaigns across multiple platforms to increase brand awareness and drive traffic to the company's website.\n• Managed and grew the company's social media accounts by creating engaging content, monitoring analytics, and implementing social media best practices.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Bellows College",
          degree: "BA",
          fieldOfStudy: "Communications",
          location: "Phoenix",
          startDate: "2014-08-01",
          endDate: "2019-06-01",
          visible: true,
        },
        {
          school: "East Beringer Community College",
          degree: "AA",
          fieldOfStudy: "Communications",
          location: "Beringer",
          startDate: "2010-08-01",
          endDate: "2014-06-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 11. PROFILE — Europass-inspired, photo + contact top left, blue-gray
  //     right sidebar with social links, skills as pills, languages
  // =========================================================================
  {
    name: "Profile",
    description: "Europass-style with photo header and blue sidebar",
    data: {
      title: "Profile Resume",
      layout: "two-column",
      templateName: "profile",
      colorHex: "#2B5797",
      borderStyle: "circle",
      fontSize: 10,
      fontFamily: "sans-serif",
      photoUrl: "/templates/whiteman.jpg",
      summary:
        "Experienced and reliable Driver with vast experience working in the transportation of goods and passengers. Adept in safe driving practices and traffic laws. Bringing forth a clean driving record as well as a career history full of satisfied customers and clients.",
      firstName: "Lukas",
      lastName: "Morgan",
      jobTitle: "Senior Project Manager",
      city: "Berlin",
      country: "Germany",
      phone: "(+49) 30 9876543",
      email: "d.gallego@example.com",
      linkedin: "linkedin.com/in/lukas-morgan",
      skills: [
        "Vehicle Control & Maneuvering",
        "Defensive Driving Techniques",
        "Attention to Detail",
        "Route Planning",
        "Knowledge of DOT & FMCSA",
      ],
      workExperiences: [
        {
          position: "Senior Project Manager",
          company: "Siemens AG",
          location: "Berlin, Germany",
          startDate: "2019-09-01",
          description:
            "• Managing international engineering projects in the energy sector (budgets up to EUR 5M).\n• Coordinating cross-functional teams (20+ members) across Germany, France, and Poland.\n• Optimizing internal workflows, resulting in a 15% reduction in operational costs.",
          visible: true,
        },
        {
          position: "Senior Project Manager",
          company: "Siemens AG",
          location: "Berlin, Germany",
          startDate: "2019-09-01",
          description:
            "• Managing international engineering projects in the energy sector (budgets up to EUR 5M).\n• Coordinating cross-functional teams (20+ members) across Germany, France, and Poland.",
          visible: true,
        },
        {
          position: "Operations Specialist",
          company: "Deutsche Bahn",
          location: "Berlin, Germany",
          startDate: "2014-08-01",
          endDate: "2019-08-01",
          description:
            "• Analysis and planning of complex logistical routes.\n• Implementation of a new digital cargo monitoring system.\n• Preparing efficiency reports and strategic presentations for senior management.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Technical University of Berlin (TU Berlin)",
          degree: "Master of Science",
          fieldOfStudy: "Engineering Management",
          location: "Berlin, Germany",
          startDate: "2012-09-01",
          endDate: "2014-06-01",
          visible: true,
        },
        {
          school: "Technical University of Munich (TUM)",
          degree: "Bachelor of Engineering",
          fieldOfStudy: "Industrial Engineering",
          location: "Munich, Germany",
          startDate: "2009-09-01",
          endDate: "2012-07-01",
          visible: true,
        },
      ],
      languages: [
        { language: "German", proficiency: "Native", visible: true },
        { language: "English", proficiency: "Native", visible: true },
        { language: "Spanish", proficiency: "Proficient", visible: true },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
        "languages",
      ],
    },
  },
  // =========================================================================
  // 12. EURO-MODERN — Europass-inspired with dark blue top bar, photo in
  //     right column, blue section headings, horizontal rules
  // =========================================================================
  {
    name: "Euro Modern",
    description: "Europass-style with dark blue header and photo sidebar",
    data: {
      title: "Euro Modern Resume",
      layout: "two-column",
      templateName: "euro-modern",
      colorHex: "#1a365d",
      borderStyle: "circle",
      fontSize: 10,
      fontFamily: "sans-serif",
      photoUrl: "/templates/indianman.jpg",
      summary:
        "Experienced and reliable Driver with vast experience working in the transportation of goods and passengers. Adept in safe driving practices and traffic laws. Bringing forth a clean driving record as well as a career history full of satisfied customers and clients.",
      firstName: "Diamond",
      lastName: "Pedro",
      jobTitle: "Senior Project Manager",
      city: "Berlin",
      country: "Germany",
      phone: "(+49) 30 9876543",
      email: "d.banks@example.com",
      linkedin: "linkedin.com/in/daryl-banks",
      skills: [
        "Vehicle Control & Maneuvering",
        "Defensive Driving Techniques",
        "Attention to Detail",
        "Route Planning",
        "Knowledge of DOT & FMCSA",
      ],
      workExperiences: [
        {
          position: "Senior Project Manager",
          company: "Siemens AG",
          location: "Berlin, Germany",
          startDate: "2019-09-01",
          description:
            "• Managing international engineering projects in the energy sector (budgets up to EUR 5M).\n• Coordinating cross-functional teams (20+ members) across Germany, France, and Poland.\n• Optimizing internal workflows, resulting in a 15% reduction in operational costs.\n• Optimizing internal workflows, resulting in a 15% reduction in operational costs.",
          visible: true,
        },
        {
          position: "Operations Specialist",
          company: "Deutsche Bahn",
          location: "Berlin, Germany",
          startDate: "2014-08-01",
          endDate: "2019-08-01",
          description:
            "• Analysis and planning of complex logistical routes.\n• Implementation of a new digital cargo monitoring system.\n• Preparing efficiency reports and strategic presentations for senior management.\n• Optimizing internal workflows, resulting in a 15% reduction in operational costs.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Technical University of Berlin (TU Berlin)",
          degree: "Master of Science",
          fieldOfStudy: "Engineering Management",
          location: "Berlin, Germany",
          startDate: "2012-09-01",
          endDate: "2014-06-01",
          visible: true,
        },
        {
          school: "Technical University of Munich (TUM)",
          degree: "Bachelor of Engineering",
          fieldOfStudy: "Industrial Engineering",
          location: "Munich, Germany",
          startDate: "2009-09-01",
          endDate: "2012-07-01",
          visible: true,
        },
      ],
      languages: [
        { language: "German", proficiency: "Native", visible: true },
        { language: "English", proficiency: "Native", visible: true },
        { language: "Spanish", proficiency: "Proficient", visible: true },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
        "languages",
      ],
    },
  },
  // =========================================================================
  // 13. BADGE — Single-column, serif name, gray badge section headings,
  //     gray badge date ranges, skills as rounded pills
  // =========================================================================
  {
    name: "Badge",
    description: "Clean single-column with badge-style headings and date pills",
    data: {
      title: "Badge Resume",
      layout: "single-column",
      templateName: "badge",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Administrative assistant with 9+ years of experience organizing presentations, preparing facility reports, and maintaining the utmost confidentiality. Possesses a B.A. in history and expertise in Microsoft Excel. Looking to leverage my wealth of knowledge and experience into the open administrative assistant role at your organization.",
      firstName: "Ernie",
      lastName: "Dockwell",
      jobTitle: "Administrative Assistant",
      city: "Weston",
      country: "FL 33326, United States",
      phone: "(210) 286-1624",
      email: "kelly dockwell@example.com",
      skills: [
        "Analytical Thinking",
        "Tolerant & Flexible",
        "Team Leadership",
        "Organization & Prioritization",
        "Strong Communication",
        "Web app development",
        "Computer engineering",
        "Web security",
      ],
      workExperiences: [
        {
          position: "Sales Manager",
          company: "Winthrop and Lee",
          location: "Boulder",
          startDate: "2014-11-01",
          endDate: "2019-09-01",
          description:
            "• Helped to achieve a 25% increase in sales revenue over the course of 1 year.\n• Established sales goals by forecasting annual sales quotas and projecting expected sales volume for existing and new products.\n• Effectively monitored competition and appropriately adjusted costs based on supply and demand.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Brown University, Providence, RI",
          degree: "Bachelor of Arts",
          fieldOfStudy: "Finance",
          startDate: "2004-08-01",
          endDate: "2009-08-01",
          visible: true,
        },
        {
          school: "San Antonio Community College, San Antonio, TX",
          degree: "Associate of Arts",
          fieldOfStudy: "Business",
          startDate: "2002-08-01",
          endDate: "2007-08-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 14. TIMELINE — Two-column with timeline-style entries, vertical line,
  //     icons next to section headings, skills as pills
  // =========================================================================
  {
    name: "Timeline",
    description: "Two-column with timeline entries and section icons",
    data: {
      title: "Timeline Resume",
      layout: "two-column",
      templateName: "timeline",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Experienced and reliable Driver with vast experience working in the transportation of goods and passengers. Adept in safe driving practices and traffic laws. Bringing forth a clean driving record as well as a career history full of satisfied customers and clients. Experienced in performing maintenance and minor repairs on vehicles. Committed to the safety and successful transportation of goods, passengers, and vehicles.",
      firstName: "Badhir",
      lastName: "Omar",
      jobTitle: "Driver",
      city: "Phoenix",
      country: "AZ 85009, United States",
      phone: "(602) 319-1212",
      email: "banks.daryl@gmail.com",
      skills: [
        "Hand-Eye Coordination",
        "Manual Dexterity",
        "References",
        "Ability to read maps",
        "Safe Driving Skills",
      ],
      workExperiences: [
        {
          position: "Driver",
          company: "Albert's Trucking Company",
          location: "Phoenix",
          startDate: "2013-04-01",
          endDate: "2019-08-01",
          description:
            "• Performed vehicle inspections and maintenance prior to trips.\n• Read maps and identified the fastest routes.",
          visible: true,
        },
        {
          position: "Driver",
          company: "Bears Transportation",
          location: "Phoenix",
          startDate: "2009-09-01",
          endDate: "2013-03-01",
          description:
            "• Reached 700k accident free miles.\n• Was awarded Best Driver in 2011.\n• Safely and efficiently transported cargo to destinations.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Phoenix Driving School",
          degree: "Class B, Commercial Driver's License",
          location: "Phoenix",
          startDate: "2013-09-01",
          endDate: "2017-05-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 15. MINIMAL — Clean single-column, left date / right content entries,
  //     uppercase section headings with horizontal rule
  // =========================================================================
  {
    name: "Minimal",
    description: "Clean single-column with date-side entries and section rules",
    data: {
      title: "Minimal Resume",
      layout: "single-column",
      templateName: "minimal",
      colorHex: "#000000",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Results-driven Digital Marketing Project Manager with over 9 years of experience leading end-to-end marketing and PR campaigns, optimizing budgets, and managing cross-functional teams of up to 70 people. Proven ability to drive project efficiency by reducing costs while maintaining high-quality outcomes.",
      firstName: "Steven",
      lastName: "Williams",
      jobTitle: "Digital Marketing Project Manager",
      city: "Washington",
      country: "DC",
      phone: "+1 202-555-0196",
      email: "example@bettercv.com",
      skills: ["Scrum", "SEA", "SEO", "Social Media"],
      workExperiences: [
        {
          position: "Project Manager",
          company: "Prospect Solutions",
          location: "Oklahoma City, OK",
          startDate: "2015-01-01",
          endDate: "",
          description:
            "• Generated, produced and maintained 42 end-to-end marketing and PR projects of which three became viral stunts. Completed all the projects within an approved budget, timescale, and expected quality.\n• Created, organized and implemented the company's employee training program with the help of up-to-date educational book reading practices, which improved the ideas of the professional team members and workflow.\n• Managed, led and coordinated various teams of up to 70 people to perform marketing programs. This included collaboration both with internal and external teams.\n• Solved internal financial business challenges by reducing projects' costs by 25% while employing young, but talented, external freelancers without negatively affecting the overall quality of the project.\n• Created, organized and implemented the company's employee training program with the help of up-to-date educational book reading practices, which improved the ideas of the professional team members and workflow.\n• Created, organized and implemented the company's employee training program with the help of up-to-date educational book reading practices, which improved the ideas of the professional team members and workflow.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Yale University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Business Administration",
          location: "Washington, D.C.",
          startDate: "2013-08-01",
          endDate: "2013-08-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 16. NOTION — Two-column with photo, job title badge, colored section
  //     heading squares, key achievements sidebar, subtle background
  // =========================================================================
  {
    name: "Notion",
    description:
      "Two-column with photo, job title badge, and colored section icons",
    data: {
      title: "Notion Resume",
      layout: "two-column",
      templateName: "notion",
      photoUrl: "/templates/blackwoman.png",
      colorHex: "#7ba38e",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Dynamic procurement specialist with over 5 years of experience in strategic sourcing and team management, highly skilled in supply chain optimization and developing category strategies. Proven leader with an MBA and a solid track record in transformative sourcing initiatives, delivering significant cost savings and operational efficiencies.",
      firstName: "Maeve",
      lastName: "Delaney",
      jobTitle:
        "Strategic Sourcing Leader | Procurement Specialist | Team Management",
      city: "Charlotte",
      country: "North Carolina",
      phone: "+1-(234)-555-1234",
      email: "help@enhancv.com",
      linkedin: "linkedin.com",
      skills: [
        "Implemented Supplier Performance Management System",
        "Managed $500M Indirect Spend Portfolio",
        "Achieved 15% Annual Cost Savings",
      ],
      workExperiences: [
        {
          position: "Senior Sourcing Manager",
          company: "Premier Inc.",
          location: "Charlotte, NC",
          startDate: "2018-06-01",
          endDate: "",
          description:
            "• Developed and executed category strategy for medical supplies, reducing annual costs by 15% through strategic supplier consolidation.\n• Led cross-functional teams in the successful negotiation of complex service contracts, yielding a 20% improvement in service level agreements.\n• Implemented a supplier performance management system, enhancing supplier quality and compliance, and resulting in a 10% increase in supplier scorecard performance.\n• Managed a portfolio of $500M in indirect spend, driving the adoption of cost-saving measures across multiple departments.\n• Pioneered a supplier diversity program that expanded the supplier base by 30% and supported organizational inclusivity goals.",
          visible: true,
        },
        {
          position: "Category Manager",
          company: "Honeywell",
          location: "Fort Mill, SC",
          startDate: "2015-01-01",
          endDate: "2018-05-01",
          description:
            "• Executed multi-year growth plans for the electronics category, delivering a sustained 10% year-over-year cost reduction.\n• Conducted extensive market trends analysis leading to the early identification of cost-saving opportunities.\n• Improved supplier on-time delivery rates by 25% through effective supplier relationship management.\n• Created financial models and business cases for senior leadership, supporting data-driven strategic sourcing decisions.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Duke University",
          degree: "Master of Business Administration",
          location: "Durham, NC",
          startDate: "2007-01-01",
          endDate: "2009-01-01",
          visible: true,
        },
        {
          school: "North Carolina State University",
          degree: "Bachelor of Science in Supply Chain Management",
          location: "Raleigh, NC",
          startDate: "2003-01-01",
          endDate: "2007-01-01",
          visible: true,
        },
      ],
      courses: [
        {
          name: "Certified Professional in Supply Management",
          institution:
            "Intensive course covering strategic sourcing and supply chain management, provided by the Institute for Supply Management.",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
        "courses",
      ],
    },
  },
  // =========================================================================
  // 17. ACADEMY — Two-column with blue accent, photo, key achievements
  //     with star icons, skills grid with underlines, language progress bars,
  //     decorative wavy shapes
  // =========================================================================
  {
    name: "Academy",
    description:
      "Two-column with photo, key achievements, skills grid, and language bars",
    data: {
      title: "Academy Resume",
      layout: "two-column",
      templateName: "academy",
      photoUrl: "/templates/whiteguy.jpg",
      colorHex: "#4a90a4",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Passionate educator with over three years of successful teaching and leadership experience, holding a Master's degree in Education, specializing in curriculum development and content-specific pedagogy. Strong track record of fostering student success and enhancing academic programs.",
      firstName: "Isabella",
      lastName: "Adams",
      jobTitle:
        "Educational Leader | Curriculum Development | Innovative Teaching",
      city: "Los Angeles",
      country: "California",
      phone: "+1-(234)-555-1234",
      email: "help@enhancv.com",
      linkedin: "linkedin.com/",
      skills: [
        "Curriculum Development",
        "Educational Leadership",
        "Project-Based Learning",
        "Standardized Testing",
        "Stakeholder Management",
        "Teacher Training",
      ],
      workExperiences: [
        {
          position: "Senior Curriculum Coordinator",
          company: "Los Angeles Unified School District",
          location: "Los Angeles, CA",
          startDate: "2019-01-01",
          endDate: "",
          description:
            "• Spearheaded the redesign of the district's STEM curriculum, increasing student engagement by 25% through integrated project-based learning initiatives.",
          visible: true,
        },
        {
          position: "Advanced Placement Coordinator",
          company: "Green Dot Public Schools",
          location: "Los Angeles, CA",
          startDate: "2015-08-01",
          endDate: "2018-12-01",
          description:
            "• Increased Advanced Placement (AP) exam pass rates by 20% through strategic teacher mentorship and resource allocation.",
          visible: true,
        },
        {
          position: "Science Department Chair",
          company: "Alliance College-Ready Public Schools",
          location: "Los Angeles, CA",
          startDate: "2011-09-01",
          endDate: "2015-07-01",
          description:
            "• Revised the science department's assessment strategy to include formative assessments with a 22% improvement in student performance.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "University of California, Berkeley",
          degree: "Bachelor of Science in Biology",
          location: "Berkeley, CA",
          startDate: "2007-01-01",
          endDate: "2011-01-01",
          visible: true,
        },
      ],
      languages: [
        { language: "English", proficiency: "Native", visible: true },
        { language: "Spanish", proficiency: "Intermediate", visible: true },
      ],
      sectionOrder: [
        "personal-info",
        "experience",
        "education",
        "skills",
        "languages",
        "profile",
        "courses",
        "interests",
      ],
    },
  },
  // =========================================================================
  // 18. BOLD — Single-column with timeline, orange accent, dark navy
  //     headings, two-column key achievements, underlined skills row
  // =========================================================================
  {
    name: "Bold",
    description:
      "Single-column with timeline entries and bold section headings",
    data: {
      title: "Bold Resume",
      layout: "single-column",
      templateName: "bold",
      colorHex: "#e67e22",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "With over 9 years of experience in data science, including advanced classification, regression modeling, and proficient use of R and Python for data analysis, I bring a solid track record of applying data analysis to achieve substantial business outcomes.",
      firstName: "Grace",
      lastName: "Jackson",
      jobTitle: "Data Scientist | Advanced Analytics | Machine Learning",
      city: "San Francisco",
      country: "CA",
      phone: "+1-(234)-555-1234",
      email: "help@enhancv.com",
      linkedin: "linkedin.com",
      skills: [
        "Statistical Modeling",
        "Data Visualization",
        "Data Wrangling",
        "R",
        "Python",
        "SQL",
      ],
      workExperiences: [
        {
          position: "Senior Data Scientist",
          company: "Tech Innovations Inc.",
          location: "San Francisco, CA",
          startDate: "2020-02-01",
          endDate: "",
          description:
            "• Led a team to optimize algorithm performance, improving data processing efficiency by 30% and reducing costs by 15%.",
          visible: true,
        },
        {
          position: "Data Scientist",
          company: "Global Analytics Corp.",
          location: "San Francisco, CA",
          startDate: "2017-05-01",
          endDate: "2020-01-01",
          description:
            "• Developed a real-time anomaly detection system that reduced false positives by 35%, enhancing data integrity.",
          visible: true,
        },
        {
          position: "Data Analyst",
          company: "Insightful Data Solutions",
          location: "San Francisco, CA",
          startDate: "2014-09-01",
          endDate: "2017-04-01",
          description:
            "• Processed and analyzed sales data, uncovering key trends that led to a 10% lift in sales performance.\n• Created comprehensive reports and dashboards that provided actionable insights for stakeholder decision-making.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "University of California, Berkeley",
          degree: "MSc Applied Mathematics",
          location: "Berkeley, CA",
          startDate: "2012-01-01",
          endDate: "2014-01-01",
          visible: true,
        },
        {
          school: "San Francisco State University",
          degree: "Bachelor of Science in Statistics",
          location: "San Francisco, CA",
          startDate: "2008-01-01",
          endDate: "2012-01-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "education",
        "skills",
      ],
    },
  },
  // =========================================================================
  // 19. EXECUTIVE PRO — Two-column with dark navy header bar, photo in header,
  //     section headings with underline, key achievements with icons,
  //     skills with underlines
  // =========================================================================
  {
    name: "Executive Pro",
    description: "Two-column with dark header bar and photo, icon achievements",
    data: {
      title: "Executive Pro Resume",
      layout: "two-column",
      templateName: "executive-pro",
      photoUrl: "/templates/indianman.jpg",
      colorHex: "#1a365d",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "With over a decade of experience in the biopharmaceutical industry, I have successfully spearheaded business development initiatives, consistently exceeding sales targets. My acumen in maintaining relationships, analyzing market trends, and leading high-impact projects has been a cornerstone of my career, highlighted by a pivotal role in generating $30M in new business for a leading CRO. Eager to bring my expertise to a senior business development position.",
      firstName: "Brandon",
      lastName: "Hale",
      jobTitle:
        "Senior Business Development Director | Biotech & Pharma Expertise",
      city: "Jacksonville",
      country: "Florida",
      phone: "+1-(234)-555-1234",
      email: "help@enhancv.com",
      linkedin: "linkedin.com",
      skills: [
        "Business Development",
        "Strategic Sales Planning",
        "Client Retention Strategies",
        "CRM Systems",
        "Market Analysis",
      ],
      workExperiences: [
        {
          position: "Business Development Manager",
          company: "Genentech",
          location: "San Francisco, CA, USA",
          startDate: "2018-05-01",
          endDate: "2021-12-01",
          description:
            "• Generated $30M in new sales revenue by identifying and securing strategic partnerships within the biotechnology sector.",
          visible: true,
        },
        {
          position: "Regional Sales Director",
          company: "Regeneron Pharmaceuticals",
          location: "Tarrytown, NY, USA",
          startDate: "2015-01-01",
          endDate: "2018-04-01",
          description:
            "• Surpassed sales goals by 20% for two consecutive years, growing the regional sales revenue to $50M.",
          visible: true,
        },
        {
          position: "Key Account Manager",
          company: "Pfizer Inc",
          location: "New York, NY, USA",
          startDate: "2010-06-01",
          endDate: "2014-12-01",
          description:
            "• Managed the growth of strategic accounts, resulting in a 35% increase in annual revenue from top-tier clients.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "University of Florida",
          degree: "Master of Business Administration",
          location: "Gainesville, FL, USA",
          startDate: "2007-01-01",
          endDate: "2009-01-01",
          visible: true,
        },
        {
          school: "Florida State University",
          degree: "Bachelor of Science in Biotechnology",
          location: "Tallahassee, FL, USA",
          startDate: "2003-01-01",
          endDate: "2007-01-01",
          visible: true,
        },
      ],
      courses: [
        {
          name: "Advanced Biopharmaceutical Business Development",
          institution:
            "Explored strategic partnership models and contract negotiations offered by Harvard Business School.",
          visible: true,
        },
        {
          name: "Regulatory Affairs for Biologics",
          institution:
            "Covered the key aspects of FDA and EMA regulations through a course provided by Coursera.",
          visible: true,
        },
      ],
      interests: [
        { name: "Leadership and Mentoring", visible: true },
        { name: "Community Outreach", visible: true },
      ],
      sectionOrder: [
        "personal-info",
        "experience",
        "education",
        "skills",
        "profile",
        "courses",
        "interests",
      ],
    },
  },
  // =========================================================================
  // 20. CLASSIC TIMELINE — Two-column with left section labels, vertical
  //     timeline line with dots, gold border frame, monogram circle
  // =========================================================================
  {
    name: "Classic Timeline",
    description: "Timeline with section labels, gold border, and monogram",
    data: {
      title: "Classic Timeline Resume",
      layout: "single-column",
      templateName: "classic-timeline",
      photoUrl: "/templates/whiteguy.jpg",
      colorHex: "#c0392b",
      borderStyle: "squircle",
      fontSize: 10,
      fontFamily: "sans-serif",
      summary:
        "Experienced in sales planning, marketing strategies, and advertising development over a 14-year career. Proficient in growing categories, managing inventory, and tracking trends to optimize campaigns. Highly skilled in negotiations, project management, and strategic planning with exceptional industry expertise and top-notch communication abilities. Proficient in monitoring trends and capitalizing on emerging opportunities.",
      firstName: "Craig",
      lastName: "Walker",
      jobTitle: "Chief Marketing Officer",
      city: "Deltona",
      country: "FL 32725",
      phone: "(555) 555 5555",
      email: "example@example.com",
      skills: [
        "Digital marketing expert",
        "Analytical",
        "Communication",
        "Creativity",
      ],
      workExperiences: [
        {
          position: "Chief Marketing Officer (CMO)",
          company: "Vettana",
          location: "Deltona, FL",
          startDate: "2017-06-01",
          endDate: "",
          description:
            "• Oversee development of traditional and social media marketing campaigns to drive stores and customer engagement.\n• Manage branding campaigns and event marketing initiatives in print, video, web, and social media.",
          visible: true,
        },
        {
          position: "Brand Manager",
          company: "Nestle USA",
          location: "Sanford, FL",
          startDate: "2011-01-01",
          endDate: "2017-06-01",
          description:
            "• Planned, implemented, and tracked sales and marketing strategies to promote brand products.\n• Conceptualized brand identity and developed unique accompanying graphic style and tone for use in communications.",
          visible: true,
        },
        {
          position: "Assistant Brand Manager",
          company: "Nestle USA",
          location: "Sanford, FL",
          startDate: "2007-05-01",
          endDate: "2011-01-01",
          description:
            "• Worked with three marketing teams to create, deploy and optimize effective marketing tactics for the company.\n• Consulted with product development teams to enhance products based on customer data.",
          visible: true,
        },
      ],
      educations: [
        {
          school: "Florida Technical College, DeLand, FL",
          degree: "MBA",
          fieldOfStudy: "Business Administration And Management",
          startDate: "2005-01-01",
          endDate: "2007-01-01",
          visible: true,
        },
        {
          school: "Daytona State College, Deltona, FL",
          degree: "Bachelor of Science",
          fieldOfStudy: "Business Communications",
          startDate: "2001-01-01",
          endDate: "2005-01-01",
          visible: true,
        },
      ],
      sectionOrder: [
        "personal-info",
        "profile",
        "experience",
        "skills",
        "education",
      ],
    },
  },
];
