function hideColumn(table, index) {
  for (const row of table.querySelectorAll('tbody tr')) {
    row.getElementsByTagName('td')[index].classList.add('td-invisible');
  }
  for (const row of table.querySelectorAll('thead tr')) {
    row.getElementsByTagName('th')[index].classList.add('td-invisible');
  }
}

function shuffleRows(holder) {
  const rows = Array.from(holder.querySelectorAll('tr'));
  // Shuffle the array randomly
  rows.sort(() => Math.random() - 0.5);

  rows.forEach((row) => {
    holder.appendChild(row);
  });
}

function utteranceOptions(elm) {
  if (!document.getElementById('speech-options')) {
    return {'enabled': false};
  }

  const rate = document.getElementById('rate-option').value;
  const voice_elm = document.getElementById('voice-option').selectedOptions[0];
  const voice_name = voice_elm.getAttribute('data-name');
  const voice = speechSynthesis.getVoices().find((v) => {
    return v.name === voice_name;
  } );

  return {
    'volume': document.getElementById('volume-option').value,
    'pitch': document.getElementById('pitch-option').value,
    'rate': Math.pow(Math.abs(rate) + 1, rate < 0 ? -1 : 1),
    'lang': voice_elm.getAttribute('data-lang'),
    'voice': voice,
    'text': elm.innerText,
    'enabled': document.getElementById('speech-option').checked,
  };
}

function speak({text, voice, rate, pitch, volume, lang, enabled}) {
  if (!enabled) {
    return;
  }

  utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  utterance.lang = lang;
  utterance.voice = voice;

  utterance.addEventListener('start', handleSpeechEvent);
  utterance.addEventListener('end', handleSpeechEvent);
  utterance.addEventListener('error', handleSpeechEvent);
  utterance.addEventListener('boundary', handleSpeechEvent);
  utterance.addEventListener('pause', handleSpeechEvent);
  utterance.addEventListener('resume', handleSpeechEvent);

  speechSynthesis.speak(utterance);
}

function handleSpeechEvent(e) {
  // console.log('Speech Event:', e);
}

function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined') {
    return;
  }

  const voices = chineseVoices();

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += ' — DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById('voice-option').appendChild(option);
  }
}

function speechOptionsHtml() {
  /* eslint-disable max-len */
  return `<form id="speech-options">
<div class="no-support">
  <p>Speech synthesis is not supported in current system or browser.</p>
</div>
<div class="options">
  <p>
    <label for="speech-option">
<input id="speech-option" type="checkbox" value="1">
Speech synthesis enabled</label>
  </p>
  <p>
    <label for="pitch-option">Pitch: </label>
    <input id="pitch-option" type="range" value="0.5" min="0" max="1" step="0.05">
  </p>
  <p>
    <label for="rate-option">Rate: </label>
    <input id="rate-option" type="range" value="0" min="-3" max="3" step="0.25">
  </p>
  <p>
    <label for="volume-option">Volume: </label>
    <input id="volume-option" type="range" value="1" min="0" max="1" step="0.05">
  </p>
  <p>
    <label for="voice-option">Voice: </label>
    <select id="voice-option"></select>
  </p>
</div>
</form>`;
  /* eslint-enable max-len */
}

function chineseVoices() {
  if (typeof speechSynthesis === 'undefined') {
    return [];
  }

  return speechSynthesis.getVoices().filter(
      (v) => {
        return /^zh-/.test(v.lang) || /Chinese/.test(v.name);
      },
  );
}

let speech_init_attempt = 0;

function initSpeechFunctionality() {
  const options_form_holder = document.getElementById('postamble');

  if (!options_form_holder) {
    return;
  }

  options_form_holder.innerHTML = speechOptionsHtml() +
    options_form_holder.innerHTML;
  const form = document.getElementById('speech-options');

  if (chineseVoices().length === 0) {
    // hack as it takes while to get voices on Chrome and mobile :shrug:
    if (speech_init_attempt < 10) {
      speech_init_attempt = speech_init_attempt + 1;
      setTimeout(initSpeechFunctionality, 500);
    } else {
      form.classList.add('not-supported');
    }
  } else {
    form.classList.add('supported');
    populateVoiceList();
    loadPersistedSpeechOptions();
  }
}

function speechEnabled() {
  return document.getElementById('speech-option') &&
    document.getElementById('speech-option').checked
}

function persistChange(elm) {
  const elm_type = elm.type.toLowerCase();
  let value;

  if (elm_type === 'checkbox') {
    value = elm.checked;
  } else if (elm_type == 'select-one') {
    value = elm.selectedIndex;
  } else {
    value = elm.value;
  }

  localStorage.setItem(elm.id, value);
}

function loadPersistedOption(id) {
  const elm = document.getElementById(id);
  const persisted_val = localStorage.getItem(id);

  if (!elm) {
    return;
  }

  if (persisted_val === null) {
    return;
  }

  const elm_type = elm.type.toLowerCase();
  if (elm_type === 'checkbox') {
    elm.checked = persisted_val === 'true';
  } else if (elm_type == 'select-one') {
    elm.selectedIndex = persisted_val;
  } else {
    elm.value = persisted_val;
  }
}

function loadPersistedSpeechOptions() {
  loadPersistedOption('rate-option');
  loadPersistedOption('volume-option');
  loadPersistedOption('pitch-option');
  loadPersistedOption('speech-option');
  loadPersistedOption('voice-option');
}

function handleThClick(th) {
  const row = th.closest('tr');
  const table = th.closest('table');
  const index = Array.from(
      row.getElementsByTagName('th'),
  ).indexOf(th);

  const rows = table.querySelectorAll('tbody tr');
  th.classList.toggle('td-invisible');
  const td_visible = th.classList.contains('td-invisible');

  for (const row of rows) {
    const td = row.getElementsByTagName('td')[index];
    if (td_visible) {
      td.classList.add('td-invisible');
    } else {
      td.classList.remove('td-invisible');
    }
  }
}

function handleHanyuBlockClick(block) {
  block.classList.toggle('lang-en-visible');
  block.classList.toggle('lang-pi-visible');
}

function handleTdClick(td) {
  if (!td.closest('.vocabulary')) {
    return;
  }

  const row = td.closest('tr');
  const table = td.closest('table');
  const index = Array.from(
      row.getElementsByTagName('td'),
  ).indexOf(td);

  // 0 - chinese, 1 - pinyin, 2 - english, 3+ - extra features

  const rows = table.querySelectorAll('tbody tr');
  td.classList.toggle('td-invisible');
  const td_visible = td.classList.contains('td-invisible');
  let all_same = true;

  for (const row of rows) {
    const td = row.getElementsByTagName('td')[index];
    all_same = all_same && td.classList.contains('td-invisible') === td_visible;
  }
  if (all_same) {
    const th = table.querySelectorAll('thead tr th')[index];
    if (td_visible) {
      th.classList.add('td-invisible');
    } else {
      th.classList.remove('td-invisible');
    }
  }
}

function handleSpeakTextBlockClick(elm) {
  if (speechEnabled()) { //  && elm.lang != 'zh-Latn'
    speak(utteranceOptions(elm));
  }
}

function initVocabularyPractice() {
  for (const table of document.querySelectorAll('.vocabulary table')) {
    shuffleRows(table.querySelector('tbody'));
    hideColumn(table, 1); // pinyin
    hideColumn(table, 2); // english
  }
}

function wrapChineseTextWithLangSpan(element) {
  // Regular expression to match Chinese characters
  const chineseRegex = /([\u4E00-\u9FA5]+)/g;

  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const content = node.textContent;
      if (content.trim().length > 0 && chineseRegex.test(content)) {
        const newContent = document.createElement('span');
        newContent.innerHTML = content.replace(chineseRegex, '<span lang="zh-cmn-Hans">$1</span>');
        node.replaceWith(...newContent.childNodes);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() != 'span' ) {
      wrapChineseTextWithLangSpan(node);
    }
  });
}

document.addEventListener('click', function(event) {
  const target = event.target;

  const langBlock = target.closest('.hanyu-block');
  if (langBlock) {
    handleHanyuBlockClick(langBlock);
    event.stopPropagation();
    return;
  }

  const zh_elm = target.closest('span[lang^="zh"]');

  if (zh_elm) {
    handleSpeakTextBlockClick(zh_elm);
    event.stopPropagation();
    return;
  }

  const th = target.closest('th');
  if (th) {
    handleThClick(th);
    event.stopPropagation();
    return;
  }

  const td = target.closest('td');
  if (td) {
    handleTdClick(td);
    event.stopPropagation();
    return;
  }
});

function sample(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);

  return arr[randomIndex];
}

document.addEventListener('DOMContentLoaded', (event) => {
  const fonts = ['font-default', 'font-long-cang', 'font-ma-shan-zheng', 'font-zcool-xiaowei'];

  document.querySelector('body').classList.add(sample(fonts));

  wrapChineseTextWithLangSpan(document.getElementById('content'));

  initVocabularyPractice();
  initSpeechFunctionality();
});

window.addEventListener('load', (event) => {
  // console.log('-t- load');
});

document.addEventListener('change', (event) => {
  persistChange(event.target);
});
