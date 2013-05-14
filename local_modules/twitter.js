(function(body, miniProfile, globalNav){
  var parentOffsetTop = miniProfile.parentNode.offsetTop,
      limit = parentOffsetTop +
              miniProfile.offsetHeight -
              globalNav.offsetHeight,
      margin = limit - parentOffsetTop,
      style = miniProfile.parentNode.style,
      fixedPosition = false,
      position,
      top;
  function onscroll(e) {
    if (fixedPosition && body.scrollTop < limit) {
      fixedPosition = false;
      style.position = position;
      style.top = top;
    } else if (!fixedPosition && limit <= body.scrollTop) {
      fixedPosition = true;
      position = style.position;
      top = style.top;
      style.position = 'fixed';
      style.top = '-' + margin + 'px';
    }
  }
  addEventListener('DOMMouseScroll', onscroll, true);
  addEventListener('mousescroll', onscroll, true);
  addEventListener('mousewheel', onscroll, true);
  addEventListener('wheel', onscroll, true);
}(
  document.body,
  document.querySelector('div.module.mini-profile'),
  document.querySelector('div.global-nav')
));