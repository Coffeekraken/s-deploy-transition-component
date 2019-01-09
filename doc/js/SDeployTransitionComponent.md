# SLayersTransitionComponent

Create a nice layered transition for your webapp with fully customizable look and feel.

### Example
```html
	<s-layers-transition layers="[{color:'#ff0000',side:'left'},{color:'#00ff00',side:'right'}]"></s-layers-transition>
```
Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

See : **Inspiration source** : [https://ddd.ge](https://ddd.ge)

Extends **SWebComponent**




## Attributes

Here's the list of available attribute(s).

### delay

Specify the delay in second between each layers animations

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **0.05**


### duration

Specify the duration of 1 layer animation in second

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **1**


### layers

Set the layers. One layer in composed of:
```js
{
 color: '#ff0000'
}
```


Type : **{ Array<Object> }**

Default : **[{**




## Methods


### animateIn

Animate the transition in

Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)


### animateOut

Animate the transition out

Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)


## Events


### in:complete

Event dispatched when the transition in is completed


### out:complete

Event dispatched when the transition out is completed