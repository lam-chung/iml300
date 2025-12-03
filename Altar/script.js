// script.js

// Run when DOM is ready
$(function () {
  // Fade in the main content
  $(".main-content, .about-main, .look-main").css("opacity", 0).animate(
    { opacity: 1 },
    500
  );

  // Character hover effect via jQuery:
  // add/remove the 'hovered' class, which our CSS listens for.
  $(".character-link").hover(
    function () {
      $(this).addClass("hovered");
    },
    function () {
      $(this).removeClass("hovered");
    }
  );
});
