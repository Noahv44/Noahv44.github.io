$(document).ready(function() {
    // --- Existing Tab-Switching Code ---
    $('.menu a').on('click', function(event) {
        // Prevent default on desktop view only
        if ($(window).width() > 600) {
            event.preventDefault();

            $('.menu a').removeClass('active');
            $('.tab-content').removeClass('active');

            $(this).addClass('active');
            var targetTab = $(this).attr('href');
            $(targetTab).addClass('active');
        }
    });
    
    // Set initial active tab on desktop
    if ($(window).width() > 600) {
        $('.menu a[href="#about"]').addClass('active');
        $('#about').addClass('active');
    }

    // --- NEW: Light/Dark Mode Toggle ---
    const themeSwitch = $('#theme-switch');
    const currentTheme = localStorage.getItem('theme');

    // On page load, check for a saved theme
    if (currentTheme) {
        $('body').addClass(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeSwitch.prop('checked', true);
        }
    }

    // When the switch is clicked
    themeSwitch.on('change', function() {
        if (this.checked) {
            $('body').addClass('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            $('body').removeClass('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
});

// --- NEW: ACCORDION LOGIC ---
    $('.accordion-toggle').on('click', function() {
        // Find the content associated with the clicked toggle
        const content = $(this).next('.accordion-content');
        
        // Use jQuery's slideToggle for a smooth animation
        content.slideToggle(300); // 300ms animation speed

        // Toggle the icon text between + and -
        const icon = $(this).find('.accordion-icon');
        if (icon.text() === '+') {
            icon.text('−');
        } else {
            icon.text('+');
        }
    });
// --- NEW: BACK TO TOP BUTTON LOGIC ---
    const backToTopBtn = $('#back-to-top-btn');

    // Show or hide the button based on scroll position
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) { // Show after scrolling 300px
            backToTopBtn.fadeIn();
        } else {
            backToTopBtn.fadeOut();
        }
    });

    // Smooth scroll to top when the button is clicked
    backToTopBtn.on('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        $('html, body').animate({scrollTop: 0}, 500); // 500ms scroll speed
    });
    // --- NEW: RANDOM QUOTE GENERATOR LOGIC ---
    const quotes = [
        {
            text: "The purpose of our lives is to be happy.",
            author: "Dalai Lama"
        },
        {
            text: "Life is what happens when you're busy making other plans.",
            author: "John Lennon"
        },
        {
            text: "Get busy living or get busy dying.",
            author: "Stephen King"
        },
        {
            text: "You only live once, but if you do it right, once is enough.",
            author: "Mae West"
        },
        {
            text: "The unexamined life is not worth living.",
            author: "Socrates"
        },
        {
            text: "Turn your wounds into wisdom.",
            author: "Oprah Winfrey"
        }
    ];

    const quoteText = $('#quote-text');
    const quoteAuthor = $('#quote-author');
    const newQuoteBtn = $('#new-quote-btn');

    function getNewQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        
        quoteText.text(`"${randomQuote.text}"`);
        quoteAuthor.text(`- ${randomQuote.author}`);
    }

    newQuoteBtn.on('click', getNewQuote);



