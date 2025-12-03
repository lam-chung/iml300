$(document).ready(function () {

  $(".character-image").each(function () {
    const originalHeight = $(this).height();

    $(this).hover(
      function () {
        $(this).stop().animate({ height: originalHeight + 30 }, 200);
      },
      function () {
        $(this).stop().animate({ height: originalHeight }, 200);
      }
    );
  });

});