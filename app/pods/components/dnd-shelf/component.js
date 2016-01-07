import Ember from 'ember';
import R from 'R';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ember-dnd-wrapper'],

  isMouseDown: false,
  newY: 0,
  prevDelta: 0,
  items: [{
    title: 'Item 1',
    id: 1,
    position: 1
  }, {
    title: 'Item 2',
    id: 2,
    position: 2
  }, {
    title: 'Item 3',
    id: 3,
    position: 3
  },
  {
    title: 'Item 4',
    id: 4,
    position: 4
  }
 ],

  mouseMove: function(event) {
    let isMouseDown = this.get('isMouseDown');

    if (!isMouseDown) {
      return;
    }

    let mouseYOnItemClick = this.get('mouseYOnItemClick');
    let activeItem = this.get('activeItem');
    let items = this.get('items');
    let prevDelta = this.get('prevDelta');

    let itemIdx = R.findIndex(R.propEq('id', activeItem), items);
    let activeItemOriginalPos = items[itemIdx].position;
    let delta = event.pageY - mouseYOnItemClick;
    let deltaDelta = delta - prevDelta;
    let relativeSlotDistance = parseInt(delta / 110);
    let implicitPosition = activeItemOriginalPos + relativeSlotDistance;
    let itemToMove = R.head(R.filter((item) => {
      if (item.position === implicitPosition && item.id !== activeItem) {
        return true;
      }
    }, items));

    this.set('newY', delta  + (activeItemOriginalPos - 1) * 110);
    this.set('prevDelta', delta);

    if (!itemToMove) {
      return;
    }

    let idx = R.findIndex(R.propEq('id', itemToMove.id), items);
    if (deltaDelta > 0) {
      items[idx].position--;
    } else {
      items[idx].position++;
    }

    this.set('items', items);
  },
  mouseUp: function() {
    let activeItem = this.get('activeItem');
    let items = this.get('items');
    let itemIdx = R.findIndex(R.propEq('id', activeItem), items);

    R.forEach(function(pos) {
      let tmp = R.findIndex(R.propEq('position', pos), items);
      if (tmp === -1) {
        items[itemIdx].position = pos;
      }
    }, R.range(1, items.length + 1));

    this.set('isMouseDown', false);
    this.set('items', items);
    this.set('activeItem', false);
    this.set('prevRelSlotDistance', 0);
    this.set('newY', 0);
    this.set('prevDelta', 0);
  },

  actions: {
    itemClicked(id, pageY) {
      let items = this.get('items');
      let itemIdx = R.findIndex(R.propEq('id', id), items);
      let pos = items[itemIdx].position;

      this.set('activeItem', id);
      this.set('newY', (pos - 1) * 110);
      this.set('isMouseDown', true);
      this.set('mouseYOnItemClick', pageY);
    }
  }
});
