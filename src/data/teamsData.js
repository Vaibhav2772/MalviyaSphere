// Mock Teams Data for MalviyaSphere Teams Module
// Realistic campus project teams, open recruitment positions, join requests, and invitations

export const MOCK_TEAMS = [
  {
    id: 'team-1',
    name: 'RoboMalviya Autonomous Rover',
    logo: '🤖',
    objective: 'Building an autonomous LiDAR & Computer Vision navigation rover for National Robocon 2025.',
    description: 'RoboMalviya is an interdisciplinary team from CSE, ECE, and EE creating an autonomous ground vehicle capable of obstacle navigation, stereoscopic terrain mapping, and precision target delivery. We test algorithms in ROS2 simulations and deploy on physical hardware with NVIDIA Jetson and STM32 motor controllers.',
    category: 'technology',
    categoryLabel: 'Robotics & AI',
    requiredSkills: ['ROS / ROS2', 'OpenCV', 'Embedded C++', 'Python', 'SLAM'],
    maxMembers: 5,
    leadId: 'student-1', // Aarav Sharma
    members: [
      { studentId: 'student-1', role: 'Team Lead & Robotics Systems', joinedAt: '2025-01-10' },
      { studentId: 'student-6', role: 'Telemetry & Sensor Systems', joinedAt: '2025-01-14' },
      { studentId: 'student-2', role: 'Perception & Computer Vision', joinedAt: '2025-01-18' },
    ],
    openRoles: [
      {
        id: 'r1',
        title: 'Firmware & Microcontroller Engineer',
        skills: ['Embedded C++', 'STM32 / Arduino', 'CAN Bus'],
        description: 'Implement real-time motor controller firmware, PID stabilization, and serial sensor telemetry.',
      },
      {
        id: 'r2',
        title: 'Path Planning & Simulation Engineer',
        skills: ['ROS2', 'Gazebo', 'Python'],
        description: 'Develop and benchmark dynamic obstacle avoidance in Gazebo simulation before physical trials.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: 'https://github.com/mmmut-robotics/autonomous-rover',
    createdAt: '2025-01-10',
  },
  {
    id: 'team-2',
    name: 'CampusPulse Student Portal',
    logo: '📱',
    objective: 'Developing a centralized real-time campus event and club notices platform for MMMUT.',
    description: 'CampusPulse consolidates college club updates, departmental notices, hostel mess menus, and hackathon schedules into one progressive web app. Currently built on React.js with offline sync capability and instant push notifications.',
    category: 'technology',
    categoryLabel: 'Web & Mobile Dev',
    requiredSkills: ['React.js', 'Node.js & Express', 'PostgreSQL', 'UI/UX Design'],
    maxMembers: 4,
    leadId: 'student-2', // Priya Patel
    members: [
      { studentId: 'student-2', role: 'Product Lead & Backend', joinedAt: '2025-01-12' },
      { studentId: 'student-1', role: 'Frontend Architect', joinedAt: '2025-01-15' },
      { studentId: 'student-5', role: 'Lead UI/UX Designer', joinedAt: '2025-01-22' },
    ],
    openRoles: [
      {
        id: 'r3',
        title: 'DevOps & Cloud Deployment Lead',
        skills: ['Docker', 'Nginx', 'CI/CD Pipelines'],
        description: 'Configure automated container deployment, SSL termination, and caching for high campus traffic.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: 'https://github.com/mmmut-devs/campuspulse',
    createdAt: '2025-01-12',
  },
  {
    id: 'team-3',
    name: 'Malviya Rhythms Acoustic Collective',
    logo: '🎸',
    objective: 'Composing original acoustic fusion tracks and live arrangements for university cultural fests.',
    description: 'An acoustic-led musical ensemble blending Indian classical melodies with fingerstyle guitar, percussions, and vocal harmonies. We rehearse twice weekly in the student center and are preparing our 4-track original studio EP.',
    category: 'music',
    categoryLabel: 'Acoustic Fusion & Production',
    requiredSkills: ['Acoustic Guitar & Fingerstyle', 'Vocal Harmonies', 'Percussion / Cajon', 'Audio Mixing'],
    maxMembers: 5,
    leadId: 'student-3', // Riya Sen
    members: [
      { studentId: 'student-3', role: 'Lead Guitarist & Arranger', joinedAt: '2025-01-08' },
      { studentId: 'student-6', role: 'Sound Engineer & Photography', joinedAt: '2025-01-16' },
    ],
    openRoles: [
      {
        id: 'r4',
        title: 'Percussionist (Cajon / Tabla)',
        skills: ['Cajon', 'Tabla', 'Rhythm Coordination'],
        description: 'Provide dynamic tempo support for live acoustic showcases and rhythmic breakdown sections.',
      },
      {
        id: 'r5',
        title: 'Keyboard / Synthesizer Player',
        skills: ['Keyboard', 'Ambient Pads', 'MIDI Sequencing'],
        description: 'Layer harmonic pads and melodic fills into recorded tracks and live college performances.',
      },
      {
        id: 'r6',
        title: 'Female / Male Vocalist',
        skills: ['Lead Vocals', 'Harmonies', 'Pitch Control'],
        description: 'Share lead vocal duties and arrange multi-part vocal harmonies for original acoustic compositions.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: 'https://soundcloud.com/malviya-rhythms',
    createdAt: '2025-01-08',
  },
  {
    id: 'team-4',
    name: 'Garuda Esports Championship Squad',
    logo: '🎮',
    objective: 'Representing MMMUT in collegiate BGMI esports tournaments and national university scrims.',
    description: 'Garuda Esports is a disciplined competitive roster competing in collegiate leagues. We focus on tactical map rotations, weapon recoil mastery, coordinated utility usage, and match VOD reviews with scheduled scrim slots.',
    category: 'gaming',
    categoryLabel: 'Competitive Esports',
    requiredSkills: ['BGMI (Battlegrounds Mobile India)', 'In-Game Comms', 'Tactical Rotations', 'Scrim Experience'],
    maxMembers: 4,
    leadId: 'student-4', // Vikram Singh
    members: [
      { studentId: 'student-4', role: 'In-Game Leader (IGL)', joinedAt: '2025-01-05' },
      { studentId: 'student-1', role: 'Support & DMR Fragger', joinedAt: '2025-01-10' },
      { studentId: 'student-6', role: 'Entry Assaulter', joinedAt: '2025-01-20' },
    ],
    openRoles: [
      {
        id: 'r7',
        title: 'Dedicated Sniper & Scout',
        skills: ['Bolt Action Precision', 'Map Vision', 'Positioning'],
        description: 'Hold high-ground perimeters, gather intelligence on enemy team movements, and execute long-range picks.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: '',
    createdAt: '2025-01-05',
  },
  {
    id: 'team-5',
    name: 'TechSrijan Creative Identity & UI Lab',
    logo: '🎨',
    objective: 'Designing brand systems, festival motion graphics, and interactive web aesthetics for campus events.',
    description: 'We are the creative design collective behind MMMUT’s largest annual techno-management festival. We design 3D typography tokens, event badges, interactive websites, digital banners, and motion teaser trailers.',
    category: 'art-design',
    categoryLabel: 'Brand & Visual Design',
    requiredSkills: ['Logo & Brand Identity Design', 'Figma', 'College Fest & Event Creatives', 'Motion Graphics'],
    maxMembers: 4,
    leadId: 'student-5', // Neha Chaurasia
    members: [
      { studentId: 'student-5', role: 'Creative Director & Lead Designer', joinedAt: '2025-01-09' },
      { studentId: 'student-3', role: 'Motion Sound & Video Sync', joinedAt: '2025-01-25' },
    ],
    openRoles: [
      {
        id: 'r8',
        title: '3D Asset & Blender Artist',
        skills: ['Blender', '3D Modeling', 'Lighting'],
        description: 'Model futuristic sci-fi festival themes and hero mascots for web render backgrounds.',
      },
      {
        id: 'r9',
        title: 'UI/UX Interactive Prototyper',
        skills: ['Figma Components', 'Design Systems', 'Micro-interactions'],
        description: 'Create responsive design components and hand off clean UI tokens to the web development team.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: 'https://behance.net/techsrijan-lab',
    createdAt: '2025-01-09',
  },
  {
    id: 'team-6',
    name: 'Gorakhpur AI Civic Intelligence Project',
    logo: '🏛️',
    objective: 'Building computer vision and anomaly detection models for city traffic and infrastructure monitoring.',
    description: 'A civic data science initiative utilizing municipal public surveillance datasets and drone imagery to detect road potholes, traffic density bottlenecks, and municipal waste overflows in Gorakhpur city.',
    category: 'technology',
    categoryLabel: 'Artificial Intelligence',
    requiredSkills: ['Computer Vision (OpenCV)', 'PyTorch / TensorFlow', 'Python', 'GIS Data'],
    maxMembers: 4,
    leadId: 'student-1', // Aarav Sharma
    members: [
      { studentId: 'student-1', role: 'Project Coordinator', joinedAt: '2025-01-02' },
      { studentId: 'student-2', role: 'Deep Learning Lead', joinedAt: '2025-01-04' },
      { studentId: 'student-4', role: 'Civic Data Collector', joinedAt: '2025-01-08' },
      { studentId: 'student-6', role: 'Drone Image Surveyor', joinedAt: '2025-01-11' },
    ],
    openRoles: [],
    isExplicitlyClosed: true, // Demonstrates explicitly closed / full team
    projectLink: 'https://github.com/mmmut-ai/gorakhpur-civic-vision',
    createdAt: '2025-01-02',
  },
  {
    id: 'team-7',
    name: 'MMMUT Solar Electric Vehicle (SEV)',
    logo: '⚡',
    objective: 'Designing an aerodynamic solar-assisted lightweight electric vehicle for national collegiate challenges.',
    description: 'Engineering a high-efficiency prototype electric vehicle featuring custom battery management systems (BMS), regenerative braking, lightweight composite chassis, and MPPT solar tracking arrays.',
    category: 'technology',
    categoryLabel: 'CleanTech & Automotive',
    requiredSkills: ['Embedded C++', 'Power Electronics', 'Battery Management Systems (BMS)', 'CAD & FEA'],
    maxMembers: 6,
    leadId: 'student-6', // Rohan Joshi
    members: [
      { studentId: 'student-6', role: 'Electrical Powertrain Lead', joinedAt: '2025-01-07' },
      { studentId: 'student-4', role: 'Structural Chassis Designer', joinedAt: '2025-01-12' },
      { studentId: 'student-1', role: 'Telemetry Dashboard Dev', joinedAt: '2025-01-19' },
    ],
    openRoles: [
      {
        id: 'r10',
        title: 'BMS & High-Voltage Safety Engineer',
        skills: ['Power Electronics', 'PCB Design', 'Safety Cutoffs'],
        description: 'Design multi-cell Li-ion balancing circuitry, thermal safety relays, and CAN bus telemetry.',
      },
      {
        id: 'r11',
        title: 'Aerodynamics & CFD Analyst',
        skills: ['Ansys Fluent', 'SolidWorks CAD', 'Airflow Optimization'],
        description: 'Perform computational fluid dynamic simulations to minimize drag coefficient of the composite body.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: 'https://github.com/mmmut-racing/solar-ev',
    createdAt: '2025-01-07',
  },
  {
    id: 'team-8',
    name: 'Malviya Inter-College Badminton Squad',
    logo: '🏸',
    objective: 'Training for state inter-university zonal championships in singles and doubles.',
    description: 'Competitive badminton training group organizing daily morning conditioning, footwork drills, match video analysis, and weekly doubles sparring at the university indoor sports complex.',
    category: 'sports',
    categoryLabel: 'Athletics & Badminton',
    requiredSkills: ['Competitive Badminton', 'Singles Tactics', 'Doubles Positioning', 'Agility Conditioning'],
    maxMembers: 4,
    leadId: 'student-4', // Vikram Singh
    members: [
      { studentId: 'student-4', role: 'Squad Captain', joinedAt: '2025-01-03' },
      { studentId: 'student-2', role: 'Women Singles Lead', joinedAt: '2025-01-15' },
    ],
    openRoles: [
      {
        id: 'r12',
        title: 'Men Doubles Specialist',
        skills: ['Smash Power', 'Net Defense', 'Quick Rotations'],
        description: 'Pair with squad captain for aggressive front-and-back attacking doubles sets.',
      },
      {
        id: 'r13',
        title: 'Mixed Doubles Partner',
        skills: ['Consistent Rallying', 'Drop Shots', 'Stamina'],
        description: 'Compete in inter-college mixed doubles bracket matches.',
      },
    ],
    isExplicitlyClosed: false,
    projectLink: '',
    createdAt: '2025-01-03',
  },
];

// Initial mock join requests
export const MOCK_JOIN_REQUESTS = [
  {
    id: 'req-1',
    teamId: 'team-1',
    studentId: 'student-3',
    message: 'Hey Aarav! I would love to help with the audio signal processing and embedded electronics for the rover!',
    status: 'pending',
    createdAt: '2025-02-01',
  },
  {
    id: 'req-2',
    teamId: 'team-3',
    studentId: 'student-1',
    message: 'Hi Riya, I play keyboard and can help with MIDI sequencing, pads, and audio recording software.',
    status: 'pending',
    createdAt: '2025-02-03',
  },
];

// Initial mock invitations
export const MOCK_INVITATIONS = [
  {
    id: 'inv-1',
    teamId: 'team-2',
    studentId: 'student-5',
    invitedBy: 'student-2',
    role: 'UI/UX Brand Designer',
    message: 'Hey Neha, we love your design work on TechSrijan and want you to lead CampusPulse UI!',
    status: 'pending',
    createdAt: '2025-02-04',
  },
];

// Helper to compute team recruitment status
export function computeRecruitmentStatus(team) {
  if (!team) return 'closed';
  const currentMembersCount = team.members ? team.members.length : 0;
  const max = team.maxMembers || 4;

  if (team.isExplicitlyClosed || currentMembersCount >= max) {
    return 'closed';
  }
  if (max - currentMembersCount <= 1) {
    return 'almost_full';
  }
  return 'open';
}

// Available domain categories for filtering
export const TEAM_CATEGORIES = [
  { id: 'all', label: 'All Domains' },
  { id: 'technology', label: 'Technology & AI' },
  { id: 'art-design', label: 'Art & Design' },
  { id: 'music', label: 'Music & Audio' },
  { id: 'gaming', label: 'Gaming & Esports' },
  { id: 'sports', label: 'Sports & Fitness' },
  { id: 'photography', label: 'Photography & Media' },
];

// Popular skills list for quick selection & filters
export const POPULAR_TEAM_SKILLS = [
  'React.js',
  'Node.js & Express',
  'Python',
  'PyTorch / TensorFlow',
  'ROS / ROS2',
  'OpenCV',
  'Embedded C++',
  'Figma',
  'Logo & Brand Identity Design',
  'Acoustic Guitar & Fingerstyle',
  'BGMI (Battlegrounds Mobile India)',
  'Docker',
  'Power Electronics',
  'Competitive Badminton',
];
