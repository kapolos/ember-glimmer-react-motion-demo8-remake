# Ember remake of react-motion demo 8

## What?

Exploring the abilities of Ember's new engine (fast rerenders) by implementing the react-motion demo 8 in a "native" way.
It's a list of items that you move without using native drag & drop (for mobile compat).

## Where?

Demo: [https://kapolos.github.io/ember-glimmer-react-motion-demo8-remake/](https://kapolos.github.io/ember-glimmer-react-motion-demo8-remake/)

## Implementation Notes

```
|----Parent component ---|
|                        |
|  -- item component --  |
|  -- item component --  |
|  -- item component --  |     
|                        |
|------------------------|
```

The item components are wrapped inside a div. That div has `position: relative`.
The items have `position: absolute`.

### Conceptual overview - but better to read the code instead ;)

* In this demo, there are 4 conceptual vertical slots, defined by their relative position inside the wrapping div.
* The implementation is generic though and not limited to 4 items.
* Each slot can have more than 1 item at each time (up to two).
* At "rest condition", each slot has 1 item/
* Once an item is selected (mousedown), it is "active".
* Once an item is "active", it gets a transform3d CSS property that depends on the mouse position. This effectively "moves" the item (but in reality, it is still sitting on its slot).
* The transform3d modifies the y-axis and the scale of the item.
* The mouse position is read by an event listener in the parent component.
* The mouse position is passed as a variable to the item components.
* If an item is active, the parent container calculates the y-axis delta of its top-left slot position and the mouse position. Then it sends the mouse position to the items.
* If an active item's delta is positive (i.e. mouse moves down) and enters [slot+1, slot+2), then if slot+1 is not empty, a rearranging of the non-active elements needs to happen.
* The item on the slot+1 position moves one position up.
* Similarly, if the active item goes into [slot+2, slot+3), the item on slot+2 moves to slot+1. Etc [slot+3, ...], ...
* Respectively for when the mouse moves upwards (negative delta)
* On the active item stops being active (mouse up), it takes the position of the slot that has no item.

## Problems and hacks

* The parent container needs to cover as much area in the user's screen as possible. Otherwise the mouse event listener will stop working once the mouse gets outside of the container area. Originally I tried to implement this by having the listener in the item component - very fragile especially on fast mouse movement. Then I did exactly what the react-motion demo8 did - the parent component takes up all the visible space and has the listener implementation instead of each item.
* Scaling an item causes blurring. The React demo letters on the items are gray-ish so that the blurring is not that visible, due to the light contrast with the background. I set it black so that the white shadow on "transform3d" that comes as a byproduct is clearly visible.

## Credits

The idea to experiment with this belongs to [Sam Selikoff](https://github.com/samselikoff) and the work in this repo was commissioned by him as well.
