import moment from 'moment';
import 'moment/locale/ru';

moment().local('ru');

export default class DrawWidget {
  constructor() {
    this.init()
  }

  init() {
    this.drawWidget();
  }

  drawWidget() {
    this.widget = document.createElement('div');
    this.widget.classList.add('wrapper-widget');
    this.widget.innerHTML = `<div class="widget-messages">
    <div class="block-title-widget">
      <h1 class="title-widget">Incomig</h1>
    </div>
    <div class="block-messages-list">
      <ul class="messages-list">
      </ul>
    </div>
  </div>`
    document.body.appendChild(this.widget);
    this.listMessages = this.widget.querySelector('.messages-list');
  }

  drawMessagesList(data) {
    for( let i of data) {
      this.drawMessageItem(i);
    }
  }

  drawMessageItem(data) {
    const li = document.createElement('li');
    li.classList.add('block-messages-item');
    li.innerHTML = `<div class="messages-content-block">
    <div class="content-block block-email"></div>
    <div class="content-block block-text"></div>
    <div class="content-block block-date"></div>
  </div>`
  li.dataset.id = data.id;
  this.listMessages.insertAdjacentElement('afterbegin', li);
  const blockEmail = li.querySelector('.block-email');
  blockEmail.textContent = data.from;
  const blockText = li.querySelector('.block-text');
  blockText.textContent = this.validateMessage(data.subject)
  const blockDate = li.querySelector('.block-date');
  blockDate.textContent = moment(data.received).format('HH:mm DD:MM:YYYY')
  }

  validateMessage(value) {
    if (value.length <= 15) {
      return value;
    }
    return value.slice(0, 15) + '...';
  }
}