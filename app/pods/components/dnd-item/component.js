import Ember from 'ember';
import R from 'R';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ember-dnd-item'],

  itemStyle: Ember.computed('newY', 'activeItem', function() {
    let activeItem = this.get('activeItem');
    let itemId = this.get('item.id');
    let items = this.get('items');
    let y = this.get('newY');
    let prepend = '';
    let top;

    let itemIdx = R.findIndex(R.propEq('id', itemId), items);
    let pos = items[itemIdx].position - 1;

    if (!activeItem) {
      top = 110 * pos;
    } else if (activeItem !== itemId) {
      top = 110 * pos;
    } else {
      prepend = `
          z-index: 99;
          box-shadow: rgba(0, 0, 0, 0.2) 0 16px 32px 0;
          transform: translate3d(0, ${y}px, 0) scale(1.1);
          `;
    }

    return new Ember.Handlebars.SafeString(`${prepend} top: ${top}px;`);
  }),

  mouseDown: function(event) {
    this.sendAction('itemClicked', this.get('item.id'), event.pageY);
  },

});
