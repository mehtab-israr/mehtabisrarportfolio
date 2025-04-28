// scriptt.js

document.addEventListener("DOMContentLoaded", function () {
  // --- Initialize AOS (Animate On Scroll) ---
  AOS.init({
    duration: 700, // Slightly longer duration
    once: true,
    offset: 80, // Trigger slightly later
    // disable: 'mobile'
  });

  // --- Intersection Observer for Skill Bar Animations ---
  const skillCircles = document.querySelectorAll(".progress-circle");

  if (skillCircles.length > 0) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const circle = entry.target;
            const progressElement = circle.querySelector(
              ".progress-circle-progress"
            );
            const svgElement = circle.querySelector(".progress-svg"); // Get SVG element
            const percentage = circle.dataset.percentage || 0;
            const colorVar = circle.dataset.colorVar || "--accent-1"; // Get color variable name from data attribute
            const offset = 100 - percentage;

            // **NEW**: Set the CSS variable for the progress color & shadow
            if (svgElement) {
              svgElement.style.setProperty(
                "--progress-color",
                `var(${colorVar})`
              );
            }

            if (progressElement) {
              progressElement.style.strokeDashoffset = offset;
            }

            const textElement = circle.querySelector(".percentage-value");
            if (textElement) {
              let current = 0;
              const target = parseInt(percentage);
              if (isNaN(target) || target < 0) {
                textElement.textContent = 0;
                observer.unobserve(circle);
                return;
              }

              const increment = Math.max(target / 75, 0.5);
              const intervalTime = 20;

              const updateText = () => {
                current += increment;
                if (current >= target) {
                  textElement.textContent = target;
                  clearInterval(interval);
                } else {
                  textElement.textContent = Math.ceil(current);
                }
              };
              textElement.textContent = 0;
              const interval = setInterval(updateText, intervalTime);
            }

            observer.unobserve(circle);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    skillCircles.forEach((circle) => {
      const textElement = circle.querySelector(".percentage-value");
      if (textElement) textElement.textContent = 0;
      skillObserver.observe(circle);
    });
  }

  // --- Footer v2 Animations ---
  const footerV2 = document.getElementById("footer-v2");
  if (footerV2) {
    const wordSpans = footerV2.querySelectorAll(".footer-title .word-span");
    const socialIcons = footerV2.querySelectorAll(".social-icon-item");
    const languageLogos = footerV2.querySelectorAll(".language-logo-item");
    const copyrightText = footerV2.querySelector(".copyright-text-v2");
    const currentYearSpan = document.getElementById("current-year");

    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }

    if (
      wordSpans.length > 0 ||
      socialIcons.length > 0 ||
      languageLogos.length > 0 ||
      copyrightText
    ) {
      const footerObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
      };

      const footerCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wordSpans.forEach((span, index) =>
              setTimeout(() => span.classList.add("word-visible"), index * 150)
            );
            socialIcons.forEach((icon, index) =>
              setTimeout(
                () => icon.classList.add("social-icon-visible"),
                300 + index * 100
              )
            );
            languageLogos.forEach((logo, index) =>
              setTimeout(
                () => logo.classList.add("logo-visible"),
                600 + index * 80
              )
            );
            if (copyrightText)
              setTimeout(() => copyrightText.classList.add("visible"), 1000);
            observer.unobserve(footerV2);
          }
        });
      };
      const footerObserver = new IntersectionObserver(
        footerCallback,
        footerObserverOptions
      );
      footerObserver.observe(footerV2);
    }
  }

  // --- Scroll To Top Button ---
  const scrollTopBtn = document.querySelector(".scroll-to-top");

  if (scrollTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 400) {
          // Show after scrolling a bit more
          scrollTopBtn.classList.add("visible");
        } else {
          scrollTopBtn.classList.remove("visible");
        }
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}); // End DOMContentLoaded








document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');

  let chatOpen = false;

  // --- Toggle Chat Window ---
  chatbotToggle.addEventListener('click', () => {
      chatOpen = !chatOpen;
      if (chatOpen) {
          chatbotWindow.style.display = 'flex'; // Use flex to enable layout
          chatbotToggle.innerHTML = '<i class="bi bi-x-lg"></i>'; // Change icon to close
      } else {
          chatbotWindow.style.display = 'none';
          chatbotToggle.innerHTML = '<i class="bi bi-chat-dots-fill"></i>'; // Change back to chat icon
      }
  });

  chatbotClose.addEventListener('click', () => {
      chatbotWindow.style.display = 'none';
      chatOpen = false;
      chatbotToggle.innerHTML = '<i class="bi bi-chat-dots-fill"></i>'; // Change back to chat icon
  });

  // --- Send Message & Get Response ---
  function sendMessage() {
      const userInput = chatbotInput.value.trim().toLowerCase();
      if (userInput === '') return;

      // Display user message
      displayMessage(userInput, 'user');
      chatbotInput.value = ''; // Clear input

      // Process input and get bot response (simple logic)
      setTimeout(() => { // Simulate bot thinking time
          const botResponse = getBotResponse(userInput);
          displayMessage(botResponse, 'bot');
      }, 600); // 600ms delay
  }

  chatbotSend.addEventListener('click', sendMessage);

  // Allow sending with Enter key
  chatbotInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          sendMessage();
      }
  });

  // --- Display Message Function ---
  function displayMessage(message, sender) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
      messageElement.textContent = message;
      chatbotMessages.appendChild(messageElement);

      // Auto-scroll to the bottom
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // --- Simple Bot Logic ---
  function getBotResponse(input) {
      // Convert to lowercase for case-insensitive matching
      input = input.toLowerCase();

      // --- Define keywords and responses ---
      if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
          return "Hello there! How can I assist you today?";
      } else if (input.includes('service') || input.includes('offer')) {
          return "I offer web development, web design, and UI/UX services. You can find more details in the 'Services' section.";
      } else if (input.includes('portfolio') || input.includes('work') || input.includes('project')) {
          return "You can see my latest projects in the 'My Work' section. I've worked on various web applications.";
      } else if (input.includes('contact') || input.includes('email') || input.includes('phone')) {
          return "You can contact me via the form on the website, or check the footer for contact details. You can also use the WhatsApp icon!";
      } else if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
          return "My pricing varies depending on the project scope. Please check the 'Pricing' section for standard packages or contact me for a custom quote.";
      } else if (input.includes('about') || input.includes('who are you')) {
          return "I'm Mehtab Israr, a front-end developer. Learn more about me in the 'About' section!";
      } else if (input.includes('thank') || input.includes('thanks')) {
          return "You're welcome! Is there anything else I can help you with?";
      } else if (input.includes('bye') || input.includes('goodbye')) {
          return "Goodbye! Have a great day!";
      } else {
          // Default response if no keywords match
          return "Sorry, I didn't quite understand that. Can you please rephrase? You could ask about 'services', 'portfolio', or 'contact'.";
      }
  }

  // Initial bot message already added in HTML, but could be added via JS too:
  // displayMessage("Hi there! How can I help you today? (Try asking about 'services', 'portfolio', 'contact')", 'bot');
});