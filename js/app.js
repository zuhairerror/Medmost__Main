/**
 * MEDMOST - Interactive Web Application Logic
 * Implements filtering, search, dynamic modals, and application form workflows.
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.MEDMOST_DATA;
  if (!data) {
    console.error('MEDMOST_DATA not loaded');
    return;
  }

  // --- State ---
  let currentLang = localStorage.getItem('medmost_lang') || 'en';
  let activeTreatmentFilter = 'all';
  let treatmentSearchQuery = '';
  let activeHospitalFilter = 'all';
  let hospitalSearchQuery = '';
  let uploadedFiles = [];

  // --- Elements ---
  const body = document.body;
  const enBtn = document.getElementById('enBtn');
  const ruBtn = document.getElementById('ruBtn');
  const treatmentContainer = document.getElementById('treatmentsGrid');
  const hospitalContainer = document.getElementById('hospitalsGrid');

  // Modals
  const treatmentModal = document.getElementById('treatmentModal');
  const hospitalModal = document.getElementById('hospitalModal');
  const applyModal = document.getElementById('applyModal');

  // Forms
  const applicationForm = document.getElementById('applicationForm');
  const formSuccessView = document.getElementById('formSuccessView');
  const formFieldsView = document.getElementById('formFieldsView');

  // ==========================================================================
  // Language Switcher
  // ==========================================================================
  window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('medmost_lang', lang);
    const isRu = lang === 'ru';
    body.classList.toggle('russian', isRu);
    if (enBtn) enBtn.classList.toggle('active', !isRu);
    if (ruBtn) ruBtn.classList.toggle('active', isRu);
    document.documentElement.lang = lang;
    document.title = isRu 
      ? 'MEDMOST | Медицинский туризм в Индию' 
      : 'MEDMOST | Medical Tourism to India';

    // Re-render dynamic cards
    renderTreatments();
    renderHospitals();
  };

  if (enBtn) enBtn.addEventListener('click', () => window.setLanguage('en'));
  if (ruBtn) ruBtn.addEventListener('click', () => window.setLanguage('ru'));
  window.setLanguage(currentLang);

  // Dynamic Year in Footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================================================
  // Render Treatments
  // ==========================================================================
  function renderTreatments() {
    if (!treatmentContainer) return;
    const isRu = currentLang === 'ru';

    const filtered = data.treatments.filter(t => {
      const matchCat = activeTreatmentFilter === 'all' || t.category === activeTreatmentFilter;
      const q = treatmentSearchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const title = (isRu ? t.titleRu : t.titleEn).toLowerCase();
      const procs = (isRu ? t.proceduresRu : t.proceduresEn).join(' ').toLowerCase();
      return matchCat && (title.includes(q) || procs.includes(q));
    });

    if (filtered.length === 0) {
      treatmentContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">
          ${isRu ? 'Направления не найдены по вашему запросу.' : 'No treatments match your search.'}
        </div>
      `;
      return;
    }

    treatmentContainer.innerHTML = filtered.map(t => {
      const title = isRu ? t.titleRu : t.titleEn;
      const procs = isRu ? t.proceduresRu : t.proceduresEn;
      const procsPreview = procs.slice(0, 3).join(' • ');
      const btnText = isRu ? 'Подробнее →' : 'Explore Details →';
      const fromText = isRu ? 'от' : 'from';

      return `
        <div class="spec-card" data-id="${t.id}" onclick="openTreatmentModal('${t.id}')">
          <div class="spec-img-wrap">
            <img src="${t.image}" alt="${title}" loading="lazy">
            <div class="spec-price-tag">${fromText} ${t.costIndia.split('–')[0]}</div>
          </div>
          <div class="spec-body">
            <div class="spec-title">${title}</div>
            <p class="spec-procedures-preview">${procsPreview}</p>
          </div>
          <div class="spec-footer">
            <span style="font-size: 11.5px; color: var(--muted);">${t.stayDuration}</span>
            <button type="button" class="spec-btn" onclick="event.stopPropagation(); openTreatmentModal('${t.id}')">${btnText}</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Treatment Filter Tabs
  document.querySelectorAll('[data-treatment-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-treatment-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTreatmentFilter = btn.getAttribute('data-treatment-filter');
      renderTreatments();
    });
  });

  // Treatment Search
  const treatmentSearchInput = document.getElementById('treatmentSearch');
  if (treatmentSearchInput) {
    treatmentSearchInput.addEventListener('input', (e) => {
      treatmentSearchQuery = e.target.value;
      renderTreatments();
    });
  }

  // ==========================================================================
  // Render Hospitals
  // ==========================================================================
  function renderHospitals() {
    if (!hospitalContainer) return;
    const isRu = currentLang === 'ru';

    const filtered = data.hospitals.filter(h => {
      const matchCity = activeHospitalFilter === 'all' || h.cityKey === activeHospitalFilter;
      const q = hospitalSearchQuery.toLowerCase().trim();
      if (!q) return matchCity;

      const name = h.name.toLowerCase();
      const specs = (isRu ? h.specialtiesRu : h.specialtiesEn).join(' ').toLowerCase();
      return matchCity && (name.includes(q) || specs.includes(q) || h.city.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      hospitalContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">
          ${isRu ? 'Больницы не найдены по вашему запросу.' : 'No hospitals match your search.'}
        </div>
      `;
      return;
    }

    hospitalContainer.innerHTML = filtered.map(h => {
      const specs = isRu ? h.specialtiesRu : h.specialtiesEn;
      const btnText = isRu ? 'Подробнее →' : 'Hospital Details →';

      return `
        <div class="hospital-card" data-id="${h.id}" onclick="openHospitalModal('${h.id}')">
          <div class="hospital-img-wrap">
            <img src="${h.image}" alt="${h.name}" loading="lazy">
            <span class="hospital-badge-top">${h.beds}</span>
          </div>
          <div class="hospital-body">
            <div class="hospital-name">${h.name}</div>
            <div class="hospital-city">📍 ${h.city}</div>
            <div class="hospital-tags">
              ${specs.slice(0, 3).map(s => `<span class="hospital-tag">${s}</span>`).join('')}
            </div>
          </div>
          <div class="hospital-footer">
            <span style="font-size: 11.5px; color: var(--muted);">${h.accreditation.split('&')[0]}</span>
            <button type="button" class="hospital-btn" onclick="event.stopPropagation(); openHospitalModal('${h.id}')">${btnText}</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Hospital Filter Tabs
  document.querySelectorAll('[data-hospital-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-hospital-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHospitalFilter = btn.getAttribute('data-hospital-filter');
      renderHospitals();
    });
  });

  // Hospital Search
  const hospitalSearchInput = document.getElementById('hospitalSearch');
  if (hospitalSearchInput) {
    hospitalSearchInput.addEventListener('input', (e) => {
      hospitalSearchQuery = e.target.value;
      renderHospitals();
    });
  }

  // ==========================================================================
  // Modal Handlers
  // ==========================================================================
  window.closeModal = function(modal) {
    if (typeof modal === 'string') modal = document.getElementById(modal);
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.openModal = function(modal) {
    if (typeof modal === 'string') modal = document.getElementById(modal);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close')) {
        window.closeModal(treatmentModal);
        window.closeModal(hospitalModal);
        window.closeModal(applyModal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModal(treatmentModal);
      window.closeModal(hospitalModal);
      window.closeModal(applyModal);
    }
  });

  // Open Treatment Modal
  window.openTreatmentModal = function(id) {
    window.closeModal(hospitalModal);
    window.closeModal(applyModal);

    const t = data.treatments.find(item => item.id === id);
    if (!t) return;
    const isRu = currentLang === 'ru';

    document.getElementById('treatmentModalTitle').textContent = isRu ? t.titleRu : t.titleEn;
    document.getElementById('treatmentModalImg').src = t.image;
    document.getElementById('treatmentModalImg').alt = isRu ? t.titleRu : t.titleEn;
    document.getElementById('treatmentModalCost').textContent = `${isRu ? 'Индия' : 'India'}: ${t.costIndia}`;
    document.getElementById('treatmentModalDuration').textContent = `${isRu ? 'Пребывание' : 'Stay'}: ${t.stayDuration}`;
    document.getElementById('treatmentModalDesc').textContent = isRu ? t.descriptionRu : t.descriptionEn;

    const procs = isRu ? t.proceduresRu : t.proceduresEn;
    document.getElementById('treatmentModalProcedures').innerHTML = procs.map(p => `<li>${p}</li>`).join('');

    const applyBtn = document.getElementById('treatmentModalApplyBtn');
    if (applyBtn) {
      applyBtn.textContent = isRu ? 'Оставить заявку на лечение ↗' : 'Apply for this Treatment ↗';
      applyBtn.onclick = () => {
        window.closeModal(treatmentModal);
        window.openApplyModal({ treatmentId: t.id });
      };
    }

    window.openModal(treatmentModal);
  };

  // Open Hospital Modal
  window.openHospitalModal = function(id) {
    window.closeModal(treatmentModal);
    window.closeModal(applyModal);

    const h = data.hospitals.find(item => item.id === id);
    if (!h) return;
    const isRu = currentLang === 'ru';

    document.getElementById('hospitalModalTitle').textContent = h.name;
    document.getElementById('hospitalModalImg').src = h.image;
    document.getElementById('hospitalModalImg').alt = h.name;
    document.getElementById('hospitalModalCity').textContent = `📍 ${h.city}`;
    document.getElementById('hospitalModalAccred').textContent = h.accreditation;
    document.getElementById('hospitalModalBeds').textContent = h.beds;
    document.getElementById('hospitalModalDesc').textContent = isRu ? h.overviewRu : h.overviewEn;

    const specs = isRu ? h.specialtiesRu : h.specialtiesEn;
    document.getElementById('hospitalModalSpecialties').innerHTML = specs.map(s => `<li>${s}</li>`).join('');

    const applyBtn = document.getElementById('hospitalModalApplyBtn');
    if (applyBtn) {
      applyBtn.textContent = isRu ? 'Консультация в этой больнице ↗' : 'Book Consultation at this Hospital ↗';
      applyBtn.onclick = () => {
        window.closeModal(hospitalModal);
        window.openApplyModal({ hospitalId: h.id });
      };
    }

    window.openModal(hospitalModal);
  };

  // Open Apply Modal
  window.openApplyModal = function(pref = {}) {
    window.closeModal(treatmentModal);
    window.closeModal(hospitalModal);

    if (!applyModal) return;

    // Reset views
    if (formFieldsView) formFieldsView.style.display = 'block';
    if (formSuccessView) formSuccessView.style.display = 'none';

    // Populate selects
    const treatmentSelect = document.getElementById('applyTreatmentSelect');
    if (treatmentSelect) {
      const isRu = currentLang === 'ru';
      treatmentSelect.innerHTML = `
        <option value="">${isRu ? '-- Выберите направление лечения --' : '-- Select Medical Specialty --'}</option>
        ${data.treatments.map(t => `
          <option value="${t.id}" ${pref.treatmentId === t.id ? 'selected' : ''}>
            ${isRu ? t.titleRu : t.titleEn}
          </option>
        `).join('')}
      `;
    }

    const hospitalSelect = document.getElementById('applyHospitalSelect');
    if (hospitalSelect) {
      const isRu = currentLang === 'ru';
      hospitalSelect.innerHTML = `
        <option value="">${isRu ? '-- Любая рекомендуемая больница --' : '-- Any Recommended Hospital --'}</option>
        ${data.hospitals.map(h => `
          <option value="${h.id}" ${pref.hospitalId === h.id ? 'selected' : ''}>
            ${h.name} (${h.city})
          </option>
        `).join('')}
      `;
    }

    window.openModal(applyModal);
  };

  // Trigger buttons across page
  document.querySelectorAll('[data-open-apply]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openApplyModal();
    });
  });

  // ==========================================================================
  // File Drag & Drop Simulation
  // ==========================================================================
  const dropzone = document.getElementById('fileDropzone');
  const fileInput = document.getElementById('medicalReportsInput');
  const fileListEl = document.getElementById('fileListPreview');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
      dropzone.addEventListener(type, () => dropzone.classList.remove('dragover'));
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleFiles(e.target.files);
      }
    });
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function handleFiles(files) {
    uploadedFiles = Array.from(files);
    if (!fileListEl) return;
    fileListEl.innerHTML = uploadedFiles.map(f => {
      const sizeKb = Math.round(f.size / 1024);
      return `<div>📎 ${escapeHtml(f.name)} (${sizeKb} KB)</div>`;
    }).join('');
  }

  // ==========================================================================
  // Application Form Submission
  // ==========================================================================
  if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isRu = currentLang === 'ru';
      const submitBtn = applicationForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Extract form values
      const name = document.getElementById('applyName').value.trim();
      const email = document.getElementById('applyEmail').value.trim();
      const phone = document.getElementById('applyPhone').value.trim();
      const country = document.getElementById('applyCountry').value;
      const treatmentId = document.getElementById('applyTreatmentSelect').value;
      const hospitalId = document.getElementById('applyHospitalSelect').value;
      const message = document.getElementById('applyMessage').value.trim();
      const consent = document.getElementById('applyConsent').checked;

      // Validation
      if (!name || !phone || !country || !consent) {
        alert(isRu 
          ? 'Пожалуйста, заполните обязательные поля (Имя, Телефон, Страна) и дайте согласие.' 
          : 'Please complete all required fields (Name, Phone, Country) and agree to terms.');
        return;
      }

      // Find treatment & hospital labels
      const matchedTreatment = data.treatments.find(t => t.id === treatmentId);
      const matchedHospital = data.hospitals.find(h => h.id === hospitalId);

      const enquiryData = {
        name,
        email,
        phone,
        country,
        treatment: matchedTreatment ? (isRu ? matchedTreatment.titleRu : matchedTreatment.titleEn) : 'General Inquiry',
        hospital: matchedHospital ? matchedHospital.name : 'Best Recommended Hospital',
        message,
        consent,
        documents: uploadedFiles.map(f => ({ name: f.name, size: f.size }))
      };

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> 
        ${isRu ? 'Отправка заявки...' : 'Submitting Enquiry...'}
      `;

      try {
        const result = await window.MedMostBackend.submitEnquiry(enquiryData);

        // Transition to success screen
        if (formFieldsView) formFieldsView.style.display = 'none';
        if (formSuccessView) {
          formSuccessView.style.display = 'block';
          document.getElementById('successRefCode').textContent = result.referenceId;
          document.getElementById('successPatientName').textContent = name;
        }

        // Reset form
        applicationForm.reset();
        uploadedFiles = [];
        if (fileListEl) fileListEl.innerHTML = '';
      } catch (err) {
        console.error('Submission failed:', err);
        alert(isRu ? 'Произошла ошибка при отправке заявки. Пожалуйста, свяжитесь с нами через WhatsApp.' : 'Submission error. Please reach out to us directly via WhatsApp.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // Initial renders
  renderTreatments();
  renderHospitals();
});
