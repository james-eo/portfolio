'use client';

import { Phone, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

const UploadedResume = () => {
  const currentDate = new Date()
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

  return (
    <div className="resume-page resume-uploaded shadow-lg">
      <div className="no-print absolute top-4 right-4 text-xs text-gray-500">Uploaded Template</div>

      {/* Page 1 */}
      <div className="mb-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-1">James OKONKWO</h1>
          <h2 className="text-xl text-gray-700 mb-3">Backend Software Engineer</h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Linkedin size={14} /> linkedin.com/in/james-o
            </div>
            <div className="flex items-center gap-1">
              <Github size={14} /> github.com/james-eo
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} /> +2347032370055
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} /> jameseokonkwo@gmail.com
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} /> Abuja, Nigeria
            </div>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 flex items-center">
            <span className="mr-2">◎</span>SUMMARY
          </h3>
          <p className="text-sm">
            Results-driven Backend Engineer with demonstrated hands-on experience in developing
            scalable web applications using Python, JavaScript/TypeScript, Node.js, and C. Skilled
            in designing and implementing robust RESTful APIs and backend systems, complemented by
            strong project management and technical documentation skills gained through diverse
            professional roles. Proven ability to manage technical projects and collaborate
            effectively with cross-functional teams.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 flex items-center">
            <span className="mr-2">⚙</span>COMPETENCES
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <span className="font-semibold">Programming Languages</span> Python, JavaScript, SQL,
              C, TypeScript
            </div>
            <div>
              <span className="font-semibold">Backend Frameworks</span> Flask, Django, Node.js,
              Express.js, RESTful APIs
            </div>
            <div>
              <span className="font-semibold">Frontend Frameworks</span> HTML, React, Jinja2,
              Bootstrap, Tailwind CSS, Material-UI
            </div>
            <div>
              <span className="font-semibold">Database Management</span> MySQL, PostgreSQL, MongoDB
            </div>
            <div>
              <span className="font-semibold">System Engineering and DevOps</span> Docker, Nginx,
              Apache, Linux, Shell scripting, CI/CD (GitLab, GitHub Actions, Puppet)
            </div>
            <div>
              <span className="font-semibold">Development and Debugging Tools</span> Postman, Curl,
              Vim, Visual Studio Code, Unittest, Mocha, Jest, ESLint, Betty
            </div>
            <div>
              <span className="font-semibold">Collaboration and Version Control</span> Git/Github,
              Kanban(Trello), Slack, Discord
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 flex items-center">
            <span className="mr-2">🎓</span>EDUCATION
          </h3>

          <div className="mb-2">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-base">
                  Software Engineering | ALX Africa | Holberton School
                </h4>
              </div>
              <div className="text-sm">2024</div>
            </div>
            <p className="text-sm">
              Software Engineering, System Engineering and DevOps, Databases, Site Reliability
              Engineering, Back-End Specialization
            </p>
          </div>

          <div className="mb-2">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-base">Data Science Professional Certificate | IBM</h4>
              </div>
              <div className="text-sm">2023</div>
            </div>
            <p className="text-sm">
              Data Wrangling, Data Modelling, Data Analysis, Data Visualization, Machine Learning
            </p>
          </div>

          <div>
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-base">B.A. Philosophy | University of Ibadan</h4>
              </div>
              <div className="text-sm">2015</div>
            </div>
            <p className="text-sm">Computer Science, Logic, Argument and Critical thinking</p>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 flex items-center">
            <span className="mr-2">🚀</span>PROJECTS
          </h3>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base">REMOTEHUB | A FULL STACK JOB SEARCH PLATFORM</h4>
              <div className="text-sm">2024</div>
            </div>
            <p className="text-sm mb-2">
              A full-featured job search platform for remote work opportunities developed using the
              MERN stack, TypeScript, Next.js, and Tailwind CSS. Implemented advanced features
              including user authentication, job recommendations, and filtering. Created a scalable
              RESTful API for complex data management and a responsive, mobile-friendly frontend.
            </p>
            <div className="flex items-center gap-4 mb-2">
              <a
                href="https://github.com/james-eo/remotehub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 flex items-center"
              >
                <Github size={14} className="mr-1" /> github.com/james-eo/remotehub
              </a>
              <a
                href="https://remotehub.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 flex items-center"
              >
                <ExternalLink size={14} className="mr-1" /> RemoteHub
              </a>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Node.js</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Express.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">MongoDB</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                React.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Next.js</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                TypeScript
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Tailwind CSS
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base">LETSTALK | A REAL-TIME CHAT APPLICATION</h4>
              <div className="text-sm">2024</div>
            </div>
            <p className="text-sm mb-2">
              A real-time chat application developed using the MERN stack and Socket.io, supporting
              5000+ simultaneous users with a search feature. Implemented end-to-end encryption and
              user authentication with JWT. Created a responsive UI using React and Tailwind CSS.
              Integrated bcrypt for secure user data hashing.
            </p>
            <div className="flex items-center gap-4 mb-2">
              <a
                href="https://github.com/james-eo/LetsTalk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 flex items-center"
              >
                <Github size={14} className="mr-1" /> github.com/james-eo/LetsTalk
              </a>
              <a href="#" className="text-sm text-blue-600 flex items-center">
                <ExternalLink size={14} className="mr-1" /> Repository
              </a>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Node.js</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Express.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">MongoDB</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                React.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Tailwind CSS
              </span>
            </div>
          </div>
        </section>

        {/* Page footer */}
        <footer className="text-xs text-gray-500 text-right">
          {currentDate} <span className="ml-4">JAMES OKONKWO</span> <span className="ml-4">1</span>
        </footer>
      </div>

      {/* Page 2 */}
      <div className="page-break-before">
        {/* Projects continued */}
        <section className="mb-6">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base">FILE MANAGEMENT SYSTEM | BACKEND API</h4>
              <div className="text-sm">2024</div>
            </div>
            <p className="text-sm mb-2">
              Built a secure file management API using Node.js, Express.js, and MongoDB with
              role-based access control. Implemented JWT authentication and bcrypt hashing for user
              security. Used Bull queues for background image thumbnail generation and leveraged
              Redis caching to improve response times. Leveraged Redis caching to improve response
              times for frequent file operations. Integrated JWT for user authentication, ensuring
              secure access to the file management system.
            </p>
            <div className="flex items-center gap-4 mb-2">
              <a
                href="https://github.com/james-eo/alx-files_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 flex items-center"
              >
                <Github size={14} className="mr-1" /> github.com/james-eo/alx-files_manager
              </a>
              <a href="#" className="text-sm text-blue-600 flex items-center">
                <ExternalLink size={14} className="mr-1" /> Repository
              </a>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Node.js</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Express.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">MongoDB</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Redis</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Bull</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Mocha</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base">TRIPTAILOR | A HOTEL RECOMMENDATION APP</h4>
              <div className="text-sm">MAY 2024</div>
            </div>
            <p className="text-sm mb-2">
              A hotel recommendation app built using Django, with RESTful APIs for frontend-backend
              communication. Designed a scalable database architecture using Django ORM and
              migrations for efficient data management. Implemented the frontend using DTL and CSS3
              for a responsive user interface. Developed a recommendation algorithm to suggest
              hotels based on user preferences and past bookings. Integrated user authentication
              with JWT to provide personalized recommendations and secure user accounts. Implemented
              bcrypt for hashing user passwords and protecting user data from potential security
              breaches.
            </p>
            <div className="flex items-center gap-4 mb-2">
              <a
                href="https://github.com/james-eo/TripTailor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 flex items-center"
              >
                <Github size={14} className="mr-1" /> github.com/james-eo/TripTailor
              </a>
              <a href="#" className="text-sm text-blue-600 flex items-center">
                <ExternalLink size={14} className="mr-1" /> Repository
              </a>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Django</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Jinja</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">SQLite</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">CSS</span>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 flex items-center">
            <span className="mr-2">💼</span>EXPERIENCE
          </h3>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base">Freelance Software Engineer, E-COMMERCE</h4>
                <h5 className="text-sm">Remote</h5>
              </div>
              <div className="text-sm">August 2024 - Present</div>
            </div>
            <ul className="list-none ml-5 text-sm mt-2">
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Built a responsive e-commerce platform using the MERN stack and integrated Stripe
                  API, resulting in a 25% increase in conversion rates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Implemented secure user authentication and user data hashing using JWT and bcrypt,
                  enhancing platform security against common vulnerabilities.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Created intuitive admin dashboard for inventory management, reducing product
                  management time by 40%.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Designed a responsive UI with Tailwind CSS, enhancing user experience across
                  various devices and improving mobile engagement by 30%.
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">MongoDB</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Express.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                React.js
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Node.js</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Tailwind CSS
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base">
                  Communications Officer | Mavsons Enterprises
                </h4>
                <h5 className="text-sm">FCT, Abuja</h5>
              </div>
              <div className="text-sm">January 2022 - August 2022</div>
            </div>
            <ul className="list-none ml-5 text-sm mt-2">
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Coordinated and hosted virtual meetings on Microsoft Teams with technical set-up.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Documented meetings and maintained detailed records of project communications.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Organized printing and distribution of technical documents for client projects.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Managed project timelines and ensured timely delivery of communication materials.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Streamlined internal workflows through effective digital communication practices.
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Microsoft Office
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Microsoft Teams
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Google Meet
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Zoom</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Excel</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base">Data Analyst | Intern</h4>
                <h5 className="text-sm">MENICUM TECHNOLOGIES, FCT Abuja</h5>
              </div>
              <div className="text-sm">August 2022 - December 2022</div>
            </div>
            <ul className="list-none ml-5 text-sm mt-2">
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Analyzed sales data using SQL and Python, identifying trends that increased
                  revenue by 10%.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>Created data visualizations using Tableau for executive presentations.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>Presented findings and recommendations to team members and management.</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Python</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">SQL</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Excel</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Tableau</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base">Teacher | Sanctus Lumen Christi Schools</h4>
                <h5 className="text-sm">FCT, Abuja</h5>
              </div>
              <div className="text-sm">January 2021 - August 2022</div>
            </div>
            <ul className="list-none ml-5 text-sm mt-2">
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Managed technical documentation including report books, diaries, and registers.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Organized and supervised educational projects from planning to successful
                  completion.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Developed curricula that integrated technical documentation and project
                  management.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>Facilitated clear and concise communication between students and staff.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">∠</span>
                <span>
                  Coordinated extracurricular initiatives to boost overall student engagement.
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Microsoft Office
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                School Registers
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                Spread Sheets
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                School diary
              </span>
            </div>
          </div>
        </section>

        {/* Page footer */}
        <footer className="text-xs text-gray-500 text-right">
          {currentDate} <span className="ml-4">JAMES OKONKWO</span> <span className="ml-4">2</span>
        </footer>
      </div>
    </div>
  );
};

export default UploadedResume;
