let COSTS = {
  ARCADE: 9,
  ADVANCED: 12,
  PRO: 15,
  ONS: 1,
  LST: 2,
  CUSPRO: 2,
}

const addonAbb = {
  ONS: "Online Services",
  LST: "Larger Storage",
  CUSPRO: "Customizable Profile",
}

const billingPeriodToggleButton = document.querySelector("[data-toggle-button]")
let isYearlyBilling = false

toggleAndDisplayMonthlyYearlyPrices()
let billing = billingPeriodToggleButton.checked ? "yr" : "mo"
billingPeriodToggleButton.addEventListener("change", (e) => {
  billing = e.target.checked ? "yr" : "mo"
  document
    .querySelectorAll("[data-moy]")
    .forEach((span) => (span.innerText = billing))

  isYearlyBilling = billing === "yr"

  COSTS = {
    ARCADE: isYearlyBilling ? 90 : 9,
    ADVANCED: isYearlyBilling ? 120 : 12,
    PRO: isYearlyBilling ? 150 : 15,
    ONS: isYearlyBilling ? 10 : 1,
    LST: isYearlyBilling ? 20 : 2,
    CUSPRO: isYearlyBilling ? 20 : 2,
  }

  toggleAndDisplayMonthlyYearlyPrices()
})

const completedForm = {
  name: "",
  email: "",
  number: "",
  plan:
    document.querySelector(".plan.active").getAttribute("data-plan-type") ||
    ARCADE,
  addons: [],
}

let currentStep = 1
let reachedEnd = false
let currentPlan = document.querySelector(".plan.active")

// Addons Working
let currentStepCountingDiv = document.querySelector(
  `[data-step='${currentStep}']`
)

let currentDataCounterStep = document.querySelector(
  `[data-counter-step='${currentStep}']`
)

let currentDataCounterStepMob = document.querySelector(
  `[data-counter-step-mob='${currentStep}']`
)

const mainForm = document.querySelector("[data-main-form]")

// Addons Section Functionality
const addons = [...document.querySelectorAll("[data-addon]")]
addons.forEach((addon) => {
  addon.querySelectorAll("input").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const parentNode = e.target.parentNode.parentNode
      if (e.target.checked) {
        parentNode.classList.add("active")
      } else {
        parentNode.classList.remove("active")
      }
    })
  })
})

// Lower Buttons

const goBackBtn = document.querySelector("[data-goback]")
const nextStepBtn = document.querySelector("[data-nextstep]")
const submitButton = document.querySelector("[data-submit]")
if (currentStep === 1) {
  goBackBtn.classList.add("hidden")
}

// Buttons Event Listeners
goBackBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (reachedEnd && currentStep <= 4) {
    submitButton.classList.add("hidden")
    nextStepBtn.classList.remove("hidden")
  }
  if (currentStep <= 1) return
  else currentStep--
  if (currentStep === 1) goBackBtn.classList.add("hidden")
  const prevStepDiv = document.querySelector(`[data-step='${currentStep}']`)
  currentStepCountingDiv.classList.add("hidden")
  prevStepDiv.classList.remove("hidden")
  currentStepCountingDiv = prevStepDiv

  currentDataCounterStep.querySelector(".circle").classList.remove("current")
  let currentDataCounterStepPrev = document.querySelector(
    `[data-counter-step='${currentStep}']`
  )
  currentDataCounterStepPrev.querySelector(".circle").classList.add("current")
  currentDataCounterStep = currentDataCounterStepPrev

  currentDataCounterStepMob.querySelector(".circle").classList.remove("current")
  let currentDataCounterStepPrevMob = document.querySelector(
    `[data-counter-step-mob='${currentStep}']`
  )
  currentDataCounterStepPrevMob
    .querySelector(".circle")
    .classList.add("current")
  currentDataCounterStepMob = currentDataCounterStepPrevMob
})

// ?Next button
nextStepBtn.addEventListener("click", (e) => {
  e.preventDefault()

  // Steps processing and validation
  if (currentStep === 1) if (!Step1Register()) return

  if (currentStep === 2) Step2Register()
  if (currentStep === 3) Step3Register()

  if (currentStep === 3) {
    reachedEnd = true
    nextStepBtn.classList.add("hidden")
    submitButton.classList.remove("hidden")
  }
  if (currentStep >= 4) {
    return
  } else currentStep++

  goBackBtn.classList.remove("hidden")
  const nextStepDiv = document.querySelector(`[data-step='${currentStep}']`)
  currentStepCountingDiv.classList.add("hidden")
  nextStepDiv.classList.remove("hidden")
  currentStepCountingDiv = nextStepDiv

  currentDataCounterStep.querySelector(".circle").classList.remove("current")
  let currentDataCounterStepNext = document.querySelector(
    `[data-counter-step='${currentStep}']`
  )
  currentDataCounterStepNext.querySelector(".circle").classList.add("current")
  currentDataCounterStep = currentDataCounterStepNext

  currentDataCounterStepMob.querySelector(".circle").classList.remove("current")
  let currentDataCounterStepNextMob = document.querySelector(
    `[data-counter-step-mob='${currentStep}']`
  )
  currentDataCounterStepNextMob
    .querySelector(".circle")
    .classList.add("current")
  currentDataCounterStepMob = currentDataCounterStepNextMob
})

mainForm.addEventListener("submit", handleSubmit)

//?? Handlers
function Step1Register() {
  const nameInput = document.querySelector("[data-name-input]")
  const emailInput = document.querySelector("[data-email-input]")
  const phoneInput = document.querySelector("[data-phone-input]")

  let success = true

  ;[nameInput, emailInput, phoneInput].forEach((input) => {
    if (input.value === "") {
      input.classList.add("error")

      success = false
      setTimeout(() => {
        input.classList.remove("error")
      }, 3000)
    } else {
      completedForm[input.name] = input.value
      // Change the variable from const to let if using the below method
      // completedForm = { ...completedForm, ...{ [input.name]: input.value } };
    }
  })

  return success
}
function Step2Register() {
  document
    .querySelectorAll(".plan")
    .forEach((plan) => plan.classList.remove("fade-in"))
}

function Step3Register() {
  let addons = []
  const checkboxes = document.querySelectorAll("[data-addon-checkbox]")
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      addons.push(checkbox.name)
    }
  })
  completedForm["addons"] = addons

  const total = calculateTotalBill()
  createBill(total)
}
function handleSubmit(e) {
  /** @type {SubmitEvent} e */
  // e.preventDefault();
  document.querySelector(".lower-buttons").remove()
  document.querySelector("[data-step='4']").classList.add("hidden")
  document.querySelector(".thank-you").classList.remove("hidden")
  e.preventDefault()
}

function calculateTotalBill() {
  const planCosts = COSTS[completedForm.plan]
  let addonsCost = 0
  addonsCost = completedForm.addons.reduce(
    (total, addon) => total + COSTS[addon],
    0
  )

  return {
    planCosts,
    addonsCost,
    total: planCosts + addonsCost,
  }
}

// Todo
function showErrorCode() {}

function toggleAndDisplayMonthlyYearlyPrices() {
  const planSpans = document.querySelectorAll("[data-plan-price]")
  planSpans.forEach((span) => {
    span.innerText = COSTS[span.getAttribute("data-plan-price")]
  })

  const addonSpans = document.querySelectorAll("[data-addon-price]")
  addonSpans.forEach((span) => {
    span.innerText = COSTS[span.getAttribute("data-addon-price")]
  })
}

function createBill(total) {
  const billPlanTypeSpan = document.querySelector("[data-bill-plan-type]")
  const billBillingPeriodSpan = document.querySelector(
    "[data-bill-billing-period]"
  )

  const billingPlanPrice = document.querySelector("[data-billing-plan-price]")

  billPlanTypeSpan.innerText =
    completedForm.plan.charAt(0) + completedForm.plan.substring(1).toLowerCase()

  billBillingPeriodSpan.innerText = isYearlyBilling ? "Yearly" : "Monthly"

  billingPlanPrice.innerText = total.planCosts

  const hr = document.querySelector(".hr")
  const billAddonsDiv = document.querySelector("[data-addons-bill]")

  if (completedForm.addons.length <= 0) {
    hr.classList.add("hidden")
    billAddonsDiv.classList.add("hidden")
  } else {
    hr.classList.remove("hidden")
    billAddonsDiv.classList.remove("hidden")

    billAddonsDiv.innerHTML = ""
    completedForm.addons.forEach((addon) => {
      billAddonsDiv.innerHTML += `
						<div>
									<p class="text-gray text-sm">${addonAbb[addon]}</p>
									<span class="text-sm"
										>+&dollar;${COSTS[addon]}/<span data-moy="">${
        isYearlyBilling ? "yr" : "mo"
      }</span></span
									>
								</div>
		
		`
    })
    completedForm["total"] = total
  }

  const perMySpan = document.querySelector("[data-per-my]")
  const finalTotalSpan = document.querySelector("[data-final-total]")
  perMySpan.innerText = isYearlyBilling ? "per year" : "per month"
  finalTotalSpan.innerText = total.total
}

// Make change plan work
const changePlan = document.querySelector("[data-change-plan]")
changePlan.addEventListener("click", (e) => {
  e.preventDefault()
  currentStep = 2

  currentDataCounterStep.querySelector(".circle").classList.remove("current")
  currentDataCounterStep = document.querySelector(
    `[data-counter-step='${currentStep}']`
  )
  currentDataCounterStep.querySelector(".circle").classList.add("current")

  currentDataCounterStepMob.querySelector(".circle").classList.remove("current")
  currentDataCounterStepMob = document.querySelector(
    `[data-counter-step-mob='${currentStep}']`
  )
  currentDataCounterStepMob.querySelector(".circle").classList.add("current")

  currentStepCountingDiv.classList.add("hidden")
  currentStepCountingDiv = document.querySelector(
    `[data-step='${currentStep}']`
  )
  currentStepCountingDiv.classList.remove("hidden")
  nextStepBtn.classList.remove("hidden")
  submitButton.classList.add("hidden")
})
// Plans Click control
;[...document.querySelectorAll(".plan")].forEach((plan) => {
  plan.addEventListener("click", (e) => {
    currentPlan.classList.remove("active")
    e.target.classList.add("active")
    currentPlan = e.target
    completedForm["plan"] = currentPlan.getAttribute("data-plan-type")
  })
})
