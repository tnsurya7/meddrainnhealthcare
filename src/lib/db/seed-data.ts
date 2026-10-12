import {
  NewSiteSettings,
  NewCourse,
  NewService,
  NewGalleryImage,
  NewFeedback,
} from "./schema";

export const initialSiteSettings: NewSiteSettings = {
  id: "default",
  instituteName: "Meddrainn Healthcare",
  address: "H-42, 80 Feet Road, Periyar Nagar, Erode - 638001, Tamil Nadu, India.",
  phone: "+91 6380918863",
  email: "meddrainnhealthcare2019@gmail.com",
  instagramUrl: "https://www.instagram.com/meddrainnhealthcare/",
  logoUrl: "/images/MeddRainn Healthcare Logo Header.png",
  heroTitle: "WELCOME TO MEDDRAINN HEALTHCARE",
  heroDescription:
    "Established in 2021, Meddrainn Healthcare is focused on equipping future healthcare professionals with practical expertise and industry-ready skills. We connect academic knowledge with real-world healthcare needs through hands-on training in medical equipment, specialized healthcare sales and marketing programs, and professional hospital support services.\n\nAt Meddrainn Healthcare, we are committed to excellence, innovation, and collaboration, preparing professionals for successful and rewarding careers in the healthcare and biomedical sector.",
  heroImageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85",
  aboutContent:
    "Established in 2021, Meddrainn Healthcare is focused on equipping future healthcare professionals with practical expertise and industry-ready skills. We connect academic knowledge with real-world healthcare needs through hands-on training in medical equipment, specialized healthcare sales and marketing programs, and professional hospital support services.\n\nAt Meddrainn Healthcare, we are committed to excellence, innovation, and collaboration, preparing professionals for successful and rewarding careers in the healthcare and biomedical sector.",
  mission:
    "• To provide high quality hands-on training in medical equipment and biomedical technology.\n• To conduct industry oriented workshops, seminars and webinars.\n• To offer internship programs that build real world technical skills.\n• To support students with placement assistance and career guidance.\n• To bridge the gap between academic learning and healthcare industry requirements.",
  vision:
    "To become a leading institution in medical equipment training and biomedical skill development, empowering students and professionals with practical knowledge, industry exposure and career opportunities in the healthcare technology sector.",
  galleryHeading: "Our Gallery",
  galleryDescription:
    "A glimpse into our practical biomedical training environment. Explore real moments from our hands-on biomedical training sessions, equipment demonstrations and hospital exposure programs at Meddrainn Healthcare.",
  footerText: "© Meddrainn Healthcare. All rights reserved. Empowering future healthcare professionals with practical expertise.",
  seoTitle: "Meddrainn Healthcare | Professional Biomedical Training Institute",
  seoDescription:
    "Medical equipment training, healthcare workshops, clinical internships, and professional biomedical skills in Erode, Tamil Nadu.",
  publicGalleryVisibility: true,
  studentShowcaseVisibility: true,
  feedbackEnabled: true,
  privacyPolicyContent:
    "At Meddrainn Healthcare, we value and respect your privacy. Any personal information gathered through admission or training enquiries (including student name, phone number, and email address) is used strictly to communicate academic details and admission guidance. We do not sell, rent, or share personal data with any third parties.",
};

export const initialCourses: Omit<NewCourse, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Biomedical Equipment Calibration & Safety Testing",
    slug: "biomedical-equipment-calibration-safety-testing",
    shortDescription:
      "Master standard electrical safety testing, preventative maintenance, and calibration protocols for vital hospital instrumentation.",
    description:
      "This intensive program covers electrical safety analyzers, patient simulators, defibrillator analyzers, and standard operating procedures (SOPs) for medical equipment calibration. Participants gain direct practical experience adhering to NABH and international biomedical engineering compliance standards.",
    category: "Equipment Calibration",
    duration: "6 Weeks",
    eligibility: "B.E/B.Tech Biomedical, Medical Electronics, ECE, Diploma holders, or Life Science graduates",
    prerequisites: "Basic knowledge of electronics and circuit analysis",
    curriculum: [
      {
        module: "Module 1: Principles of Medical Equipment Safety",
        topics: [
          "IEC 60601 and IEC 62353 safety standards",
          "Chassis leakage and patient leakage currents",
          "Ground wire resistance and insulation testing",
        ],
      },
      {
        module: "Module 2: Diagnostic & Therapeutic Simulators",
        topics: [
          "ECG, NIBP, and SpO2 simulator verification",
          "Infusion and syringe pump analyzer testing",
          "Electrosurgical unit (ESU) output verification",
        ],
      },
      {
        module: "Module 3: Calibration Reporting & NABH Documentation",
        topics: [
          "Creating equipment breakdown and PPM schedules",
          "Issuing calibration certificates and sticker documentation",
          "Hospital audit readiness protocols",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Biomedical engineer testing medical device with safety analyzer and calibration tool",
    featured: true,
    status: "published",
    displayOrder: 1,
  },
  {
    title: "Clinical Instrumentation & Diagnostic Systems",
    slug: "clinical-instrumentation-diagnostic-systems",
    shortDescription:
      "Deep dive into the operational mechanics, circuit schematics, and sensor technologies of clinical diagnostic devices.",
    description:
      "Understand the physiological transducers, signal conditioning hardware, and display modules of essential hospital diagnostic equipment. Students examine real patient monitors, ECG recorders, pulse oximeters, and ultrasound scanners under the guidance of experienced biomedical trainers.",
    category: "Diagnostics",
    duration: "4 Weeks",
    eligibility: "Engineering and Diploma students in Biomedical, EEE, ECE, or Instrumentation",
    prerequisites: "Fundamentals of human anatomy and basic analog electronics",
    curriculum: [
      {
        module: "Module 1: Physiological Transducers & Sensors",
        topics: [
          "Biopotential electrodes and lead configurations",
          "Optical sensors in photoplethysmography (PPG)",
          "Piezoelectric transducers in medical ultrasound",
        ],
      },
      {
        module: "Module 2: Multichannel Patient Monitoring Systems",
        topics: [
          "ECG filtering, baseline wander removal, and amplifier design",
          "Non-invasive blood pressure oscillometric measurement",
          "Capnography (EtCO2) and temperature monitoring circuits",
        ],
      },
      {
        module: "Module 3: Troubleshooting Clinical Hardware",
        topics: [
          "Modular component diagnosis and board replacement",
          "Display inverter and power supply unit repair",
          "Sensor harness continuity testing",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Patient monitor oscilloscope and clinical diagnostic test leads",
    featured: true,
    status: "published",
    displayOrder: 2,
  },
  {
    title: "ICU & Critical Care Equipment Hands-on Training",
    slug: "icu-critical-care-equipment-training",
    shortDescription:
      "Practical troubleshooting, pneumatic controls, and maintenance of life-support ICU equipment including ventilators and defibrillators.",
    description:
      "Life-support technology requires zero tolerance for errors. This hands-on course instructs trainees on mechanical ventilators, anesthesia workstations, biphasic defibrillators, syringe infusion pumps, and dialysis machine fundamentals, focusing on pneumatic systems, oxygen blenders, and emergency bypass controls.",
    category: "Critical Care",
    duration: "8 Weeks",
    eligibility: "Biomedical engineering students, clinical engineers, and hospital biomedical technicians",
    prerequisites: "Completion of basic medical instrumentation coursework",
    curriculum: [
      {
        module: "Module 1: Mechanical Ventilators & Pneumatics",
        topics: [
          "Pneumatic block diagrams and proportional valve controls",
          "Flow sensors, exhalation valves, and PEEP calibration",
          "Alarm handling: high airway pressure and apnea backup",
        ],
      },
      {
        module: "Module 2: Defibrillators & Cardiac Monitors",
        topics: [
          "Biphasic waveform generation and high-voltage capacitor charging",
          "Pacing modes: demand vs fixed transcutaneous pacing",
          "Joule energy delivery testing using specialized watt-second meters",
        ],
      },
      {
        module: "Module 3: Syringe & Infusion Pump Service",
        topics: [
          "Lead screw drive mechanisms and optical drop sensors",
          "Occlusion pressure threshold calibration",
          "Battery maintenance and power failure alerts",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Intensive care unit medical ventilator and patient monitoring station",
    featured: true,
    status: "published",
    displayOrder: 3,
  },
  {
    title: "Hospital Medical Technology Internship Program",
    slug: "hospital-medical-technology-internship",
    shortDescription:
      "Comprehensive field internship exposing trainees to actual hospital engineering departments, equipment inventories, and maintenance rotations.",
    description:
      "Designed specifically for college students seeking mandatory academic internship credits and practical hospital exposure. Interns work through daily rounds across Emergency, Operation Theaters, Neonatal ICU, Radiology, and Central Sterile Supply Departments (CSSD).",
    category: "Internship",
    duration: "15 Days / 1 Month",
    eligibility: "Pre-final & Final year B.E/B.Tech/Diploma Biomedical Engineering students",
    prerequisites: "Enrollment in an accredited diploma or degree program",
    curriculum: [
      {
        module: "Week 1: Operation Theater & Sterilization Systems",
        topics: [
          "Autoclaves, surgical lights, and electrocautery setup",
          "Anesthesia gas scavenging systems (AGSS)",
          "Sterility protocol and surgical suite safety guidelines",
        ],
      },
      {
        module: "Week 2: Diagnostic Radiology & Laboratory Systems",
        topics: [
          "X-Ray generator principles, collimators, and radiation safety",
          "Hematology analyzers and biochemistry colorimeters",
          "AERB standards and lead shielding inspection",
        ],
      },
      {
        module: "Week 3 & 4: Live Breakdown Reporting & Logbook Submissions",
        topics: [
          "Logging incident reports and MTBF/MTTR metrics",
          "Asset tagging, barcode tracking, and CMMS software",
          "Project report preparation and viva voce assessment",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Biomedical engineering student intern examining hospital laboratory equipment",
    featured: true,
    status: "published",
    displayOrder: 4,
  },
  {
    title: "Medical Imaging Systems Overview & Maintenance",
    slug: "medical-imaging-systems-maintenance",
    shortDescription:
      "Foundational technical training on Ultrasound scanners, digital radiography (DR/CR), and medical imaging workstations.",
    description:
      "Understand the operational physics, hardware architecture, and imaging sensors behind Diagnostic Ultrasound, Digital X-Ray, and PACS networking. Trainees explore probe piezo-arrays, high-voltage beam generation, and DICOM image formatting standards.",
    category: "Medical Imaging",
    duration: "4 Weeks",
    eligibility: "Engineering graduates, post-graduates, and clinical equipment trainees",
    prerequisites: "Basic physics of radiation and digital signal processing",
    curriculum: [
      {
        module: "Module 1: Ultrasound Physics & Transducer Arrays",
        topics: [
          "Linear, convex, and phased array ultrasound probes",
          "Time gain compensation (TGC) and beamformer calibration",
          "Phantom testing for resolution and image uniformity",
        ],
      },
      {
        module: "Module 2: Digital Radiography (DR & CR)",
        topics: [
          "Flat panel detector (FPD) technology and scintillation layers",
          "Photostimulable phosphor plates in CR systems",
          "Radiation dose limits and QA testing protocols",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Digital medical imaging monitor showing diagnostic radiology scans",
    featured: false,
    status: "published",
    displayOrder: 5,
  },
  {
    title: "Operation Theatre (OT) & Surgical Technology",
    slug: "operation-theatre-surgical-technology",
    shortDescription:
      "Specialized training on anesthesia machines, surgical diathermy (cautery units), OT lighting, and patient warming systems.",
    description:
      "Operation Theatres represent one of the highest-risk technical zones in any healthcare facility. This program prepares biomedical trainees to calibrate, troubleshoot, and certify surgical equipment, including bipolar/monopolar electrosurgical units, surgical suction units, and AGSS pneumatic lines.",
    category: "Surgical Systems",
    duration: "5 Weeks",
    eligibility: "Biomedical, Electronics, and Instrumentation engineering candidates",
    prerequisites: "Basic knowledge of high-frequency electronics and safety principles",
    curriculum: [
      {
        module: "Module 1: Electrosurgical Units & RF Energy",
        topics: [
          "Monopolar vs bipolar cutting and coagulation modes",
          "Return electrode monitoring (REM) and patient burn prevention",
          "High-frequency leakage current measurement",
        ],
      },
      {
        module: "Module 2: Anesthesia Workstations & Vaporizers",
        topics: [
          "Gas delivery circuits and flowmeter calibration",
          "Vaporizer interlocking mechanisms and leakage tests",
          "Surgical suction and surgical LED shadowless lights",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern operating room surgical equipment and anesthesia workstation",
    featured: true,
    status: "published",
    displayOrder: 6,
  },
  {
    title: "Biomedical Circuits & Diagnostic Sensor Troubleshooting",
    slug: "biomedical-circuits-diagnostic-sensor-troubleshooting",
    shortDescription:
      "Hands-on board-level diagnostics, soldering, operational amplifier filters, and bio-potential transducer repair.",
    description:
      "Master component-level diagnostics on medical instrumentation boards. Learn to isolate power supply failures, decode noise artifacts on ECG front-ends, calibrate Wheatstone pressure bridges, and perform micro-soldering on SMD components.",
    category: "Hardware Diagnostics",
    duration: "4 Weeks",
    eligibility: "Engineering and Diploma students in ECE, EEE, and Biomedical",
    prerequisites: "Basic circuit theory and multimeter operation",
    curriculum: [
      {
        module: "Module 1: Biopotential Front-End Circuits",
        topics: [
          "Instrumentation amplifier CMRR optimization",
          "Driven Right Leg (DRL) circuit implementation",
          "Notch filter design for 50Hz/60Hz line interference suppression",
        ],
      },
      {
        module: "Module 2: Practical Board-Level Servicing",
        topics: [
          "SMPS troubleshooting and low-dropout regulator testing",
          "SMD rework and precision soldering techniques",
          "Oscilloscope signal tracing and logic probe diagnostics",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Biomedical technician troubleshooting electronic medical circuits on lab workbench",
    featured: false,
    status: "published",
    displayOrder: 7,
  },
  {
    title: "Cardiovascular Devices & ECG Diagnostic Technology",
    slug: "cardiovascular-devices-ecg-technology",
    shortDescription:
      "Comprehensive curriculum on 12-lead electrocardiography, telemetry transmitters, Holter recorders, and cardiac pacemakers.",
    description:
      "Examine modern cardiology equipment architectures from lead cable pinouts to DSP arrhythmia detection algorithms. Trainees calibrate ECG patient simulators, diagnose lead fail alarms, and understand external cardiac pacing technology.",
    category: "Cardiology",
    duration: "6 Weeks",
    eligibility: "Biomedical Engineering students, clinical technicians, and hospital technologists",
    prerequisites: "Electrophysiology fundamentals and electrical safety standards",
    curriculum: [
      {
        module: "Module 1: 12-Lead ECG Acquisition & Waveform Analysis",
        topics: [
          "Einthoven triangle and Wilson central terminal principles",
          "Frequency response standards (0.05Hz - 150Hz)",
          "Lead impedance checking and contact artifact mitigation",
        ],
      },
      {
        module: "Module 2: Cardiac Pacing & Defibrillation Systems",
        topics: [
          "Energy delivery validation using precision discharge loads",
          "Synchronized cardioversion timing with R-wave detection",
          "External transcutaneous pacing circuit diagnostics",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "ECG rhythm monitor displaying cardiac waveforms and biopotential signals",
    featured: true,
    status: "published",
    displayOrder: 8,
  },
  {
    title: "Dialysis & Renal Life-Support Systems Maintenance",
    slug: "dialysis-renal-life-support-maintenance",
    shortDescription:
      "In-depth technical training on hemodialysis machines, RO water treatment plants, and fluidic hydraulic circuits.",
    description:
      "Understand the mechanics of hemodialysis units, proportioning pumps, conductivity sensors, blood leak detectors, and reverse osmosis (RO) systems. Trainees execute preventative maintenance protocols on dialysis hydraulics.",
    category: "Renal Systems",
    duration: "6 Weeks",
    eligibility: "Biomedical and Clinical Engineering graduates and final-year students",
    prerequisites: "Fluids fundamentals and basic chemical sensor principles",
    curriculum: [
      {
        module: "Module 1: Hemodialysis Hydraulics & Flow Paths",
        topics: [
          "Dialysate proportioning, mixing chambers, and degassing units",
          "Ultrafiltration (UF) control pumps and flow balancing chambers",
          "Conductivity and temperature monitoring sensors",
        ],
      },
      {
        module: "Module 2: Extracorporeal Blood Circuit & Safety Controls",
        topics: [
          "Peristaltic arterial/venous blood pump calibrations",
          "Ultrasonic air bubble detectors and venous line clamps",
          "RO water purification standards and endotoxin testing",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Clinical renal technology and hemodialysis fluidics system",
    featured: false,
    status: "published",
    displayOrder: 9,
  },
  {
    title: "Clinical Pathology & Diagnostic Lab Equipment",
    slug: "clinical-pathology-diagnostic-lab-equipment",
    shortDescription:
      "Automated hematology analyzers, clinical centrifuges, spectrophotometers, and biochemistry diagnostic instruments.",
    description:
      "Equips engineers with knowledge of clinical pathology lab hardware. Learn optical path calibration, laser flow cytometry optics, syringe stepper drivers, photodiode detectors, and temperature-controlled incubation chambers.",
    category: "Laboratory Technology",
    duration: "4 Weeks",
    eligibility: "Life sciences, biomedical, and instrumentation engineering candidates",
    prerequisites: "Basic optics and fluidics principles",
    curriculum: [
      {
        module: "Module 1: Photometry & Spectrophotometry Systems",
        topics: [
          "Halogen and deuterium light sources with diffraction gratings",
          "Beer-Lambert law verification and filter wheel calibration",
          "Flow cell cleaning, fluid debubbling, and optical alignment",
        ],
      },
      {
        module: "Module 2: Automated Cell Counters & Centrifugation",
        topics: [
          "Impedance aperture principle for RBC/WBC counting",
          "Centrifuge brushless DC motor control and safety interlocks",
          "Preventative maintenance schedules for clinical labs",
        ],
      },
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Diagnostic pathology laboratory equipment and clinical microscopy analysis",
    featured: false,
    status: "published",
    displayOrder: 10,
  },
];

// 9 Client-Specified Services with Exact Descriptions + Biomedical Devices
export const initialServices: Omit<NewService, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Internship Training",
    slug: "internship-training",
    description:
      "The program provides hands on exposure to healthcare instruments, their operations, maintenance, safety standards and real world clinical applications.",
    icon: "GraduationCap",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 1,
    status: "published",
  },
  {
    title: "Implant Training",
    slug: "implant-training",
    description:
      "A short-term, skill-oriented program focused on advanced medical devices and specialized technical competencies.",
    icon: "Cpu",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 2,
    status: "published",
  },
  {
    title: "Hands-on Training",
    slug: "hands-on-training",
    description:
      "Experiential training that enables participants to actively handle and operate medical devices in a guided, real-time learning environment.",
    icon: "Wrench",
    imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 3,
    status: "published",
  },
  {
    title: "Workshop",
    slug: "workshop",
    description:
      "An interactive program offering practical demonstrations and focused learning on medical device technologies.",
    icon: "Hammer",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 4,
    status: "published",
  },
  {
    title: "Seminar",
    slug: "seminar",
    description:
      "An informative session highlighting medical device advancements and industry standards with expert insights.",
    icon: "Presentation",
    imageUrl: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 5,
    status: "published",
  },
  {
    title: "Webinar",
    slug: "webinar",
    description:
      "An online interactive session delivering expert insights on medical device technologies, innovations and industry best practices.",
    icon: "Video",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 6,
    status: "published",
  },
  {
    title: "Guest Lecture",
    slug: "guest-lecture",
    description:
      "An expert-led session sharing practical insights and industry knowledge on medical device technologies.",
    icon: "Users",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 7,
    status: "published",
  },
  {
    title: "Placement Training",
    slug: "placement-training",
    description:
      "Career guidance and assistance to help students secure jobs in the medical device and healthcare sector.",
    icon: "Compass",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 8,
    status: "published",
  },
  {
    title: "Medical Coding",
    slug: "medical-coding",
    description:
      "We provide professional medical coding services that ensure accurate translation of healthcare diagnoses, procedures and services into standardized medical codes.",
    icon: "Code",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 9,
    status: "published",
  },
  {
    title: "Biomedical Devices",
    slug: "biomedical-devices",
    description:
      "Specialized training and demonstrations covering multi-parameter monitors, defibrillators, syringe pumps, ventilators, and clinical calibration procedures.",
    icon: "Stethoscope",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    displayOrder: 10,
    status: "published",
  },
];

// Gallery Categories: College, Seminars, Medical Coding, Biomedical Devices, Workshop Training, Internship Training, Practical Training, Events
export const initialGalleryImages: Omit<NewGalleryImage, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Workshop Training",
    caption: "Hands-on biomedical device workshop demonstrating electrical safety analyzers.",
    category: "Workshop Training",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-workshop-1",
    altText: "Students and instructors in biomedical equipment workshop",
    eventDate: "2026-02-20",
    displayOrder: 1,
    status: "published",
  },
  {
    title: "Seminar",
    caption: "Informative healthcare technology session highlighting medical device advancements.",
    category: "Seminars",
    imageUrl: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-seminar-1",
    altText: "Audience participating in medical technology seminar",
    eventDate: "2026-01-10",
    displayOrder: 2,
    status: "published",
  },
  {
    title: "Medical Devices",
    caption: "Clinical demonstration of intensive care ventilator pneumatic controls.",
    category: "Biomedical Devices",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-device-1",
    altText: "Biomedical intensive care ventilator and monitor demonstration",
    eventDate: "2026-03-05",
    displayOrder: 3,
    status: "published",
  },
  {
    title: "College Campus Workshop",
    caption: "Collegiate interactive biomedical instrumentation session with engineering students.",
    category: "College",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-college-1",
    altText: "Engineering college students in practical biomedical session",
    eventDate: "2026-02-15",
    displayOrder: 4,
    status: "published",
  },
  {
    title: "Medical Coding Professional Batch",
    caption: "Hands-on ICD and CPT coding training session for healthcare documentation.",
    category: "Medical Coding",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-coding-1",
    altText: "Students training in clinical medical coding workstations",
    eventDate: "2026-03-01",
    displayOrder: 5,
    status: "published",
  },
  {
    title: "Internship Training Rounds",
    caption: "Students performing preventative maintenance and equipment inspection.",
    category: "Internship Training",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-intern-1",
    altText: "Intern examining laboratory test apparatus",
    eventDate: "2026-03-12",
    displayOrder: 6,
    status: "published",
  },
  {
    title: "Practical Hardware Diagnostics",
    caption: "Circuit board debugging and probe testing on patient monitoring amplifiers.",
    category: "Practical Training",
    imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-practical-1",
    altText: "Circuit board testing with digital multimeter and oscilloscope",
    eventDate: "2026-02-28",
    displayOrder: 7,
    status: "published",
  },
  {
    title: "Annual Certification Event",
    caption: "Recognizing student batch project completions and certification achievements.",
    category: "Events",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    storageKey: "gallery-event-1",
    altText: "Trainees celebrating biomedical course certification",
    eventDate: "2026-03-30",
    displayOrder: 8,
    status: "published",
  },
];

// Initial Approved Student & Customer Feedback
export const initialFeedback: Omit<NewFeedback, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Karthik Raja S.",
    message:
      "The practical medical equipment training at Meddrainn Healthcare gave me real confidence. Handling ventilators and patient monitors hands-on helped me clear my hospital interview on the first attempt.",
    rating: 5,
    status: "approved",
  },
  {
    name: "Priyadharshini M.",
    message:
      "Excellent internship experience! The trainers explained calibration standards and safety testing clearly. The real equipment demonstrations made all the difference.",
    rating: 5,
    status: "approved",
  },
  {
    name: "Vignesh Kumar",
    message:
      "The workshop on medical device troubleshooting was top-notch. Board-level diagnostics and circuit tracing were taught with complete practical depth.",
    rating: 5,
    status: "approved",
  },
  {
    name: "Sowmya R.",
    message:
      "Meddrainn Healthcare bridged the gap between my college syllabus and real hospital requirements. Highly recommended for all biomedical engineering students.",
    rating: 5,
    status: "approved",
  },
];
