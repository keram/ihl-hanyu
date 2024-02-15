document.addEventListener('click', function(event) {
  let target = event.target;
  let tagName = target.tagName;
  let langBlock = event.target.closest('.hanyu-block')

  if (langBlock) {
    langBlock.classList.toggle('lang-en-visible');
    langBlock.classList.toggle('lang-pi-visible');
  }
});

// document.addEventListener('click', function(event) {} );
