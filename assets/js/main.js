/**
 * MAIN.JS
 * Website scripts for Freelance Serverless Architecture Consultant
 * Handles animations, theming, RTL, and interactive tools
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheming();
  initRTL();
  initMobileMenu();
  initCostCalculator();
  initColdStartSimulator();
  initSAMDownloader();
  initContactFormValidation();
  initBackToTop();
  initAccordion();
});

/* ==========================================================================
   0. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   1. Theme & Dark Mode Setup
   ========================================================================== */
function initTheming() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Set default theme from localStorage or system preferences
  const cachedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = 'light';
  if (cachedTheme) {
    currentTheme = cachedTheme;
  } else if (systemPrefersDark) {
    currentTheme = 'dark';
  }
  
  applyTheme(currentTheme);
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update icons on all toggle buttons
  const themeIcons = document.querySelectorAll('.theme-toggle i');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  });
}

/* ==========================================================================
   2. RTL (Right-to-Left) Mode Setup
   ========================================================================== */
function initRTL() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  const cachedRtl = localStorage.getItem('rtl');
  let isRTL = cachedRtl === 'true';
  
  applyRTL(isRTL);
  
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentRtl = document.documentElement.getAttribute('dir') === 'rtl';
      applyRTL(!currentRtl);
    });
  });
}

function applyRTL(isRTL) {
  if (isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
    localStorage.setItem('rtl', 'true');
  } else {
    document.documentElement.removeAttribute('dir');
    localStorage.setItem('rtl', 'false');
  }
  
  // Toggle the buttons' text if they say "RTL" or similar
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  rtlToggles.forEach(toggle => {
    toggle.textContent = isRTL ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   3. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!menuToggle || !mainNav) return;
  
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
    
    // Change icon between bars and times
    const icon = menuToggle.querySelector('i');
    if (icon) {
      if (mainNav.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    }
  });
}

/* ==========================================================================
   4. Playground Pass & Party Planner Calculator
   ========================================================================== */
function initCostCalculator() {
  const memorySlider = document.getElementById('calc-memory');      // repurposed as: Number of Children
  const durationSlider = document.getElementById('calc-duration');    // repurposed as: Play Duration (Hours)
  const invocationsSlider = document.getElementById('calc-invocations'); // repurposed as: Add-ons (None, Cafe Pass, Party Room)
  
  if (!memorySlider) return; // Not on the calculator page
  
  const memoryVal = document.getElementById('val-memory');
  const durationVal = document.getElementById('val-duration');
  const invocationsVal = document.getElementById('val-invocations');
  
  // Cost outputs
  const costAws = document.getElementById('cost-aws');
  const costGcp = document.getElementById('cost-gcp');
  const costAzure = document.getElementById('cost-azure');
  const costCloudflare = document.getElementById('cost-cloudflare');
  
  // Progress/fill bar variables
  const barAws = document.getElementById('bar-aws');
  const barGcp = document.getElementById('bar-gcp');
  const barAzure = document.getElementById('bar-azure');
  const barCloudflare = document.getElementById('bar-cloudflare');

  function calculateCosts() {
    const children = parseInt(memorySlider.value);
    const hours = parseInt(durationSlider.value);
    const addOnType = parseInt(invocationsSlider.value);

    // Update value displays (custom text adjustments)
    memoryVal.textContent = children;
    durationVal.textContent = hours + " hrs";
    
    let addOnLabel = "None";
    if (addOnType === 1) addOnLabel = "Cafe Drinks Pack";
    if (addOnType === 2) addOnLabel = "Private Room Booking";
    invocationsVal.textContent = addOnLabel;

    // 1. Single Entry Passes Cost Logic
    // Base Single Pass is $15 per child (includes 2 hours), then $5 per child per extra hour.
    let baseSinglePass = children * (15 + Math.max(0, hours - 2) * 5);
    if (addOnType === 1) baseSinglePass += children * 6; // $6 cafe drinks pack per child
    if (addOnType === 2) baseSinglePass += 150; // $150 private party room upgrade
    const singlePassCost = baseSinglePass;

    // 2. Monthly Play Membership Savings
    // Monthly membership is $49/month per child (unlimited hours).
    let monthlyPass = children * 49;
    if (addOnType === 1) monthlyPass += children * 15; // Cafe add-on flat discount rate
    if (addOnType === 2) monthlyPass += 100; // Discounted private party room
    const monthlyPassCost = monthlyPass;

    // 3. Annual Jamboree Pass
    // Annual membership is $399/year per child (unlimited play, VIP access, free guest pass).
    let annualPass = children * 399;
    if (addOnType === 1) annualPass += children * 80;
    if (addOnType === 2) annualPass += 50; // Free or highly discounted party room booking
    const annualPassCost = annualPass;

    // 4. Custom School Group/Event Package (Mock rate per children, hours, add-ons)
    let eventCost = children * 12 * hours;
    if (addOnType === 1) eventCost += children * 5;
    if (addOnType === 2) eventCost += 120;
    const eventPackageCost = eventCost;

    // Format outputs
    costAws.textContent = `$${singlePassCost.toFixed(2)}`;
    costGcp.textContent = `$${monthlyPassCost.toFixed(2)}`;
    costAzure.textContent = `$${annualPassCost.toFixed(2)}`;
    costCloudflare.textContent = `$${eventPackageCost.toFixed(2)}`;

    // Set graph bar widths (normalized against max cost)
    const maxCost = Math.max(singlePassCost, monthlyPassCost, annualPassCost, eventPackageCost, 10);
    barAws.style.width = `${Math.max(10, (singlePassCost / maxCost) * 100)}%`;
    barGcp.style.width = `${Math.max(10, (monthlyPassCost / maxCost) * 100)}%`;
    barAzure.style.width = `${Math.max(10, (annualPassCost / maxCost) * 100)}%`;
    barCloudflare.style.width = `${Math.max(10, (eventPackageCost / maxCost) * 100)}%`;
  }

  // Update labels and trigger calculation on slide input
  memorySlider.addEventListener('input', calculateCosts);
  durationSlider.addEventListener('input', calculateCosts);
  invocationsSlider.addEventListener('input', calculateCosts);

  // Run calculation initially
  calculateCosts();
}

/* ==========================================================================
   5. Children's Safety & Capacity Monitor Simulator
   ========================================================================== */
function initColdStartSimulator() {
  const runtimeSelect = document.getElementById('opt-runtime');    // repurposed as Peak Hour Slots
  const vpcToggle = document.getElementById('opt-vpc');            // repurposed as Extra Sanitization Check
  const provisionToggle = document.getElementById('opt-provision');  // repurposed as Priority VIP Slot Pre-book
  
  if (!runtimeSelect) return;
  
  const coldStartVal = document.getElementById('cold-start-time');
  const recommendationBox = document.getElementById('opt-recommendation');
  const timelineBar = document.getElementById('timeline-bar');

  const baseWaitTimes = {
    'nodejs': 5,     // Weekday morning wait time (mins)
    'python': 12,    // Weekday afternoon wait time
    'go': 25,        // Weekend morning wait time
    'rust': 40,      // Weekend afternoon wait time
    'java': 60       // Holidays / Rainy days wait time
  };

  function simulate() {
    const slot = runtimeSelect.value;
    let waitTime = baseWaitTimes[slot] || 15;
    
    // extra sanitization slows down checks slightly
    if (vpcToggle.checked) {
      waitTime += 5;
    }
    
    // Priority VIP check-in reduces wait time to near zero
    let isVip = provisionToggle.checked;
    if (isVip) {
      waitTime = 1;
    }

    // Display simulated wait time
    coldStartVal.textContent = `${waitTime} mins`;
    
    // Update visual timeline bar width
    const percentWidth = Math.min(100, (waitTime / 70) * 100);
    timelineBar.style.width = `${percentWidth}%`;
    if (waitTime > 30) {
      timelineBar.style.backgroundColor = 'var(--danger)';
    } else if (waitTime > 10) {
      timelineBar.style.backgroundColor = 'var(--warning)';
    } else {
      timelineBar.style.backgroundColor = 'var(--success)';
    }

    // Provide recommendations
    let text = "";
    if (isVip) {
      text = "<strong>Recommendation:</strong> Pre-booked VIP passes unlock priority skip-the-line check-in! Zero wait time at the check-in gate. Highly recommended for birthday parties and weekends.";
    } else if (slot === 'java') {
      text = "<strong>Recommendation:</strong> Holidays and rainy days are our busiest hours. Expect up to 60+ mins wait. Pre-book slots online or arrive before 10:00 AM to beat the crowd!";
    } else if (vpcToggle.checked && waitTime > 20) {
      text = "<strong>Recommendation:</strong> Deep cleaning cycles keep our kids completely safe, but add minor check-in latency. Pre-register child waivers online to bypass document reviews.";
    } else {
      text = `<strong>Recommendation:</strong> This slot (${slot.replace('nodejs','Weekday Morning').replace('python','Weekday Afternoon').replace('go','Weekend Morning').replace('rust','Weekend Afternoon')}) has moderate attendance. Perfect for relaxed play sessions!`;
    }
    
    recommendationBox.innerHTML = text;
  }

  runtimeSelect.addEventListener('change', simulate);
  vpcToggle.addEventListener('change', simulate);
  provisionToggle.addEventListener('change', simulate);

  simulate();
}

/* ==========================================================================
   6. Play Kit & Waiver Document Downloader
   ========================================================================== */
function initSAMDownloader() {
  const downloadBtns = document.querySelectorAll('.download-sam-btn');
  
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const designName = btn.getAttribute('data-design') || 'api-gateway-lambda';
      
      let templateContent = '';
      let filename = 'document.txt';

      if (designName === 'api-gateway-lambda') {
        filename = 'jungle-jamboree-birthday-invite.pdf';
        templateContent = `%PDF-1.4 Mockup Birthday Invitation Card
--------------------------------------------------
Welcome to JungleJamboree!
You are invited to a magical birthday celebration!
Date: [Fill in Date]
Time: [Fill in Time]
RSVP: parents@junglejamboree.com
Notes: Please bring play socks! Slipper socks recommended.
--------------------------------------------------
`;
      } else if (designName === 'sqs-lambda-db') {
        filename = 'jungle-jamboree-safety-waiver.pdf';
        templateContent = `%PDF-1.4 Mockup Liability Safety Waiver Form
--------------------------------------------------
JungleJamboree Indoor Playground Waiver Form
I hereby certify that as a parent or legal guardian, I give my
consent for my child to participate in soft play activities.
I agree to follow all safety policies:
- Play socks must be worn at all times.
- Supervision by an adult is required.
- Play nicely and respect other explorers.
Signed: ___________________________
--------------------------------------------------
`;
      } else {
        filename = 'annual-membership-benefits-guide.pdf';
        templateContent = `%PDF-1.4 Mockup Membership Benefits Guide
--------------------------------------------------
JungleJamboree Annual Membership Pass Benefits:
1. Unlimited soft play entries.
2. 10% discount on all parents cafe coffees and snacks.
3. Free access to 3 private birthday party lounge spaces.
4. One free friend entry pass every month.
--------------------------------------------------
`;
      }

      // Download file logic
      const blob = new Blob([templateContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });
}

/* ==========================================================================
   7. Form Validation (Contact Page)
   ========================================================================== */
function initContactFormValidation() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  form.addEventListener('submit', (e) => {
    let isValid = true;

    inputs.forEach(input => {
      // Clean previous error marks
      input.classList.remove('input-error');
      const errSpan = input.parentNode.querySelector('.error-msg');
      if (errSpan) errSpan.remove();

      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('input-error');
        
        // Create error tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'error-msg';
        tooltip.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
        tooltip.style.color = 'var(--danger)';
        tooltip.style.fontSize = '0.8rem';
        tooltip.style.marginTop = '4px';
        tooltip.style.display = 'block';
        input.parentNode.appendChild(tooltip);
      } else if (input.type === 'email') {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(input.value.trim())) {
          isValid = false;
          input.classList.add('input-error');
          
          const tooltip = document.createElement('span');
          tooltip.className = 'error-msg';
          tooltip.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address';
          tooltip.style.color = 'var(--danger)';
          tooltip.style.fontSize = '0.8rem';
          tooltip.style.marginTop = '4px';
          tooltip.style.display = 'block';
          input.parentNode.appendChild(tooltip);
        }
      }
    });

    if (!isValid) {
      e.preventDefault(); // Stop form submission
    } else {
      e.preventDefault();
      // Show elegant success state
      const formContainer = form.parentNode;
      formContainer.innerHTML = `
        <div class="success-alert" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 4rem; color: var(--success); margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3 style="margin-bottom: 12px;">Consultation Request Received!</h3>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Thank you for reaching out. I will review your serverless parameters and respond with diagnostic insights within 24 business hours.</p>
          <a href="../index.html" class="btn btn-primary">Return Home</a>
        </div>
      `;
    }
  });

  // Real-time clearance of validation errors on input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      const errSpan = input.parentNode.querySelector('.error-msg');
      if (errSpan) errSpan.remove();
    });
  });
}

/* ==========================================================================
   8. Reusable Accordion (FAQ Dropdown) Logic
   ========================================================================== */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Find the parent accordion container to isolate active states per accordion
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
          otherItem.classList.remove('active');
        });
      } else {
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
          otherItem.classList.remove('active');
        });
      }

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
