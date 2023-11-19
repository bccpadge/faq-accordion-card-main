(function loadAccordionCSS() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
   <style>
    .accordion__list{
      display:grid;
      gap: 1.7rem;
      padding-block-start: 3rem;
    }

 
    .accordion__item{
      border-bottom: 1px solid hsl(var(--clr-neutral-divider));
      padding-block-end: 0.625rem;
    }

    .accordion__btn{
      font-size: 0.8125rem;
      font-weight: 400;
      color: hsl(var(--clr-neutral-blue));
      display:flex;
      gap: 1rem;
      justify-content: space-between;
      align-items:center;
      width: 100%;
      cursor: pointer;
     
    }

    @keyframes slide{
      0% {
        opacity: 0;
        transform: translateX(-9px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    

    [aria-expanded="true"].accordion__btn{
      font-weight: 700;
      color: hsl(var(--clr-primary-blue));
      margin-block-end: 0.9375rem;
      animation: slide 0.4s ease-in-out;
    }

    .accordion__btn:is(:hover,:focus-visible){
      color: hsl(var(--clr-primary-red));
    }

    .accordion__icon{
      pointer-events: none;
      transition: 180ms cubic-bezier(.09,.26,.75,.44) ease;
    }

    [aria-expanded="true"] .accordion__icon{
      transform: rotate(180deg);
      transition: 180ms cubic-bezier(.09,.26,.75,.44) ease;
    }


    @keyframes active {
      0% {
        opacity: 0;
        transform: translateX(-5px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .accordion__answer{
      color: hsl(var( --clr-neutral-dark-blue));
      line-height: 1.4;
      overflow:hidden;
    }

    .accordion__panel:not([hidden="true"]){
      animation: active 0.4s ease-in-out;
      margin-block-start: 0.9375rem;
    }
   </style>

  
    `
  );
})();

class Accordion {
  constructor(element, options) {
    this.acc = element;
    this.options = options || {};
    this.id = Math.random().toString(30).substring(2, 10);
    this.buttons = [...this.acc.querySelectorAll(".accordion__btn")];
    this.panels = [...this.acc.querySelectorAll(".accordion__panel")];
    this.addData();
    this.connectAddEventListeners();
  }

  // !addData function
  addData() {
    this.buttons.forEach((btn, index) => {
      btn.id = `btn-${this.id}-${index}`;
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", `panel-${this.id}-${index}`);
      btn.insertAdjacentHTML(
        "beforeend",
        `
        <svg width="10" height="7" class="accordion__icon" aria-hidden"true" focusable="false" aria-label="click here to see the answer" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 .799l4 4 4-4" stroke="#F47B56" stroke-width="2" fill="none" fill-rule="evenodd"/>
        </svg>
      `
      );
    });
    this.panels.forEach((panel, index) => {
      panel.id = `panel-${this.id}-${index}`;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", `btn-${this.id}-${index}`);
      panel.setAttribute("hidden", "true");
    });
  }

  connectAddEventListeners() {
    this.acc.addEventListener("click", (e) => {
      if (!e.target.classList.contains("accordion__btn")) return;
      const isExpanded = e.target.getAttribute("aria-expanded") == "true";
      const index = this.buttons.findIndex((btn) => btn.id === e.target.id);

      // todo options for one panel only

      if (isExpanded) {
        e.target.setAttribute("aria-expanded", "false");
        this.panels[index].setAttribute("hidden", "true");
      }

      if (!isExpanded) {
        e.target.setAttribute("aria-expanded", "true");
        this.panels[index].removeAttribute("hidden");
      }
    });
    // !keyboard event
    this.acc.addEventListener("keydown", (e) => {
      if (!e.target.classList.contains("accordion__btn")) return;
      const index = this.buttons.findIndex((btn) => btn.id === e.target.id);
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.buttons[0].focus();
          break;
        case "ArrowRight":
          e.preventDefault();
          this.buttons[this.buttons.length - 1].focus();
          break;
        case "ArrowUp":
          if (index === 0) {
            this.buttons[this.buttons.length - 1].focus();
          } else {
            this.buttons[index - 1].focus();
          }
          e.preventDefault();
          break;
        case "ArrowDown":
          if (index === this.buttons.length - 1) {
            this.buttons[0].focus();
          } else {
            this.buttons[index + 1].focus();
          }
          e.preventDefault();
          break;

        default:
          break;
      }
    });
  }
}

function createAccordion(element, options) {
  document.querySelectorAll(element).forEach((accordion) => {
    new Accordion(accordion, options);
  });
}

createAccordion("#accordion-1", {});
