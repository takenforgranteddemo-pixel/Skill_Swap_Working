/**
* Template Name: Learner
* Template URL: https://bootstrapmade.com/learner-bootstrap-course-template/
* Updated: Jul 08 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /*
   * Pricing Toggle
   */

  const pricingContainers = document.querySelectorAll('.pricing-toggle-container');

  pricingContainers.forEach(function(container) {
    const pricingSwitch = container.querySelector('.pricing-toggle input[type="checkbox"]');
    const monthlyText = container.querySelector('.monthly');
    const yearlyText = container.querySelector('.yearly');

    pricingSwitch.addEventListener('change', function() {
      const pricingItems = container.querySelectorAll('.pricing-item');

      if (this.checked) {
        monthlyText.classList.remove('active');
        yearlyText.classList.add('active');
        pricingItems.forEach(item => {
          item.classList.add('yearly-active');
        });
      } else {
        monthlyText.classList.add('active');
        yearlyText.classList.remove('active');
        pricingItems.forEach(item => {
          item.classList.remove('yearly-active');
        });
      }
    });
  });

})();

/* Populating fields into Register Pop up Modal  
 * 
 */
document.addEventListener("DOMContentLoaded", function () {
    // --- Populate form choices ---
    fetch("/api/get-choices/")
        .then(response => response.json())
        .then(data => {
            // Universities
            const uniSelect = document.getElementById("university_name");
            data.universities.forEach(u => {
                const opt = document.createElement("option");
                opt.value = u.id;
                opt.textContent = u.name;
                uniSelect.appendChild(opt);
            });

            // Departments
            const deptSelect = document.getElementById("department");
            data.departments.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d.id;
                opt.textContent = d.name;
                deptSelect.appendChild(opt);
            });

            // Branches
            const branchSelect = document.getElementById("branch");
            data.branches.forEach(b => {
                const opt = document.createElement("option");
                opt.value = b.id;
                opt.textContent = b.name;
                branchSelect.appendChild(opt);
            });

            // Years
            const yearSelect = document.getElementById("year");
            data.years.forEach(([value, label]) => {
                const opt = document.createElement("option");
                opt.value = value;
                opt.textContent = label;
                yearSelect.appendChild(opt);
            });

            // Genders (radio buttons)
            const genderContainer = document.getElementById("gender");
            data.genders.forEach(([value, label]) => {
                const div = document.createElement("div");
                div.classList.add("form-check", "form-check-inline");

                const input = document.createElement("input");
                input.type = "radio";
                input.name = "gender";
                input.id = "gender_" + value;
                input.value = value;
                input.classList.add("form-check-input");

                const lab = document.createElement("label");
                lab.setAttribute("for", "gender_" + value);
                lab.classList.add("form-check-label");
                lab.textContent = label;

                div.appendChild(input);
                div.appendChild(lab);
                genderContainer.appendChild(div);
            });
        })
        .catch(error => console.error("Error loading form choices:", error));

    // --- Handle form submission (only once) ---
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Remove old errors (form-specific)
        form.querySelectorAll(".error-text").forEach(el => el.remove());

        const formData = new FormData(form);
        const url = form.getAttribute("data-url");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": form.querySelector("[name=csrfmiddlewaretoken]").value,
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            const data = await response.json();

            if (data.success) {
                // Close register modal and open login modal
                const registerModal = document.getElementById("openregisterModal");
                const loginModal = document.getElementById("openloginModal");

                if (registerModal) {
                    const bsModal = bootstrap.Modal.getInstance(registerModal);
                    bsModal.hide();
                }
                if (loginModal) {
                    const bsModal = new bootstrap.Modal(loginModal);
                    bsModal.show();
                }
            } else {
                // Show field errors
                if (data.errors) {
                    for (let field in data.errors) {
                        const input = form.querySelector(`[name=${field}]`);
                        if (input) {
                            input.insertAdjacentHTML(
                                "afterend",
                                `<span class="error-text text-danger">${data.errors[field]}</span>`
                            );
                        }
                    }
                } else {
                    alert("Error: " + (data.message || "Something went wrong"));
                }
            }
        } catch (err) {
            console.error("Request failed", err);
            alert("Something went wrong. Please try again.");
        }
    });
});

/*
* Script for login form field errors
*/
document.addEventListener("DOMContentLoaded", function(){
    const loginForm = document.getElementById("loginForm");
    if(loginForm){
        loginForm.addEventListener("submit", function(e){
            e.preventDefault();
            let form = e.target;
            let data = new FormData(form);
            
            fetch(form.action, {
                method: "POST",
                headers: {"X-Requested-With": "XMLHttpRequest"},
                body: data
            })
            .then(res => res.json())
            .then(res => {
                // Clear previous errors
                console.log("Response from server:", res); 
                document.getElementById("usernameError").innerHTML = "";
                document.getElementById("passwordError").innerHTML = "";

                if(res.success){
                    window.location.href = "/"; // redirect to homepage
                } else {
                    // Show field-specific errors
                    if(res.errors.username){
                        document.getElementById("usernameError").innerText = res.errors.username;
                    }
                    if(res.errors.password){
                        document.getElementById("passwordError").innerText = res.errors.password;
                    }
                }
            })
            .catch(err => console.error(err));
        });
    }
});

