const patients = [
  {
    id: "maria",
    name: "María R.",
    context: "Diabetes tipo 2 · 62 años · HbA1c sin mejora pese a ajuste previo",
    risk: 68,
    riskLabel: "Riesgo moderado",
    confidence: "Confianza alta · 4 fuentes",
    action: "Revisar adherencia antes de intensificar medicación.",
    reason:
      "La falta de mejora coincide con dispensación irregular y ausencia de seguimiento educativo reciente.",
    evidence: [
      {
        level: "Alta",
        tone: "high",
        title: "Dispensación irregular",
        text: "Dos retiros tardíos de medicación en las últimas 8 semanas.",
      },
      {
        level: "Media",
        tone: "medium",
        title: "Marcadores sin respuesta esperada",
        text: "HbA1c se mantiene elevada pese a indicación terapéutica estable.",
      },
      {
        level: "Baja",
        tone: "low",
        title: "Sin refuerzo educativo reciente",
        text: "No hay registro de consejería terapéutica en los últimos 90 días.",
      },
    ],
    sources: [
      ["HCE", "Notas y diagnósticos"],
      ["Farmacia", "Retiros de medicación"],
      ["Laboratorio", "HbA1c y perfil renal"],
      ["Seguimiento", "Controles previos"],
    ],
    timeline: [
      ["Hace 82 d", "Se indica continuidad terapéutica y control metabólico."],
      ["Hace 43 d", "Retiro de medicación registrado 9 días después de la fecha esperada."],
      ["Hace 12 d", "HbA1c persiste elevada sin correlato de ajuste documentado."],
    ],
  },
  {
    id: "carlos",
    name: "Carlos P.",
    context: "Hipertensión y enfermedad renal · 58 años · presión variable",
    risk: 81,
    riskLabel: "Riesgo alto",
    confidence: "Confianza alta · 5 fuentes",
    action: "Priorizar conversación de adherencia y barreras de acceso.",
    reason:
      "El patrón combina presión inestable, brechas de dispensación y visitas no asistidas.",
    evidence: [
      {
        level: "Alta",
        tone: "high",
        title: "Brecha de tratamiento",
        text: "No aparece dispensación de antihipertensivo durante 21 días.",
      },
      {
        level: "Alta",
        tone: "high",
        title: "Controles perdidos",
        text: "Dos citas de seguimiento figuran como no asistidas.",
      },
      {
        level: "Media",
        tone: "medium",
        title: "Variabilidad clínica",
        text: "Tres mediciones recientes superan el rango objetivo institucional.",
      },
    ],
    sources: [
      ["HCE", "Antecedentes y notas"],
      ["Farmacia", "Dispensación"],
      ["Enfermería", "Toma de presión"],
      ["Agenda", "Asistencia a controles"],
    ],
    timeline: [
      ["Hace 77 d", "Control estable con recomendación de seguimiento mensual."],
      ["Hace 34 d", "Primera inasistencia registrada."],
      ["Hace 8 d", "Nueva medición elevada en triaje."],
    ],
  },
  {
    id: "elena",
    name: "Elena V.",
    context: "Diabetes tipo 2 · 49 años · buena respuesta reciente",
    risk: 24,
    riskLabel: "Riesgo bajo",
    confidence: "Confianza media · 3 fuentes",
    action: "Mantener plan actual y reforzar seguimiento preventivo.",
    reason:
      "Los datos disponibles muestran continuidad de medicación y mejoría gradual de marcadores.",
    evidence: [
      {
        level: "Baja",
        tone: "low",
        title: "Dispensación continua",
        text: "Retiros dentro de la ventana esperada en los últimos 3 ciclos.",
      },
      {
        level: "Baja",
        tone: "low",
        title: "Marcadores en mejora",
        text: "Tendencia descendente en HbA1c frente al control anterior.",
      },
      {
        level: "Media",
        tone: "medium",
        title: "Seguimiento incompleto",
        text: "Falta registro reciente de nutrición, aunque no cambia el riesgo principal.",
      },
    ],
    sources: [
      ["HCE", "Diagnóstico y evolución"],
      ["Farmacia", "Retiros recientes"],
      ["Laboratorio", "HbA1c"],
      ["Agenda", "Próximo control"],
    ],
    timeline: [
      ["Hace 89 d", "Se ajusta pauta y se agenda control trimestral."],
      ["Hace 45 d", "Dispensación registrada a tiempo."],
      ["Hace 5 d", "Laboratorio muestra mejora respecto al control previo."],
    ],
  },
];


const selectors = {
  patientList: document.querySelector("#patientList"),
  patientName: document.querySelector("#patientName"),
  patientContext: document.querySelector("#patientContext"),
  riskCard: document.querySelector("#riskCard"),
  riskLabel: document.querySelector("#riskLabel"),
  riskScore: document.querySelector("#riskScore"),
  confidenceLabel: document.querySelector("#confidenceLabel"),
  evidenceList: document.querySelector("#evidenceList"),
  clinicalBoard: document.querySelector(".clinical-board"),
  sourceGrid: document.querySelector("#sourceGrid"),
  timeline: document.querySelector("#timeline"),
  suggestedAction: document.querySelector("#suggestedAction"),
  actionReason: document.querySelector("#actionReason"),
  copySummary: document.querySelector("#copySummary"),
  form: document.querySelector(".contact-form"),
  formMessage: document.querySelector(".form-message"),
};

let activePatient = patients[0];

const riskTone = (score) => {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
};

const renderPatients = () => {
  selectors.patientList.innerHTML = patients
    .map((patient) => {
      const isActive = patient.id === activePatient.id;
      const tone = riskTone(patient.risk);

      return `
        <button class="patient-button ${isActive ? "is-active" : ""}" type="button" data-id="${patient.id}">
          <div class="patient-button__top">
            <strong>${patient.name}</strong>
            <span class="mini-score score-${tone}">${patient.risk}%</span>
          </div>
          <small>${patient.riskLabel}</small>
        </button>
      `;
    })
    .join("");
};

const renderClinicalBoard = () => {
  const tone = riskTone(activePatient.risk);
  selectors.patientName.textContent = activePatient.name;
  selectors.patientContext.textContent = activePatient.context;
  selectors.riskLabel.textContent = activePatient.riskLabel;
  selectors.riskScore.textContent = `${activePatient.risk}%`;
  selectors.riskCard.className = `risk-card risk-${tone}`;
  selectors.confidenceLabel.textContent = activePatient.confidence;
  selectors.suggestedAction.textContent = activePatient.action;
  selectors.actionReason.textContent = activePatient.reason;

  selectors.evidenceList.innerHTML = activePatient.evidence
    .map(
      (item) => `
        <div class="evidence-item">
          <span class="evidence-tag score-${item.tone}">${item.level}</span>
          <div>
            <h5>${item.title}</h5>
            <p>${item.text}</p>
          </div>
        </div>
      `
    )
    .join("");

  selectors.sourceGrid.innerHTML = activePatient.sources
    .map(
      ([name, detail]) => `
        <div class="source-item">
          <strong>${name}</strong>
          <span>${detail}</span>
        </div>
      `
    )
    .join("");

  selectors.timeline.innerHTML = activePatient.timeline
    .map(
      ([date, event]) => `
        <div class="timeline-item">
          <time>${date}</time>
          <p>${event}</p>
        </div>
      `
    )
    .join("");
};

const setActivePatient = (patientId) => {
  activePatient = patients.find((patient) => patient.id === patientId) || patients[0];
  renderPatients();
  renderClinicalBoard();
  selectors.clinicalBoard.classList.remove("is-switching");
  window.requestAnimationFrame(() => {
    selectors.clinicalBoard.classList.add("is-switching");
  });
};

selectors.patientList.addEventListener("click", (event) => {
  const button = event.target.closest(".patient-button");
  if (button) setActivePatient(button.dataset.id);
});

selectors.copySummary.addEventListener("click", async () => {
  const summary = `${activePatient.name}: ${activePatient.riskLabel} (${activePatient.risk}%). ${activePatient.action}`;

  try {
    await navigator.clipboard.writeText(summary);
    selectors.copySummary.textContent = "Resumen copiado";
  } catch {
    selectors.copySummary.textContent = "Resumen listo";
  }

  window.setTimeout(() => {
    selectors.copySummary.textContent = "Copiar resumen para HCE";
  }, 1800);
});

selectors.form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(selectors.form);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const organization = data.get("organization").trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !organization || !isValidEmail) {
    selectors.formMessage.textContent = "Completa los campos con un correo institucional válido.";
    selectors.formMessage.classList.add("is-error");
    return;
  }

  selectors.formMessage.textContent = "Solicitud recibida. Te contactaremos para coordinar el piloto.";
  selectors.formMessage.classList.remove("is-error");
  selectors.form.reset();
});

const revealElements = document.querySelectorAll(
  ".hero__content, .hero__visual, .section-intro, .app-shell, .steps article, .institutions > div, .contact > div, .contact-form"
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

renderPatients();
renderClinicalBoard();
