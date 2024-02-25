document.addEventListener('click', function(event) {
  let target = event.target;
  let tagName = target.tagName;
  let langBlock = event.target.closest('.hanyu-block')

  if (langBlock) {
    langBlock.classList.toggle('lang-en-visible');
    langBlock.classList.toggle('lang-pi-visible');
    event.stopPropagation();
    return;
  }

  let th  = event.target.closest('th');

  if (th) {
    let row = th.closest('tr')
    let table = th.closest('table')
    let index = Array.from(
      row.getElementsByTagName('th')
    ).indexOf(th);
    let rows = table.querySelectorAll('tbody tr');
    th.classList.toggle('td-invisible');
    let td_visible = th.classList.contains('td-invisible');

    for (let row of rows) {
      let td = row.getElementsByTagName('td')[index];
      if (td_visible) {
        td.classList.add('td-invisible');
      } else {
        td.classList.remove('td-invisible');
      }
    }

    event.stopPropagation();
    return;
  }

  let td  = event.target.closest('td');

  if (td) {
    let row = td.closest('tr')
    let table = td.closest('table')
    let index = Array.from(
      row.getElementsByTagName('td')
    ).indexOf(td);
    let rows = table.querySelectorAll('tbody tr');
    td.classList.toggle('td-invisible');
    let td_visible = td.classList.contains('td-invisible');
    let all_same = true;

    for (let row of rows) {
      let td = row.getElementsByTagName('td')[index];
      all_same = all_same && td.classList.contains('td-invisible') === td_visible;
    }
    if (all_same) {
      let th = table.querySelectorAll('thead tr th')[index];
      if (td_visible) {
        th.classList.add('td-invisible');
      } else {
        th.classList.remove('td-invisible');
      }
    }

    event.stopPropagation();
    return;
  }

});

function hideColumn(table, index) {
    for (let row of table.querySelectorAll('tbody tr')) {
      row.getElementsByTagName('td')[index].classList.add('td-invisible');
    }
    for (let row of table.querySelectorAll('thead tr')) {
      row.getElementsByTagName('th')[index].classList.add('td-invisible');
    }
}

function shuffleRows(holder) {
    var rows = Array.from(holder.querySelectorAll('tr'));
    // Shuffle the array randomly
    rows.sort(() => Math.random() - 0.5);

    rows.forEach(row => {
      holder.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
  for (let table of document.querySelectorAll('.vocabulary table')) {
    shuffleRows(table.querySelector('tbody'));
    hideColumn(table, 1); // pinyin
    hideColumn(table, 2); // english
  }
});
