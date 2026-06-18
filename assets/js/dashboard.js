/**
 * DASHBOARD.JS
 * Client-side scripting for Serverless Architecture Dashboard
 * Manages responsive sidebar menus, metric calculations, and interactive views
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardNavigation();
  initLiveLogsSimulator();
  initDashboardMetrics();
  initInteractiveForms();
});





/* ==========================================================================
   3. Mobile & Tablet Sidebar Menu Toggle
   ========================================================================== */
function initDashboardSidebar() {
  const sidebarToggle = document.getElementById('dashboard-sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const mainOverlay = document.createElement('div');
  
  if (!sidebarToggle || !sidebar) return;

  mainOverlay.className = 'sidebar-overlay';
  document.body.appendChild(mainOverlay);

  sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    mainOverlay.classList.toggle('active');
    
    // Toggle hamburger icon
    const icon = sidebarToggle.querySelector('i');
    if (icon) {
      icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    }
  });

  // Close sidebar on overlay click
  mainOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    mainOverlay.classList.remove('active');
    const icon = sidebarToggle.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  });

  // Close sidebar on link click in mobile views
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('active');
        mainOverlay.classList.remove('active');
        const icon = sidebarToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  });
}

/* ==========================================================================
   4. Dashboard Tabbed Navigation
   ========================================================================== */
function initDashboardNavigation() {
  const links = document.querySelectorAll('.sidebar-link[data-tab]');
  const panels = document.querySelectorAll('.dashboard-panel');
  const titleDisplay = document.getElementById('dashboard-view-title');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetTab = link.getAttribute('data-tab');
      
      // Update sidebar links active class
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update dashboard active panel
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });

      // Update header title in Dashboard
      if (titleDisplay) {
        titleDisplay.textContent = link.querySelector('span').textContent.toUpperCase();
      }
    });
  });
}

/* ==========================================================================
   5. Live Serverless Logs Simulator
   ========================================================================== */
function initLiveLogsSimulator() {
  const logStream = document.getElementById('dashboard-log-stream');
  if (!logStream) return;

  const runtimes = ['Leo (Pass #1024)', 'Mia (Pass #1025)', 'Noah (Pass #1026)', 'Harper (Pass #1027)'];
  const functions = ['Checked in at Main Gate', 'Checked in at Slide Mountain', 'Checked in at Ball Pit Gate', 'Signed Liability Waiver', 'Purchased Café Drinks Pass', 'Scanned Membership Card'];
  const statuses = ['VALID', 'VALID', 'VALID', 'VALID', 'PENDING', 'EXPIRED'];

  setInterval(() => {
    if (!logStream) return;
    
    const randomRuntime = runtimes[Math.floor(Math.random() * runtimes.length)];
    const randomFunc = functions[Math.floor(Math.random() * functions.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const duration = Math.floor(Math.random() * 45) + 5;
    
    let statusClass = 'log-success';
    if (randomStatus === 'PENDING') statusClass = 'log-warning';
    if (randomStatus === 'EXPIRED') statusClass = 'log-danger';

    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.style.borderLeft = `3px solid var(--border-color)`;
    logEntry.style.padding = '8px 12px';
    logEntry.style.marginBottom = '6px';
    logEntry.style.fontSize = '0.8rem';
    logEntry.style.fontFamily = 'monospace';
    logEntry.style.background = 'rgba(255, 255, 255, 0.02)';
    logEntry.style.borderRadius = '4px';
    logEntry.style.display = 'flex';
    logEntry.style.justifyContent = 'space-between';

    logEntry.innerHTML = `
      <span>[${timestamp}] <strong style="color: var(--accent-color);">${randomRuntime}</strong>: <span style="color: var(--secondary-color);">${randomFunc}</span></span>
      <span>
        <span style="margin-right: 12px; color: var(--text-muted);">${duration} mins ago</span>
        <span class="${statusClass}" style="font-weight: 700; font-size: 0.75rem;">${randomStatus}</span>
      </span>
    `;

    logStream.insertBefore(logEntry, logStream.firstChild);

    // Prune logs to keep it light
    if (logStream.children.length > 25) {
      logStream.removeChild(logStream.lastChild);
    }
  }, 3500);
}

/* ==========================================================================
   6. Dashboard Stats Updates
   ========================================================================== */
function initDashboardMetrics() {
  // Let's add simple visual animations to numerical metrics in dashboard
  const statValues = document.querySelectorAll('.stat-number');
  statValues.forEach(elem => {
    const rawVal = elem.textContent.trim();
    if (rawVal.startsWith('$')) {
      // It is currency
      const numericPart = parseFloat(rawVal.replace('$', ''));
      animateValue(elem, 0, numericPart, 2000, '$');
    } else if (rawVal.includes('/')) {
      // Progress like 1/3
      return;
    } else if (!isNaN(parseInt(rawVal))) {
      const numericPart = parseInt(rawVal);
      animateValue(elem, 0, numericPart, 2000, '');
    }
  });
}

function animateValue(obj, start, end, duration, prefix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const val = progress * (end - start) + start;
    
    if (prefix === '$') {
      obj.textContent = prefix + val.toFixed(2);
    } else {
      obj.textContent = prefix + Math.floor(val);
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   7. Interactive Forms & Checkout Simulator
   ========================================================================== */
function initInteractiveForms() {
  // Pass purchase calculator interactivity
  const passForm = document.getElementById('pass-purchase-form');
  const passTypeSelect = document.getElementById('purchase-pass-type');
  const qtyInput = document.getElementById('purchase-qty');
  const totalDisplay = document.getElementById('purchase-total-display');
  const availablePassWidget = document.getElementById('widget-pass-count');

  function calculatePassTotal() {
    if (!passTypeSelect || !qtyInput || !totalDisplay) return;
    const rate = parseFloat(passTypeSelect.value);
    const qty = parseInt(qtyInput.value) || 1;
    totalDisplay.textContent = `$${(rate * qty).toFixed(2)}`;
  }

  if (passTypeSelect && qtyInput) {
    passTypeSelect.addEventListener('change', calculatePassTotal);
    qtyInput.addEventListener('input', calculatePassTotal);
  }

  if (passForm) {
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const child = document.getElementById('purchase-child').value;
      const rate = parseFloat(passTypeSelect.value);
      const qty = parseInt(qtyInput.value) || 1;
      const totalCost = rate * qty;
      
      // Update passes widget count
      if (availablePassWidget) {
        const currentPasses = parseInt(availablePassWidget.textContent) || 0;
        const newPasses = currentPasses + qty;
        animateValue(availablePassWidget, currentPasses, newPasses, 1000);
      }

      alert(`Success! Purchased ${qty} pass(es) for ${child === 'both' ? 'Leo & Mia' : child === 'leo' ? 'Leo' : 'Mia'} for $${totalCost.toFixed(2)}. Passes are now active.`);
    });
  }

  // Waiver signing interactivity
  const waiverForm = document.getElementById('waiver-signing-form');
  const waiverWidget = document.getElementById('widget-waiver-count');
  const waiverSub = document.getElementById('widget-waiver-sub');
  
  if (waiverForm) {
    waiverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update missing waiver count widget
      if (waiverWidget) {
        const current = parseInt(waiverWidget.textContent) || 0;
        if (current > 0) {
          animateValue(waiverWidget, current, 0, 1000);
        }
      }
      if (waiverSub) {
        waiverSub.style.color = 'var(--success)';
        waiverSub.innerHTML = '<i class="fas fa-check-circle"></i> All waivers signed';
      }

      // Update Mia status badge and details
      const miaStatusBadge = document.getElementById('mia-status-badge');
      const miaWaiverStatus = document.getElementById('mia-waiver-status');
      if (miaStatusBadge) {
        miaStatusBadge.style.background = 'rgba(16, 185, 129, 0.12)';
        miaStatusBadge.style.color = 'var(--success)';
        miaStatusBadge.textContent = 'READY TO PLAY';
      }
      if (miaWaiverStatus) {
        miaWaiverStatus.style.color = 'var(--success)';
        miaWaiverStatus.textContent = 'Signed (Today)';
      }

      // Unlock Mia's barcode
      const miaBarcodeBox = document.getElementById('mia-barcode-box');
      const miaBarcodeLabel = document.getElementById('mia-barcode-label');
      const miaBarcodeVisual = document.getElementById('mia-barcode-visual');
      const miaBarcodeText = document.getElementById('mia-barcode-text');
      if (miaBarcodeBox) {
        miaBarcodeBox.style.opacity = '1';
        miaBarcodeBox.style.filter = 'none';
      }
      if (miaBarcodeLabel) miaBarcodeLabel.textContent = 'Check-In Barcode';
      if (miaBarcodeText) miaBarcodeText.textContent = '*MIA-1025*';
      if (miaBarcodeVisual) {
        miaBarcodeVisual.innerHTML = `
          <div style="width: 2px; background: black; margin-right: 1px;"></div>
          <div style="width: 1px; background: black; margin-right: 2px;"></div>
          <div style="width: 4px; background: black; margin-right: 1px;"></div>
          <div style="width: 2px; background: black; margin-right: 2px;"></div>
          <div style="width: 3px; background: black; margin-right: 1px;"></div>
          <div style="width: 2px; background: black; margin-right: 1px;"></div>
          <div style="width: 1px; background: black; margin-right: 2px;"></div>
          <div style="width: 4px; background: black; margin-right: 1px;"></div>
        `;
      }

      // Add Mia's signed record to table history
      const miaWaiverRow = document.getElementById('mia-waiver-row');
      const miaWaiverDate = document.getElementById('mia-waiver-date');
      if (miaWaiverRow) miaWaiverRow.style.display = 'table-row';
      if (miaWaiverDate) {
        const today = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        miaWaiverDate.textContent = today.toLocaleDateString('en-US', options);
      }

      // Show success text in waiver form container
      const waiverCard = document.getElementById('waiver-form-card');
      if (waiverCard) {
        waiverCard.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--success); margin-bottom: 15px;"></i>
            <h3 class="card-title">All Waivers Signed!</h3>
            <p class="card-description">Thank you! Mia Jenkins is now cleared for play. Check-in barcodes are fully unlocked.</p>
          </div>
        `;
      }

      alert("Waiver signed successfully for Mia Jenkins!");
    });
  }

  // Party Booking Interactivity
  const partyForm = document.getElementById('party-booking-form');
  const partyWidget = document.getElementById('widget-party-count');
  const partySub = document.getElementById('widget-party-sub');

  if (partyForm) {
    partyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('party-date').value;
      const themeVal = document.getElementById('party-theme').value;
      const packageVal = document.getElementById('party-package-select').value;
      
      // Update party widget
      if (partyWidget) {
        const current = parseInt(partyWidget.textContent) || 0;
        animateValue(partyWidget, current, current + 1, 1000);
      }
      if (partySub) {
        partySub.style.color = 'var(--success)';
        partySub.innerHTML = `<i class="fas fa-calendar-check"></i> Reserved: ${dateVal}`;
      }

      // Show success notification in place of form
      const formContainer = partyForm.parentElement;
      if (formContainer) {
        formContainer.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--success); margin-bottom: 15px;"></i>
            <h3 class="card-title">Party Room Reserved!</h3>
            <p class="card-description">Your <strong>${packageVal} (${themeVal} theme)</strong> reservation for <strong>${dateVal}</strong> has been submitted. A play coordinator will contact you shortly to confirm catering details.</p>
            <button class="btn btn-secondary" onclick="location.reload()" style="margin-top: 15px;">Book Another Event</button>
          </div>
        `;
      }

      alert(`Success! Reserved ${packageVal} room for ${dateVal}.`);
    });
  }
}
