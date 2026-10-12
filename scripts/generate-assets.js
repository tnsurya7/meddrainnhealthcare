const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSvgCard(title, subtitle, iconType, primaryColor = '#155EEF', secondaryColor = '#0D9488') {
  const safeTitle = escapeXml(title);
  const safeSub = escapeXml(subtitle);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10243A"/>
      <stop offset="60%" stop-color="#142d48"/>
      <stop offset="100%" stop-color="#0a1726"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="500" fill="url(#bgGrad)"/>
  <rect width="800" height="500" fill="url(#gridPattern)"/>

  <!-- Biomedical Technical Circuit Glow -->
  <circle cx="680" cy="120" r="180" fill="${primaryColor}" opacity="0.12" filter="blur(40px)"/>
  <circle cx="120" cy="380" r="150" fill="${secondaryColor}" opacity="0.10" filter="blur(30px)"/>

  <!-- ECG Grid Waveform -->
  <g transform="translate(0, 260)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="2.5" fill="none">
    <path d="M0,0 L180,0 L200,-25 L215,35 L230,-40 L245,20 L260,0 L450,0 L470,-30 L485,45 L500,-50 L515,25 L530,0 L800,0"/>
  </g>

  <!-- Central Device / Diagnostic Frame -->
  <rect x="70" y="60" width="660" height="380" rx="20" fill="rgba(16, 36, 58, 0.7)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2"/>
  
  <!-- Header Bar of Device -->
  <rect x="70" y="60" width="660" height="50" rx="20" fill="rgba(255, 255, 255, 0.04)"/>
  <circle cx="105" cy="85" r="7" fill="#0D9488"/>
  <circle cx="130" cy="85" r="7" fill="#38BDF8"/>
  <circle cx="155" cy="85" r="7" fill="#155EEF"/>
  <text x="690" y="90" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#38BDF8" letter-spacing="1.5">BIOMED INSTITUTE LAB</text>

  <!-- Central Icon Glow -->
  <circle cx="400" cy="200" r="54" fill="url(#accentGrad)" opacity="0.2"/>
  <circle cx="400" cy="200" r="44" fill="#10243A" stroke="url(#accentGrad)" stroke-width="3"/>

  <!-- Waveform / Pulse inside Icon -->
  <path d="M375,200 L388,200 L394,182 L400,218 L406,176 L412,210 L418,200 L425,200" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Typography -->
  <text x="400" y="295" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="25" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">
    ${safeTitle}
  </text>
  <text x="400" y="330" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8" letter-spacing="0.8">
    ${safeSub}
  </text>

  <!-- Badge Pill -->
  <g transform="translate(325, 365)">
    <rect width="150" height="30" rx="15" fill="rgba(21, 94, 239, 0.25)" stroke="#155EEF" stroke-width="1.5"/>
    <text x="75" y="19" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#38BDF8" letter-spacing="1">PRACTICAL TRAINING</text>
  </g>
</svg>`;
}

const assets = [
  // Hero
  { file: 'public/images/hero-biomedical.svg', title: 'Future of Biomedical Technology', sub: 'Clinical Instrumentation & Hands-on Lab Training' },
  // Courses
  { file: 'public/images/courses/calibration.svg', title: 'Equipment Calibration & Safety', sub: 'IEC 60601, Defibrillator & Electrical Safety Analyzers' },
  { file: 'public/images/courses/instrumentation.svg', title: 'Clinical Instrumentation Systems', sub: 'Patient Monitors, Diagnostic Transducers & ECG Circuits' },
  { file: 'public/images/courses/icu-care.svg', title: 'ICU & Critical Care Equipment', sub: 'Mechanical Ventilators, Syringe Pumps & Defibrillators' },
  { file: 'public/images/courses/internship.svg', title: 'Hospital Technology Internship', sub: 'Clinical Rotations, OT Safety & CMMS Maintenance' },
  { file: 'public/images/courses/imaging.svg', title: 'Medical Imaging Maintenance', sub: 'Diagnostic Ultrasound, Digital X-Ray & DICOM PACS' },
  // Services
  { file: 'public/images/services/equipment-training.svg', title: 'Biomedical Equipment Training', sub: 'Hands-on Multi-Parameter Patient Monitor Testing' },
  { file: 'public/images/services/internship.svg', title: 'Academic Internship Program', sub: 'Verified Field Modules & Institutional Certification' },
  { file: 'public/images/services/practical.svg', title: 'Practical Hands-on Laboratory', sub: 'Circuit Diagnosis, Sensor Repair & Calibration' },
  { file: 'public/images/services/workshops.svg', title: 'Collegiate Workshops', sub: 'Live Equipment Demonstrations for Engineering Colleges' },
  { file: 'public/images/services/seminars.svg', title: 'Technical Seminars', sub: 'NABH Audit Readiness & Healthcare Engineering Insights' },
  { file: 'public/images/services/guest-lectures.svg', title: 'Specialist Guest Lectures', sub: 'Case Studies by Senior Hospital Biomedical Engineers' },
  { file: 'public/images/services/career-guidance.svg', title: 'Biomedical Career Guidance', sub: 'Hospital Clinical Engineering & Sales Technical Paths' },
  // Gallery
  { file: 'public/images/gallery/training-1.svg', title: 'Patient Monitor Calibration', sub: 'Hands-on verification of NIBP & ECG leads' },
  { file: 'public/images/gallery/workshop-1.svg', title: 'Biomedical Workshop Session', sub: 'Engineering students analyzing safety analyzer output' },
  { file: 'public/images/gallery/equipment-1.svg', title: 'Ventilator Pneumatics Lab', sub: 'Proportional valve and flow sensor inspection' },
  { file: 'public/images/gallery/lab-1.svg', title: 'Clinical Circuit Probing', sub: 'Oscilloscope testing on biopotential amplifier' },
  { file: 'public/images/gallery/seminar-1.svg', title: 'Healthcare Technology Seminar', sub: 'Audience discussing hospital equipment protocols' },
  { file: 'public/images/gallery/event-1.svg', title: 'Annual Batch Certification', sub: 'Biomed Institute Trainee Certification Ceremony' },
];

async function generateAll() {
  for (const a of assets) {
    const p = path.resolve(a.file);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    const svgContent = createSvgCard(a.title, a.sub, 'pulse');
    fs.writeFileSync(p, svgContent, 'utf8');

    // Create a real WebP binary file using sharp
    const webpAlias = p.replace(/\.svg$/, '.webp');
    try {
      const webpBuf = await sharp(Buffer.from(svgContent)).webp({ quality: 90 }).toBuffer();
      fs.writeFileSync(webpAlias, webpBuf);
    } catch (err) {
      console.error(`Failed to generate webp for ${a.file}:`, err);
    }
  }

  console.log('Successfully generated all Biomed Institute graphical assets (SVG and true WebP)!');
}

generateAll();
